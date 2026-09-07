<script setup lang="ts">
import BaseAddEntryPage from '@/components/BaseAddEntryPage.vue';
import BaseDateInput from '@/components/BaseDateInput.vue';
import BaseTextField from '@/components/BaseTextField.vue';
import type treeMenuData from '@/interfaces/TreeMenuData';
import { useTreeStore } from '@/stores/trees';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { Capacitor } from '@capacitor/core';

enum notificationTypes {
    general = 0,
    transplant = 1,
    fertilise = 2,
    prune = 3,
    medicate = 4
}

const router = useRouter();
const treeStore = useTreeStore();

const maxPos = ref<number>(1);
const pos = ref<number>(0);

const trees = ref<treeMenuData[]>([]);
const getTrees = async () => {
    await treeStore.fetchTrees();
    trees.value = treeStore.trees;

    selectedTree.value = trees.value[0]?.id;
}

const selectTree = (id: number) => {
  console.log("previous selected tree: " + selectedTree.value);
  selectedTree.value = id;
  console.log("current selected tree: " + selectedTree.value);
}

const type = ref<notificationTypes>(notificationTypes.general);
const selectedTree = ref<number>();

const date = ref<string>("");
const body = ref<string>("");
const title = ref<string>("");

const setType = (newType: notificationTypes) => {
    type.value = newType;
}

const goForward = async () => {
    if(pos.value < maxPos.value) {
        pos.value = pos.value + 1;
    }
    else {
        const result: boolean = true;//await saveEntry();
        if (result) {
          router.push("/reminders");
        }
    }
}

const goBackwards = () => {
    if(pos.value == 0) {
        router.push("/reminders");
    }
    else {
      pos.value = pos.value - 1;
    }
}

onMounted(async () => {
    await getTrees();
})
</script>

