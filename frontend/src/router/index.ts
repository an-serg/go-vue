import { createRouter, createWebHistory } from 'vue-router'
import MainRegisterView from '@/components/auth/MainRegisterView.vue'
import MainDescription from '@/components/MainDescription.vue'
import MainLoginView from '@/components/auth/MainLoginView.vue'
import HomePage from '@/components/HomePage.vue'
import ProfilePage from '@/components/profile/ProfilePage.vue'
import { useUserStore } from '@/stores/user'

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
      name: 'main_home_page',
      component: HomePage,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
    },
  ],
})

const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
]

router.beforeEach(async (to) => {
  if (publicRoutes.includes(to.path)) {
    return true
  }

  const user = useUserStore()
  await user.ensureLoaded()

  return user.isAuthenticated ? true : '/auth/login'
})

export default router
