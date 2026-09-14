<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  goForward: () => void,
  goBackwards: () => void,

  maxPos: number,
  position: number,
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
        <div class="AddBonsaiButtonWrapper" >
            <div :class="['Back', position == 0 ? 'home' : '']" v-on:click="goBackwards"/>
        </div>
        
        <div class="AddBonsaiButtonWrapper" v-on:click="goForward">
            <div :class="['Front', position == props.maxPos ? 'done' : '']"/>
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
    min-height: 100dvh;
    overflow: auto;
    width: 100%;
    
    display: flex;
    flex-direction: row;
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
    z-index: 100;
}

.Back {
    height: 70%;
    aspect-ratio: 1;
    background-color: black;
    mask-image: url('/icons/FullLeftArrow.svg');
    mask-size: contain;
    cursor: pointer;
    z-index: 1;
}

.Front {
    height: 70%;
    aspect-ratio: 1;
    background-color: black;
    mask-image: url('/icons/FullRightArrow.svg');
    mask-size: contain;
    cursor: pointer;
    z-index: 1;
}

.home {
    mask-image: url('/icons/Cross.svg');
}

.done {
    mask-image: url('/icons/Tick.svg');
}
</style>