<template>
  <div class="flex flex-col w-full">
    <div v-if="taskStore.isLoading" class="flex justify-center items-cente">
      <Spinner />
    </div>
    <div v-if="taskStore.columns && !taskStore.isLoading">
      <div class="mt-3">
        <div class="flex">
          <div class="flex-1" v-for="col in taskStore.columns" :key="col.id">
            <Column :col="col" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="editBoard">
      <EditBoard :selectedBoard="selectedBoard" @close="editBoard = false" />
    </div>
  </div>
</template>


<script>
import { computed, ref } from "vue";
import { useTaskStore } from "../stores/TaskStore";
import TaskDetails from "../components/TaskDetails.vue";
import Column from "../components/Column.vue";

export default {
  props: ["columnCardsCount", "cardCompletedSubtasksCount"],
  components: { TaskDetails, Column },
  setup(props) {
    const taskStore = useTaskStore();
    const selectedCard = ref("");
    const showCardDetails = ref(false);

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
      taskStore,
      selectedCard,
      cardCompletedSubtasksCount,
      columnCardsCount: props.columnCardsCount,
    };
  },
};
</script>

<style>
/* Add any required styles here */
</style>
