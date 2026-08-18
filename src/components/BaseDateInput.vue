<script setup lang="ts">
    import { ref } from 'vue';

    const selectedDate = ref<string>('');

    const props = defineProps<{
        selectedDate: string,
    }>();
</script>

<template>
  <div class="date-field">
    <input
      id="date"
      type="date"
      v-model="props.selectedDate"
      class="date-input"
    />
  </div>
</template>

<style scoped>
.date-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 300px;
}

.date-input {
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
    -webkit-appearance: none;
    appearance: none;
}

.date-input:focus {
    border-color: var(--soil-primary);
    box-shadow: 0 0 0 3px rgba(var(--soil-primary-rgb, 0, 0, 0), 0.2);
}

.date-input::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.6;
    filter: invert(0.5); /* adjust as needed */
    transition: opacity 0.2s;
}

.date-input::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
}
</style>