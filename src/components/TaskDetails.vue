<!-- TaskDetails.vue -->
<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white dark:bg-myGray-darkest relative w-11/12 md:w-1/2 lg:w-[25%] max-w-2xl p-6 rounded-lg"
    >
      <div class="flex justify-between items-center">
        <h1 class="mb-4 font-bold text-xl dark:text-white" v-if="selectedCard">
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
          class="absolute right-0 top-20 z-20 bg-white dark:bg-myGray-darkest shadow-lg px-10 py-5"
        >
          <ul class="space-y-2">
            <li
              @click="EditTask = true"
              class="cursor-pointer text-gray-400 hover:text-gray-800 dark:hover:text-white"
            >
              Edit Task
            </li>
            <!-- @click="showConfirmDialog(selectedCard.id, 'task')" -->
            <li
              @click="deleteCard = true"
              class="cursor-pointer text-red-400 hover:text-red-800"
            >
              Delete Task
            </li>
          </ul>
        </nav>
      </div>
      <p class="dark:text-white text-sm">
        subtasks ( {{ cardCompletedSubtasksCount(selectedCard) }} of
        {{ selectedCard.subtasks.length }} )
      </p>
      <div v-for="sub in selectedCard.subtasks" :key="sub.id">
        <div
          class="bg-myGray-lightest py-4 px-3 my-2 rounded-lg flex items-center hover:bg-gray-100"
        >
          <input
            @change="updateSubtask(sub)"
            v-model="sub.isCompleted"
            type="checkbox"
            class="mr-2 hidden my-checkbox"
            :id="'subtask-' + sub.id"
          />
          <label
            :for="'subtask-' + sub.id"
            class="mr-2 custom-checkbox"
            :class="{ checked: sub.isCompleted }"
          ></label>
          <div class="flex-1 flex justify-between items-center">
            <h1
              :class="{ 'line-through italic': sub.isCompleted }"
              class="text-myGray-medium"
            >
              {{ sub.title }}
            </h1>

            <p>
              <i
                class="fa fa-trash-o text-myLavender cursor-pointer hover:text-myRed-darkest transition-colors duration-100"
                style="font-size: 22px"
                @click="showConfirmDialog(sub.id, 'subtask')"
              ></i>
            </p>
          </div>
        </div>
      </div>
      <div class="mb-4">
        <label class="mr-2 dark:text-white">Current Status</label>
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

      <!-- <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click.stop="$emit('close')"
      >
        Close
      </button> -->
    </div>
  </div>
  <div v-if="EditTask">
    <EditTask
      :selectedCard="selectedCard"
      :subtasks="subtasks"
      @close="EditTask = false"
    />
  </div>
  <div v-if="deleteCard">
    <DeleteCard
      type="task"
      :selectedCard="selectedCard"
      :title="selectedCard.title"
      :message="`Are you sure you want to delete the \`${selectedCard.title}\` task and its subtasks? This action cannot be reversed.`"
      @close="deleteCard = false"
    />
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useTaskStore } from "@/stores/TaskStore";
import Swal from "sweetalert2";
import EditTask from "./EditTask.vue";
import DeleteCard from "../components/DeleteCard.vue";

export default {
  props: ["selectedCard"],
  components: { EditTask, DeleteCard },
  setup(props) {
    const taskStore = useTaskStore();
    const updateSubtask = async (subtask) => {
      taskStore.updateSubtasks(subtask.card_id, [subtask]);
    };
    taskStore.fetchSubtasks(props.selectedCard.id);
    const deleteCard = ref("");

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
      deleteCard,
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

<style  >
.custom-checkbox {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: white;
  border: 1px solid #8a3ffc;
  cursor: pointer;
  position: relative;
  border-radius: 3px;
}

.custom-checkbox.checked {
  background-color: #8a3ffc;
}

.custom-checkbox::before {
  content: "";
  display: block;
  position: absolute;
  width: 6px;
  height: 12px;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(45deg) translateY(-5px) translateX(3px);
  margin-top: 3px;
  opacity: 0;
}

.custom-checkbox.checked::before {
  opacity: 1;
}
</style>