<template>
  <div class="flex flex-col w-full">
    <nav class="bg-white h-20">
      <ul class="flex justify-between items-center mt-4 px-10">
        <li class="text-2xl font-bold">Platform Launch</li>
        <li
          class="bg-purple-500 py-2 px-2 text-white cursor-pointer"
          @click="addTask = true"
        >
          + Add a New Task
        </li>
      </ul>
    </nav>
    <div v-if="addTask">
      <AddTask @close="addTask = false" />
    </div>
    <!-- <div>
      <div v-if="documents.length > 0">
        <h1 class="bg-red-200">Documents</h1>
        {{ documents }}
      </div>
      <div v-if="columns">
        <h1 class="bg-red-400">Columns</h1>
        {{ columns }}
      </div>
      <div v-if="cards">
        <h1 class="bg-red-600">Cards</h1>
        {{ cards }}
      </div>
      <div v-if="subtasks">
        <h1 class="bg-red-900">Subtasjs</h1>
        {{ subtasks }}
      </div>

      <div v-else-if="error">{{ error }}</div>
      <div v-else>Loading...</div>
    </div> -->
    <!-- todo -->
    <div v-if="columns.length > 0">
      <!-- Loop through the columns -->
      <div class="flex justify-around mt-3">
        <div class="flex flex-col" v-for="col in columns" :key="col.id">
          <!-- Display the column name and id -->
          <h1 class="bg-gray-300 px-2">{{ col.name }} - {{ col.id }}</h1>
          <div v-if="cards">
            <!-- Loop through the cards -->
            <div
              v-for="card in cards"
              :key="card.id"
              @click="showTaskDetails(card)"
            >
              <!-- Only display the card if it belongs to the current column -->
              <div v-if="card.column_id === col.id">
                <div
                  class="flex flex-col shadow-md mt-3 py-3 px-6 bg-white w-80 mb-8"
                >
                  <!-- Display the card title -->
                  <p class="font-bold" v-if="card">{{ card.title }}</p>
                  <!-- Display subtask information if there are any subtasks for the card -->
                  <div v-if="subtasks.some((sub) => sub.card_id === card.id)">
                    <p class="text-gray-500">
                      {{
                        completedSubtasks.filter(
                          (sub) => sub.card_id === card.id
                        ).length
                      }}
                      of
                      {{
                        subtasks.filter((sub) => sub.card_id === card.id).length
                      }}
                      subtasks
                    </p>
                  </div>
                  <!-- Display "No subtasks" message if there are no subtasks for the card -->
                  <p class="text-gray-500" v-else>No subtasks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showCardDetails">
        <TaskDetails
          :selectedCard="selectedCard"
          :subtasks="subtasks"
          @close="showCardDetails = false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { computed, onMounted } from "vue";
import getCollection from "../composables/getCollection";
import { useTaskStore } from "../stores/TaskStore";
import TaskDetails from "../components/TaskDetails.vue";
import AddTask from "../components/AddTask.vue";
export default defineComponent({
  components: { TaskDetails, AddTask },
  setup() {
    const { documents, error, load } = getCollection("Boards");
    const taskStore = useTaskStore();
    const selectedCard = ref(null);
    const showCardDetails = ref(false);
    const addTask = ref(false);
    const showTaskDetails = (card) => {
      selectedCard.value = card;
      showCardDetails.value = true;
    };
    const {
      documents: columns,
      error: eColumns,
      load: loadColumns,
    } = getCollection("columns");
    const {
      documents: cards,
      error: eCards,
      load: loadCards,
    } = getCollection("cards");
    const {
      documents: subtasks,
      error: eSubtasks,
      load: loadSubtasks,
    } = getCollection("subtasks");

    load();
    loadColumns();
    loadCards();
    loadSubtasks();
    const completedSubtasks = computed(() =>
      subtasks.value.filter((subtask) => subtask.isCompleted)
    );
    loadSubtasks;
    return {
      addTask,
      showTaskDetails,
      selectedCard,
      showCardDetails,
      taskStore,
      subtasks,
      error,
      documents,
      columns,
      cards,
      completedSubtasks,
    };
  },
});
</script>
