import { createRouter, createWebHistory } from 'vue-router'
import MainRegisterView from '@/components/MainRegisterView.vue'
import MainDescription from '@/components/MainDescription.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainDescription,
    },
    {
      path: '/register',
      name: 'main_register_view',
      component: MainRegisterView,
    }
  ],
})

export default router
