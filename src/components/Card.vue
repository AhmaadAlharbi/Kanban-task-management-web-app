<template>
  <draggable v-model="taskStore.cards" tag="ul" @update="handleUpdate">
    <template #item="{ element: card }">
      <li
        @dragstart="handleDragStart"
        draggable
        v-if="card.column_id === col.id"
        class="bg-red-400 text-white py-4 px-6 my-4 cursor-move"
      >
        {{ card.title }}
      </li>
    </template>
  </draggable>

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
import draggable from "vuedraggable";

export default defineComponent({
  props: {
    col: {
      required: true,
    },
  },
  components: { TaskDetails, draggable },
  setup(props) {
    const taskStore = useTaskStore();
    const showCardDetails = ref(false);
    const selectedCard = ref("");
    taskStore.fetchCards(taskStore.selectedBoard.id);
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
    const handleUpdate = (event) => {
      const newBoardCards = [...boardCards.value];
      newBoardCards.splice(
        event.newIndex,
        0,
        newBoardCards.splice(event.oldIndex, 1)[0]
      );
      boardCards.value = newBoardCards;
    };
    const handleDragStart = (event) => {
      // Add the card data to the data transfer object
      event.dataTransfer.setData("card", this.card);
    };
    return {
      handleDragStart,
      handleUpdate,
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
