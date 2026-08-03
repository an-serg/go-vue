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
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
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
    lg: 'w-12 h-12' 
}[props.size || 'md']

</script>
