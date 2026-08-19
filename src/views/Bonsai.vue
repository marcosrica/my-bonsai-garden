<script setup lang="ts">
import BaseBonsaiPage from '@/components/BaseBonsaiPage.vue';
import type Entries from '@/interfaces/Entries';
import type fullTreeData from '@/interfaces/FullTreeData';
import { abonateTree, changeTreeInit, changeTreeName, changeTreeSpecies, killTree, transplantTree } from '@/services/database';
import { useFeedStore, useFullTreeStore } from '@/stores/trees';
import { Capacitor } from '@capacitor/core';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const router = useRouter();
const addEntry = () => {
    router.push("/addEntry?id=" + id);
}

const showEditPanel = ref<boolean>(false);
const treeAge = ref<number>(-1);
const newName = ref<string>("");
const newSpecies = ref<string>("");

const treeStore = useFullTreeStore();
let id = useRoute().query.id;
const data = ref<fullTreeData>();

const currentYear:number = new Date(Date.now()).getFullYear();

const abonateCounter = ref<number>(0);
const abonatePressed = ref<boolean>(false);

const transplantCounter = ref<number>(0);
const transplantPressed = ref<boolean>(false);

const feedStore = useFeedStore();
const feedData = ref<Entries[]>([]);

const transplant = async () => {
    const _id = id?.toString() || "";
    const response: boolean = await transplantTree(_id);
    getData(_id);
}

const abonate = async () => {
    const _id = id?.toString() || "";
    const response: boolean = await abonateTree(_id);
    getData(_id);
}

const kill = async (value: boolean) => {
    const _id = id?.toString() || "";
    const response: boolean = await killTree(_id, value);
    getData(_id);
}

const saveData = async () => {
    let result1 = true;
    let result2 = true;
    let result3 = true;
    const _id = id?.toString() || "";
    
    if (data.value != undefined) {
        if (data.value.year_planted != treeAge.value) {
            result1 = await changeTreeInit(_id, treeAge.value);
        }

        if (data.value.name != newName.value) {
            result2 = await changeTreeName(_id, newName.value);
        }

        if (data.value.species != newSpecies.value) {
            result3 = await changeTreeSpecies(_id, newSpecies.value) 
        }
    }

    if (result1 && result2 && result3) {
        hideEditPanel();
        await getData(_id);
    }
    else {
        alert("Ha habido un error. Por favor, inténtelo de nuevo");
    }
}

const getData = async (id: string) => {
    await treeStore.getData(id as string);
    data.value = treeStore.tree;

    newName.value = data.value?.name || "";
    newSpecies.value = data.value?.species || "";
    treeAge.value = data.value?.year_planted || -1;
}

const getFeed = async (id: string) => {
    await feedStore.getData(id);
    feedData.value = feedStore.entries;
}

const tick = () => {
    if (abonatePressed.value) {
        abonateCounter.value = Math.min(2000, abonateCounter.value + 10);

        if (abonateCounter.value >= 2000) {
            abonateCounter.value = 0;
            hideEditPanel();
            abonate();
        }
    }
    else {
        abonateCounter.value = Math.max(0, abonateCounter.value - 10);
    }

    if (transplantPressed.value) {
        transplantCounter.value = Math.min(2000, transplantCounter.value + 10);

        if (transplantCounter.value >= 2000) {
            transplantCounter.value = 0;
            hideEditPanel();
            transplant();
        }
    }
    else {
        transplantCounter.value = Math.max(0, transplantCounter.value - 10);
    }
}

const abonateTreePressed = (e: PointerEvent) => {
    e.preventDefault();
    abonatePressed.value = true;
}

const abonateTreeNotPressed = (e: PointerEvent) => {
    e.preventDefault();
    abonatePressed.value = false;
}

const transplantTreePressed = (e: PointerEvent) => {
    e.preventDefault();
    transplantPressed.value = true;
}

const transplantTreeNotPressed = (e: PointerEvent) => {
    e.preventDefault();
    transplantPressed.value = false;
}

const hideEditPanel = () => {
    transplantPressed.value = false;
    transplantCounter.value = 0;
    abonatePressed.value = false;
    abonateCounter.value = 0;
  
    showEditPanel.value = false;
}

onMounted(async () => {
    if (id == undefined) {
        id = "-1";
    }

    await treeStore.init(id as string);
    await getData(id as string);

    await feedStore.init(id as string);
    await getFeed(id as string);

    setInterval(tick, 10);
})
</script>

