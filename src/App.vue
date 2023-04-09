<script setup>
import { RouterLink, RouterView } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
</script>

<template>
  <Navbar />
  <Sidebar />

  <RouterView />
</template>

<style scoped>
</style>
