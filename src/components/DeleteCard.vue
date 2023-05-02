<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white dark:bg-myGray-darkest relative w-11/12 md:w-1/2 lg:w-1/3 max-w-2xl p-6 rounded-lg sm:w-full"
    >
      <form @submit.prevent="handleSubmit" class="max-w-md mx-auto">
        <h2 class="text-xl text-myRed-darkest font-bold mb-4 dark:text-white">
          Delete this {{ type }}?
        </h2>
        <p class="text-myGray-medium">
          {{ message }}
        </p>
        <div class="flex space-x-12 justify-center mt-4">
          <button
            type="submit"
            class="bg-myRed-darkest w-full rounded-full hover:opacity-70 flex-1 font-bold text-white block px-6 py-2"
          >
            Delete
          </button>
          <button
            @click="$emit('close')"
            class="bg-myGray-light text-myPurple w-full rounded-full hover:opacity-70 flex-1 font-bold block px-6 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useTaskStore } from "@/stores/TaskStore";
import { timestamp } from "@/firebase/config";

export default {
  props: ["type", "title", "message"],
  setup(props) {
    const taskStore = useTaskStore();
    const handleSubmit = () => {
      if (props.type === "task") {
        taskStore.deleteCard(taskStore.selectedBoard.id);
      } else {
        taskStore.deleteBoardAndRelatedItems(taskStore.selectedBoard.id);
      }
    };
    return { taskStore, handleSubmit };
  },
};
</script>

<style>
</style>
