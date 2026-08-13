<script setup lang="ts">
import BasePage from '@/components/BasePage.vue';
import type { Tree } from '@/stores/trees';
import { useRouter } from 'vue-router';
const router = useRouter()

const trees: Tree[] = [
    {id: 0, name: "Tree 1", species: 1, year_planted: 2020, created_at: ""},
    {id: 1, name: "Tree 2", species: 1, year_planted: 2016, created_at: ""},
    {id: 1, name: "Tree 3", species: 1, year_planted: 2016, created_at: ""},
    {id: 1, name: "Tree 4", species: 1, year_planted: 2016, created_at: ""},
    {id: 1, name: "Tree 5", species: 1, year_planted: 2016, created_at: ""},
    {id: 1, name: "Tree 6", species: 1, year_planted: 2016, created_at: ""},
    {id: 1, name: "Tree 7", species: 1, year_planted: 2016, created_at: ""},
    {id: 1, name: "Tree 8", species: 1, year_planted: 2016, created_at: ""},
    {id: 1, name: "Tree 9", species: 1, year_planted: 2016, created_at: ""},
    {id: 1, name: "Tree 10", species: 1, year_planted: 2016, created_at: ""},
];

const inspectTree = (id: number) => {
  router.push("/bonsai?id=" + id);
}

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
    <BasePage location="home">
        <div class="HomeOptions">
            <h1 class="Header"> Colección </h1>
            <div class="search" />
        </div>

        <div class="TreesDiv">
            <div v-for="tree in trees" class="TreeDiv" v-on:click="inspectTree(tree.id)"> 
                <div class="TreeImg">
                    
                </div>

                <div class="TreeData">
                    <p class="marginless treeNameText" style="font-size: 25px;"> {{tree.name}} </p>
                    <p class="marginless treeSpeciesText"> Aspaleocotus malacateaus </p>
                </div>

                <div class="RightArrow">
                    
                </div>
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
    cursor: pointer;
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

    background-image: url('/icons/Wallpaper_Phone_1.png');
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
</style>