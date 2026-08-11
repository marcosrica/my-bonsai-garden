import './assets/main.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useTreeStore } from './stores/trees';

const app = createApp(App);
app.use(createPinia());
app.use(router);

// Pre-initialize database and load data before any component renders
const store = useTreeStore();
store.init().then(() => {
  app.mount('#app');
});