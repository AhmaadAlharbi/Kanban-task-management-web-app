import { defineStore } from "pinia";
import { projectFirestore } from "../firebase/config";
import Swal from "sweetalert2";

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    selectedBoard: "",
    boards: [],
    columns: [],
    cards: [],
    subtasks: [],
    isLoading: true,
    theme: "light",
  }),
  getters: {
    boardNames: (state) => state.boards.map((board) => board.name),
    columnsNames: (state) => state.columns.map((column) => column.name),
    completedSubTasks: (state) => {
      const cardIds = state.cards.map((card) => card.id);
      return state.subtasks.filter((subtask) => {
        return subtask.isCompleted && cardIds.includes(subtask.card_id);
      });
    },
    latestBoard: (state) => {
      const lastBoard = state.boards.slice(-1)[0];
      return lastBoard;
    },
    getColumnCardsCount: (state) => (columnId) => {
      return state.cards.filter((card) => card.column_id === columnId).length;
    },
  },

  actions: {
    async fetchBoards() {
      const res = await projectFirestore.collection("Boards").get();
      this.boards = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      this.selectedBoard = this.boards[0];
    },
    async fetchColumns(boardId) {
      this.isLoading = true;

      if (!boardId) {
        return;
      }
      const res = await projectFirestore
        .collection("columns")
        .where("board_id", "==", boardId)
        .get();
      this.columns = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      this.isLoading = false;
    },
    async fetchCards(boardId) {
      if (!boardId) {
        return;
      }
      const cardsRef = projectFirestore.collection("cards");
      const cardsQuery = cardsRef.where("board_id", "==", boardId);
      const cardsSnapshot = await cardsQuery.get();
      this.cards = cardsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        subtasks: [],
      }));
      // Fetch subtasks for each card
      for (const card of this.cards) {
        const subtasksRef = projectFirestore
          .collection("subtasks")
          .where("card_id", "==", card.id);
        const subtasksSnapshot = await subtasksRef.get();
        card.subtasks = subtasksSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
      }
      this.isLoading = false;
    },
    async fetchSubtasks(cardId) {
      if (!cardId) {
        return;
      }
      const subtasksRef = projectFirestore.collection("subtasks");
      const subtasksQuery = subtasksRef.where("card_id", "==", cardId);
      const subtasksSnapshot = await subtasksQuery.get();
      const subtasks = subtasksSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const card = this.cards.find((card) => card.id === cardId);
      if (card) {
        card.subtasks = subtasks;
      }
    },
    async addBoard(name) {
      try {
        const res = await projectFirestore.collection("Boards").add({ name });
        const newBoard = { id: res.id, name };
        this.boards.push(newBoard);
      } catch (error) {
        console.error("Error adding board:", error);
      }
    },
    async addColumn(boardId, name) {
      try {
        const res = await projectFirestore
          .collection("columns")
          .add({ board_id: boardId, name });
        const newColumn = { id: res.id, board_id: boardId, name };
        this.columns.push(newColumn);
        // Reload the page
        location.reload();
      } catch (error) {
        console.error("Error adding column:", error);
      }
    },

    async addCard(boardId, columnId, title, description, subtasks = []) {
      const newCard = {
        board_id: boardId,
        column_id: columnId,
        title: title,
        description: description, // convert description to a string
      };
      try {
        const res = await projectFirestore.collection("cards").add(newCard);
        this.cards.push({ ...newCard, id: res.id });
        for (const subtask of subtasks) {
          await this.addSubtasks(res.id, subtask.title, subtask.isCompleted);
        }
      } catch (error) {
        console.error("Error adding card:", error);
      }
    },

    async addSubtasks(cardId, title) {
      if (title.trim() === "") {
        return; // skip empty subtasks
      }
      const newSubtask = {
        card_id: cardId,
        title: title,
        isCompleted: false,
      };
      try {
        const res = await projectFirestore
          .collection("subtasks")
          .add(newSubtask);
        this.subtasks.push({ ...newSubtask, id: res.id });
      } catch (error) {
        console.error("Error adding card:", error);
      }
    },
    async deleteBoardAndRelatedItems(boardId) {
      if (!boardId) {
        return;
      }
      try {
        // Prompt the user to confirm the deletion
        this.isLoading = false;

        // Delete all the cards associated with the board from Firestore
        const cardsToDelete = this.cards.filter(
          (card) => card.board_id === boardId
        );
        for (const card of cardsToDelete) {
          await projectFirestore.collection("cards").doc(card.id).delete();
        }

        // Remove all the cards associated with the board from local state
        this.cards = this.cards.filter((card) => card.board_id !== boardId);

        // Delete all the subtasks associated with the board from Firestore
        const subtasksToDelete = this.subtasks.filter((subtask) => {
          const card = this.cards.find((card) => card.id === subtask.card_id);
          return card.board_id === boardId;
        });
        for (const subtask of subtasksToDelete) {
          await projectFirestore
            .collection("subtasks")
            .doc(subtask.id)
            .delete();
        }

        // Remove all the subtasks associated with the board from local state
        this.subtasks = this.subtasks.filter((subtask) => {
          const card = this.cards.find((card) => card.id === subtask.card_id);
          return card.board_id !== boardId;
        });

        // Delete all the columns associated with the board from Firestore
        const columnsToDelete = this.columns.filter(
          (col) => col.board_id === boardId
        );
        for (const column of columnsToDelete) {
          await projectFirestore.collection("columns").doc(column.id).delete();
        }

        // Remove all the columns associated with the board from local state
        this.columns = this.columns.filter((col) => col.board_id !== boardId);

        // Delete the board from Firestore
        await projectFirestore.collection("Boards").doc(boardId).delete();

        // Remove the board from local state
        const index = this.boards.findIndex((board) => board.id === boardId);
        this.boards.splice(index, 1);
        this.selectedBoard = this.boards[0];
        // Show confirmation using SweetAlert
        await Swal.fire({
          title: "Board, columns, cards, and subtasks deleted!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });

        // Reload the page
        this.isLoading = true;

        location.reload();
      } catch (error) {
        console.error("Error deleting board and related items:", error);
      }
    },

    async deleteColumnAndCards(columnId) {
      try {
        // Prompt the user to confirm the deletion
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
          // Delete all the cards associated with the column from Firestore
          const cardsToDelete = this.cards.filter(
            (card) => card.column_id === columnId
          );
          for (const card of cardsToDelete) {
            await projectFirestore.collection("cards").doc(card.id).delete();
          }

          // Remove all the cards associated with the column from local state
          this.cards = this.cards.filter((card) => card.column_id !== columnId);

          // Delete the column from Firestore
          await projectFirestore.collection("columns").doc(columnId).delete();

          // Remove the column from local state
          const index = this.columns.findIndex((col) => col.id === columnId);
          this.columns.splice(index, 1);

          // Show confirmation using SweetAlert
          await Swal.fire({
            title: "Column and cards deleted!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });

          // Refresh the page
          location.reload();
        }
      } catch (error) {
        console.error("Error deleting column and cards:", error);
      }
    },

    async deleteSubtask(subtaskId) {
      try {
        await projectFirestore.collection("subtasks").doc(subtaskId).delete();
        const index = this.subtasks.findIndex(
          (subtask) => subtask.id === subtaskId
        );
        this.subtasks.splice(index, 1);
        location.reload();
      } catch (error) {
        console.error("Error deleting subtask:", error);
      }
    },
    async deleteCard(cardId) {
      try {
        // Delete card from Firestore
        await projectFirestore.collection("cards").doc(cardId).delete();

        // Remove card from local state
        const index = this.cards.findIndex((card) => card.id === cardId);
        this.cards.splice(index, 1);

        // Show confirmation using SweetAlert
        await Swal.fire({
          title: "Task Deleted deleted!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });

        // Refresh the page
        location.reload();
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    },
    async updateBoard(boardId, updates) {
      if (!boardId) {
        return;
      }
      try {
        const boardRef = projectFirestore.collection("Boards").doc(boardId);
        await boardRef.update(updates);
      } catch (error) {
        console.error("Error updating board:", error);
      }
    },

    async updateColumn(columnID, updates) {
      if (!columnID) {
        return;
      }
      try {
        const columnRef = projectFirestore.collection("columns").doc(columnID);
        await columnRef.update(updates);
        Object.assign(column, updates);
      } catch (error) {
        console.error("Error updating column:", error);
      }
    },

    async updateCard(card, updates) {
      try {
        const cardRef = projectFirestore.collection("cards").doc(card.id);
        await cardRef.update(updates);
        Object.assign(card, updates);
      } catch (error) {
        console.error("Error updating card:", error);
      }
    },
    async updateSubtasks(cardId, newSubtasks) {
      try {
        const currentSubtasks = this.subtasks.filter(
          (subtask) => subtask.card_id === cardId
        );

        // delete subtasks that are not in the new subtasks array
        const subtasksToDelete = currentSubtasks.filter(
          (subtask) =>
            !newSubtasks.some((newSubtask) => newSubtask.id === subtask.id)
        );
        for (const subtask of subtasksToDelete) {
          await projectFirestore
            .collection("subtasks")
            .doc(subtask.id)
            .delete();
          this.subtasks.splice(this.subtasks.indexOf(subtask), 1);
        }

        // update or add new subtasks
        for (const newSubtask of newSubtasks) {
          if (newSubtask.id) {
            // subtask already exists, update it
            await projectFirestore
              .collection("subtasks")
              .doc(newSubtask.id)
              .update({
                title: newSubtask.title,
                isCompleted: newSubtask.isCompleted,
              });
            const updatedSubtaskIndex = this.subtasks.findIndex(
              (subtask) => subtask.id === newSubtask.id
            );
            this.subtasks[updatedSubtaskIndex] = {
              ...this.subtasks[updatedSubtaskIndex],
              ...newSubtask,
            };
          } else {
            // subtask is new, add it
            const res = await projectFirestore.collection("subtasks").add({
              card_id: cardId,
              title: newSubtask.title,
              isCompleted: newSubtask.isCompleted,
            });
            this.subtasks.push({ ...newSubtask, id: res.id, card_id: cardId });
          }
        }
      } catch (error) {
        console.error("Error updating subtasks:", error);
      }
    },
    setSelectedBoard(boardId) {
      const board = this.boards.find((b) => b.id === boardId);
      if (board) {
        this.selectedBoard = board;
      } else {
        // Handle the case where the board is not found
        console.error(`Board with ID ${boardId} not found`);
      }
    },
  },
});
