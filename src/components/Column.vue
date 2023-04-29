<template>
  <div>
    <h1 class="px-2 mx-auto" v-if="col.board_id === taskStore.selectedBoard.id">
      {{ col.name }}({{ taskStore.getColumnCardsCount(col.id) }})
    </h1>

    <div v-if="taskStore.cards">
      <!-- Loop through the cards -->
      <div v-for="card in taskStore.cards" :key="card.id">
        <!-- Only display the card if it belongs to the current column -->
        <div v-if="taskStore.cards && card.column_id === col.id">
          <Card :col="col" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useTaskStore } from "@/stores/TaskStore";
import Card from "@/components/Card.vue";
import { ref } from "vue";
export default defineComponent({
  props: {
    col: {
      type: Object,
      required: true,
    },
    cardCompletedSubtasksCount: {
      required: true,
    },
  },
  components: {
    Card,
  },
  setup(props) {
    const taskStore = useTaskStore();
    const showCardDetails = ref(false);

    // Compute the cards that belong to the current column
    const columnCards = computed(() =>
      taskStore.cards.filter((card) => card.column_id === props.col.id)
    );

    // Show task details when the user clicks on a card

    return {
      taskStore,
      columnCards,
    };
  },
});
</script>
