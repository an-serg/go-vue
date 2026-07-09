<template>
  <div class="min-h-screen bg-[#DDDFC2] text-center py-12 px-4">
    <div class="max-w-6xl mx-auto">
        
      <h1 class="text-xl sm:text-7xl font-bold mb-4" :style="{ color: text.main }">
        Первый раз?
      </h1>
      
      <p class="text-xl sm:text-2xl mb-4" :style="{ color: text.subtitle }">
        Давай зарегистрируемся!
      </p>

      <RegisterForm @submit="onSubmit" />

    </div>
  </div>
</template>
<script setup lang="ts">
import AppButton from '../components/ui/AppButton.vue'
import AppCard from '../components/ui/AppCard.vue'
import { brownButton, greenCard, darkText } from '../assets/styles/palette.ts'
import BookIcon from '../assets/icons/BookIcon.vue'
import PenIcon from '../assets/icons/PenIcon.vue'
import UsersIcon from '../assets/icons/UserIcon.vue'
import BookmarkIcon from '../assets/icons/BookmarkIcon.vue'
import RegisterForm from './ui/RegisterForm.vue'
import type { RegisterFormData } from '@/types/auth.ts'

const button = brownButton
const card = greenCard
const text = darkText

function onSubmit(form: RegisterFormData): void {
  console.log('Форма:', form)
  // Здесь потом будет вызов API
}

</script>