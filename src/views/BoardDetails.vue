<template>
  <div class="w-full h-full flex flex-col items-center">
    <div
      v-if="taskStore.isLoading"
      class="flex justify-center items-center h-screen"
    >
      <Spinner />
    </div>
    <div v-else class="w-full h-full">
      <Board
        class="w-full h-full"
        :columnCardsCount="columnCardsCount"
        :cardCompletedSubtasksCount="cardCompletedSubtasksCount"
        @card-selected="showTaskDetails"
      />
      <div
        v-if="showCardDetails"
        class="fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center"
      >
        <TaskDetails
          :selectedCard="selectedCard"
          @close="showCardDetails = false"
        />
      </div>
    </div>
    <div
      v-if="editBoard"
      class="fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center"
    >
      <EditBoard :selectedBoard="selectedBoard" @close="editBoard = false" />
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useTaskStore } from "../stores/TaskStore";
import EditBoard from "../components/EditBoard.vue";
import TaskDetails from "../components/TaskDetails.vue";
import Spinner from "../components/Spinner.vue";
import Board from "../components/Board.vue";

export default {
  props: ["id"],
  components: { TaskDetails, EditBoard, Spinner, Board },

  setup(props) {
    const taskStore = useTaskStore();
    const selectedCard = ref("");
    const isLoading = ref(true);
    const editBoard = ref(false);
    const showCardDetails = ref(false);

    taskStore.fetchColumns(props.id).then(() => {
      taskStore.fetchCards(props.id).then(() => {
        // Fetch subtask for each card
        for (const card of taskStore.cards) {
          taskStore.fetchSubtasks(card.id);
        }
      });
      isLoading.value = false; // Set isLoading to false once data is loaded
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
      editBoard,
      showTaskDetails,
      selectedCard,
      showCardDetails,
      taskStore,
      cardCompletedSubtasksCount,
    };
  },
};
</script>

<style>
</style>
