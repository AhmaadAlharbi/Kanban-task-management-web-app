<template>
  <div class="flex flex-col w-full">
    <nav class="bg-white h-20">
      <ul class="flex justify-between items-center mt-4 px-10">
        <li class="text-2xl font-bold">Platform Launch</li>
        <li
          class="bg-purple-500 py-2 px-2 text-white cursor-pointer"
          @click="addTaskComponent = true"
        >
          + Add a New Task
        </li>
      </ul>
    </nav>
    <div>
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
    </div>
    <!-- todo -->
    <div v-if="columns.length > 0">
      <div class="flex justify-around">
        <div class="flex flex-col" v-for="col in columns" :key="col.id">
          <h1 class="bg-gray-300 px-2">{{ col.name }} - {{ col.id }}</h1>
          <div v-if="cards">
            <div
              class="flex flex-col shadow-md mt-3 py-3 px-6 bg-white w-80 mb-8"
              v-for="card in cards"
              :key="card.id"
            >
              <div v-if="card.column_id == col.id">
                <p class="font-bold" v-if="card">{{ card.title }}</p>
                <!-- subtasks -->
                <div v-for="sub in subtasks" :key="sub.id">
                  <p class="text-gray-500" v-if="card.id === sub.card_id">
                    {{ completedSubtasks.length }} - of {{ subtasks.length }}
                  </p>
                  <p class="text-gray-500" v-else>No subtasks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { computed, onMounted } from "vue";
import getCollection from "../composables/getCollection";
import { useTaskStore } from "../stores/TaskStore";
export default defineComponent({
  setup() {
    const { documents, error, load } = getCollection("Boards");
    const taskStore = useTaskStore();
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
