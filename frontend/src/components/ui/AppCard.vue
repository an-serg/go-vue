<template>
  <div class="app-card" :style="style" @mouseenter="hover = true" @mouseleave="hover = false">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CardColors } from '@/types/ui'

const props = defineProps<{ colors: CardColors }>()
const hover = ref(false)

const style = computed(() => ({
  backgroundColor: hover.value ? props.colors.hoverBg : props.colors.bg,
  color: props.colors.text
}))
</script>

<style scoped>
.app-card {
  @apply p-6 rounded-2xl shadow-lg transition-all duration-300 cursor-pointer;
}
</style>