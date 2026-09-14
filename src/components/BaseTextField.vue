<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  type?: 'text' | 'textarea';
  rows?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const isTextarea = computed(() => props.type === 'textarea');

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});
</script>

<template>
  <textarea
    v-if="isTextarea"
    v-model="inputValue"
    class="text-input"
    :placeholder="placeholder"
    :rows="rows || 4"
  ></textarea>
  <input
    v-else
    v-model="inputValue"
    class="text-input"
    type="text"
    :placeholder="placeholder"
  />
</template>

<style scoped>
.text-input {
  font-family: 'IBM Plex Serif', serif;
  font-weight: 500;
  font-size: 16px;
  padding: 10px 12px;
  border: 2px solid black;
  border-radius: 8px;
  background-color: var(--soil-surface);
  color: var(--soil-text, #333);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.text-input:focus {
  border-color: var(--soil-primary);
  box-shadow: 0 0 0 3px rgba(var(--soil-primary-rgb, 0, 0, 0), 0.2);
}

.text-input::placeholder {
  color: rgba(0, 0, 0, 0.5);
  font-style: italic;
}
</style>