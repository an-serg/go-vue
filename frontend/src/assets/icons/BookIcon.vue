<template>
  <svg
    :class="[sizeClass, { 'book-icon--animated': animated }]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1"
    stroke-linecap="round"
    stroke-linejoin="round"
  >

    <!-- Левый лист -->
    <path
      class="book-left"
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"
    />

    <!-- Правый лист -->
    <path
      class="book-right"
      d="M12 6.253v13m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />

    <!-- Перелистывающийся лист -->
    <path
      class="book-flip"
      d="M12 6.253v13m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />

    <!-- Лист после перелистывания -->
    <path
      class="book-flipped"
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"
    />

    <!-- Корешок -->
    <line x1="12" y1="5" x2="12" y2="19" class="book-spine" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
type IconSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

const props = defineProps<{
  size?: IconSize
  sm?: IconSize
  md?: IconSize
  lg?: IconSize
  animated?: boolean
}>()

const sizeClass = computed(() => ({
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-20 h-20',
  '3xl': 'w-24 h-24'
}[props.size || 'md']))

</script>

<style scoped>
.book-icon--animated .book-flip {
  animation: flipAway 2.5s ease-in-out infinite;
  transform-origin: 12px 12px;
}

.book-icon--animated .book-flipped {
  animation: flipIn 2.5s ease-in-out infinite;
  transform-origin: 12px 12px;
}

@keyframes flipAway {
  0% { opacity: 1; transform: perspective(100px) rotateY(0deg); }
  45% { opacity: 0.6; transform: perspective(100px) rotateY(-90deg) translateX(-2px); }
  50% { opacity: 0; }
  100% { opacity: 0; transform: perspective(100px) rotateY(-90deg) translateX(-2px); }
}

@keyframes flipIn {
  0% { opacity: 0; transform: perspective(100px) rotateY(90deg) translateX(2px); }
  45% { opacity: 0; }
  50% { opacity: 0.6; transform: perspective(100px) rotateY(90deg) translateX(2px); }
  100% { opacity: 1; transform: perspective(100px) rotateY(0deg); }
}

.book-spine {
  opacity: 0.4;
}
</style>