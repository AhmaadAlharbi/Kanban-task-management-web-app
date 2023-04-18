// src/stores/TaskStore.js
import { defineStore } from "pinia";

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    boards: [],
    loading: false,

    selectedBoardIndex: 0,
  }),
  getters: {
    totalCount: (state) => {
      return state.boards.length;
    },
  },
  actions: {
    async getTasks() {
      this.loading = true;
      // get data from json file using json server
      const res = await fetch("http://localhost:3000/boards");
      const data = await res.json();
      this.boards = data;
      this.loading = false;
    },
    selectBoard(index) {
      this.selectedBoardIndex = index;
    },
  },
});
