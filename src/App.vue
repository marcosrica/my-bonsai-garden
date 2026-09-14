<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import { onMounted } from 'vue';
import { initDatabase } from './services/database';

onMounted(async () => {
    try {
        await initDatabase();
        console.log('Database ready');
    } catch (error) {
        console.error('Database init failed:', error);
        // Optionally show a user-friendly error on screen
    }
});
</script>

<template>
    <RouterView class="appp" />
</template>

<style>
html {
    padding: 0px;
    margin: 0px;
    
    width: 100dvw;
    height: 100dvh;
}

#app {
    margin: 0px;
    padding: 0px;
}

body {
    margin: 0px;
    padding: 0px;

    width: 100dvw;
    height: 100dvh;

    color: black;
}
</style>
