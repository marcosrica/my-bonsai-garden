<script setup lang="ts">
import BasePage from '@/components/BasePage.vue';
import ImageInput from '@/components/ImageInput.vue';
import type { Tree } from '@/stores/trees';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTreeStore } from '@/stores/trees';
import type treeMenuData from '@/interfaces/TreeMenuData';
import { Capacitor } from '@capacitor/core';
import { createBackup, restoreBackup } from '@/services/backup';

const router = useRouter();
const treeStore = useTreeStore();
treeStore.init();

const showAddTreePanel = ref<boolean>(false);

const trees = ref<treeMenuData[]>([]);

const getTrees = async () => {
    await treeStore.fetchTrees();
    trees.value = treeStore.trees;
}

const addNewTree = () => {
    showAddTreePanel.value = !showAddTreePanel.value;
}

const treeAdded = () => {
    showAddTreePanel.value = false;
    getTrees();
}

const inspectTree = (id: number) => {
  router.push("/bonsai?id=" + id);
}

const backUp = async () => {
    try {
        const result = await createBackup();
        if (result != "") {
            alert("Copia guardada");
        }
    }
    catch (error) {
        console.error('Backup failed:', error);
        alert('Error al crear la copia de seguridad');
    }
}

const restore = async () => {
    try {
        const result = await restoreBackup();
    }
    catch (error) {
        console.error('restoration failed:', error);
        alert('Error al recuperar la copia de seguridad');
    }
}

onMounted(async () => {
    await getTrees();
    console.log("trees logged");
})

// 
/*
<div v-if="store.loading">Loading...</div>
    <ul v-else>
      <li v-for="tree in store.trees" :key="tree.id">
        {{ tree.species }} – Planted {{ tree.year_planted }}
      </li>
    </ul>
*/
</script>

<template>
    <BasePage location="home" :addClicked="addNewTree" :varyAddColor="showAddTreePanel">
        <div class="blackOut" v-if="showAddTreePanel" v-on:click="addNewTree"/>

        <div class="addTreePanel" v-if="showAddTreePanel">
            <h1 class="Header" style="font-size: 30px; margin-top: 10px"> Añadir árbol </h1>

            <ImageInput :treeAdded="treeAdded"></ImageInput>
        </div>
        
        <div class="HomeOptions">
            <h1 class="Header"> Colección </h1>
            <div class="search" />
        </div>

        <div class="TreesDiv">
            <div v-for="tree in trees" class="TreeDiv" v-on:click="inspectTree(tree.id)"> 
                <div class="TreeImg" :style="{ backgroundImage: `url(${Capacitor.convertFileSrc(tree.image)})` }"/>

                <div class="TreeData">
                    <p class="marginless treeNameText" style="font-size: 25px;"> {{tree.name}} </p>
                    <p class="marginless treeSpeciesText"> {{tree.species}} </p>
                </div>

                <div class="RightArrow" />
            </div>

             <div class="TreeDiv" v-on:click="backUp"> 
                <div class="backupImg"/>
                <div class="TreeData">
                    <p class="marginless treeNameText" style="font-size: 25px;"> Hacer una copia de seguridad </p>
                </div>

                <div class="RightArrow" />
            </div>

            <div class="TreeDiv" v-on:click="restore"> 
                <div class="backupImg"/>
                <div class="TreeData">
                    <p class="marginless treeNameText" style="font-size: 25px;"> Restaurar una copia de seguridad </p>
                </div>

                <div class="RightArrow" />
            </div>
        </div>
    </BasePage>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fontdiner+Swanky&family=IBM+Plex+Serif:ital,wght@0,500;0,700;1,500;1,700&family=Jim+Nightshade&display=swap');

.marginless {
    margin: 0px;
}

.Header {
    font-family: "IBM Plex Serif", serif;
    font-weight: 700;
    font-size: 50px;
    text-align: center;
}

.HomeOptions {
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    margin-bottom: 20px;
    margin-top: 20px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.TreesDiv {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 105px;
}

.TreeDiv {
    background-color: var(--soil-primary);
    box-shadow: var(--shadow-card);

    box-sizing: border-box;
    width: 100%;
    min-height: 50px;
    
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    margin-bottom: 10px;
    border-radius: 10px;
    padding: 10px;
}

.TreeImg {
    box-sizing: border-box;
    height: 60px;
    aspect-ratio: 1;
    margin-right: 10px;
    border-radius: 6px;

    /*background-image: url('/icons/Wallpaper_Phone_1.png');*/
    background-size: cover;
    background-repeat: no-repeat;
}

.TreeData {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex: 1;
}

.treeNameText {
    font-family: 'IBM Plex Serif', serif;
    font-weight: 700;
}

.treeSpeciesText {
    font-family: "IBM Plex Serif", serif;
    font-weight: 700;
    font-style: italic;
}

.RightArrow {
    height: 20px;
    aspect-ratio: 1;
    background-color: black;
    mask-image: url('/icons/RightArrow.svg');
    mask-size: contain;
}

.search {
    height: 80%;
    aspect-ratio: 1;
    background-color: black;
    mask-image: url('/icons/Search.svg');
    mask-size: contain;
}

.blackOut {
    position: absolute;
    background-color: #000000cc;
    z-index: 100;

    width: 100dvw;
    height: 100dvh;

    top: 0;
    left: 0;
}

.addTreePanel {
    z-index: 1000;
    position: absolute;
    right: 20px;
    bottom: 110px;

    width: 80dvw;
    height: auto;
    padding-bottom: 10px;
    background-color: var(--soil-secondary);

    border: 2px solid black;
    border-radius: 20px;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.backupImg {
    height: 60px;
    aspect-ratio: 1;
    background-color: black;
    mask-image: url('/icons/Backup.svg');
    mask-size: contain;
    margin-right: 10px;
}
</style>