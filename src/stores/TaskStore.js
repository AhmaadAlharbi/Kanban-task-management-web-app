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
  },

  actions: {
    async fetchBoards() {
      const res = await projectFirestore.collection("Boards").get();
      this.boards = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      this.selectedBoard = this.boards[0];
    },
    async fetchColumns(boardId) {
      if (!boardId) {
        return;
      }
      const res = await projectFirestore
        .collection("columns")
        .where("board_id", "==", boardId)
        .get();
      this.columns = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
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
  },
});
