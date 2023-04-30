<!-- TaskDetails.vue -->
<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    @click.self="$emit('close')"
  >
    <div class="bg-white relative w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-lg">
      <div class="flex justify-between items-center">
        <h1 class="mb-4 font-bold text-xl" v-if="selectedCard">
          {{ selectedCard.title }}
        </h1>

        <img
          @click="cardMenuIcon = !cardMenuIcon"
          class="cursor-pointer"
          src="@/assets/images/icon-vertical-ellipsis.svg"
          alt=""
        />
        <nav
          v-if="cardMenuIcon"
          class="absolute right-0 top-20 z-20 bg-white shadow-lg px-10 py-5"
        >
          <ul class="space-y-2">
            <li
              @click="EditTask = true"
              class="cursor-pointer text-gray-400 hover:text-gray-800"
            >
              Edit Task
            </li>
            <li
              @click="showConfirmDialog(selectedCard.id, 'task')"
              class="cursor-pointer text-red-400 hover:text-red-800"
            >
              Delete Task
            </li>
          </ul>
        </nav>
      </div>
      <p>
        subtasks ( {{ cardCompletedSubtasksCount(selectedCard) }} of
        {{ selectedCard.subtasks.length }} )
      </p>
      <div v-for="sub in selectedCard.subtasks" :key="sub.id">
        <div
          class="bg-gray-200 p-2 my-2 rounded-lg flex items-center hover:bg-gray-100"
        >
          <input
            @change="updateSubtask(sub)"
            v-model="sub.isCompleted"
            type="checkbox"
            class="mr-2"
          />
          <div class="flex-1 flex justify-between items-center">
            <h1 :class="{ 'line-through italic': sub.isCompleted }">
              {{ sub.title }}
            </h1>

            <p>
              <i
                class="fa fa-trash-o cursor-pointer hover:text-red-400 transition-colors duration-100"
                style="font-size: 36px"
                @click="showConfirmDialog(sub.id, 'subtask')"
              ></i>
            </p>
          </div>
        </div>
      </div>
      <div class="mb-4">
        <label class="mr-2">Current Status</label>
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
      </div>
      <!-- current status -->

      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click.stop="$emit('close')"
      >
        Close
      </button>
    </div>
  </div>
  <div v-if="EditTask">
    <EditTask
      :selectedCard="selectedCard"
      :subtasks="subtasks"
      @close="EditTask = false"
    />
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useTaskStore } from "@/stores/TaskStore";
import Swal from "sweetalert2";
import EditTask from "./EditTask.vue";
export default {
  props: ["selectedCard"],
  components: { EditTask },
  setup(props) {
    const taskStore = useTaskStore();
    const updateSubtask = async (subtask) => {
      taskStore.updateSubtasks(subtask.card_id, [subtask]);
    };
    taskStore.fetchSubtasks(props.selectedCard.id);
    const subtasks = ref([]);
    // Fetch subtasks based on the selected card id
    watch(
      () => props.selectedCard.id,
      async (cardId) => {
        subtasks.value = await taskStore.fetchSubtasks(cardId);
      },
      { immediate: true }
    );
    // taskStore.fetchSubtasks(props.selectedCard.id);
    const selectedColumnId = ref(props.selectedCard.column_id);
    const cardMenuIcon = ref(false);
    const EditTask = ref(false);
    const showConfirmDialog = (id, type) => {
      let message, successMessage;
      let deleteFunction = null;
      if (type === "subtask") {
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
          deleteFunction(id);
          Swal.fire("Deleted!", successMessage, "success");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your item is safe :)", "error");
        }
      });
    };
    const cardCompletedSubtasksCount = () => {
      const completedSubtasks = props.selectedCard.subtasks.filter(
        (subtask) => subtask.isCompleted
      );
      return completedSubtasks.length;
    };
    watch(selectedColumnId, (newVal, oldVal) => {
      if (newVal === undefined) return;

      taskStore.updateCard(props.selectedCard, {
        column_id: newVal,
      });
      taskStore.fetchColumns(taskStore.selectedBoard.id);
    });

    return {
      updateSubtask,
      cardCompletedSubtasksCount,
      subtasks,
      selectedColumnId,
      taskStore,
      showConfirmDialog,
      cardMenuIcon,
      EditTask,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>