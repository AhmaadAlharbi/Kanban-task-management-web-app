import { defineStore } from "pinia";
import { projectFirestore } from "../firebase/config";
import Swal from "sweetalert2";

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    boards: [],
    columns: [],
    cards: [],
    subtasks: [],
  }),
  getters: {
    boardNames: (state) => state.boards.map((board) => board.name),
    columnsNames: (state) => state.columns.map((column) => column.name),
    completedSubTasks: (state) =>
      state.boards.filter((board) => board.subtask.isCompleted),
  },

  actions: {
    async fetchBoards() {
      const res = await projectFirestore.collection("Boards").get();
      this.boards = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    },
    async fetchColumns() {
      const res = await projectFirestore.collection("columns").get();
      this.columns = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    },
    async addCard(columnId, title, description, subtasks = []) {
      const newCard = {
        column_id: columnId,
        title: title,
        description: JSON.stringify(description), // convert description to a string
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
    async addSubtasks(cardId, title, isCompleted) {
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
  },
});
