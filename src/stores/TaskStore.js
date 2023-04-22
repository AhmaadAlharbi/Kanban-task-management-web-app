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
    // async addTasks(boardName, columnName, task) {
    //   let targetBoard = this.boards.find((board) => board.name === boardName);

    //   if (targetBoard) {
    //     let targetColumn = targetBoard.columns.find(
    //       (column) => column.name === columnName
    //     );

    //     if (targetColumn) {
    //       targetColumn.tasks.push(task);

    //       const res = await fetch("http://localhost:3000/boards", {
    //         method: "POST",
    //         body: JSON.stringify(task),
    //         headers: { "Content-Type": "application/json" },
    //       });

    //       if (res.error) {
    //         console.log(res.error);
    //       }
    //     } else {
    //       console.log(
    //         `Column with name "${columnName}" not found in the "${boardName}" board.`
    //       );
    //     }
    //   } else {
    //     console.log(`Board with name "${boardName}" not found.`);
    //   }
    // },
    // async addTasks(boardName, columnName, task) {
    //   let targetBoard = this.boards.find((board) => board.name === boardName);

    //   if (targetBoard) {
    //     let targetColumn = targetBoard.columns.find(
    //       (column) => column.name === columnName
    //     );

    //     if (targetColumn) {
    //       targetColumn.tasks.push(task);

    //       const res = await fetch("http://localhost:3000/boards", {
    //         method: "POST",
    //         body: JSON.stringify(task),
    //         headers: { "Content-Type": "application/json" },
    //       });

    //       if (res.error) {
    //         console.log(res.error);
    //       }
    //     } else {
    //       console.log(
    //         `Column with name "${columnName}" not found in the "${boardName}" board.`
    //       );
    //     }
    //   } else {
    //     console.log(`Board with name "${boardName}" not found.`);
    //   }
    // },
    async addTasks(boardName, columnName, task) {
      let targetBoard = this.boards.find((board) => board.name === boardName);

      if (targetBoard) {
        let targetColumn = targetBoard.columns.find(
          (column) => column.name === columnName
        );

        if (targetColumn) {
          targetColumn.tasks.push(task);

          try {
            const res = await fetch("http://localhost:3000/boards", {
              method: "POST",
              body: JSON.stringify(task),
              headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
              console.log("Task added successfully");
            } else {
              console.log("Failed to add task");
            }
          } catch (error) {
            console.log("An error occurred:", error);
          }
        } else {
          console.log(
            `Column with name "${columnName}" not found in the "${boardName}" board.`
          );
        }
      } else {
        console.log(`Board with name "${boardName}" not found.`);
      }
    },

    setSelectedBoardIndex(index) {
      this.selectedBoardIndex = index;
    },
  },
});
