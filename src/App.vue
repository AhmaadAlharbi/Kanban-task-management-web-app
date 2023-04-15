<script setup>
import { RouterLink, RouterView } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
</script>

<template>
  <div class="flex">
    <Sidebar />
    <RouterView />
  </div>
</template>

<style scoped>
</style>
