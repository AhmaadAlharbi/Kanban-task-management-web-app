<!-- TaskDetails.vue -->
<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    @click.self="$emit('close')"
  >
    <div class="bg-white w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-lg">
      <h2 class="text-2xl font-bold mb-4">Modal Title</h2>
      <p class="mb-4" v-if="selectedCard">
        {{ selectedCard.title }}
      </p>
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
                @click="taskStore.deleteSubtask(sub.id)"
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
import { computed } from "vue";
import { useTaskStore } from "@/stores/TaskStore";

export default {
  props: ["selectedCard", "subtasks"],
  setup() {
    const taskStore = useTaskStore();
    taskStore.fetchColumns();

    return { taskStore };
  },
};
</script>

<style lang="scss" scoped>
</style>