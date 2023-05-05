<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white dark:bg-myGray-darkest w-11/12 md:w-1/2 lg:w-[25%] p-6 rounded-lg"
    >
      <h2 class="text-2xl font-bold mb-4 dark:text-white">Add a New Task</h2>
      <form
        @submit.prevent="handleSubmit"
        class="max-w-md mx-auto overflow-y-auto"
      >
        <div class="mb-4">
          <label
            class="block text-gray-700 font-bold mb-2 dark:text-white"
            for="title"
          >
            Title
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Enter title"
            v-model="title"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 font-bold mb-2 dark:text-white"
            for="description"
          >
            Description
          </label>
          <textarea
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Enter description"
            v-model="description"
          ></textarea>
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 font-bold mb-2 dark:text-white"
            for="subtask"
          >
            SubTasks
          </label>

          <!--- --->
          <div class="overflow-y-auto max-h-48">
            <div
              v-for="(subtask, index) in subtasks"
              :key="index"
              class="flex flex-row pb-4"
            >
              <input
                class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                :id="'subtask-' + index"
                type="text"
                v-model="subtask.title"
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
          </div>

          <div class="flex justify-center my-7">
            <button
              @click="addSubtask"
              class="bg-myGray-medium w-full opacity-70 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
              type="button"
            >
              Add new subtask
            </button>
          </div>

          <label class="dark:text-white text-white">Status</label>
          <select
            v-model="selectedColumnId"
            class="bg-white border border-gray-400 px-4 py-2 rounded-lg text-gray-700 w-full block mt-4"
          >
            <option value="" disabled>Select a column</option>
            <option
              v-for="col in taskStore.columns"
              :key="col.id"
              :value="col.id"
            >
              {{ col.name }}
            </option>
          </select>
          <button
            class="bg-myLavender w-full text-white font-bold py-2 px-4 mt-6 inline-block rounded-full focus:outline-none focus:shadow-outline"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useTaskStore } from "@/stores/TaskStore";

export default {
  setup() {
    const subtasks = ref([]);
    const taskStore = useTaskStore();
    // taskStore.fetchBoards().then(() => {
    //   taskStore.fetchColumns(taskStore.selectedBoard.id);
    // });
    const title = ref("");
    const description = ref("");
    const status = ref("");
    const selectedColumnId = ref("");

    const addSubtask = () => {
      subtasks.value.push({ title: "", isCompleted: false });
    };

    const removeSubtask = (index) => {
      subtasks.value.splice(index, 1);
    };
    const handleSubmit = () => {
      taskStore
        .addCard(
          taskStore.selectedBoard.id,
          selectedColumnId.value,
          title.value,
          description.value,
          subtasks.value
        )
        .then(() => {
          (title.value = ""),
            (description.value = ""),
            (subtasks.value = ""),
            location.reload(); // reload the page after the task is added
        });
    };

    return {
      selectedColumnId,
      title,
      description,
      status,
      handleSubmit,
      taskStore,
      subtasks,
      addSubtask,
      removeSubtask,
    };
  },
};
</script>

<style>
</style>