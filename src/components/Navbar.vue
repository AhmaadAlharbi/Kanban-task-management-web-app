<template>
  <nav class="bg-white h-20">
    <ul class="flex justify-between items-center px-4 md:px-10 py-5">
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
  <nav
    v-if="cardMenuIcon"
    class="absolute right-0 top-20 z-20 bg-white shadow-lg px-10 py-5"
  >
    <ul class="space-y-2">
      <li
        @click="
          editBoard = true;
          cardMenuIcon = false;
        "
        class="cursor-pointer text-gray-400 hover:text-gray-800"
      >
        Edit Task
      </li>
      <li
        @click="
          taskStore.deleteBoardAndRelatedItems(taskStore.selectedBoard.id)
        "
        class="cursor-pointer text-red-400 hover:text-red-800"
      >
        Delete board
      </li>
    </ul>
  </nav>
  <div v-if="addTask">
    <AddTask @close="addTask = false" />
  </div>
  <div v-if="editBoard">
    <EditBoard :selectedBoard="selectedBoard" @close="editBoard = false" />
  </div>
</template>


<script>
import { ref } from "vue";
import AddTask from "./AddTask.vue";
import { useTaskStore } from "../stores/TaskStore";
import EditBoard from "../components/EditBoard.vue";

export default {
  components: { AddTask, EditBoard },
  setup() {
    const taskStore = useTaskStore();
    const addTask = ref(false);
    const editBoard = ref(false);

    const cardMenuIcon = ref(false);
    return { taskStore, addTask, cardMenuIcon, editBoard };
  },
};
</script>

<style>
</style>