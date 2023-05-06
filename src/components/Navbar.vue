<template>
  <nav class="bg-myWhite dark:bg-myGray-darker h-20 overflow-hidden">
    <ul class="flex justify-between items-center px-4 md:px-10 py-5">
      <li class="text-2xl font-bold dark:text-white flex items-center">
        <span class="md:hidden mr-2"
          ><img src="@/assets/images/logo-mobile.svg" alt=""
        /></span>
        {{ taskStore.selectedBoard.name }}
        <span class="md:hidden ml-2 mt-1 cursor-pointer"
          ><img
            @click="mobileNav = !mobileNav"
            src="@/assets/images/icon-chevron-down.svg"
            alt=""
        /></span>
      </li>
      <div class="md:hidden" v-if="mobileNav">
        <MobileNavbar
          @close="mobileNav = false"
          @darkModeToggled="mobileNav = true"
        />
      </div>
      <div class="flex items-center space-x-4 justify-around">
        <li
          @click="addTask = true"
          class="bg-myPurple hidden md:block text-sm font-bold hover:bg-myLavender rounded-full py-2 px-4 text-white cursor-pointer"
        >
          + Add a New Task
        </li>
        <li
          @click="editBoard = true"
          class="bg-myGray-medium flex items-center space-x-2 md:hidden text-sm font-bold hover:bg-myRed-darker rounded-full py-2 px-4 text-white cursor-pointer"
        >
          <img
            class="md:hidden"
            src="@/assets/images/icon-add-task-mobile.svg"
            alt=""
          />
          <span class="px-2">Column</span>
        </li>
        <li
          @click="addTask = true"
          class="bg-myPurple md:hidden text-sm flex items-center space-x-2 font-bold hover:bg-myLavender rounded-full py-2 px-4 text-white cursor-pointer"
        >
          <img
            class="md:hidden"
            src="@/assets/images/icon-add-task-mobile.svg"
            alt=""
          />
          <span class="px-2">Task</span>
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
    @click="cardMenuIcon = false"
    class="absolute right-0 top-20 z-20 bg-white dark:bg-myGray-darkest shadow-lg px-10 py-5"
  >
    <ul class="space-y-2">
      <li
        @click="
          editBoard = true;
          cardMenuIcon = false;
        "
        class="cursor-pointer text-gray-400 hover:text-gray-800 dark:hover:text-white"
      >
        Edit Board
      </li>
      <li
        @click="deleteCard = true"
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
  <div v-if="deleteCard">
    <DeleteCard
      type="board"
      :title="taskStore.selectedBoard.name"
      :message="`Are you sure you want to delete the \`${taskStore.selectedBoard.name}\` This action will remove all columns and tasks and cannot be reversed.`"
      @close="deleteCard = false"
    />
  </div>
</template>


<script>
import { ref } from "vue";
import AddTask from "./AddTask.vue";
import { useTaskStore } from "../stores/TaskStore";
import EditBoard from "../components/EditBoard.vue";
import MobileNavbar from "../components/MobileNavbar.vue";
import DeleteCard from "../components/DeleteCard.vue";

export default {
  components: { AddTask, EditBoard, MobileNavbar, DeleteCard },
  setup() {
    const taskStore = useTaskStore();
    const addTask = ref(false);
    const editBoard = ref(false);
    const mobileNav = ref(false);
    const cardMenuIcon = ref(false);
    const deleteCard = ref("");
    return {
      deleteCard,
      taskStore,
      addTask,
      cardMenuIcon,
      editBoard,
      mobileNav,
    };
  },
};
</script>

<style>
</style>