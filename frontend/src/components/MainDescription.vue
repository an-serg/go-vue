<template>
  <div class="min-h-screen bg-[#DDDFC2] text-center py-12 px-4">
    <div class="max-w-6xl mx-auto">
      
      <!-- Главная иконка — БОЛЬШАЯ -->
      <BookIcon size="2xl" animated class="mx-auto mb-8 text-[#2C341B]" />
        
      <h1 class="text-5xl sm:text-7xl font-bold mb-4" :style="{ color: text.main }">
        BookTook
      </h1>
      
      <p class="text-xl sm:text-2xl mb-4" :style="{ color: text.subtitle }">
        Социальная сеть для тех, кто читает
      </p>
      
      <p class="text-base sm:text-lg mb-10 max-w-2xl mx-auto" :style="{ color: text.body }">
        Делись прочитанными книгами, пиши обзоры, находи единомышленников
      </p>

      <AppButton :colors="button" @click="start">Начать</AppButton>

      <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:sizeClass">
        
        <AppCard :colors="card">
          <BookIcon class="w-8 h-8 mx-auto mb-3" :style="{ color: card.icon }" />
          <div class="font-bold mb-1" :style="{ color: card.title }">Моя полка</div>
          <div class="text-sm">Собери свою библиотеку</div>
        </AppCard>

        <AppCard :colors="card">
          <PenIcon class="w-8 h-8 mx-auto mb-3" :style="{ color: card.icon }" />
          <div class="font-bold mb-1" :style="{ color: card.title }">Обзоры</div>
          <div class="text-sm">Делись мнением</div>
        </AppCard>

        <AppCard :colors="card">
          <UsersIcon class="w-8 h-8 mx-auto mb-3" :style="{ color: card.icon }" />
          <div class="font-bold mb-1" :style="{ color: card.title }">Друзья</div>
          <div class="text-sm">Находи читателей</div>
        </AppCard>

        <AppCard :colors="card">
          <BookmarkIcon class="w-8 h-8 mx-auto mb-3" :style="{ color: card.icon }" />
          <div class="font-bold mb-1" :style="{ color: card.title }">Хочу прочитать</div>
          <div class="text-sm">Сохраняй в список</div>
        </AppCard>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import AppButton from '../components/ui/AppButton.vue'
import AppCard from '../components/ui/AppCard.vue'
import { brownButton, greenCard, darkText } from '../assets/styles/palette'
import BookIcon from '../assets/icons/BookIcon.vue'
import PenIcon from '../assets/icons/PenIcon.vue'
import UsersIcon from '../assets/icons/UserIcon.vue'
import BookmarkIcon from '../assets/icons/BookmarkIcon.vue'

const button = brownButton
const card = greenCard
const text = darkText

const start = () => alert('Переход к регистрации...')
</script>