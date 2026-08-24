<template>
  <div
    class="min-h-screen grid grid-cols-1 md:grid-cols-2"
    :style="{ backgroundColor: colors.bg.main }"
  >
    <!-- ЛЕВАЯ ПОЛОВИНА: фоновое изображение, показываем правую часть -->
    <div
      class="hidden md:block h-screen bg-cover bg-right"
      :style="{ backgroundImage: `url(${booksPaint})` }"
    ></div>

    <!-- ПРАВАЯ ПОЛОВИНА -->
    <div class="flex flex-col px-8 py-6">
      <!-- Кнопка "Назад" -->
      <div class="flex items-center gap-2 cursor-pointer hover:opacity-60 mb-2" @click="goBack">
        <img :src="vectorIcon" alt="Назад" class="h-4 w-7" />
        <span class="text-base font-semibold" :style="{ color: text.main }">Назад</span>
      </div>

      <!-- Заголовки -->
      <div class="text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-2" :style="{ color: text.main }">
          Первый раз?
        </h1>
        <p class="text-xl sm:text-2xl mb-4" :style="{ color: text.main }">
          Давай зарегистрируемся!
        </p>
      </div>

      <!-- Форма -->
      <div class="flex-1 flex items-center justify-center">
        <div class="w-full max-w-xl">
          <RegisterForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { colors } from '@/assets/styles/colors'
import { greenText } from '@/assets/styles/palette'
import RegisterForm from '../ui/RegisterForm.vue'
import booksPaint from '@/assets/icons/books_paint.jpg'
import vectorIcon from '@/assets/icons/vector9.svg'

const router = useRouter()
const text = greenText

function goBack(): void {
  router.push('/')
}
</script>