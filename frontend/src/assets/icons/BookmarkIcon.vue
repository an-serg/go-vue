<template>
  <svg
    :class="sizeClass"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    stroke-width="1"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L7 21V5z"
    />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()

const sizeClass = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}[props.size || 'md']
</script>