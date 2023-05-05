<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    @click.self="$emit('close')"
  >
    <div class="bg-white w-11/12 md:w-1/2 lg:w-[25%] px-6 py-2 rounded-lg">
      <h2 class="text-2xl font-bold mb-2">Edit Task</h2>
      <form
        @submit.prevent="handleSubmit"
        class="max-w-md mx-auto overflow-y-auto"
      >
        <div class="mb-2">
          <label class="block text-gray-700 font-bold mb-2" for="title">
            Title
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Enter title"
            v-model="selectedCard.title"
          />
        </div>
        <div class="mb-2">
          <label class="block text-gray-700 font-bold mb-2" for="description">
            Description
          </label>
          <textarea
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Enter description"
            v-model="selectedCard.description"
          ></textarea>
        </div>
        <div class="mb-2">
          <label class="block text-gray-700 font-bold mb-2" for="subtask">
            SubTasks
          </label>
          <div class="overflow-y-auto max-h-48">
            <div v-for="(subtask, index) in taskStore.subtasks" :key="index">
              <div class="flex items-center">
                <input
                  class="appearance-none border rounded w-full py-2 mb-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  :id="'subtask-' + index"
                  type="text"
                  v-model="subtask.title"
                />

                <button
                  @click="showConfirmDialog(subtask, 'subtask')"
                  class="ml-2 flex-shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-full bg-transparent text-white focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  <img src="@/assets/images/icon-cross.svg" alt="" />
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-center my-3">
            <button
              @click="addSubtask"
              class="bg-myGray-medium w-full opacity-70 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
              type="button"
            >
              Add new subtask
            </button>
          </div>

          <label>Status</label>
          <select
            class="bg-white border border-gray-400 px-4 py-2 rounded-lg text-gray-700 w-full block my-1"
            v-model="selectedColumnId"
          >
            <option value="" disabled>Select a column</option>
            <option
              v-for="col in taskStore.columns"
              :key="col.id"
              :value="col.id"
              :selected="col.id === selectedCard.column_id"
            >
              {{ col.name }}
            </option>
          </select>
          <button
            class="bg-myLavender w-full text-white font-bold py-2 px-4 mt-3 inline-block rounded-full focus:outline-none focus:shadow-outline"
          >
            update Task
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
  props: ["selectedCard", "subtasks"],
  setup(props) {
    const newSubtasks = ref([]);
    const taskStore = useTaskStore();
    // taskStore.fetchColumns();
    taskStore.fetchSubtasks(props.selectedCard.id);
    const title = ref("");
    const description = ref("");
    const status = ref("");
    const selectedColumnId = ref(props.selectedCard.column_id);
    const addSubtask = () => {
      taskStore.subtasks.push({ title: "", isCompleted: false });
    };
    // const removeSubtask = (index) => {
    //   taskStore.subtasks.splice(index, 1);
    // };
    const showConfirmDialog = (subtask, type) => {
      let message, successMessage;
      let deleteFunction = null;

      if (!subtask.id) {
        // If the subtask is new and not yet in Firestore, just remove it from local state
        deleteFunction = () => {
          const index = taskStore.subtasks.indexOf(subtask);
          taskStore.subtasks.splice(index, 1);
        };
      } else if (type === "subtask") {
        message = "Delete this subtask?";
        successMessage = "Your subtask has been deleted.";
        deleteFunction = taskStore.deleteSubtask;
      } else if (type === "task") {
        message = "Delete this task?";
        successMessage = "Your task has been deleted.";
        deleteFunction = taskStore.deleteCard;
      }

      Swal.fire({
        title: message,
        text: "You will not be able to recover this item!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          deleteFunction(subtask.id);
          Swal.fire("Deleted!", successMessage, "success");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your item is safe :)", "error");
        }
      });
    };

    const handleSubmit = async () => {
      try {
        await taskStore.updateCard(props.selectedCard, {
          column_id: selectedColumnId.value,
          title: props.selectedCard.title,
          description: props.selectedCard.description,
        });
        const nonEmptySubtasks = taskStore.subtasks.filter(
          (subtask) => subtask.title !== ""
        );
        if (nonEmptySubtasks.length > 0) {
          await taskStore.updateSubtasks(
            props.selectedCard.id,
            nonEmptySubtasks
          );
        }
        location.reload();
      } catch (error) {
        console.error("Error updating card:", error);
      }
    };

    return {
      showConfirmDialog,
      selectedColumnId,
      title,
      description,
      status,
      handleSubmit,
      taskStore,
      newSubtasks,
      addSubtask,
    };
  },
};
</script>

<style>
</style>