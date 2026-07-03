<template>
  <div
    class="p-6 rounded-2xl shadow-lg transition-colors"
    :style="{
      backgroundColor: colors.bg.card,
      color: colors.text.light,
    }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    :class="{ 'card-hover': hover }"
  >
    <component
      :is="icon"
      size="md"
      class="mx-auto mb-3"
      :style="{ color: colors.icon.light }"
    />
    <div class="font-bold mb-1" :style="{ color: colors.text.light }">
      {{ title }}
    </div>
    <div class="text-sm font-medium" :style="{ color: colors.text.light + 'CC' }">
      {{ description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Component } from 'vue'
import { colors } from '../../assets/styles/colors'

const props = defineProps<{
  title: string
  description: string
  icon: Component
}>()

const hover = ref(false)
</script>

<style scoped>
.card-hover {
  background-color: v-bind('colors.bg.cardHover') !important;
}
</style>