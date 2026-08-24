<template>
  <div
    class="min-h-screen text-center py-12 px-4"
    :style="{ backgroundColor: colors.bg.main }"
  >
    <div class="max-w-6xl mx-auto">

      <!-- Главная иконка -->
      <BookIcon
        size="2xl"
        animated
        class="mx-auto mb-8"
        :style="{ color: colors.text.greenDark }"
      />

      <!-- Заголовок -->
      <h1
        class="text-5xl sm:text-7xl font-bold mb-4"
        :style="{ color: text.main }"
      >
        BookTook
      </h1>

      <!-- Подзаголовок -->
      <p
        class="text-xl sm:text-2xl mb-4"
        :style="{ color: text.subtitle }"
      >
        Социальная сеть для тех, кто читает
      </p>

      <!-- Описание -->
      <p
        class="text-base sm:text-lg mb-10 max-w-2xl mx-auto"
        :style="{ color: text.body }"
      >
        Делись прочитанными книгами, пиши обзоры, находи единомышленников
      </p>

      <!-- Кнопка -->
      <AppButton
        :colors="button"
        @click="goToRegistration"
      >
        Начать
      </AppButton>

      <!-- Карточки -->
      <div
        class="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
      >

        <!-- Моя полка -->
        <AppCard :colors="card">
          <BookIcon
            class="w-8 h-8 mx-auto mb-3"
            :style="{ color: card.icon }"
          />

          <div
            class="font-bold mb-1"
            :style="{ color: card.title }"
          >
            Моя полка
          </div>

          <div
            class="text-sm"
            :style="{ color: card.text }"
          >
            Собери свою библиотеку
          </div>
        </AppCard>


        <!-- Обзоры -->
        <AppCard :colors="card">
          <PenIcon
            class="w-8 h-8 mx-auto mb-3"
            :style="{ color: card.icon }"
          />

          <div
            class="font-bold mb-1"
            :style="{ color: card.title }"
          >
            Обзоры
          </div>

          <div
            class="text-sm"
            :style="{ color: card.text }"
          >
            Делись мнением
          </div>
        </AppCard>


        <!-- Друзья -->
        <AppCard :colors="card">
          <UsersIcon
            class="w-8 h-8 mx-auto mb-3"
            :style="{ color: card.icon }"
          />

          <div
            class="font-bold mb-1"
            :style="{ color: card.title }"
          >
            Друзья
          </div>

          <div
            class="text-sm"
            :style="{ color: card.text }"
          >
            Находи читателей
          </div>
        </AppCard>


        <!-- Хочу прочитать -->
        <AppCard :colors="card">
          <BookmarkIcon
            class="w-8 h-8 mx-auto mb-3"
            :style="{ color: card.icon }"
          />

          <div
            class="font-bold mb-1"
            :style="{ color: card.title }"
          >
            Хочу прочитать
          </div>

          <div
            class="text-sm"
            :style="{ color: card.text }"
          >
            Сохраняй в список
          </div>
        </AppCard>

      </div>

    </div>
  </div>
</template>


<script setup lang="ts">

import { useRouter } from 'vue-router'

import AppButton from '../components/ui/AppButton.vue'
import AppCard from '../components/ui/AppCard.vue'

import BookIcon from '../assets/icons/BookIcon.vue'
import PenIcon from '../assets/icons/PenIcon.vue'
import UsersIcon from '../assets/icons/UserIcon.vue'
import BookmarkIcon from '../assets/icons/BookmarkIcon.vue'

import { colors } from '@/assets/styles/colors'
import {
  greenButton,
  greenCard,
  greenText
} from '@/assets/styles/palette'


const button = greenButton
const card = greenCard
const text = greenText

const router = useRouter()


function goToRegistration(): void {
  router.push('/auth/register')
}

</script>