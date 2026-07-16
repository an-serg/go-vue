<template>
     <div class="min-h-screen bg-[#DDDFC2] text-center py-12 px-4">
    <div class="max-w-6xl mx-auto">
        
      <h1 class="text-xl sm:text-5xl font-bold mb-4" :style="{ color: text.main }">
        Уже регистрировался?
      </h1>
      
      <p class="text-xl sm:text-2xl mb-4" :style="{ color: text.subtitle }">
        Заходи в свою учётную запись!
      </p>

      <LoginForm />

    </div>
  </div>

</template>

<script setup lang="ts">
import { brownButton, darkText } from '@/assets/styles/palette.ts'
import LoginForm from '../ui/LoginForm.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const text = darkText

</script>