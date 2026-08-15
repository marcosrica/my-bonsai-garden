<script setup lang="ts">
    import { ref, computed } from 'vue';
    import { Cropper } from 'vue-advanced-cropper';
    import 'vue-advanced-cropper/dist/style.css';   // import cropper CSS
    
    import { pickImage } from '@/services/camera';
    import { savePhoto } from '@/services/storage';
    import { addNewTree } from '@/services/database';
    
    const props = defineProps<{
      treeAdded: () => void,
    }>();

    const imageBase64 = ref<string | null>(null);      // cropped base64 (will be saved)
    const imageDataUrl = ref<string | null>(null);      // cropped data URL (preview)
    const originalImageDataUrl = ref<string | null>(null); // original image passed to cropper
    const showCropper = ref(false);
    const cropping = ref(false);
    const saving = ref(false);

    const treeName = ref<string>("");
    const treeSpecies = ref<string>("");
    
    async function addImage() {
        const image = await pickImage();
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
    
    async function saveEntry() {
        //Avoiding empty responses
        if (!treeName.value.trim() || !imageBase64.value || !treeSpecies.value.trim()) {
            alert('Por favor, rellene los campos');
            return;
        }

        //Setting loading in the frontend 
        saving.value = true;
      
        try {
            let imagePath: string | null = null;
        
            // Save image if present
            if (imageBase64.value) {
                const fileName = `tree_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
                const uri = await savePhoto(imageBase64.value, fileName);
                imagePath = uri;
            }

            if (imagePath != null) {
                // Insert into database (assuming tree_id optional for now)
                const result = await addNewTree(treeName.value.trim(), treeSpecies.value.trim(), imagePath);
                
                // Reset form
                removeImage();
                treeName.value = "";
                treeSpecies.value = "";
                
                if (result) {
                    alert('¡Guardado!');
                    props.treeAdded();
                }
                else {
                    alert('Hubo un error al guardar. Por favor, inténtelo de nuevo');
                }
            }
        }
        catch (error) {
            console.error('Hubo un error al guardar:', error);
            alert('Error al guardar el árbol');
        } finally {
            saving.value = false;
        }
    }
</script>

<template>
    <div class="feed-form">
        <!-- Preview of the cropped image -->
        <div class="image-preview" v-if="imageDataUrl">
            <img :src="imageDataUrl" alt="Preview" />
            <button @click="removeImage">✕</button>
        </div>

        <button class="add-image-btn" @click="addImage">
            {{ imageDataUrl ? 'Cambiar imagen' : 'Añadir imagen' }}
        </button>

        <!-- Existing inputs ... -->
        <input v-model="treeName" type="text" placeholder="Nombre del árbol" />
        <input v-model="treeSpecies" type="text" placeholder="Especie" />

        <button class="save-btn" :disabled="saving" @click="saveEntry">
            {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
        
        <!-- Crop modal -->
        <div v-if="showCropper" class="cropper-overlay">
            <div class="cropper-modal">
                <h2>Recorta la imagen</h2>

                <div class="cropper-actions">
                    <button @click="cancelCrop" class="cancel-btn">Cancelar</button>
                    <button @click="confirmCrop" class="crop-btn" :disabled="cropping">
                        {{ cropping ? 'Procesando...' : 'Recortar' }}
                    </button>
                </div>
                
                <Cropper
                ref="cropperRef"
                :src="originalImageDataUrl"
                :stencil-props="{}"></Cropper>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .feed-form {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 0.8rem;
    }
    
    .image-preview {
        position: relative;
        width: 80%;
    }
    
    .image-preview img {
        box-sizing: border-box;
        width: 100%;
        border-radius: 8px;
    }
    
    .image-preview button {
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
    
    .add-image-btn {
        background: var(--soil-clay);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.6rem;
        font-size: 1rem;
        cursor: pointer;
    }
    
    .save-btn {
        background: var(--soil-primary);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.8rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
    }
    
    .save-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    input[type="text"] {
        background: var(--soil-bg);
        border: 1px solid var(--soil-border);
        border-radius: 8px;
        padding: 0.6rem;
        font-size: 1rem;
        color: var(--soil-text);
    }

    .cropper-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .cropper-modal {
      background: var(--soil-surface);
      border-radius: 12px;
      padding: 1rem;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }
    
    .cropper-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
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
</style>