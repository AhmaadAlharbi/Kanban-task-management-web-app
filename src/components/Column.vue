<template>
  <div class="px-2 mx-auto">
    <div class="flex items-center space-x-2">
      <div
        class="w-4 h-4 rounded-full"
        :style="{ backgroundColor: randomColor() }"
      ></div>

      <h1
        class="text-md font-bold text-myGray-medium"
        v-if="col.board_id === taskStore.selectedBoard.id"
      >
        {{ col.name }}({{ taskStore.getColumnCardsCount(col.id) }})
      </h1>
    </div>

    <div v-if="taskStore.cards">
      <!-- Loop through the cards -->
      <!-- Only display the card if it belongs to the current column -->
      <div>
        <Card :col="col" />
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
    index: {
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

    const randomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
    return {
      randomColor,
      taskStore,
      columnCards,
    };
  },
});
</script>
