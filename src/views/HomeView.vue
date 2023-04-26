<template>
  <div class="flex flex-col w-full">
    <nav class="bg-white h-20">
      <ul class="flex justify-between items-center mt-4 px-10">
        <li class="text-2xl font-bold">Platform Launch</li>
        <li
          @click="addTask = true"
          class="bg-purple-500 py-2 px-2 text-white cursor-pointer"
        >
          + Add a New Task
        </li>
      </ul>
    </nav>
    <div v-if="addTask">
      <AddTask @close="addTask = false" />
    </div>
    <div v-if="taskStore.columns.length > 0">
      <div class="flex justify-around mt-3">
        <div
          class="flex flex-col"
          v-for="col in taskStore.columns"
          :key="col.id"
        >
          <h1 class="bg-gray-300 px-2">{{ col.name }} - {{ col.id }}</h1>
          <div v-if="taskStore.cards">
            <!-- Loop through the cards -->
            <div
              v-for="card in taskStore.cards"
              :key="card.id"
              @click="showTaskDetails(card)"
            >
              <!-- Only display the card if it belongs to the current column -->
              <div v-if="card.column_id === col.id">
                <div
                  class="flex flex-col shadow-md mt-3 py-3 px-6 bg-white w-80 mb-8"
                >
                  <!-- Display the card title -->
                  <p class="font-bold" v-if="card">{{ card.title }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useTaskStore } from "../stores/TaskStore";
import AddTask from "../components/AddTask.vue";
export default defineComponent({
  components: { AddTask },
  setup() {
    const addTask = ref(false);
    const taskStore = useTaskStore();
    //fetch board to set selectedBoard
    taskStore.fetchBoards().then(() => {
      taskStore.fetchColumns(taskStore.selectedBoard.id).then(() => {
        taskStore.fetchCards(taskStore.selectedBoard.id);
      });
    });
    return { taskStore, addTask };
  },
});
</script>
