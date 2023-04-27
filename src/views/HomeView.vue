<template>
  <div class="flex flex-col w-full">
    <nav class="bg-white h-20">
      <ul class="flex justify-between items-center mt-4 px-10">
        <li class="text-2xl font-bold">Platform Launch</li>
        <li
          @click="addTask = true"
          class="bg-purple-500 py-2 px-2 text-white cursor-pointer"
        >
          + Add a New Task
        </li>
      </ul>
    </nav>
    <div v-if="addTask">
      <AddTask @close="addTask = false" />
    </div>
    <div v-if="taskStore.columns.length > 0">
      <div class="flex justify-around mt-3">
        <div
          class="flex flex-col"
          v-for="col in taskStore.columns"
          :key="col.id"
        >
          <h1 class="bg-gray-300 px-2">{{ col.name }} - {{ col.id }}</h1>
          <div v-if="taskStore.cards">
            <!-- Loop through the cards -->
            <div
              v-for="card in taskStore.cards"
              :key="card.id"
              @click="showTaskDetails(card)"
            >
              <!-- Only display the card if it belongs to the current column -->
              <div v-if="card.column_id === col.id">
                <div
                  @click="selectedCard = card"
                  class="flex flex-col shadow-md mt-3 py-3 px-6 bg-white w-80 mb-8"
                >
                  <!-- Display the card title -->
                  <p class="font-bold" v-if="card">{{ card.title }}</p>
                  <p v-if="card">
                    {{ cardCompletedSubtasksCount(card) }} of
                    {{ card.subtasks.length }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showCardDetails">
      <TaskDetails
        :selectedCard="selectedCard"
        @close="showCardDetails = false"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from "vue";
import { useTaskStore } from "../stores/TaskStore";
import AddTask from "../components/AddTask.vue";
import TaskDetails from "../components/TaskDetails.vue";
export default defineComponent({
  components: { AddTask, TaskDetails },
  setup() {
    const selectedCard = ref("");
    const addTask = ref(false);
    const showCardDetails = ref(false);
    const taskStore = useTaskStore();
    //fetch board to set selectedBoard
    taskStore.fetchBoards().then(() => {
      taskStore.fetchColumns(taskStore.selectedBoard.id).then(() => {
        taskStore.fetchCards(taskStore.selectedBoard.id).then(() => {
          //fetch subtask for each card
          for (const card of taskStore.cards) {
            taskStore.fetchSubtasks(card.id);
          }
        });
      });
    });
    // Watch for changes in selectedBoard and update the displayed cards
    watch(
      () => taskStore.selectedBoard,
      () => {
        taskStore.fetchColumns(taskStore.selectedBoard.id).then(() => {
          taskStore.fetchCards(taskStore.selectedBoard.id).then(() => {
            // Fetch subtask for each card
            for (const card of taskStore.cards) {
              taskStore.fetchSubtasks(card.id);
            }
          });
        });
      }
    );
    // Define computed property to calculate completed subtasks count
    const cardCompletedSubtasksCount = (card) => {
      const completedSubtasks = taskStore.subtasks.filter(
        (subtask) => subtask.card_id === card.id && subtask.isCompleted
      );
      return completedSubtasks.length;
    };
    const showTaskDetails = (card) => {
      selectedCard.value = card;
      showCardDetails.value = true;
    };

    return {
      showTaskDetails,
      selectedCard,
      showCardDetails,
      taskStore,
      addTask,
      cardCompletedSubtasksCount,
    };
  },
});
</script>
