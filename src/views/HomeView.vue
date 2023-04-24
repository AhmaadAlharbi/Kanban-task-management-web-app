<template>
  <div class="flex flex-col w-full">
    <nav class="bg-white h-20">
      <ul class="flex justify-between items-center mt-4 px-10">
        <li class="text-2xl font-bold">Platform Launch</li>
        <li
          class="bg-purple-500 py-2 px-2 text-white cursor-pointer"
          @click="addTaskComponent = true"
        >
          + Add a New Task
        </li>
      </ul>
    </nav>
    <div v-if="taskStore.tasks">
      <!-- TODO -->
      <div>
        <div class="flex space-x-2">
          <div class="h-6 w-6 rounded-full bg-sky-500"></div>
          <h1 class="text-black">TODO ()</h1>
        </div>
      </div>
      <div v-if="taskStore.tasks && taskStore.tasks[0]">
        <div
          v-for="(column, columnIndex) in taskStore.tasks[0].columns"
          :key="columnIndex"
          class="shadow-md mt-3 py-3 px-6 bg-white w-80 mb-8"
        >
          <div class="flex flex-col space-x-2">
            <h1 class="text-black">{{ column.title }}</h1>
            <div v-if="column.subtasks">
              {{ taskStore.getCompletedSubtaskCount(column.subtasks) }} of
              {{ column.subtasks.length }} subtasks
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useTaskStore } from "../stores/TaskStore";
import { computed, onMounted } from "vue";
import getTasks from "../composables/getTasks";

export default defineComponent({
  setup() {
    const taskStore = useTaskStore();
    taskStore.getTasks();

    // const { tasks, error, load } = getTasks();
    // load();
    return { taskStore };
  },
});
</script>
