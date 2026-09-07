import { createRouter, createWebHistory } from 'vue-router'
import TreesView from '@/views/TreesView.vue'
import Reminders from '@/views/Reminders.vue'
import Bonsai from '@/views/Bonsai.vue'
import AddEntry from '@/views/AddEntry.vue'
import AddReminder from '@/views/AddReminder.vue'

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
    },
    {
      path: '/addEntry',
      name: 'Add entry',
      component: AddEntry,
    },
    {
      path: '/addReminder',
      name: 'Add reminder',
      component: AddReminder
    }
  ],
})

export default router
