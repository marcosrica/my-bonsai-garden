import { createRouter, createWebHistory } from 'vue-router'
import TreesView from '@/views/TreesView.vue'
import Reminders from '@/views/Reminders.vue'
import Bonsai from '@/views/Bonsai.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TreesView,
    },
    {
      path: '/reminders',
      name: 'reminders',
      component: Reminders
    },
    {
      path: '/bonsai',
      name: 'bonsai',
      component: Bonsai
    }
  ],
})

export default router
