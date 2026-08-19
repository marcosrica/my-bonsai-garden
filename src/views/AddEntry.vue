<script setup lang="ts">
import BaseAddEntryPage from '@/components/BaseAddEntryPage.vue';
import BaseDateInput from '@/components/BaseDateInput.vue';
import BaseTextField from '@/components/BaseTextField.vue';
import { chooseImage, shootImage, type CapturedImage } from '@/services/camera';
import { addEntry, addEntry_withTime, changeTreeImage } from '@/services/database';
import { savePhoto } from '@/services/storage';
import { onMounted, ref } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const router = useRouter();
let id = useRoute().query.id as string;

const maxPos = ref<number>(1);
const pos = ref<number>(0);

const isPrimary = ref<boolean>(false);

const imageBase64 = ref<string | null>(null);      // cropped base64 (will be saved)
const imageDataUrl = ref<string | null>(null);      // cropped data URL (preview)
const originalImageDataUrl = ref<string | null>(null); // original image passed to cropper
const showCropper = ref(false);
const cropping = ref(false);

const date = ref<string>("");
const notes = ref<string>("");

const goForward = async () => {
    if(pos.value < maxPos.value) {
        pos.value = pos.value + 1;
    }
    else {
        const result: boolean = await saveEntry();
        if (result) {
          router.push("/bonsai?id=" + id);
        }
    }
}

const goBackwards = () => {
    if(pos.value == 0) {
        router.push("/bonsai?id=" + id);
    }
    else {
      pos.value = pos.value - 1;
    }
}

const takePicture = async(live: boolean) => {
    let image: CapturedImage | null = null;

    //Picking the image
    if (live) {
        image = await shootImage();
    }
    else {
        image = await chooseImage();
    }
  
    if (image) {
          originalImageDataUrl.value = image.dataUrl;
          showCropper.value = true;
    }
}

function removeImage() {
    imageBase64.value = null;
    imageDataUrl.value = null;
    originalImageDataUrl.value = null;
    showCropper.value = false;
}

const cropperRef = ref<InstanceType<typeof Cropper> | null>(null);
    
async function confirmCrop() {
    if (!cropperRef.value) return;
  
    cropping.value = true;
    try {
        // Get the cropped canvas
        const { canvas } = cropperRef.value.getResult();
        if (canvas) {
            // Convert canvas to data URL (JPEG, quality 0.9)
            const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            imageDataUrl.value = croppedDataUrl;
            // Extract base64 string (remove prefix) for saving
            imageBase64.value = croppedDataUrl.split(',')[1] || "";
            // Close cropper modal
            showCropper.value = false;
        }
    }
    catch (error) {
        console.error('Error cropping image:', error);
        alert('Error al recortar la imagen');
    }
    finally {
        cropping.value = false;
    }
}

function cancelCrop() {
    showCropper.value = false;
    originalImageDataUrl.value = null;
}

