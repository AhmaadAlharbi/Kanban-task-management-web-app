<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white dark:bg-myGray-darkest w-11/12 md:w-1/2 lg:w-[25%] p-6 rounded-lg"
    >
      <h2 class="text-2xl font-bold mb-4 dark:text-white">Add a New Task</h2>
      <form
        @submit.prevent="handleSubmit"
        class="max-w-md mx-auto overflow-y-auto"
      >
        <div class="mb-4">
          <label
            class="block text-gray-700 font-bold mb-2 dark:text-white"
            for="title"
          >
            Title
          </label>
          <input
            v-bind:class="{
              'appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline': true,
              'border-red-500': isTitleInvalid,
            }"
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Enter title"
            v-model="title"
          />
          <span v-show="isTitleInvalid" class="text-red-500 text-xs italic">
            Can't be empty
          </span>
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 font-bold mb-2 dark:text-white"
            for="description"
          >
            Description
          </label>
          <textarea
            v-bind:class="{
              'appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline': true,
              'border-red-500': isDescriptionInvalid,
            }"
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Enter description"
            v-model="description"
          ></textarea>
          <span
            v-show="isDescriptionInvalid"
            class="text-red-500 text-xs italic"
          >
            Can't be empty
          </span>
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 font-bold mb-2 dark:text-white"
            for="subtask"
          >
            SubTasks
          </label>

          <!--- --->
          <div class="overflow-y-auto max-h-48">
            <div
              v-for="(subtask, index) in subtasks"
              :key="index"
              class="flex flex-row pb-4"
            >
              <input
                class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                :id="'subtask-' + index"
                type="text"
                v-model="subtask.title"
                :placeholder="'Enter subtask ' + (index + 1)"
              />

              <button
                @click="removeSubtask(index)"
                class="ml-2 flex-shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-full bg-transparent text-white focus:outline-none focus:shadow-outline"
                type="button"
              >
                <img src="@/assets/images/icon-cross.svg" alt="" />
              </button>
            </div>
          </div>

          <div class="flex justify-center my-7">
            <button
              @click="addSubtask"
              class="bg-myGray-medium w-full opacity-70 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
              type="button"
            >
              Add new subtask
            </button>
          </div>

          <label class="dark:text-white text-white">Status</label>
          <select
            v-model="selectedColumnId"
            class="bg-white border border-gray-400 px-4 py-2 rounded-lg text-gray-700 w-full block mt-4"
          >
            <option value="" disabled>Select a column</option>
            <option
              v-for="col in taskStore.columns"
              :key="col.id"
              :value="col.id"
            >
              {{ col.name }}
            </option>
          </select>
          <button
            type="submit"
            class="bg-myLavender w-full text-white font-bold py-2 px-4 mt-6 inline-block rounded-full focus:outline-none focus:shadow-outline"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useTaskStore } from "@/stores/TaskStore";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  setup() {
    const v = useVuelidate();

    const subtasks = ref([]);
    const taskStore = useTaskStore();
    // taskStore.fetchBoards().then(() => {
    //   taskStore.fetchColumns(taskStore.selectedBoard.id);
    // });
    const title = ref("");
    const description = ref("");
    const status = ref("");
    const selectedColumnId = ref("");

    const addSubtask = () => {
      subtasks.value.push({ title: "", isCompleted: false });
    };
    const formSubmitted = ref(false);

    const removeSubtask = (index) => {
      subtasks.value.splice(index, 1);
    };
    const handleSubmit = () => {
      v.value.$touch(); // Mark all fields as touched
      formSubmitted.value = true;

      if (v.value.$invalid) {
        // Change this line from v.value.$error to v.value.$invalid
        return;
      }
      taskStore
        .addCard(
          taskStore.selectedBoard.id,
          selectedColumnId.value,
          title.value,
          description.value,
          subtasks.value
        )
        .then(() => {
          (title.value = ""),
            (description.value = ""),
            (subtasks.value = ""),
            location.reload(); // reload the page after the task is added
        });
    };
    const isTitleInvalid = computed(
      () =>
        v.value.title.$invalid &&
        (v.value.title.$touched || formSubmitted.value)
    );
    const isDescriptionInvalid = computed(
      () =>
        v.value.description.$invalid &&
        (v.value.description.$touched || formSubmitted.value)
    );

    return {
      isDescriptionInvalid,
      isTitleInvalid,
      selectedColumnId,
      title,
      description,
      status,
      handleSubmit,
      taskStore,
      subtasks,
      addSubtask,
      removeSubtask,
      v,
    };
  },
  validations() {
    return {
      title: { required },
      description: { required },
    };
  },
};
</script>

<style>
</style>