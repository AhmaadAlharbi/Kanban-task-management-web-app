import { defineStore } from "pinia";
import { projectFirestore } from "../firebase/config";

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    boards: [],
    loading: false,
    selectedBoardIndex: 0,
    tasks: [], // add a new property to store the tasks
  }),
  getters: {
    getCompletedSubtaskCount: (state) => (subtasks) => {
      return subtasks.filter((subtask) => subtask.isCompleted).length;
    },
  },

  actions: {
    async getTasks() {
      try {
        const querySnapshot = await projectFirestore.collection("tasks").get();
        const tasks = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          data.id = doc.id;
          return data;
        });
        this.tasks = tasks;
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    },
  },
});
