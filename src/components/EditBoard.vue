<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    @click.self="$emit('close')"
  >
    <div class="bg-white w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-lg">
      <h2 class="text-2xl font-bold mb-4">Edit Board</h2>
      <form @submit.prevent="handleSubmit" class="max-w-md mx-auto">
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="title">
            Board Name
            {{ taskStore.selectedBoard.id }}
            {{ name }}
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
          <label class="block text-gray-700 font-bold mb-2" for="subtask">
            Board columns
          </label>

          <!--- --->
          <div
            v-for="(col, index) in taskStore.columns"
            :key="index"
            class="flex items-center mb-2"
          >
            <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              class="bg-purple-500 w-full hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
              type="button"
            >
              Add new columns
            </button>
          </div>

          <button
            class="bg-purple-300 w-full hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
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
    taskStore.fetchColumns(taskStore.selectedBoard.id);
    const name = ref(taskStore.selectedBoard.name);
    const columns = ref([]);
    const addColumns = () => {
      taskStore.columns.push({
        board_id: taskStore.selectedBoard.id,
        name: "",
      });
    };
    const removeColumns = (index) => {
      taskStore.columns.value.splice(index, 1);
    };
    const handleSubmit = async () => {
      try {
        // Update the board name
        await taskStore.updateBoard(taskStore.selectedBoard.id, {
          name: name.value,
        });

        // Update each column name
        for (const col of taskStore.columns) {
          await taskStore.updateColumn(col.id, { name: col.name });
        }

        // Show success message using SweetAlert
        await Swal.fire({
          title: "Board and columns updated!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });

        // Refresh the page
        // location.reload();
      } catch (error) {
        console.error("Error updating board and columns:", error);
      }
    };

    return {
      taskStore,
      columns,
      name,
      addColumns,
      removeColumns,
      handleSubmit,
    };
  },
};
</script>

<style>
</style>