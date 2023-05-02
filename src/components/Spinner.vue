<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    @click.self="$emit('close')"
    v-if="taskStore.boards.length !== 0"
  >
    <span class="loader">Loading</span>
  </div>
</template>

<script>
</script>

<style>
.loader {
  font-size: 48px;
  display: inline-block;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  color: #8f1c80;
  box-sizing: border-box;
  text-shadow: 0 0 2px #fff, 0 0 1px #fff, 0 0 1px #fff;
  letter-spacing: 2px;
  position: relative;
}
.loader::after {
  content: "Loading";
  position: absolute;
  left: 0;
  top: 0;
  color: #fff;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  animation: animloader 6s linear infinite;
}

@keyframes animloader {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
</style>
