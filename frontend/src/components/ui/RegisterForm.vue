<template>
  <form class="space-y-6" @submit.prevent="submit">
    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Имя профиля</label>
      <input 
        v-model="form.nick" 
        type="text" 
        placeholder="Anna Karenina"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 border-[#94A59C] text-[#2C341B] placeholder-[#94A59C] focus:border-[#688A65] focus:outline-none transition-colors"
        :class="errors.nick ? 'border-red-500 focus:border-red-600' : 'border-[#94A59C] focus:border-[#688A65]'"
      >
      <p v-if="errors.nick" class="text-red-600 text-sm mt-1">{{ errors.nick }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Имя пользователя</label>
      <input 
        v-model="form.username" 
        type="text" 
        placeholder="anna_reads"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 border-[#94A59C] text-[#2C341B] placeholder-[#94A59C] focus:border-[#688A65] focus:outline-none transition-colors"
        :class="errors.username ? 'border-red-500 focus:border-red-600' : 'border-[#94A59C] focus:border-[#688A65]'"
      >
      <p v-if="errors.username" class="text-red-600 text-sm mt-1">{{ errors.username }}</p>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Email</label>
      <input 
        v-model="form.email" 
        type="email" 
        placeholder="anna@mail.ru"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 border-[#94A59C] text-[#2C341B] placeholder-[#94A59C] focus:border-[#688A65] focus:outline-none transition-colors"
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
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 border-[#94A59C] text-[#2C341B] placeholder-[#94A59C] focus:border-[#688A65] focus:outline-none transition-colors"
        :class="errors.password ? 'border-red-500 focus:border-red-600' : 'border-[#94A59C] focus:border-[#688A65]'"
      >
    </div>
    
    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Повторите пароль</label>
      <input 
        v-model="form.confirmPassword" 
        type="password" 
        placeholder="••••••••"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 border-[#94A59C] text-[#2C341B] placeholder-[#94A59C] focus:border-[#688A65] focus:outline-none transition-colors"
        :class="errors.confirmPassword ? 'border-red-500 focus:border-red-600' : 'border-[#94A59C] focus:border-[#688A65]'"
      >
      <p v-if="errors.confirmPassword" class="text-red-600 text-sm mt-1">{{ errors.confirmPassword }}</p>
    </div>
    
    <AppButton :colors="brownButton" type="submit" class="w-full justify-center mb-10">
      Зарегистрироваться
    </AppButton>

    <a @click="go_to_main_login" class="text-base sm:text-lg mb-10 max-w-2xl mx-auto md-4 cursor-pointer hover:opacity-60" :color="darkText.main">
      Войти
    </a>
    
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import AppButton from './AppButton.vue'
import { brownButton, darkText } from '@/assets/styles/palette.ts'; 
import type { RegisterFormData, RegisterErrors, RegisterField } from '../../types/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive<RegisterFormData>({
  nick: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive<RegisterErrors>({
  nick: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

async function submit(): Promise<void> {
  errors.nick = ''
  errors.username = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!response.ok) {
      const error = await response.json() as { field: RegisterField; message: string }
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

function go_to_main_login(): void {
  router.push('/auth/login')
}
</script>