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
            <li class="cursor-pointer text-gray-400 hover:text-gray-800">
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
      <p class="mb-4" v-if="subtasks">
        {{
          subtasks.filter(
            (subtask) =>
              subtask.card_id === selectedCard.id && subtask.isCompleted
          ).length
        }}
        of
        {{
          subtasks.filter((subtask) => subtask.card_id === selectedCard.id)
            .length
        }}
        subtasks
      </p>

      <div v-for="sub in subtasks" :key="sub.id">
        <div
          v-if="sub.card_id === selectedCard.id"
          class="bg-gray-200 p-2 my-2 rounded-lg flex items-center"
        >
          <input v-model="sub.isCompleted" type="checkbox" class="mr-2" />
          <div class="flex-1 flex justify-between items-center">
            <h1>{{ sub.title }}</h1>
            <p>
              <i
                class="fa fa-trash-o cursor-pointer"
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
        >
          <option
            v-for="(col, index) in taskStore.columns"
            :key="col.id"
            :selected="col.id === selectedCard.column_id"
          >
            {{
              index === 0
                ? taskStore.columns.find((c) => c.id === selectedCard.column_id)
                    .name
                : col.name
            }}
          </option>
        </select>
      </div>
      <!-- current status -->

      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click.stop="$emit('close')"
      >
        Close Modal
      </button>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useTaskStore } from "@/stores/TaskStore";
import Swal from "sweetalert2";

export default {
  props: ["selectedCard", "subtasks"],
  setup() {
    const taskStore = useTaskStore();
    taskStore.fetchColumns();
    const cardMenuIcon = ref(false);

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

    return { taskStore, showConfirmDialog, cardMenuIcon };
  },
};
</script>

<style lang="scss" scoped>
</style>