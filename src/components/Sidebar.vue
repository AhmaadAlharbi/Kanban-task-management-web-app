<template>
  <div
    class="bg-myWhite hidden md:block min-h-screen drop-shadow-sm dark:bg-myGray-darker py-6 px-2"
  >
    <div class="flex space-y-96 flex-col w-full">
      <div class="mb-6">
        <img
          v-if="taskStore.theme == 'light'"
          src="@/assets/images/logo-dark.svg"
          alt=""
        />
        <img v-else src="@/assets/images/logo-light.svg" alt="" />

        <div class="mt-6">
          <p
            class="text-myGray-medium font-bold mb-2 px-3 uppercase tracking-wider"
          >
            all boards ({{ taskStore.boards.length }})
          </p>
          <nav>
            <div
              v-for="(board, index) in taskStore.boards"
              :key="board.id"
              class="flex cursor-pointer space-x-3 py-2 px-4 rounded-full hover:bg-myLavender transition-colors duration-300"
              :class="{
                'bg-myPurple': board.id === taskStore.selectedBoard.id,
              }"
            >
              <div class="flex items-center space-x-4">
                <div>
                  <img src="@/assets/images/icon-board.svg" alt="" />
                </div>
                <h4
                  @click="taskStore.selectedBoard = taskStore.boards[index]"
                  class="text-base font-bold flex-grow"
                  :class="{
                    'text-myGray-medium':
                      board.id !== taskStore.selectedBoard.id,
                    'text-white': board.id === taskStore.selectedBoard.id,
                  }"
                >
                  {{ board.name }}
                </h4>
              </div>
            </div>
            <h4
              @click="addBoard = true"
              class="text-base font-bold text-myGray-medium hover:text-myPurple cursor-pointer px-4 mt-4"
            >
              + Add new Board
            </h4>
          </nav>
        </div>
      </div>
      <div class="flex flex-col justify-between">
        <div
          class="flex justify-center max-w-sm mx-auto bg-gray-200 dark:bg-myGray-darkest py-2 px-10 space-x-3 items-center"
        >
          <img
            src="../assets/images/icon-light-theme.svg"
            alt=""
            class="w-5 h-5"
          />
          <div>
            <label class="switch">
              <input id="default-toggle" @click="toggleDark" type="checkbox" />
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
          @click="$emit('close-sidebar')"
          class="text-gray-500 text-sm cursor-pointer flex justify-center items-center space-x-2 mt-5 text-center"
        >
          <img
            src="../assets/images/icon-hide-sidebar.svg"
            class="w-4 h-4"
            alt=""
          />
          <span class="hidden md:inline-block text-xl font-bold"
            >Hide sidebar</span
          >
        </p>
      </div>
    </div>
  </div>
  <div v-if="addBoard">
    <AddBoard @close="addBoard = false" />
  </div>
</template>


<script>
import { useTaskStore } from "../stores/TaskStore";
import AddBoard from "../components/AddBoard.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  components: { AddBoard },
  setup() {
    const taskStore = useTaskStore();
    const router = useRouter();
    const activeBoardIndex = ref(0);
    const addBoard = ref(false);
    const changeBoard = (index) => {
      taskStore.selectedBoard = taskStore.boards[index];
      router.push({
        name: "BoardDetails",
        params: { id: taskStore.selectedBoard.id },
      });
    };

    const handleNewBoard = () => {
      const name = ref("");
      taskStore.addBoard();
    };
    const toggleDark = () => {
      document
        .getElementById("default-toggle")
        .addEventListener("change", function () {
          if (this.checked) {
            document.documentElement.classList.add("dark");
            taskStore.theme = "dark"; // theme is dark
          } else {
            document.documentElement.classList.remove("dark");
            taskStore.theme = "light"; // theme is light
          }
        });
    };
    return {
      toggleDark,
      addBoard,
      changeBoard,
      taskStore,
      activeBoardIndex,
    };
  },
};
</script>

<style >
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
  background-color: #a8a4ff;
}

input:focus + .slider {
  box-shadow: 0 0 1px #635fc7;
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