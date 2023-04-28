<template>
  <nav class="bg-white h-20">
    <ul class="flex justify-between items-center px-10 py-5">
      <li class="text-2xl font-bold">
        {{ taskStore.selectedBoard.name }}
      </li>
      <div class="flex items-center space-x-4 justify-around">
        <li
          @click="addTask = true"
          class="bg-purple-500 py-2 px-2 text-white cursor-pointer"
        >
          + Add a New Task
        </li>
        <img
          @click="cardMenuIcon = !cardMenuIcon"
          class="cursor-pointer"
          src="@/assets/images/icon-vertical-ellipsis.svg"
          alt=""
        />
      </div>
    </ul>
  </nav>
  <div v-if="addTask">
    <AddTask @close="addTask = false" />
  </div>
</template>

<script>
import { ref } from "vue";
import AddTask from "./AddTask.vue";
import { useTaskStore } from "../stores/TaskStore";

export default {
  components: { AddTask },
  setup() {
    const taskStore = useTaskStore();
    const addTask = ref(false);
    const cardMenuIcon = ref(false);
    return { taskStore, addTask, cardMenuIcon };
  },
};
</script>

<style>
</style>