<template>
  <div class="flex flex-row">
    <transition name="sidebar">
      <Sidebar
        v-if="sidebarComponent"
        @close-sidebar="sidebarComponent = false"
      />
    </transition>
    <div
      v-if="!sidebarComponent"
      @click="sidebarComponent = true"
      class="bg-myPurple absolute -left-5 bottom-10 py-3 px-6 rounded-full cursor-pointer"
    >
      <img src="./assets/images/icon-show-sidebar.svg" alt="" />
    </div>
    <div class="flex-1">
      <Navbar />
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import { ref } from "vue";
const sidebarComponent = ref(true);
</script>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
}
</style>
