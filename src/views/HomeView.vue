<template>
  <div
    class="absolute w-full h-full bg-white flex flex-col justify-center items-center"
    v-if="isLoading"
  >
    <div class="lds-dual-ring"></div>
    <p class="text-pink-500 text-3xl font-bold italic my-2">
      Data is on its way ...
    </p>
  </div>
  <div v-else class="flex flex-col w-full">
    <nav
      v-if="cardMenuIcon"
      class="absolute right-0 top-20 z-20 bg-white shadow-lg px-10 py-5"
    >
      <ul class="space-y-2">
        <li
          @click="
            editBoard = true;
            cardMenuIcon = false;
          "
          class="cursor-pointer text-gray-400 hover:text-gray-800"
        >
          Edit Task
        </li>
        <li
          @click="
            taskStore.deleteBoardAndRelatedItems(taskStore.selectedBoard.id)
          "
          class="cursor-pointer text-red-400 hover:text-red-800"
        >
          Delete board
        </li>
      </ul>
    </nav>
    <div v-if="addTask">
      <AddTask @close="addTask = false" />
    </div>

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
    <div v-if="editBoard">
      <EditBoard :selectedBoard="selectedBoard" @close="editBoard = false" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from "vue";
import { useTaskStore } from "../stores/TaskStore";
import AddTask from "../components/AddTask.vue";
import EditBoard from "../components/EditBoard.vue";
import TaskDetails from "../components/TaskDetails.vue";

export default defineComponent({
  components: { AddTask, TaskDetails, EditBoard },
  setup() {
    const selectedCard = ref("");
    const isLoading = ref(true);
    const addTask = ref(false);
    const cardMenuIcon = ref(false);
    const editBoard = ref(false);
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
});
</script>
<style>
.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fcf;
  border-color: #fcf transparent #fcf transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
