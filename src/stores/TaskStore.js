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
    allColumns() {
      const selectedBoard = this.boards[this.selectedBoardIndex];

      if (!selectedBoard) {
        return [];
      }

      return selectedBoard.columns;
    },
    boardName() {
      const selectedBoard = this.boards[this.selectedBoardIndex];
      if (!selectedBoard) {
        return [];
      }

      return selectedBoard.name;
    },
  },
  actions: {
    // async getTasks() {
    //   this.loading = true;
    //   // get data from json file using json server
    //   const res = await fetch("http://localhost:3000/boards");
    //   const data = await res.json();
    //   this.boards = data;
    //   this.loading = false;
    // },
    async getBoards() {
      this.loading = true;
      try {
        const response = await fetch("http://localhost:3000/boards");
        const data = await response.json();
        this.boards = data;
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
      this.loading = false;
    },

    setSelectedBoardIndex(index) {
      this.selectedBoardIndex = index;
    },
  },
});
