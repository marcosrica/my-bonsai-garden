<template>
  <div>
    <h1>My Bonsai Trees</h1>
    <div v-if="store.loading">Loading...</div>
    <ul v-else>
      <li v-for="tree in store.trees" :key="tree.id">
        {{ tree.species }} – Planted {{ tree.year_planted }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useTreeStore } from '@/stores/trees';
const store = useTreeStore();
</script>