<template>
    <BaseBonsaiPage :addClicked="addEntry">
        <!-- Edit button -->
        <div class="editButton" v-on:click="showEditPanel = true">
            <div class="editIcon"/>
        </div>

        <!-- Edit panel -->
        <div class="blackBackground" v-if="showEditPanel" v-on:click.self="hideEditPanel">
            <form class="editPanelBackground">
                <div class="editPanelHeader">
                    <p class="marginless treeNameText" style="font-size: 40px;"> Editar </p>
                    <div class="closeEditPanel" v-on:click="hideEditPanel">
                        <div class="editIcon" style="mask-image: url('/icons/Cross.svg');"/>
                    </div>
                </div>

                <div :class="['basicInfo', 'button', transplantPressed ? 'button-selected' : '']" @pointerdown="transplantTreePressed"
                    @pointerup=    "transplantTreeNotPressed"
                    @pointercancel="transplantTreeNotPressed"
                    @pointerleave= "transplantTreeNotPressed">
                    <div class="progress-fill" :style="{ width: `${(transplantCounter / 2000) * 100}%` }" />
                    <p class="marginless treeNameText" style="font-size: 20px; text-align: center; width: 100%;"> Transplantar </p>
                </div>
                
                <div :class="['basicInfo', 'button', abonatePressed ? 'button-selected' : '']" @pointerdown="abonateTreePressed"
                    @pointerup=    "abonateTreeNotPressed"
                    @pointercancel="abonateTreeNotPressed"
                    @pointerleave= "abonateTreeNotPressed">
                    <div class="progress-fill" :style="{ width: `${(abonateCounter / 2000) * 100}%` }" />
                    <p class="marginless treeNameText" style="font-size: 20px; text-align: center; width: 100%; position: relative; z-index: 1;""> Abonar </p>
                </div>
                
                <div class="basicInfo button" style="background-color: var(--soil-error);" v-if="!data?.dead" v-on:click="kill(true)">
                    <p class="marginless treeNameText" style="font-size: 20px; text-align: center; width: 100%;"> Está muerto </p>
                </div>
                <div class="basicInfo button" style="background-color: var(--soil-accent-hover);" v-else v-on:click="kill(false)">
                    <p class="marginless treeNameText" style="font-size: 20px; text-align: center; width: 100%;"> Está vivo </p>
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
                    <input class="input" type="number" v-model="treeAge">
                </div>
                
                <div class="acceptButton" v-on:click="saveData">
                    <p class="marginless treeSpeciesText" style="font-style: normal;"> Guardar </p>
                </div>
            </form>
        </div>

        <!-- Header panel -->
        <div class="header">
            <div class="treeImage" :style="{ backgroundImage: `url(${Capacitor.convertFileSrc(data?.image || '')})` }"/>

            <div class="treeId">
                <p class="marginless treeNameText" style="font-size: 40px;"> {{data?.name}} </p>
                <p class="marginless treeSpeciesText"> {{data?.species}} </p>
            </div>
        </div>

        <div class="info">
            <div class="basicInfo" style="margin-bottom: 0px;">
                <p class="marginless" v-if="data?.year_planted == undefined"> Edad: Sin datos </p>
                <p class="marginless" v-else> Edad: {{currentYear - data.year_planted}} años ({{data.year_planted}}) </p>
                
                <p class="marginless" > Último transplante: {{data?.last_transplanted ? data?.last_transplanted : "Sin datos"}} </p>
                <p class="marginless" > Último abono: {{data?.last_abonated ? data?.last_abonated : "Sin datos"}} </p>
                <p class="marginless" > Estado: {{data?.dead ? "Muerto" : "Vivo"}} </p>
            </div>
        </div>

        <div :class="['info', entry.id == feedData[feedData.length - 1]?.id ? 'lastEntry' : '']" v-for="entry in feedData">
            <div class="entryTitle" style="margin-bottom: 10px;">
                <div clasS="datePanel">
                    <p class="marginless"> {{entry.created_at}} </p>
                </div>

                <div class="moreInfoButton">
                    <div class="moreInfoIcon"/>
                </div>
            </div>
            <div v-if="entry.image_path != ''" class="entryImage" :style="{ backgroundImage: `url(${Capacitor.convertFileSrc(entry.image_path)})`, marginBottom: `10px` }"/>
            <div v-if="entry.text != ''" class="basicInfo" style="margin-bottom: 0px;">
                <p class="marginless"> {{entry.text}} </p>
            </div>
        </div>

        <div style="width: 100%; height: 110px;"/>
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
    margin-bottom: 40px;
}

.basicInfo {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 10px;
    position: relative;

    box-sizing: border-box;
    width: 100%;
    background-color: var(--soil-clay);
    border-radius: 10px;

    font-family: "IBM Plex Serif", serif;
    font-weight: 500;

    margin-bottom: 40px;
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

.button {
    box-shadow: 0 4px 8px 2px #0003, 0 6px 20px 2px #00000030;
    transition: 0.3s ease;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
    overflow: hidden;
}

.button-selected {
    box-shadow: 0 4px 8px 10px #0003, 0 6px 20px 10px #00000030;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;            
  background-color:var(--soil-error);
  z-index: 0;              
  pointer-events: none;
}

.entryImage {
    width: 100%;
    height: 50dvh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 8px;
}

.lastEntry {
    margin-bottom: 110px;
}

.entryTitle {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 40px;

    position: relative;
}

.datePanel {
    box-sizing: border-box;
    background-color: var(--soil-clay);
    border-radius: 10px;

    font-family: "IBM Plex Serif", serif;
    font-weight: 500;
    padding: 10px;

    flex: 1;
}

.moreInfoButton {
    height: 100%;
    aspect-ratio: 1;
    
    margin-left: 10px;
    box-sizing: border-box;
    background-color: var(--soil-clay);
    border-radius: 10px;

    display: flex;
    justify-content: center;
    align-items: center;
}

.moreInfoIcon {
    width: 70%;
    aspect-ratio: 1;

    background-color: black;
    mask-image: url('/icons/Edit.svg');
    mask-size: contain;
}
</style>