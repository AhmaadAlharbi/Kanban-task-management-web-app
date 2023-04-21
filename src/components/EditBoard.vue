<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    @click.self="$emit('close')"
  >
    <div class="bg-white w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-lg">
      <h2 class="text-2xl font-bold mb-4">Edit Board</h2>
      <form class="max-w-sm mx-auto">
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="board-name">
            Board Name
          </label>
          <input
            v-model="taskStore.boardName"
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="board-name"
            name="board-name"
            type="text"
            placeholder="Enter a board name"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="board-columns">
            Board Columns
          </label>
        </div>
        <div
          class="flex items-center mb-2"
          v-for="column in taskStore.allColumns"
          :key="column.name"
        >
          <input
            v-model="column.name"
            id="board-columns"
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="board-columns"
            type="text"
          />
          <button
            class="bg-transparent hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            <img class="h-4 w-4" src="@/assets/images/icon-cross.svg" alt="" />
          </button>
        </div>
        <div v-for="(subtask, index) in subtasks" :key="index">
          <div v-if="index !== 0" class="flex items-center mb-2">
            <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              :id="'subtask-' + index"
              type="text"
              :placeholder="'Enter subtask'"
            />

            <button
              @click="removeSubtask(index)"
              class="bg-transparent hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              <img src="@/assets/images/icon-cross.svg" alt="" />
            </button>
          </div>
        </div>

        <div class="flex justify-center my-4">
          <button
            @click="addSubtask"
            class="bg-purple-500 w-full hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            type="button"
          >
            Add new subtask
          </button>
        </div>
        <button
          class="bg-white border border-purple-700 w-full my-1 hover:opacity-75 text-purple-900 font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Save Changes
        </button>
        <!-- <button
          class="bg-transparent border border-purple-500 w-full hover:opacity-75 text-purple-700 font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          type="submit"
        >
          save changes
        </button> -->
      </form>

      <!-- <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click.stop="$emit('close')"
      >
        Close Modal
      </button> -->
    </div>
  </div>
</template>

<script>
import { useTaskStore } from "@/stores/TaskStore";
import { ref } from "vue";
export default {
  setup() {
    const taskStore = useTaskStore();
    const subtasks = ref([{ text: "" }]);
    const addSubtask = () => {
      subtasks.value.push({ text: "" });
    };
    const removeSubtask = (index) => {
      subtasks.value.splice(index, 1);
    };
    return { taskStore, subtasks, addSubtask, removeSubtask };
  },
};
</script>

<style>
</style>