<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  addClicked: () => void,
}>();

const goHome = () => {
  router.push("/");
}

const goToReminders = () => {
  router.push("/reminders");
}
</script>

<template>
  <div class="app">
    <div class="background">
        <slot />
    </div>

    <div class="bottomBar">
        <div class="AddBonsaiButtonWrapper" v-on:click="goHome">
            <div class="Home"/>
        </div>
        
        <div class="AddBonsaiButtonWrapper" v-on:click="() => { addClicked(); }">
            <div class="Picture"/>
        </div>
    </div>
  </div>
</template>

<style scoped>
.app {
    box-sizing: border-box;
    width: 100dvw;
    height: 100dvh;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    background-color: var(--soil-bg);
}

.background {
    width: 100%;
    min-height: 100dvh;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.bottomBar {
    position: absolute;
    bottom: 20px;
    width: 100dvw;
    height: 75px;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.AddBonsaiButtonWrapper {
    width:  75px;
    height: 75px;

    border-radius: 50px;
    border: 2px solid black;
    
    background-color: var(--soil-secondary);

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
}

.Home {
    height: 70%;
    aspect-ratio: 1;
    background-color: black;
    mask-image: url('/icons/House.svg');
    mask-size: contain;
    cursor: pointer;
}

.Picture {
    height: 70%;
    aspect-ratio: 1;
    background-color: black;
    mask-image: url('/icons/CameraPlus.svg');
    mask-size: contain;
    cursor: pointer;
}
</style>