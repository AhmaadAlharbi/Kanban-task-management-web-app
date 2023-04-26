<template>
  <div class="flex flex-col w-full">
    <nav class="bg-white h-20">
      <ul class="flex justify-between items-center mt-4 px-10">
        <li class="text-2xl font-bold">Platform Launch</li>
        <li class="bg-purple-500 py-2 px-2 text-white cursor-pointer">
          + Add a New Task
        </li>
      </ul>
    </nav>
    <div v-if="taskStore.columns">
      <h1>Columns</h1>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import { useTaskStore } from "../stores/TaskStore";

export default defineComponent({
  setup() {
    const taskStore = useTaskStore();
    //fetch board to set selectedBoard
    taskStore.fetchBoards();
    taskStore.fetchColumns(taskStore.selectedBoard.id);
    taskStore.fetchCards(taskStore.selectedBoard.id);
    return { taskStore };
  },
});
</script>
