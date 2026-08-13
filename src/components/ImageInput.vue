<script setup lang="ts">
    import { ref } from 'vue';
    import { pickImage } from '@/services/camera';
    import { savePhoto } from '@/services/storage';
    import { addNewTree, getConnection } from '@/services/database';

    const props = defineProps<{
        treeAdded: () => void,
    }>();
    
    const imageBase64 = ref<string | null>(null);
    const imageDataUrl = ref<string | null>(null);
    const saving = ref(false);

    const treeName = ref<string>("");
    const treeSpecies = ref<string>("");
    
    async function addImage() {
        const image = await pickImage();
        if (image) {
            imageBase64.value = image.base64;
            imageDataUrl.value = image.dataUrl;
        }
    }
    
    function removeImage() {
        imageBase64.value = null;
        imageDataUrl.value = null;
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
    <div class="image-preview" v-if="imageDataUrl">
      <img :src="imageDataUrl" alt="Preview" />
      <button @click="removeImage">✕</button>
    </div>

    <button class="add-image-btn" @click="addImage">
      {{ imageDataUrl ? 'Cambiar imagen' : 'Añadir imagen' }}
    </button>

    <input
         v-model="treeName"
         type="text"
         placeholder="Nombre del árbol"
       />
   
       <!-- Species input -->
       <input
         v-model="treeSpecies"
         type="text"
         placeholder="Especie"
       />

    <button class="save-btn" :disabled="saving" @click="saveEntry">
      {{ saving ? 'Guardando...' : 'Guardar' }}
    </button>
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
</style>