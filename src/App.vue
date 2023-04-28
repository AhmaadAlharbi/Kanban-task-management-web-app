<template>
  <div class="flex flex-row">
    <Sidebar />
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
</script>

<style>
</style>
