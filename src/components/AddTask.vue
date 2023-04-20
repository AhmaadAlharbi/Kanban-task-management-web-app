<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    @click.self="$emit('close')"
  >
    <div class="bg-white w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-lg">
      <h2 class="text-2xl font-bold mb-4">Add a New Task</h2>
      <form class="max-w-md mx-auto">
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="title">
            Title
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Enter title"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="description">
            Description
          </label>
          <textarea
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Enter description"
          ></textarea>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="subtask">
            SubTasks
          </label>

          <!--- --->
          <div
            v-for="(subtask, index) in subtasks"
            :key="index"
            class="flex items-center mb-2"
          >
            <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              :id="'subtask-' + index"
              type="text"
              :placeholder="'Enter subtask ' + (index + 1)"
            />

            <button
              @click="removeSubtask(index)"
              class="ml-2 flex-shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-full bg-transparent text-white focus:outline-none focus:shadow-outline"
              type="button"
            >
              <img src="@/assets/images/icon-cross.svg" alt="" />
            </button>
          </div>
          <button
            @click="addSubtask"
            class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            type="button"
          >
            Add new subtask
          </button>
        </div>
      </form>

      <button
        @click="addSubtask"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click.stop="$emit('close')"
      >
        Close Modal
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const subtasks = ref([{ text: "" }]);

    const addSubtask = () => {
      subtasks.value.push({ text: "" });
    };

    const removeSubtask = (index) => {
      subtasks.value.splice(index, 1);
    };

    return {
      subtasks,
      addSubtask,
      removeSubtask,
    };
  },
};
</script>

<style>
</style>