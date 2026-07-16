<template>
  <form class="space-y-6" @submit.prevent="submit">    
    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Email</label>
      <input 
        v-model="form.email" 
        type="email" 
        placeholder="anna@mail.ru"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 text-[#2C341B] placeholder-[#94A59C] focus:outline-none transition-colors"
        :class="errors.email ? 'border-red-500 focus:border-red-600' : 'border-[#94A59C] focus:border-[#688A65]'"
      >
      <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Пароль</label>
      <input 
        v-model="form.password" 
        type="password" 
        placeholder="••••••••"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 text-[#2C341B] placeholder-[#94A59C] focus:outline-none transition-colors"
        :class="errors.password ? 'border-red-500 focus:border-red-600' : 'border-[#94A59C] focus:border-[#688A65]'"
      >
      <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
    </div>
    
    <AppButton :colors="brownButton" type="submit" class="w-full justify-center mb-10">
      Войти
    </AppButton>

    <a @click="go_to_main_register" class="text-base sm:text-lg mb-10 max-w-2xl mx-auto cursor-pointer hover:opacity-60" :style="{ color: darkText.main }">
      Зарегистрироваться
    </a>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import AppButton from './AppButton.vue'
import { brownButton, darkText } from '@/assets/styles/palette.ts'
import type { LoginFormData, LoginField, LoginErrors } from '../../types/auth.ts'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive<LoginFormData>({
  email: '',
  password: ''
})

const errors = reactive<LoginErrors>({
  email: '',
  password: ''
})

async function submit(): Promise<void> {
  errors.email = ''
  errors.password = ''
  
  try {
    const response = await fetch('/auth/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!response.ok) {
      const error = await response.json() as { field: LoginField; message: string }
      errors[error.field] = error.message
      return
    }

    const result = await response.json()
    router.push('/home')
  }
  catch (error) {
    alert('Ошибка: ' + error)
  }
}

function go_to_main_register(): void {
  router.push('/auth/register')
}
</script>