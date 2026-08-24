<template>
  <form :style="cssVars" class="space-y-2" @submit.prevent="submit">

    <div class="mb-6 space-y-1">
    <!-- Поле "Имя профиля" -->
    <div>
      <label class="block text-base font-medium text-[var(--input-text)] mb-1">
        Имя профиля
      </label>
      <input
        v-model="form.nick"
        type="text"
        placeholder="Anna Karenina"
        class="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--input-bg)] border-2 text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none transition-colors"
        :class="errors.nick ? 'border-[var(--status-error)] focus:border-[var(--status-error-focus)]' : 'border-[var(--input-border)] focus:border-[var(--input-focus-border)]'"
      />
      <p class="text-xs h-3">
        <span v-if="errors.nick" class="text-[var(--status-error)]">{{ errors.nick }}</span>
      </p>
    </div>

    <!-- Поле "Имя пользователя" -->
    <div>
      <label class="block text-base font-medium text-[var(--input-text)] mb-1">
        Имя пользователя
      </label>
      <input
        v-model="usernameCheck.value"
        @blur="usernameCheck.checkNow"
        type="text"
        placeholder="anna_reads"
        class="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--input-bg)] border-2 text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none transition-colors"
        :class="inputBorderClass(usernameCheck, errors.username)"
      />
      <p class="text-xs h-3">
        <span v-if="usernameCheck.checking" class="text-[var(--status-info)]">Проверяем...</span>
        <span v-else-if="errors.username" class="text-[var(--status-error)]">{{ errors.username }}</span>
        <span v-else-if="usernameCheck.error" class="text-[var(--status-error)]">{{ usernameCheck.error }}</span>
        <span v-else-if="usernameCheck.available === true" class="text-[var(--status-success)]">✓ Свободно</span>
      </p>
    </div>

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
        <span v-else-if="emailCheck.available === true" class="text-[var(--status-success)]">✓ Свободно</span>
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

    <!-- Поле "Повторите пароль" -->
    <div>
      <label class="block text-base font-medium text-[var(--input-text)] mb-1">
        Повторите пароль
      </label>
      <input
        v-model="form.confirmPassword"
        type="password"
        placeholder="••••••••"
        class="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--input-bg)] border-2 text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none transition-colors"
        :class="errors.confirmPassword ? 'border-[var(--status-error)] focus:border-[var(--status-error-focus)]' : 'border-[var(--input-border)] focus:border-[var(--input-focus-border)]'"
      />
      <p class="text-xs h-3">
        <span v-if="errors.confirmPassword" class="text-[var(--status-error)]">{{ errors.confirmPassword }}</span>
      </p>
    </div>
    </div>

    <div class="text-center mt-8">
      <!-- Кнопка и ссылка -->
      <AppButton :colors="pinkButton" type="submit" class="w-2/5 justify-center" :disabled="!canSubmit">
        Зарегистрироваться
      </AppButton>
    </div>

    <div class="text-center mt-4">
      <span class="text-[var(--text-main)]">Уже есть аккаунт?</span>
      <a
        @click="go_to_main_login"
        class="text-[var(--text-pink)] underline cursor-pointer hover:opacity-60 ml-1"
      >
        Войти
      </a>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import AppButton from './AppButton.vue'
import type { RegisterFormData, RegisterErrors, RegisterField } from '../../types/auth'
import { useRouter } from 'vue-router'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { useCheckAvailability } from '@/components/auth/сomposable/useCheckAvailability.ts'
import { greenText, pinkText, pinkButton, formInput, statusColors } from '@/assets/styles/palette'

const router = useRouter()

const usernameCheck = useCheckAvailability('username')
const emailCheck = useCheckAvailability('email')

const form = reactive<RegisterFormData>({
  nick: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive<RegisterErrors>({
  nick: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// CSS-переменные для полей и статусов
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

// Остальная логика: watch, inputBorderClass, canSubmit, submit, go_to_main_login
// (без goBack, так как кнопка "Назад" теперь в MainRegisterView)

watch(() => usernameCheck.value, () => { errors.username = '' })
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

const canSubmit = computed(() => {
  return usernameCheck.available === true &&
         emailCheck.available === true &&
         !usernameCheck.checking &&
         !emailCheck.checking
})

async function submit(): Promise<void> {
  errors.nick = ''
  errors.username = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  
  form.username = usernameCheck.value
  form.email = emailCheck.value

  if (!canSubmit.value) return
  
  try {
    const fp = await FingerprintJS.load()
    const fpResult = await fp.get()
    const fingerprint = fpResult.visitorId
    localStorage.setItem('fingerprint', fingerprint)

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json',
        'X-Fingerprint': fingerprint,
       },
      body: JSON.stringify(form),
    })

    if (!response.ok) {
      const error = await response.json() as { field: RegisterField; message: string }
      errors[error.field] = error.message
      return
    }
    
    const result = await response.json()
    router.push('/home')
  } 
  catch (error) {
    alert('Ошибка: ' + error)
  }
}

function goBack(): void {
  router.back()
}

function go_to_main_login(): void {
  router.push('/auth/login')
}
</script>