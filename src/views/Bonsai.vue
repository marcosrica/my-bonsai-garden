<script setup lang="ts">
import BaseBonsaiPage from '@/components/BaseBonsaiPage.vue';


</script>

<template>
    <BaseBonsaiPage>
        <div class="header">
            <div class="treeImage" />

            <div class="treeId">
                <p class="marginless treeNameText" style="font-size: 40px;"> Tree 1 </p>
                <p class="marginless treeSpeciesText"> Aspaleocotus malacateaus </p>
            </div>
        </div>

        <div class="info">
                
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
    background-image: url('/icons/Wallpaper_Phone_1.png');
    background-position: center;
    
    mask-image: url('/icons/BonsaiMask.svg');
    mask-size: contain;
    mask-repeat: no-repeat;
}

.info {
    width: 95dvw;
    box-sizing: border-box;
    background-color: var(--soil-primary);
    box-shadow: 0 4px 8px 10px #0003, 0 6px 20px 20px #00000030;
    min-height: 200dvh;

    border-radius: 20px;
    margin-bottom: 110px;
}
</style>