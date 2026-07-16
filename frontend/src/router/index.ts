import { createRouter, createWebHistory } from 'vue-router'
import MainRegisterView from '@/components/auth/MainRegisterView.vue'
import MainDescription from '@/components/MainDescription.vue'
import MainLoginView from '@/components/auth/MainLoginView.vue'
import HomePage from '@/components/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainDescription,
    },
    {
      path: '/auth/register',
      name: 'main_register_view',
      component: MainRegisterView,
    },
    {
      path: '/auth/login',
      name: 'main_login_view',
      component: MainLoginView,
    },
    {
      path: '/home',
      name: 'main_hime_page',
      component: HomePage,
    },
  ],
})

export default router
