<template>
  <form class="space-y-6" @submit.prevent="submit">
    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Имя пользователя</label>
      <input 
        v-model="form.nick" 
        type="text" 
        placeholder="anna_reads"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 border-[#94A59C] text-[#2C341B] placeholder-[#94A59C] focus:border-[#688A65] focus:outline-none transition-colors"
      >
    </div>

    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Имя пользователя</label>
      <input 
        v-model="form.username" 
        type="text" 
        placeholder="anna_reads"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 border-[#94A59C] text-[#2C341B] placeholder-[#94A59C] focus:border-[#688A65] focus:outline-none transition-colors"
      >
    </div>
    
    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Email</label>
      <input 
        v-model="form.email" 
        type="email" 
        placeholder="anna@mail.ru"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 border-[#94A59C] text-[#2C341B] placeholder-[#94A59C] focus:border-[#688A65] focus:outline-none transition-colors"
      >
    </div>
    
    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Пароль</label>
      <input 
        v-model="form.password" 
        type="password" 
        placeholder="••••••••"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 border-[#94A59C] text-[#2C341B] placeholder-[#94A59C] focus:border-[#688A65] focus:outline-none transition-colors"
      >
    </div>
    
    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Повторите пароль</label>
      <input 
        v-model="form.confirmPassword" 
        type="password" 
        placeholder="••••••••"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 border-[#94A59C] text-[#2C341B] placeholder-[#94A59C] focus:border-[#688A65] focus:outline-none transition-colors"
      >
    </div>
    
    <AppButton :colors="brownButton" type="submit" class="w-full justify-center">
      Зарегистрироваться
    </AppButton>
    
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import AppButton from './AppButton.vue'
import { brownButton } from '../../assets/styles/palette'
import type { RegisterFormData } from '../../types/auth'

const emit = defineEmits<{
  submit: [form: RegisterFormData]
}>()

const form = reactive<RegisterFormData>({
  nick: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

function submit(): void {
  emit('submit', { ...form })
}
</script>