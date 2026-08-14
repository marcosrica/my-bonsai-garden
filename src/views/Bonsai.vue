<script setup lang="ts">
import BaseBonsaiPage from '@/components/BaseBonsaiPage.vue';
import type fullTreeData from '@/interfaces/FullTreeData';
import { useFullTreeStore } from '@/stores/trees';
import { Capacitor } from '@capacitor/core';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const treeStore = useFullTreeStore();
let id = useRoute().query.id;
const data = ref<fullTreeData>();

onMounted(async () => {
    if (id == undefined) {
        id = "-1";
    }

    await treeStore.init(id as string);
    await treeStore.getData(id as string);
    data.value = treeStore.tree;
})
</script>

<template>
    <BaseBonsaiPage>
        <div class="editButton">
            <div class="editIcon" />
        </div>
        
        <div class="header">
            <div class="treeImage" :style="{ backgroundImage: `url(${Capacitor.convertFileSrc(data?.image || '')})` }"/>

            <div class="treeId">
                <p class="marginless treeNameText" style="font-size: 40px;"> {{data?.name}} </p>
                <p class="marginless treeSpeciesText"> {{data?.species}} </p>
            </div>
        </div>

        <div class="info">
            <div class="basicInfo">
                <p class="marginless" > Edad: {{data?.year_planted}} </p>
                <p class="marginless" > Último transplante: {{data?.last_transplanted}} </p>
                <p class="marginless" > Último abono: {{data?.last_abonated}} </p>
            </div>
        </div>
    </BaseBonsaiPage>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fontdiner+Swanky&family=IBM+Plex+Serif:ital,wght@0,500;0,700;1,500;1,700&family=Jim+Nightshade&display=swap');

.marginless {
    margin: 0px;
}

.header {
    width: 100dvw;
    box-sizing: border-box;
    min-height: 45dvh;
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;

    margin-bottom: 10px;
}

.treeId {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    margin-left: calc(2.5% + 10px);
}

.treeNameText {
    font-family: 'IBM Plex Serif', serif;
    font-weight: 700;
    z-index: 10;
}

.treeSpeciesText {
    font-family: "IBM Plex Serif", serif;
    font-weight: 700;
    font-style: italic;
}

.treeImage {
    width: 70%;
    height: 45dvh;
    position: absolute;
    top: 0px;
    right: 0px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    
    mask-image: url('/icons/BonsaiMask.svg');
    mask-size: contain;
    mask-repeat: no-repeat;
}

.editButton {
    position: fixed;
    width: 50px;
    aspect-ratio: 1;
    border-radius: 50px;
    background-color: var(--soil-secondary);

    top: 20px;
    left: 20px;
    border: 2px solid black;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
}

.editIcon {
    width: 70%;
    aspect-ratio: 1;

    background-color: black;
    mask-image: url('/icons/Edit.svg');
    mask-size: contain;
}

.info {
    width: 95dvw;
    box-sizing: border-box;
    background-color: var(--soil-primary);
    box-shadow: 0 4px 8px 10px #0003, 0 6px 20px 20px #00000030;

    padding: 10px;
    
    border-radius: 20px;
    margin-bottom: 110px;
}

.basicInfo {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 10px;

    box-sizing: border-box;
    width: 100%;
    background-color: orange;
    border-radius: 20px;

    font-family: "IBM Plex Serif", serif;
    font-weight: 500;
}
</style>