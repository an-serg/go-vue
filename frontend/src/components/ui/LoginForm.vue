<template>
  <form :style="cssVars" class="space-y-4" @submit.prevent="submit">
    <div class="mb-6 space-y-2">
      <!-- Поле "Email" -->
      <div>
        <label class="block text-base font-medium text-[var(--input-text)] mb-1">Email</label>
        <input
          v-model="emailCheck.value"
          @blur="emailCheck.checkNow"
          type="email"
          placeholder="anna@mail.ru"
          class="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--input-bg)] border-2 text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none transition-colors"
          :class="inputBorderClass(emailCheck, errors.email)"
        />
        <p class="text-xs h-3">
          <span v-if="emailCheck.checking" class="text-[var(--status-info)]">Проверяем...</span>
          <span v-else-if="errors.email" class="text-[var(--status-error)]">{{ errors.email }}</span>
          <span v-else-if="emailCheck.error" class="text-[var(--status-error)]">{{ emailCheck.error }}</span>
          <span v-else-if="emailCheck.available === true" class="text-[var(--status-success)]">✓ Найден</span>
        </p>
      </div>

      <!-- Поле "Пароль" -->
      <div>
        <label class="block text-base font-medium text-[var(--input-text)] mb-1">Пароль</label>
        <input
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          class="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--input-bg)] border-2 text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none transition-colors"
          :class="errors.password ? 'border-[var(--status-error)] focus:border-[var(--status-error-focus)]' : 'border-[var(--input-border)] focus:border-[var(--input-focus-border)]'"
        />
        <p class="text-xs h-3">
          <span v-if="errors.password" class="text-[var(--status-error)]">{{ errors.password }}</span>
        </p>
      </div>
    </div>

    <div class="text-center mt-8">
      <AppButton :colors="pinkButton" type="submit" class="w-1/4 justify-center" :disabled="!canSubmit">
        Войти
      </AppButton>
    </div>

    <div class="text-center mt-4">
      <span class="text-[var(--text-main)] block">Ещё нет аккаунта?</span>
      <a
        @click="go_to_main_register"
        class="text-[var(--text-pink)] underline cursor-pointer hover:opacity-60 block ml-1 "
      >
      Зарегистрироваться
      </a>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import AppButton from './AppButton.vue'
import { pinkButton, greenText, pinkText, formInput, statusColors } from '@/assets/styles/palette'
import type { LoginFormData, LoginField, LoginErrors } from '../../types/auth'
import { useRouter } from 'vue-router'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { useCheckAvailability } from '@/components/auth/сomposable/useCheckAvailability.ts'

const router = useRouter()

const emailCheck = useCheckAvailability('email', 'login')

const form = reactive<LoginFormData>({
  email: '',
  password: ''
})

const errors = reactive<LoginErrors>({
  email: '',
  password: ''
})

// CSS-переменные на основе palette
const cssVars = computed(() => ({
  '--input-bg': formInput.bg,
  '--input-border': formInput.border,
  '--input-focus-border': formInput.focusBorder,
  '--input-text': formInput.text,
  '--input-placeholder': formInput.placeholder,
  '--status-error': statusColors.error,
  '--status-error-focus': statusColors.errorFocus,
  '--status-success': statusColors.success,
  '--status-success-focus': statusColors.successFocus,
  '--status-info': statusColors.info,
  '--status-info-focus': statusColors.infoFocus,
  '--text-main': greenText.main,
  '--text-pink': pinkText.main,
}))

watch(() => emailCheck.value, () => { errors.email = '' })

function inputBorderClass(
  check: { available: boolean | null; checking: boolean; error: string },
  serverError: string
): string {
  if (serverError || check.error) return 'border-[var(--status-error)] focus:border-[var(--status-error-focus)]'
  if (check.available === true) return 'border-[var(--status-success)] focus:border-[var(--status-success-focus)]'
  if (check.checking) return 'border-[var(--status-info)] focus:border-[var(--status-info-focus)]'
  return 'border-[var(--input-border)] focus:border-[var(--input-focus-border)]'
}

const canSubmit = computed(() => emailCheck.available === true && !emailCheck.checking)

async function submit(): Promise<void> {
  errors.email = ''
  errors.password = ''
  
  if (!canSubmit.value) return
  
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

    if (!response.ok) {
      const error = await response.json() as { field: LoginField; message: string }
      errors[error.field] = error.message
      return
    }

    const loginResult = await response.json()
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