async function saveEntry(): Promise<boolean> {
    //Avoiding empty responses
    if (!imageBase64.value && !(notes.value!="")) {
        alert('Por favor, añada una imagen o un texto');
        return false;
    }

    try {
        let imagePath: string | null = null;
        let result: boolean = false;
        let result2: boolean = false;
        
        // Save image if present
        if (imageBase64.value) {
            const fileName = `tree_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            const uri = await savePhoto(imageBase64.value, fileName);
            imagePath = uri;

            if (imagePath == null) {
                alert("La imagen no se ha podido guardar");
                return false;
            }
        }
        
        //Adding entry to the database
        if (date.value != "") {
            //Add it with the day's date
            result = await addEntry(id, imagePath, notes.value);
        }
        else {
            result = await addEntry_withTime(id, imagePath, notes.value, date.value);
        }

        if (isPrimary.value) {
            result2 = await changeTreeImage(id, imagePath);
        }

        return true;
    }
    catch (error) { 
      alert("Ha ocurrido un error al guardar la entrada");
      return false;
    }
}
</script>

<template>
    <BaseAddEntryPage :maxPos="maxPos" :position="pos" :goForward="goForward" :goBackwards="goBackwards">
        <div :class="['wrapper',
          pos == 0 ? 'wrapper-picture' : '',
          pos == 1 ? 'wrapper-metadata' : '']
        ">
            <div :class="['container', pos != 0 ? 'picture-closed' : '']">
                <h1 class="Header"> Añada la imagen </h1>

                <div class="pictureContent">
                    <div class="image-preview" v-if="imageDataUrl">
                        <div class="image-wrapper">
                            <img :src="imageDataUrl" alt="Preview" />
                            <button @click="removeImage">✕</button>
                        </div>
                    </div>

                    <Teleport to="body">
                        <div v-if="showCropper" class="cropper-overlay">
                            <div class="cropper-modal">
                                <h2 style="margin-top: 0px;margin-bottom: 0px;">Recorta la imagen</h2>
                                
                                <Cropper
                                ref="cropperRef"
                                :src="originalImageDataUrl"
                                :stencil-props="{}"></Cropper>
                                
                                <div class="cropper-actions">
                                    <button @click="cancelCrop" class="cancel-btn">Cancelar</button>
                                    <button @click="confirmCrop" class="crop-btn" :disabled="cropping">
                                        {{ cropping ? 'Procesando...' : 'Recortar' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Teleport>

                    <div class="pickSourceRow">
                        <div class="pickSource" v-on:click="takePicture(true)">
                            <div class="camera" />
                        </div>

                        <div class="pickSource" v-on:click="takePicture(false)">
                            <div class="gallery"/>
                        </div>
                    </div>
                    
                    <label class="checkbox-container">
                        <input type="checkbox" v-model="isPrimary" />
                        <span class="checkmark"></span>
                        Fijar como imagen principal
                    </label>
                </div>
            </div>
            <div :class="['container', pos != 1 ? 'metadata-closed' : '']">
                <h1 class="Header"> Metadatos </h1>

                <div class="metadataRow">
                    <p class="baseText marginless"> Fecha:  </p>
                    <BaseDateInput :selectedDate="date"/>
                </div>

                <div class="metadataRow" style="margin-top: 20px;">
                    <BaseTextField v-model="notes" type="textarea" placeholder="Notas..." :rows="4" />
                </div>
            </div>
        </div>
    </BaseAddEntryPage>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fontdiner+Swanky&family=IBM+Plex+Serif:ital,wght@0,500;0,700;1,500;1,700&family=Jim+Nightshade&display=swap');

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

.pictureContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    width: 95%;
    height: 70dvh;
    gap: 20px;

    margin-bottom: 110px;
}

.pickSourceRow {
    display: flex;
    width: 80%;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
    z-index: 1;
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

.camera {
    height: 70%;
    aspect-ratio: 1;
    background-color: black;
    mask-size: contain;
    cursor: pointer;
    mask-image: url('/icons/Camera.svg');
}

.gallery {
    height: 70%;
    aspect-ratio: 1;
    background-color: black;
    mask-size: contain;
    cursor: pointer;
    mask-image: url('/icons/Gallery.svg');
}

.image-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    flex: 1;
}

.image-wrapper {
    position: relative;
    display: inline-block;
}

.image-wrapper img {
    display: block;
    border-radius: 8px;
    width: 100%;
    height: 100%;
    aspect-ratio: initial;
    max-width: 100%;
    max-height: 50dvh;
}

.image-wrapper button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
}

.cropper-overlay {
    position: fixed;
    top: 0; 
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000000000;
}
    
.cropper-modal {
    background: var(--soil-surface);
    border-radius: 12px;
    padding: 1rem;      
    max-width: 90vw;   
    height: 60vh; 
    max-height: 60vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;      /* prevent scroll inside, cropper handles its own */
}

.cropper-modal .vue-advanced-cropper {
    flex: 1;
    min-height: 0;         /* important! allows cropper to shrink */
    width: 100%;
}
    
.cropper-actions {
    display: flex;
    justify-content: space-around;
    gap: 0.5rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    
    width: 100%;
}
    
.cancel-btn, .crop-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
}
    
.cancel-btn {
    background: var(--soil-secondary);
    color: white;
}
    
.crop-btn {
    background: var(--soil-primary);
    color: white;
}
    
.crop-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.baseText {
    font-family: 'IBM Plex Serif', serif;
    font-weight: 700;
    font-size: 20px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-family: 'IBM Plex Serif', serif;
  font-weight: 700;
  font-size: 20px;
  user-select: none;
}

/* Hide the default checkbox */
.checkbox-container input {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
}

/* Custom box */
.checkmark {
  height: 24px;
  width: 24px;
  background-color: var(--soil-surface);
  border: 2px solid black;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transition: background-color 0.2s;
}

/* Checkmark inside */
.checkmark::after {
  content: "";
  position: absolute;
  display: none;
  left: 7px;
  top: 2px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}

/* Show checkmark when checked */
.checkbox-container input:checked + .checkmark {
  background-color: var(--soil-primary);
}

.checkbox-container input:checked + .checkmark::after {
  display: block;
}

.metadataRow {
    display: flex;
    flex-direction: row;
    width: 80%;
    align-items: center;
    justify-content: space-between;
}
</style>