<template>
  <div class="flex flex-col w-full">
    <nav class="bg-white h-20">
      <ul class="flex justify-between items-center mt-4 px-10">
        <li class="text-2xl font-bold">Platform Launch</li>
        <li
          class="bg-purple-500 py-2 px-2 text-white cursor-pointer"
          @click="addTaskComponent = true"
        >
          + Add a New Task
        </li>
      </ul>
    </nav>
    <div v-if="taskStore.loading">Loading...</div>
    <section
      v-if="taskStore.boards && taskStore.boards.length > 0"
      class="container px-10 mt-5 flex justify-between"
    >
      <!-- TODO -->
      <div v-if="selectedBoard">
        <div class="flex space-x-2">
          <div class="h-6 w-6 rounded-full bg-sky-500"></div>
          <h1 class="text-black">
            TODO ({{ taskStore.boards[0].columns[0].tasks.length }})
          </h1>
        </div>
        <div
          v-for="(task, index) in selectedBoard.columns[0].tasks"
          :key="index"
          class="shadow-md mt-3 py-3 px-6 bg-white w-80 mb-8"
          @click="selectedTask === task ? closeDetails() : openDetails(task)"
        >
          <h3 class="font-bold text-xl">{{ task.title }}</h3>
          <p class="text-gray-500">
            {{ completedSubtasksCount(task) }} of
            {{ task.subtasks.length }} subtasks
          </p>
        </div>
      </div>
      <!-- DOING -->
      <div v-if="selectedBoard">
        <div class="flex space-x-2">
          <div class="h-6 w-6 rounded-full bg-purple-500"></div>
          <h1 class="text-black">
            DOING ({{ taskStore.boards[0].columns[1].tasks.length }})
          </h1>
        </div>
        <div
          v-for="(task, index) in selectedBoard.columns[1].tasks"
          :key="index"
          class="shadow-md mt-3 py-3 px-6 bg-white w-80 mb-8"
          @click="selectedTask === task ? closeDetails() : openDetails(task)"
        >
          <h3 class="font-bold text-xl">{{ task.title }}</h3>
          <p class="text-gray-500">
            {{ completedSubtasksCount(task).value }} of
            {{ task.subtasks.length }} subtasks
          </p>
        </div>
      </div>
      <!-- DONE -->
      <div v-if="selectedBoard">
        <div class="flex space-x-2">
          <div class="h-6 w-6 rounded-full bg-green-500"></div>
          <h1 class="text-black">
            DONE ({{ taskStore.boards[0].columns[2].tasks.length }})
          </h1>
        </div>
        <div
          v-for="(task, index) in selectedBoard.columns[2].tasks"
          :key="index"
          class="shadow-md mt-3 py-3 px-6 bg-white w-80 mb-8"
          @click="selectedTask === task ? closeDetails() : openDetails(task)"
        >
          <h3 class="font-bold text-xl">{{ task.title }}</h3>
          <p class="text-gray-500">
            {{ completedSubtasksCount(task).value }} of
            {{ task.subtasks.length }} subtasks
          </p>
        </div>
      </div>
      <!-- new column -->
      <div
        @click="editBoardComponent = !editBoardComponent"
        class="hidden self-center bg-gray-300 py-96 px-20"
      >
        <button>+ New Column</button>
      </div>
      <TaskDetails
        :columns="findBoard(selectedTask)?.columns || []"
        :task="selectedTask"
        :taskStore="taskStore"
        :completedSubtasksCount="completedSubtasksCount"
        @close="closeDetails"
      />
      <div v-if="addTaskComponent">
        <AddTask
          :columns="findBoard(selectedTask)?.columns || []"
          @close="addTaskComponent = false"
        />
      </div>

      <div v-if="editBoardComponent">
        <EditBoard @close="editBoardComponent = false" />
      </div>
    </section>
  </div>
</template>

<script>
import { useTaskStore } from "../stores/TaskStore";
import { onMounted, computed, ref } from "vue";
import TaskDetails from "../components/TaskDetails.vue";
import EditBoard from "../components/EditBoard.vue";
import AddTask from "../components/AddTask.vue";
export default {
  components: { TaskDetails, AddTask, EditBoard },
  setup() {
    const taskStore = useTaskStore();
    onMounted(() => {
      taskStore.getBoards();
    });
    const completedSubtasksCount = (task) => {
      return computed(() => {
        return task.subtasks.filter((subtask) => subtask.isCompleted).length;
      });
    };
    const selectedBoard = computed(() => {
      return taskStore.boards[taskStore.selectedBoardIndex];
    });
    const selectedTask = ref(null);
    const openDetails = (task) => {
      selectedTask.value = task;
    };
    const closeDetails = () => {
      selectedTask.value = null;
    };
    const findBoard = (task) => {
      return taskStore.boards.find((board) =>
        board.columns.some((column) => column.tasks.some((t) => t === task))
      );
    };

    const addTaskComponent = ref(false);
    const editBoardComponent = ref(false);

    return {
      editBoardComponent,
      addTaskComponent,
      findBoard,
      closeDetails,
      openDetails,
      taskStore,
      selectedTask,
      completedSubtasksCount,
      selectedBoard,
    };
  },
};
</script>

<style>
</style>
