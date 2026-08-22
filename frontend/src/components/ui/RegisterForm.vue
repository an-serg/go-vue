<template>
  <form class="space-y-6" @submit.prevent="submit">
    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Имя профиля</label>
      <input 
        v-model="form.nick" 
        type="text" 
        placeholder="Anna Karenina"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 text-[#2C341B] placeholder-[#94A59C] focus:outline-none transition-colors"
        :class="errors.nick ? 'border-red-500 focus:border-red-600' : 'border-[#94A59C] focus:border-[#688A65]'"
      >
      <p class="text-sm mt-1 h-5">
        <span v-if="errors.nick" class="text-red-600">{{ errors.nick }}</span>
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Имя пользователя</label>
      <input 
        v-model="usernameCheck.value" 
        @blur="usernameCheck.checkNow"
        type="text" 
        placeholder="anna_reads"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 text-[#2C341B] placeholder-[#94A59C] focus:outline-none transition-colors"
        :class="inputBorderClass(usernameCheck, errors.username)"
      >
      <p class="text-sm mt-1 h-5">
        <span v-if="usernameCheck.checking" class="text-blue-600">Проверяем...</span>
        <span v-else-if="errors.username" class="text-red-600">{{ errors.username }}</span>
        <span v-else-if="usernameCheck.error" class="text-red-600">{{ usernameCheck.error }}</span>
        <span v-else-if="usernameCheck.available === true" class="text-green-600">✓ Свободно</span>
      </p>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Email</label>
      <input 
        v-model="emailCheck.value" 
        @blur="emailCheck.checkNow"
        type="email" 
        placeholder="anna@mail.ru"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 text-[#2C341B] placeholder-[#94A59C] focus:outline-none transition-colors"
        :class="inputBorderClass(emailCheck, errors.email)"
      >
      <p class="text-sm mt-1 h-5">
        <span v-if="emailCheck.checking" class="text-blue-600">Проверяем...</span>
        <span v-else-if="errors.email" class="text-red-600">{{ errors.email }}</span>
        <span v-else-if="emailCheck.error" class="text-red-600">{{ emailCheck.error }}</span>
        <span v-else-if="emailCheck.available === true" class="text-green-600">✓ Свободно</span>
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
      <label class="block text-sm font-medium text-[#2C341B] mb-1">Повторите пароль</label>
      <input 
        v-model="form.confirmPassword" 
        type="password" 
        placeholder="••••••••"
        class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 text-[#2C341B] placeholder-[#94A59C] focus:outline-none transition-colors"
        :class="errors.confirmPassword ? 'border-red-500 focus:border-red-600' : 'border-[#94A59C] focus:border-[#688A65]'"
      >
      <p class="text-sm mt-1 h-5">
        <span v-if="errors.confirmPassword" class="text-red-600">{{ errors.confirmPassword }}</span>
      </p>
    </div>
    
    <div>
      <AppButton :colors="brownButton" type="submit" class="w-full justify-center" :disabled="!canSubmit">
        Зарегистрироваться
      </AppButton>

      <a @click="go_to_main_login" class="text-base mt-3 sm:text-lg max-w-2xl mx-auto md-4 cursor-pointer hover:opacity-60 block" :color="darkText.main">
        Войти
      </a>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import AppButton from './AppButton.vue'
import { brownButton, darkText } from '@/assets/styles/palette.ts'
import type { RegisterFormData, RegisterErrors, RegisterField } from '../../types/auth'
import { useRouter } from 'vue-router'
import { useCheckAvailability } from '@/components/auth/сomposable/useCheckAvailability.ts'

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

watch(() => usernameCheck.value, () => { errors.username = '' })
watch(() => emailCheck.value, () => { errors.email = '' })

function inputBorderClass(
  check: { available: boolean | null; checking: boolean; error: string },
  serverError: string
): string {
  if (serverError || check.error) return 'border-red-500 focus:border-red-600'
  if (check.available === true) return 'border-green-500 focus:border-green-600'
  if (check.checking) return 'border-blue-400 focus:border-blue-500'
  return 'border-[#94A59C] focus:border-[#688A65]'
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
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!response.ok) {
      const error = await response.json() as { field: RegisterField; message: string }
      errors[error.field] = error.message
      return
    }

    router.push({ path: '/auth/verify-pending', query: { email: form.email } })
  } 
  catch (error) {
    alert('Ошибка: ' + error)
  }
}

function go_to_main_login(): void {
  router.push('/auth/login')
}
</script>