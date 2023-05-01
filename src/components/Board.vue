<template>
  <div class="flex flex-col w-full justify-center items-stretch">
    <div v-if="taskStore.isLoading" class="flex justify-center items-cente">
      <Spinner />
    </div>
    <div
      class="overflow-x-auto"
      v-if="taskStore.columns && !taskStore.isLoading"
    >
      <div class="mt-10 mx-auto">
        <div class="flex overflow-x-auto whitespace-no-wrap min-w-full">
          <div
            class="flex-1"
            v-for="(col, index) in taskStore.columns"
            :key="col.id"
            :index="index"
          >
            <Column :col="col" />
          </div>
          <div
            class="p-10 min-h-[650px] flex justify-center items-center bg-myGray-light dark:bg-myGray-darker"
          >
            <button
              type="button"
              @click="handleClick"
              class="text-2xl font-bold text-myGray-medium hover:text-myPurple transition-colors duration-150"
            >
              + New Column
            </button>
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
import EditBoard from "../components/EditBoard.vue";

export default {
  props: ["cardCompletedSubtasksCount", "selectedBoard"],
  components: { TaskDetails, Column, EditBoard },
  setup(props) {
    const taskStore = useTaskStore();
    const selectedCard = ref("");
    const showCardDetails = ref(false);
    const editBoard = ref(false);
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
    const handleClick = () => {
      editBoard.value = true;
      // alert("test");
    };

    return {
      handleClick,
      showTaskDetails,
      selectedCard,
      taskStore,
      selectedCard,
      cardCompletedSubtasksCount,
      columnCardsCount: props.columnCardsCount,
      editBoard,
    };
  },
};
</script>

<style>
/* Add any required styles here */
</style>
