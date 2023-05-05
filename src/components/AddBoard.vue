<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    @click.self="$emit('close')"
  >
    <div class="bg-white w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-lg">
      <h2 class="text-2xl font-bold mb-4">Add a New Board</h2>
      <form @submit.prevent="handleSubmit" class="max-w-md mx-auto">
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="title">
            Board Name
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Enter board name"
            v-model="name"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 dark:text-white font-bold mb-2"
            for="subtask"
          >
            Board columns
          </label>

          <!--- --->
          <div
            v-for="(col, index) in columns"
            :key="index"
            class="flex items-center mb-2"
          >
            <input
              class="appearance-none mb-4 dark:bg-myGray-darkest dark:text-white border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              :id="'col-' + index"
              type="text"
              v-model="col.name"
              :placeholder="'Enter column ' + (index + 1)"
            />

            <button
              @click="taskStore.deleteColumnAndCards(col.id)"
              class="ml-2 flex-shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-full bg-transparent text-white focus:outline-none focus:shadow-outline"
              type="button"
            >
              <img src="@/assets/images/icon-cross.svg" alt="" />
            </button>
          </div>
          <div class="flex justify-center my-7">
            <button
              @click="addColumns"
              class="bg-myLavender w-full hover:bg-myPurple text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
              type="button"
            >
              Add new columns
            </button>
          </div>
          <button
            class="bg-myPurple hover:bg-myLavender w-full text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          >
            Create Board
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
    const taskStore = useTaskStore();
    const name = ref("");
    const columns = ref([]);
    const addColumns = () => {
      columns.value.push({
        name: "",
      });
    };
    const removeColumns = (index) => {
      columns.value.splice(index, 1);
    };

    const handleSubmit = async () => {
      try {
        const newBoard = await taskStore.addBoard(name.value);
        // Add all the columns for the new board
        for (const col of columns.value) {
          if (col.name) {
            await taskStore.addColumn(taskStore.latestBoard.id, col.name);
          }
        }
        location.reload(); // reload the page after the task is added
      } catch (error) {
        console.error("Error adding board:", error);
      }
    };

    return {
      taskStore,
      name,
      columns,
      addColumns,
      removeColumns,
      handleSubmit,
    };
  },
};
</script>

<style>
</style>