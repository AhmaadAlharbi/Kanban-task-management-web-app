<template>
  <div v-if="taskStore.isLoading" class="flex justify-center items-cente">
    <Spinner />
  </div>
  <div v-else>
    <div v-if="taskStore.columns">
      <div class="flex justify-around mt-3">
        <div
          class="flex flex-col"
          v-for="col in columnCardsCount"
          :key="col.id"
        >
          <h1 class="px-2">
            {{ col.name }}({{ taskStore.getColumnCardsCount(col.id) }})
          </h1>

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
  <div v-if="editBoard">
    <EditBoard :selectedBoard="selectedBoard" @close="editBoard = false" />
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useTaskStore } from "../stores/TaskStore";
import AddTask from "../components/AddTask.vue";
import EditBoard from "../components/EditBoard.vue";
import TaskDetails from "../components/TaskDetails.vue";
import Spinner from "../components/Spinner.vue";

export default {
  props: ["id"],
  components: { AddTask, TaskDetails, EditBoard, Spinner },

  setup(props) {
    const taskStore = useTaskStore();
    const selectedCard = ref("");
    const isLoading = ref(true);
    const addTask = ref(false);
    const cardMenuIcon = ref(false);
    const editBoard = ref(false);
    const showCardDetails = ref(false);
    taskStore.fetchColumns(props.id).then(() => {
      taskStore.fetchCards(props.id).then(() => {
        // Fetch subtask for each card
        for (const card of taskStore.cards) {
          taskStore.fetchSubtasks(card.id);
        }
      });
    });
    const columnCardsCount = computed(() => {
      return taskStore.columns.map((col) => {
        return {
          ...col,
          cardsCount: taskStore.cards.filter(
            (card) => card.column_id === col.id
          ).length,
        };
      });
    });
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
    watch(
      () => props.id,
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
    return {
      columnCardsCount,
      isLoading,
      cardMenuIcon,
      editBoard,
      showTaskDetails,
      selectedCard,
      showCardDetails,
      taskStore,
      addTask,
      cardCompletedSubtasksCount,
    };
  },
};
</script>

<style>
</style>