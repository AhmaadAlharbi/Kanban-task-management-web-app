<template>
  <div class="flex flex-row">
    <Sidebar v-if="sidebarComonent" @close-sidebar="sidebarComonent = false" />
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
const sidebarComonent = ref(true);
</script>

<style>
</style>
