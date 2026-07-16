<template>
  <div class="min-h-screen bg-[#DDDFC2] text-center py-12 px-4">
    <div class="max-w-6xl mx-auto">
        
      <h1 class="text-5xl sm:text-5xl font-bold mb-4" :style="{ color: text.main }">
        Первый раз?
      </h1>
      
      <p class="text-xl sm:text-2xl mb-4" :style="{ color: text.subtitle }">
        Давай зарегистрируемся!
      </p>

      <RegisterForm />

    </div>
  </div>
</template>

<script setup lang="ts">
import { brownButton, darkText } from '@/assets/styles/palette.ts'
import RegisterForm from '../ui/RegisterForm.vue'
import type { RegisterFormData } from '@/types/auth.ts'
import { useRouter } from 'vue-router'

const text = darkText
const router = useRouter()

</script>