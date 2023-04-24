<!-- TaskDetails.vue -->
<template>
  <div
    v-if="task"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    @click.self="$emit('close')"
  >
    <div class="bg-white w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-lg">
      <h2 class="text-2xl font-bold mb-4">{{ task.title }}</h2>
      <p class="mb-4">
        {{ task.description }}
      </p>
      <p>{{ completedCount }} of {{ task.subtasks.length }}</p>
      <div
        class="bg-gray-200 py-4 mb-3 mt-3"
        v-for="(sub, index) in task.subtasks"
        :key="sub"
      >
        <input class="mx-2" type="checkbox" />
        <label>{{ sub.title }}</label>
        <button
          @click="
            taskStore.deleteSubtask(
              task.boardId,
              task.status,
              task.id,
              subtask.id
            )
          "
          class="bg-red-400 px-4 py-2 rounded-full"
        >
          DELETE
        </button>
      </div>

      <!-- current status -->
      <div>
        <select class="mb-3" v-model="task.status">
          <option v-for="column in columns" :key="column.name">
            {{ column.name }}
          </option>
        </select>
      </div>
      <button
        @click="taskStore.deleteTask(taskStore.boardName, task.status, task.id)"
        class="bg-red-400 px-4 py-2 rounded-full"
      >
        DELETE
      </button>

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
  props: ["task", "completedSubtasksCount", "taskStore", "columns"],
  setup(props) {
    const taskStore = useTaskStore();

    const completedCount = computed(() => {
      return props.completedSubtasksCount(props.task).value;
    });

    return { completedCount };
  },
};
</script>

<style lang="scss" scoped>
</style>