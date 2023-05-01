<template>
  <div
    @click.self="$emit('close')"
    class="absolute top-16 px-5 py-3 left-0 inset-0 bg-black bg-opacity-75"
  >
    <div
      class="bg-white rounded-md dark:bg-myGray-darker shadow-xl py-6 w-80 px-2 md:w-96 border border-dashed border-myGray-darker"
    >
      <div class="flex flex-col justify-between h-full">
        <div>
          <div class="mt-6">
            <p
              class="text-myGray-medium font-bold mb-2 px-3 uppercase tracking-wider"
            >
              all boards ({{ taskStore.boards.length }})
            </p>
            <nav class="space-y-2 mt-5">
              <div
                v-for="(board, index) in taskStore.boards"
                :key="board.id"
                class="flex cursor-pointer items-center space-x-3 py-2 px-4 rounded-lg hover:bg-myLavender transition-colors duration-300"
                :class="{
                  'bg-myPurple': board.id === taskStore.selectedBoard.id,
                }"
              >
                <img src="@/assets/images/icon-board.svg" alt="" />
                <h4
                  @click.self="$emit('close')"
                  @click="taskStore.selectedBoard = taskStore.boards[index]"
                  class="text-base font-bold"
                  :class="{
                    'text-myGray-medium':
                      board.id !== taskStore.selectedBoard.id,
                    'text-white': board.id === taskStore.selectedBoard.id,
                  }"
                >
                  {{ board.name }}
                </h4>
              </div>
              <h4
                class="text-base font-bold text-myGray-medium hover:text-myPurple cursor-pointer px-4 mt-4"
              >
                + Add new Board
              </h4>
            </nav>
          </div>
        </div>
        <div class="flex flex-col justify-between my-6">
          <div
            class="flex justify-center max-w-sm mx-auto bg-gray-200 dark:bg-myGray-darkest py-2 px-10 mb-5 space-x-3 items-center"
          >
            <img
              src="../assets/images/icon-light-theme.svg"
              alt=""
              class="w-5 h-5"
            />
            <div>
              <label class="switch">
                <input
                  id="default-toggle2"
                  @click="toggleDark"
                  @click.self.stop="$emit('close')"
                  type="checkbox"
                />
                <span class="slider round"></span>
              </label>
            </div>
            <img
              src="../assets/images/icon-dark-theme.svg"
              alt=""
              class="w-5 h-5"
            />
          </div>
        </div>
      </div>
      <div v-if="addBoard">
        <AddBoard @close="addBoard = false" />
      </div>
    </div>
  </div>
</template>

<script>
import { useTaskStore } from "../stores/TaskStore";

export default {
  setup() {
    const taskStore = useTaskStore();
    const toggleDark = () => {
      document
        .getElementById("default-toggle2")
        .addEventListener("change", function () {
          if (this.checked) {
            document.documentElement.classList.add("dark");
            taskStore.theme = "dark"; // theme is dark
          } else {
            document.documentElement.classList.remove("dark");
            taskStore.theme = "light"; // theme is light
          }
        });
      this.$emit("darkModeToggled");
    };
    return { taskStore, toggleDark };
  },
};
</script>

<style>
</style>