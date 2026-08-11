import { createRouter, createWebHistory } from 'vue-router'
import TreesView from '@/views/TreesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TreesView,
    }
  ],
})

export default router
