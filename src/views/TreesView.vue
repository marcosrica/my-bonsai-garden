<script setup lang="ts">
import BasePage from '@/components/BasePage.vue';
import type { Tree } from '@/stores/trees';

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
    <BasePage>
        <h1 class="Header"> Colección </h1>

        <div class="HomeOptions">
            
        </div>

        <div class="TreesDiv">
            <div v-for="tree in trees" class="TreeDiv"> 
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
    margin: 0px;;
}

.Header {
    margin-top: 10px;
    font-family: "IBM Plex Serif", serif;
    font-weight: 700;
    font-size: 50px;
    text-align: center;
}

.HomeOptions {
    width: 100%;
    height: 50px;
    background-color: green;
    margin-bottom: 10px;
}

.TreesDiv {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 105px;
}

.TreeDiv {
    background-color: yellow;

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
    background-color: pink;
    margin-right: 10px;
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
</style>