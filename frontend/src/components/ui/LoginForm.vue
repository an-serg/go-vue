<template>
  <form class="space-y-6" @submit.prevent="submit">
    <div v-if="onCooldown" class="bg-amber-50 border border-amber-300 rounded-xl p-4">
      <p class="font-semibold text-amber-900">{{ cooldownMessage || 'Слишком много попыток входа' }}</p>
      <p class="text-sm text-amber-800/80 mt-1">Попробуйте через {{ cooldownLabel }}</p>
      <a @click="goRecover" class="inline-block mt-2 text-sm font-medium text-amber-900 underline cursor-pointer hover:opacity-70">
        Восстановить пароль
      </a>
    </div>

    <div v-if="needsVerification" class="bg-amber-50 border border-amber-300 rounded-xl p-4 text-left">
      <p class="font-semibold text-amber-900">Почта не подтверждена</p>
      <p class="text-sm text-amber-800/80 mt-1">
        Мы отправили письмо на <span class="font-medium">{{ form.email }}</span>.
        Перейдите по ссылке из него — вход выполнится сам.
      </p>
      <p v-if="resent" class="text-sm text-amber-900 mt-3 font-medium">Письмо отправлено ✓</p>
      <template v-else>
        <button
          type="button"
          class="mt-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="resending"
          @click="resendLetter"
        >
          {{ resending ? 'Отправляем...' : 'Отправить письмо ещё раз' }}
        </button>
        <p v-if="resendError" class="text-sm text-red-600 mt-2">{{ resendError }}</p>
      </template>
    </div>

    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Email</label>
      <input
        v-model="form.email"
        type="email"
        placeholder="anna@mail.ru"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 border-[#94A59C] text-[#2C341B] placeholder-[#94A59C] focus:outline-none focus:border-[#688A65] transition-colors"
      >
    </div>

    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Пароль</label>
      <input
        v-model="form.password"
        type="password"
        placeholder="••••••••"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 text-[#2C341B] placeholder-[#94A59C] focus:outline-none transition-colors"
        :class="error ? 'border-red-500 focus:border-red-600' : 'border-[#94A59C] focus:border-[#688A65]'"
      >
      <p class="text-sm mt-1 h-5">
        <span v-if="error" class="text-red-600">{{ error }}</span>
      </p>
    </div>

    <div>
      <AppButton :colors="brownButton" type="submit" class="w-full justify-center" :disabled="!canSubmit || onCooldown">
        Войти
      </AppButton>

      <a @click="go_to_main_register" class="text-base sm:text-lg max-w-2xl mt-3 mx-auto cursor-pointer hover:opacity-60 block" :style="{ color: darkText.main }">
        Зарегистрироваться
      </a>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onUnmounted } from 'vue'
import AppButton from './AppButton.vue'
import { brownButton, darkText } from '@/assets/styles/palette.ts'
import type { LoginFormData } from '../../types/auth.ts'
import { useRouter } from 'vue-router'
import { getFingerprint } from '@/composables/useFingerprint'
import { resendVerification } from '@/composables/useVerification'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = reactive<LoginFormData>({
  email: '',
  password: ''
})

const error = ref('')

const needsVerification = ref(false)
const resending = ref(false)
const resent = ref(false)
const resendError = ref('')

const canSubmit = computed(() => form.email.trim() !== '' && form.password !== '')

const cooldownUntil = ref(Number(localStorage.getItem('loginCooldownUntil')) || 0)
const now = ref(Date.now())
const cooldownMessage = ref('')
let cooldownTimer: ReturnType<typeof setInterval> | undefined

const cooldownRemaining = computed(() => Math.max(0, Math.ceil((cooldownUntil.value - now.value) / 1000)))
const onCooldown = computed(() => cooldownRemaining.value > 0)
const cooldownLabel = computed(() => {
  const total = cooldownRemaining.value
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

function startCooldownTimer(): void {
  if (cooldownTimer) return
  cooldownTimer = setInterval(() => {
    now.value = Date.now()
    if (cooldownRemaining.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = undefined
    }
  }, 1000)
}

function triggerCooldown(retryAfter: number, message: string): void {
  cooldownUntil.value = Date.now() + retryAfter * 1000
  cooldownMessage.value = message
  localStorage.setItem('loginCooldownUntil', String(cooldownUntil.value))
  startCooldownTimer()
}

function goRecover(): void {
  router.push('/auth/recover')
}

if (onCooldown.value) startCooldownTimer()
onUnmounted(() => { if (cooldownTimer) clearInterval(cooldownTimer) })

async function resendLetter(): Promise<void> {
  if (resending.value) return

  resending.value = true
  resendError.value = ''
  try {
    await resendVerification(form.email)
    resent.value = true
  } catch (err) {
    resendError.value = err instanceof Error ? err.message : 'Не удалось отправить письмо'
  } finally {
    resending.value = false
  }
}

async function submit(): Promise<void> {
  error.value = ''
  needsVerification.value = false
  resent.value = false
  resendError.value = ''

  if (!canSubmit.value || onCooldown.value) return

  try {
    const fingerprint = await getFingerprint()

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint': fingerprint,
      },
      body: JSON.stringify(form),
    })

    if (response.status === 429) {
      const data = await response.json() as { message: string; retryAfter: number }
      triggerCooldown(data.retryAfter, data.message)
      return
    }

    if (response.status === 403) {
      needsVerification.value = true
      return
    }

    if (!response.ok) {
      const data = await response.json() as { message: string }
      error.value = data.message
      return
    }

    await userStore.load()
    router.push('/home')
  }
  catch (err) {
    alert('Ошибка: ' + err)
  }
}

function go_to_main_register(): void {
  router.push('/auth/register')
}
</script>
