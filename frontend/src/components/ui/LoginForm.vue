<template>
  <form class="space-y-6" @submit.prevent="submit">    
    <div v-if="onCooldown" class="bg-amber-50 border border-amber-300 rounded-xl p-4">
      <p class="font-semibold text-amber-900">{{ cooldownMessage || 'Слишком много попыток входа' }}</p>
      <p class="text-sm text-amber-800/80 mt-1">Попробуйте через {{ cooldownLabel }}</p>
      <a @click="goRecover" class="inline-block mt-2 text-sm font-medium text-amber-900 underline cursor-pointer hover:opacity-70">
        Восстановить пароль
      </a>
    </div>

    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Email</label>
      <input 
        v-model="emailCheck.value" 
        @blur="emailCheck.checkNow"
        type="email" 
        placeholder="anna@mail.ru"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 text-[#2C341B] placeholder-[#94A59C] focus:outline-none transition-colors"
        :class="errors.email ? 'border-red-500 focus:border-red-600' : emailCheck.error ? 'border-red-500 focus:border-red-600' : emailCheck.available === true ? 'border-green-500 focus:border-green-600' : emailCheck.checking ? 'border-blue-400 focus:border-blue-500' : 'border-[#94A59C] focus:border-[#688A65]'"
      >
      <p class="text-sm mt-1 h-5">
        <span v-if="emailCheck.checking" class="text-blue-600">Проверяем...</span>
        <span v-else-if="errors.email" class="text-red-600">{{ errors.email }}</span>
        <span v-else-if="emailCheck.error" class="text-red-600">{{ emailCheck.error }}</span>
        <span v-else-if="emailCheck.available === true" class="text-green-600">✓ Найден</span>
      </p>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Пароль</label>
      <input 
        v-model="form.password" 
        type="password" 
        placeholder="••••••••"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 text-[#2C341B] placeholder-[#94A59C] focus:outline-none transition-colors"
        :class="errors.password ? 'border-red-500 focus:border-red-600' : 'border-[#94A59C] focus:border-[#688A65]'"
      >
      <p class="text-sm mt-1 h-5">
        <span v-if="errors.password" class="text-red-600">{{ errors.password }}</span>
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
import { reactive, computed, watch, ref, onUnmounted } from 'vue'
import AppButton from './AppButton.vue'
import { brownButton, darkText } from '@/assets/styles/palette.ts'
import type { LoginFormData, LoginField, LoginErrors } from '../../types/auth.ts'
import { useRouter } from 'vue-router'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { useCheckAvailability } from '@/components/auth/сomposable/useCheckAvailability.ts'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const emailCheck = useCheckAvailability('email', 'login')

const form = reactive<LoginFormData>({
  email: '',
  password: ''
})

const errors = reactive<LoginErrors>({
  email: '',
  password: ''
})

watch(() => emailCheck.value, () => { errors.email = '' })

const canSubmit = computed(() => emailCheck.available === true && !emailCheck.checking)

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

async function submit(): Promise<void> {
  errors.email = ''
  errors.password = ''
  
  if (!canSubmit.value || onCooldown.value) return
  
  form.email = emailCheck.value
  
  try {
    const fp = await FingerprintJS.load()
    const fpResult = await fp.get()
    const fingerprint = fpResult.visitorId
    localStorage.setItem('fingerprint', fingerprint)

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

    if (!response.ok) {
      const error = await response.json() as { field: LoginField; message: string }
      errors[error.field] = error.message
      return
    }

    await userStore.load()
    router.push('/home')
  }
  catch (error) {
    alert('Ошибка: ' + error)
  }
}

function go_to_main_register(): void {
  router.push('/auth/register')
}
</script>