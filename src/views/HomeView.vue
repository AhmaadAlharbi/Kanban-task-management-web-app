<template>
  <div class="flex flex-col w-full">
    <!-- <div v-if="taskStore.isLoading" class="flex justify-center items-center">
      <Spinner />
    </div> -->

    <div class="flex flex-col lg:flex-row w-full">
      <div class="w-full px-4">
        <div class="flex flex-col lg:flex-row">
          <Board :columns="taskStore.columns" />
        </div>
      </div>
      <div v-if="addTask" class="hidden lg:block lg:w-1/4 px-4">
        <AddTask class="mb-8" />
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, computed, watch } from "vue";
import { useTaskStore } from "../stores/TaskStore";
import AddTask from "../components/AddTask.vue";
import EditBoard from "../components/EditBoard.vue";
import TaskDetails from "../components/TaskDetails.vue";
import Spinner from "../components/Spinner.vue";
import Column from "../components/Column.vue";
import Board from "../components/Board.vue";
export default defineComponent({
  components: {
    AddTask,
    TaskDetails,
    EditBoard,
    Spinner,
    Column,
    Board,
  },
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
    return {
      isLoading,
      cardMenuIcon,
      editBoard,
      selectedCard,
      showCardDetails,
      taskStore,
      addTask,
    };
  },
});
</script>

<style>
/* spinner style */
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
