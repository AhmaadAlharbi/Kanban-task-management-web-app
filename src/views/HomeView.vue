<template>
  <div class="flex flex-col w-full">
    <nav class="bg-white h-20">
      <ul class="flex justify-between items-center mt-4 px-10">
        <li class="text-2xl font-bold">Platform Launch</li>
        <li class="bg-purple-500 py-2 px-2 text-white cursor-pointer">
          + Add a New Task
        </li>
      </ul>
    </nav>
    <section class="container px-10 mt-5 flex justify-between items-center">
      <!-- TODO -->
      <div>
        <div class="flex space-x-2">
          <div class="h-6 w-6 rounded-full bg-sky-500"></div>
          <h1 class="text-blak">TODO (4)</h1>
        </div>
        <div class="shadow-md bg-white mt-3 py-3 px-6">
          <h3 class="font-bold text-xl">Build UI for onboarding flow</h3>
          <p class="text-gray-500">0 of 6 substasks</p>
        </div>
        <div class="shadow-md bg-white mt-3 py-3 px-6">
          <h3 class="font-bold text-xl">Build UI for search</h3>
          <p class="text-gray-500">1 of 6 substasks</p>
        </div>
        <div class="shadow-md bg-white mt-3 py-3 px-6">
          <h3 class="font-bold text-xl">Build UI for search</h3>
          <p class="text-gray-500">0 of 1 substasks</p>
        </div>
        <div class="shadow-md bg-white mt-3 py-3 px-6">
          <h3 class="font-bold text-xl">QA and test all major user journeys</h3>
          <p class="text-gray-500">0 of 2 substasks</p>
        </div>
      </div>
      <!-- DOING -->

      <div>
        <div class="flex space-x-2">
          <div class="h-6 w-6 rounded-full bg-purple-500"></div>
          <h1 class="text-blak">DOING (4)</h1>
        </div>
        <div class="shadow-md bg-white mt-3 py-3 px-6">
          <h3 class="font-bold text-xl">Build UI for onboarding flow</h3>
          <p class="text-gray-500">0 of 6 substasks</p>
        </div>
        <div class="shadow-md bg-white mt-3 py-3 px-6">
          <h3 class="font-bold text-xl">Build UI for search</h3>
          <p class="text-gray-500">1 of 6 substasks</p>
        </div>
        <div class="shadow-md bg-white mt-3 py-3 px-6">
          <h3 class="font-bold text-xl">Build UI for search</h3>
          <p class="text-gray-500">0 of 1 substasks</p>
        </div>
        <div class="shadow-md bg-white mt-3 py-3 px-6">
          <h3 class="font-bold text-xl">QA and test all major user journeys</h3>
          <p class="text-gray-500">0 of 2 substasks</p>
        </div>
      </div>
      <!-- DONE -->

      <div>
        <div class="flex space-x-2">
          <div class="h-6 w-6 rounded-full bg-green-500"></div>
          <h1 class="text-blak">DONE (4)</h1>
        </div>
        <div class="shadow-sm bg-white mt-3 py-3 px-6">
          <h3 class="font-bold text-xl">Build UI for onboarding flow</h3>
          <p class="text-gray-500">0 of 6 substasks</p>
        </div>
        <div class="shadow-md bg-white mt-3 py-3 px-6">
          <h3 class="font-bold text-xl">Build UI for search</h3>
          <p class="text-gray-500">1 of 6 substasks</p>
        </div>
        <div class="shadow-md bg-white mt-3 py-3 px-6">
          <h3 class="font-bold text-xl">Build UI for search</h3>
          <p class="text-gray-500">0 of 1 substasks</p>
        </div>
        <div class="shadow-md bg-white mt-3 py-3 px-6">
          <h3 class="font-bold text-xl">QA and test all major user journeys</h3>
          <p class="text-gray-500">0 of 2 substasks</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>