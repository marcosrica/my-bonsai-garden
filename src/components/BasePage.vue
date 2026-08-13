<script setup lang="ts">

</script>

<template>
  <div class="app">
    <div class="background">
        <slot />
    </div>

    <div class="bottomBar">
        <div class="menu">
            <div class="Bonsai"/>
            <div class="Reminder"/>
        </div>
        
        <div class="AddBonsaiButtonWrapper">
            <p style="margin: 0px; font-size: 40px;"> + </p>
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
    width: 95%;
    min-height: 100dvh;
    overflow: auto;
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

.menu {
    width:  150px;
    height: 75px;

    border-radius: 50px;
    border: 2px solid black;
    
    background-color: var(--soil-secondary);

    display: flex;
    flex-direction: row;
    gap: 40px;
    justify-content: center;
    align-items: center;

    padding-left: 20px;
    padding-right: 20px;
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

.Bonsai {
    height: 70%;
    aspect-ratio: 1;
    background-color: black;
    mask-image: url('/icons/Bonsai.svg');
    mask-size: contain;
    cursor: pointer;
}

.Reminder {
    height: 70%;
    aspect-ratio: 1;
    background-color: black;
    mask-image: url('/icons/Reminder.svg');
    mask-size: contain;
    cursor: pointer;
}
</style>