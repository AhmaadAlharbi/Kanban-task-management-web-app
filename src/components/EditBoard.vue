<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    @click.self="$emit('close')"
  >
    <div class="bg-white w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-lg">
      <h2 class="text-2xl font-bold mb-4">Modal</h2>
      <p class="mb-4">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed beatae hic
        iusto, sunt non praesentium reiciendis consectetur similique at adipisci
        harum necessitatibus alias voluptatem fugiat blanditiis tenetur soluta
        sit eveniet, exercitationem quia a quam ex id. Incidunt sed similique
        magnam.
      </p>

      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click.stop="$emit('close')"
      >
        Close Modal
      </button>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>