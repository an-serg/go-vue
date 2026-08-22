<template>
  <div class="min-h-screen bg-[#DDDFC2] text-[#2C341B] py-12 px-4">
    <div class="max-w-md mx-auto">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-[#94A59C]/20 text-center">
        <span class="text-4xl">📬</span>

        <h1 class="text-2xl font-bold mt-3">Осталось подтвердить почту</h1>

        <p class="text-[#2C341B]/70 mt-2">
          Мы отправили письмо<span v-if="email"> на <span class="font-medium">{{ email }}</span></span>.
          Перейдите по ссылке из него — вход выполнится сам, пароль вводить не нужно.
        </p>

        <p class="text-sm text-[#94A59C] mt-3">
          Ссылка действует 24 часа. Письма нет — загляните в «Спам».
        </p>

        <div v-if="email" class="mt-6">
          <p v-if="sent" class="text-sm text-green-600 font-medium">Письмо отправлено ✓</p>
          <template v-else>
            <button
              class="bg-[#688A65] hover:bg-[#5A7A57] text-white font-medium px-5 py-2 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="sending"
              @click="resend"
            >
              {{ sending ? 'Отправляем...' : 'Отправить письмо ещё раз' }}
            </button>
            <p v-if="error" class="text-sm text-red-600 mt-2">{{ error }}</p>
          </template>
        </div>

        <RouterLink
          to="/auth/login"
          class="inline-block mt-6 text-sm font-medium text-[#688A65] hover:text-[#2C341B] transition-colors"
        >
          Уже подтвердили? Войти
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { resendVerification } from '@/composables/useVerification'

const route = useRoute()

const email = computed(() => (typeof route.query.email === 'string' ? route.query.email : ''))

const sending = ref(false)
const sent = ref(false)
const error = ref('')

async function resend(): Promise<void> {
  if (sending.value || !email.value) return

  sending.value = true
  error.value = ''
  try {
    await resendVerification(email.value)
    sent.value = true
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Не удалось отправить письмо'
  } finally {
    sending.value = false
  }
}
</script>
