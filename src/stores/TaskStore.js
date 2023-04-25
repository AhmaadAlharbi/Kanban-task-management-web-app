import { defineStore } from "pinia";
import { projectFirestore } from "../firebase/config";

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    boards: [],
    columns: [],
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
  },
});
