<template>
  <div class="bg-white shadow-xl py-6 w-80 h-screen px-2 md:w-96">
    <div class="flex flex-col justify-between h-full">
      <div class="mb-6">
        <router-link :to="{ name: 'Home' }">
          <img src="@/assets/images/logo-dark.svg" alt="" />
        </router-link>
        <div class="mt-6">
          <p
            class="text-myGray-medium font-bold mb-2 px-3 uppercase tracking-wider"
          >
            all boards ({{ taskStore.boards.length }})
          </p>
          <nav>
            <div class="space-y-4 px-3 cursor-pointer">
              <div
                v-for="(board, index) in taskStore.boards"
                :key="board.id"
                class="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-myLavender transition-colors duration-300"
                :class="{
                  'bg-myPurple': board.id === taskStore.selectedBoard.id,
                }"
              >
                <router-link
                  @click="changeBoard(index)"
                  :to="{ name: 'BoardDetails', params: { id: board.id } }"
                  class="flex items-center space-x-2"
                >
                  <img src="@/assets/images/icon-board.svg" alt="" />
                  <h4
                    class="text-base font-bold"
                    :class="{
                      'text-myGray-medium':
                        board.id !== taskStore.selectedBoard.id,
                      'text-white': board.id === taskStore.selectedBoard.id,
                    }"
                  >
                    {{ board.name }}
                  </h4>
                </router-link>
              </div>

              <li
                @click="addBoard = true"
                class="cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <img
                  src="../assets/images/icon-board.svg"
                  alt=""
                  class="w-5 h-5"
                />
                <span class="text-md font-bold text-myPurple"
                  >+Create a New Board</span
                >
              </li>
            </div>
          </nav>
        </div>
      </div>
      <div class="flex flex-col justify-between mb-6">
        <div
          class="flex justify-center max-w-sm mx-auto bg-gray-200 py-2 px-10 mb-5 space-x-3 items-center"
        >
          <img
            src="../assets/images/icon-light-theme.svg"
            alt=""
            class="w-5 h-5"
          />
          <div>
            <label class="switch">
              <input type="checkbox" />
              <span class="slider round"></span>
            </label>
          </div>
          <img
            src="../assets/images/icon-dark-theme.svg"
            alt=""
            class="w-5 h-5"
          />
        </div>
        <p
          class="text-gray-500 text-sm cursor-pointer flex items-center space-x-2"
        >
          <img
            src="../assets/images/icon-hide-sidebar.svg"
            class="w-4 h-4"
            alt=""
          />
          <span class="hidden md:inline-block">Hide sidebar</span>
        </p>
      </div>
    </div>
    <div v-if="addBoard">
      <AddBoard @close="addBoard = false" />
    </div>
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