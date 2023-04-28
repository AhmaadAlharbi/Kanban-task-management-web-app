<template>
  <div class="bg-white shadow-xl py-6 w-80 h-screen px-2">
    <div class="">
      <img src="@/assets/images/logo-dark.svg" alt="" />
      <div class="">
        <p class="uppercase text-gray-500 my-5 px-3">
          all boards ({{ taskStore.boards.length }})
        </p>
        <nav>
          <div class="space-y-4 px-3 cursor-pointer">
            <div
              v-for="(board, index) in taskStore.boards"
              :key="board.id"
              class="flex items-center space-x-3 py-2 px-4"
              :class="{
                'bg-purple-500 text-white  rounded-lg ':
                  board.id === taskStore.selectedBoard.id,
              }"
            >
              <router-link
                @click="changeBoard(index)"
                :to="{ name: 'BoardDetails', params: { id: board.id } }"
              >
                <div class="flex item-center space-x-2">
                  <img src="@/assets/images/icon-board.svg" alt="" />
                  <h4>{{ board.name }}</h4>
                </div>
              </router-link>
            </div>

            <li @click="addBoard = true" class="">+ Create a New Board</li>
          </div>
        </nav>
      </div>
    </div>
    <div v-if="addBoard">
      <AddBoard @close="addboard = false" />
    </div>
    <div
      class="flex items-center space-x-3 absolute bottom-10 justify-center left-5 bg-gray-200 px-10"
    >
      <div>
        <img src="../assets/images/icon-light-theme.svg" alt="" />
      </div>
      <!-- switch -->
      <div>
        <label class="switch">
          <input type="checkbox" />
          <span class="slider round"></span>
        </label>
      </div>
      <div>
        <div class="">
          <img src="../assets/images/icon-dark-theme.svg" alt="" />
        </div>
      </div>
    </div>
    <p
      class="flex items-center absolute bottom-0 justify-center left-5 cursor-pointer"
    >
      <img src="../assets/images/icon-hide-sidebar.svg" class="mr-3" alt="" />
      Hide sidebar
    </p>
  </div>
</template>

<script>
import { useTaskStore } from "../stores/TaskStore";
import AddBoard from "../components/AddBoard.vue";
import { ref } from "vue";
export default {
  components: { AddBoard },
  setup() {
    const taskStore = useTaskStore();
    // taskStore.fetchBoards();
    const activeBoardIndex = ref(0);
    const addBoard = ref(false);
    // const changeActiveBoard = (index) => {
    //   taskStore.selectedBoard = taskStore.boards[index];
    // };
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
    const changeBoard = (index) => {
      taskStore.selectedBoard = taskStore.boards[index];
    };
    const handleNewBoard = () => {
      const name = ref("");
      taskStore.addBoard();
    };
    return {
      addBoard,
      changeBoard,
      taskStore,
      activeBoardIndex,
    };
  },
};
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>