<template>
    <BaseAddEntryPage :maxPos="maxPos" :position="pos" :goForward="goForward" :goBackwards="goBackwards">
        <div :class="['wrapper',
          pos == 0 ? 'wrapper-picture' : '',
          pos == 1 ? 'wrapper-metadata' : '']
        ">
            <div :class="['container', pos != 0 ? 'picture-closed' : '']">
                <h1 class="Header"> Añada un recordatorio </h1>

                <div class="optionsWrapper">
                    <div class="optionsRow">
                        <div :class="['pickSource', type == notificationTypes.general ? 'sourcePicked' : '']" v-on:click="setType(notificationTypes.general)">
                            <div class="source general" />
                        </div>
                        
                        <div :class="['pickSource', type == notificationTypes.transplant ? 'sourcePicked' : '']" v-on:click="setType(notificationTypes.transplant)">
                            <div class="source transplant" />
                        </div>
                        
                        <div :class="['pickSource', type == notificationTypes.fertilise ? 'sourcePicked' : '']" v-on:click="setType(notificationTypes.fertilise)">
                            <div class="source fertilise" />
                        </div>
                    </div>
                    <div class="optionsRow">
                        <div :class="['pickSource', type == notificationTypes.prune ? 'sourcePicked' : '']" v-on:click="setType(notificationTypes.prune)">
                            <div class="source pliers" />
                        </div>
                        
                        <div :class="['pickSource', type == notificationTypes.medicate ? 'sourcePicked' : '']" v-on:click="setType(notificationTypes.medicate)">
                            <div class="source medicate" />
                        </div>
                    </div>
                </div>

                <div class="treesPickerWrapper">
                    <div class="treesPickerContainer">
                        <div v-for="tree in trees" :class="['treeContainer', selectedTree == tree.id ? 'treeSelected' : '']" v-on:click="selectTree(tree.id)">
                            <div class="TreeImg" :style="{ backgroundImage: `url(${Capacitor.convertFileSrc(tree.image)})` }"/>
                            <div class="TreeData">
                                <p class="marginless treeNameText"> {{tree.name}} </p>
                                <p class="marginless treeSpeciesText"> {{tree.species}} </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div :class="['container', pos != 1 ? 'metadata-closed' : '']">
                <h1 class="Header"> Datos </h1>

                <div class="metadataRow" v-if="type == notificationTypes.general" style="margin-top: 20px; margin-bottom: 20px;">
                    <BaseTextField v-model="title" type="text" placeholder="Título..." :rows="1" />
                </div>
                
                <div class="metadataRow">
                    <p class="baseText marginless"> Fecha:  </p>
                    <BaseDateInput v-model:modelValue="date"/>
                </div>

                <div class="metadataRow" style="margin-top: 20px;">
                    <BaseTextField v-model="body" type="textarea" placeholder="Notas..." :rows="4" />
                </div>
            </div>
        </div>
    </BaseAddEntryPage>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Fontdiner+Swanky&family=IBM+Plex+Serif:ital,wght@0,500;0,700;1,500;1,700&family=Jim+Nightshade&display=swap');

    /* Styles for the full page structure */
    .wrapper {
        width: 100dvw;
        height: 100dvh;
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 100%;
        transition: 0.3s;
        overflow: hidden;
    }
    
    .wrapper-picture {
        background-color: var(--soil-bg);
    }
    
    .wrapper-metadata {
        background-color: var(--soil-primary);
    }
    
    .container {
        grid-row: 1;
        grid-column: 1;
        width: 100%;
        height: 100%;
        transition: 0.3s;
        max-width: 100%;
        overflow: hidden;
        
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        transform: translateX(0);
    }

    .picture-closed {
        transform: translateX(-100%);
    }
    
    .metadata-closed {
        transform: translateX(100%);
    }
    
    .marginless {
        margin: 0px;
    }
    
    .Header {
        font-family: "IBM Plex Serif", serif;
        font-weight: 700;
        font-size: 40px;
        text-align: center;
    }

    /* Source picking (The buttons in the beggining that let you choose specific reminders) */
    .optionsWrapper {
        display: flex;
        flex-direction: column;
        gap: 15px;
        
        width: 80%;
    }
    
    .optionsRow {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 20px;
        
        width: 100%;
    }
    
    .pickSource {
        width:  75px;
        height: 75px;
        
        border-radius: 50px;
        border: 2px solid black;
        
        background-color: var(--soil-secondary);
        
        display: flex;
        justify-content: center;
        align-items: center;
        
        cursor: pointer;
        z-index: 10;
    }
    
    .sourcePicked {
        background-color: var(--soil-accent-hover);
    }
    
    .source {
        height: 70%;
        aspect-ratio: 1;
        background-color: black;
        mask-size: contain;
        cursor: pointer;
    }
    
    .general {
        mask-image: url('/icons/Edit.svg');
    }
    
    .fertilise {
        mask-image: url('/icons/Fertiliser.svg');
    }
    
    .transplant {
        mask-image: url('/icons/Shovel.svg');
    }
    
    .pliers {
        mask-image: url('/icons/Pliers.svg');
    }
    
    .medicate {
        mask-image: url('/icons/Spray.svg');
    }


    
    .baseText {
        font-family: 'IBM Plex Serif', serif;
        font-weight: 700;
        font-size: 20px;
    }
    
    .metadataRow {
        display: flex;
        flex-direction: row;
        width: 80%;
        align-items: center;
        justify-content: space-between;
    }

    /* Container for picking the tree to bind the notification to */
    .treesPickerWrapper {
        display: flex;
        flex-direction: column;
        background-color: var(--soil-secondary);
        border-radius: 20px;
        border: 2px solid black;
        
        margin-bottom: 110px;
        margin-top: 20px;

        width: 90%;
        height: 100%;

        overflow: hidden;
    }

    .treesPickerContainer {
        width: 100%;
        box-sizing: border-box;

        padding: 10px;        
        overflow: auto;
        
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
    }

    .treeContainer {
        display: flex;
        flex-direction: row;
        background-color: var(--soil-primary);
        width: 100%;
        box-sizing: border-box;
        height: auto;

        border: 2px solid black;
        border-radius: 10px;

        padding: 5px;
    }

    .treeSelected {
        background-color: var(--soil-accent-hover);
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
        font-size: 20px;
        font-family: 'IBM Plex Serif', serif;
        font-weight: 700;
    }
    
    .treeSpeciesText {
        font-size: 18px;
        font-family: "IBM Plex Serif", serif;
        font-weight: 700;
        font-style: italic;
    }
</style>