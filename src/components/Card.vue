<template>
  <div v-for="card in boardCards" :key="card.id" @click="showTaskDetails(card)">
    <div v-if="card.column_id === col.id">
      <div
        class="flex flex-col shadow-md mt-3 py-3 px-6 bg-white w-full md:w-80 mb-8"
      >
        <!-- Display the card title -->
        <p class="font-bold" v-if="card">{{ card.title }}</p>
        <p v-if="card">
          {{ completedSubtasksCount(card) }} of
          {{ card.subtasks.length }}
        </p>
      </div>
    </div>
  </div>

  <div v-if="showCardDetails">
    <TaskDetails
      :selectedCard="selectedCard"
      @close="showCardDetails = false"
    />
  </div>
</template>


<script>
import { computed, defineComponent } from "vue";
import { useTaskStore } from "@/stores/TaskStore";
import TaskDetails from "./TaskDetails.vue";
import { ref } from "vue";
export default defineComponent({
  props: {
    col: {
      required: true,
    },
  },
  components: { TaskDetails },
  setup(props) {
    const taskStore = useTaskStore();
    const showCardDetails = ref(false);
    const selectedCard = ref("");
    taskStore.fetchCards(props.col.board_id);
    const boardCards = computed(() => {
      return taskStore.cards.filter((card) => card.column_id === props.col.id);
    });
    // Select the card when the user clicks on it
    const showTaskDetails = (card) => {
      selectedCard.value = card;
      showCardDetails.value = true;
    };
    // Define computed property to calculate completed subtasks count

    const completedSubtasksCount = (card) => {
      const completedSubtasks = card.subtasks.filter(
        (subtask) => subtask.isCompleted
      );
      return completedSubtasks.length;
    };
    return {
      completedSubtasksCount,
      taskStore,
      selectedCard,
      showCardDetails,
      boardCards,
      showTaskDetails,
    };
  },
});
</script>