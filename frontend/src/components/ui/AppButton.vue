<template>
  <button class="app-button" :style="style" @mouseenter="hover = true" @mouseleave="hover = false" @click="emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ButtonColors } from '@/types/ui'

const props = defineProps<{ colors: ButtonColors }>()
const hover = ref(false)

const style = computed(() => ({
  backgroundColor: hover.value ? props.colors.hoverBg : props.colors.bg,
  color: props.colors.text
}))

const emit = defineEmits<{ click: [] }>()
</script>

<style scoped>
.app-button {
  @apply inline-flex items-center px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl;
}
</style>