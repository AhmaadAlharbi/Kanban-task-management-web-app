<template>
  <nav class="bg-white h-20">
    <ul class="flex justify-between items-center px-10">
      <li class="text-2xl font-bold">
        {{ taskStore.selectedBoard.name }} - {{ taskStore.selectedBoard.id }}
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
</template>

<script>
import { useTaskStore } from "../stores/TaskStore";

export default {
  setup() {
    const taskStore = useTaskStore();
    return { taskStore };
  },
};
</script>

<style>
</style>