<script setup lang="ts">
import BaseBonsaiPage from '@/components/BaseBonsaiPage.vue';
import type fullTreeData from '@/interfaces/FullTreeData';
import { useFullTreeStore } from '@/stores/trees';
import { Capacitor } from '@capacitor/core';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const showEditPanel = ref<boolean>(true);
const treeAge = ref<string>("");
const newName = ref<string>("");
const newSpecies = ref<string>("");

const treeStore = useFullTreeStore();
let id = useRoute().query.id;
const data = ref<fullTreeData>();

const getData = async (id: string) => {
    await treeStore.getData(id as string);
    data.value = treeStore.tree;

    newName.value = data.value?.name || "";
    newSpecies.value = data.value?.species || "";
}

onMounted(async () => {
    if (id == undefined) {
        id = "-1";
    }

    await treeStore.init(id as string);
    await getData(id as string);
})
</script>

<template>
    <BaseBonsaiPage>
        <div class="editButton" v-on:click="showEditPanel = true">
            <div class="editIcon"/>
        </div>

        <div class="blackBackground" v-if="showEditPanel" v-on:click.self="showEditPanel = false">
            <form class="editPanelBackground">
                <div class="editPanelHeader">
                    <p class="marginless treeNameText" style="font-size: 40px;"> Editar </p>
                    <div class="closeEditPanel" v-on:click="showEditPanel = false">
                        <div class="editIcon" style="mask-image: url('/icons/Cross.svg');"/>
                    </div>
                </div>

                <div class="editPanelRow">
                    <p class="marginless treeSpeciesText" style="font-style: normal;"> Nombre: </p>
                    <input class="input" type="text" v-model="newName">
                </div>

                <div class="editPanelRow">
                    <p class="marginless treeSpeciesText" style="font-style: normal;"> Especie: </p>
                    <input class="input" type="text" v-model="newSpecies">
                </div>
                
                <div class="editPanelRow">
                    <p class="marginless treeSpeciesText" style="font-style: normal;"> Año de comienzo: </p>
                    <input class="input" type="date">
                </div>

                <div class="acceptButton">
                    <p class="marginless treeSpeciesText" style="font-style: normal;"> Guardar </p>
                </div>
            </form>
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
                <p class="marginless" > Edad: {{data?.year_planted ? data?.year_planted : "Sin datos"}} </p>
                <p class="marginless" > Último transplante: {{data?.last_transplanted ? data?.last_transplanted : "Sin datos"}} </p>
                <p class="marginless" > Último abono: {{data?.last_abonated ? data?.last_abonated : "Sin datos"}} </p>
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
    z-index: 10000;
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
    background-color: var(--soil-clay);
    border-radius: 20px;

    font-family: "IBM Plex Serif", serif;
    font-weight: 500;
}

.blackBackground {
    width: 100dvw;
    height: 100dvh;
    background-color: #000000cc;

    position: absolute;
    top: 0px;
    left: 0px;

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 10000000000000;
}

.editPanelBackground {
    width: 90%;
    padding: 10px;
    border-radius: 20px;

    background-color: var(--soil-primary);
    box-shadow: 0 4px 8px 10px #0003, 0 6px 20px 20px #00000030;
    
    z-index: 10000000000010;
}

.input {
    background: var(--soil-bg);
    border: 1px solid var(--soil-border);
    border-radius: 8px;
    padding: 0.6rem;
    font-size: 1rem;
    color: black;
}

.closeEditPanel {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 40px;
    aspect-ratio: 1;
    border-radius: 50px;
    background-color: var(--soil-secondary);
    border: 2px solid black;
    
    cursor: pointer;    
}

.editPanelHeader {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    border-bottom: 2px solid black;
    margin-bottom: 20px;
}

.editPanelRow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    box-sizing: border-box;
    width: 100%;
    margin-bottom: 10px;
}

.acceptButton {
    padding: 10px;
    background-color: var(--soil-accent);

    border-radius: 20px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    transition: 0.3s ease;
}

.acceptButton:hover {
    background-color: var(--soil-accent-hover);
}
</style>