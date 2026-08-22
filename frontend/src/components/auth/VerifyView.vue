<template>
  <div class="min-h-screen bg-[#DDDFC2] text-[#2C341B] py-12 px-4">
    <div class="max-w-md mx-auto">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-[#94A59C]/20 text-center">
        <template v-if="status === 'checking'">
          <span class="text-4xl">⏳</span>
          <h1 class="text-2xl font-bold mt-3">Подтверждаем почту</h1>
          <p class="text-[#2C341B]/70 mt-2">Одну секунду...</p>
        </template>

        <template v-else-if="status === 'done'">
          <span class="text-4xl">✅</span>
          <h1 class="text-2xl font-bold mt-3">Почта подтверждена</h1>
          <p class="text-[#2C341B]/70 mt-2">Открываем главную...</p>
        </template>

        <template v-else>
          <span class="text-4xl">✉️</span>
          <h1 class="text-2xl font-bold mt-3">Ссылка не сработала</h1>
          <p class="text-[#2C341B]/70 mt-2">{{ error }}</p>
          <RouterLink
            to="/auth/login"
            class="inline-block mt-6 bg-[#688A65] hover:bg-[#5A7A57] text-white font-medium px-5 py-2 rounded-xl transition-colors"
          >
            Перейти ко входу
          </RouterLink>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getFingerprint } from '@/composables/useFingerprint'
import { useUserStore } from '@/stores/user'

type Status = 'checking' | 'done' | 'failed'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const status = ref<Status>('checking')
const error = ref('')

function fail(message: string): void {
  status.value = 'failed'
  error.value = message
}

onMounted(async () => {
  const token = typeof route.query.token === 'string' ? route.query.token : ''

  if (!token) {
    fail('В ссылке нет токена. Откройте письмо ещё раз и нажмите кнопку в нём.')
    return
  }

  try {
    const fingerprint = await getFingerprint()

    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint': fingerprint,
      },
      body: JSON.stringify({ token }),
    })

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null
      fail(body?.message ?? 'Ссылка недействительна или устарела')
      return
    }

    await userStore.load()
    status.value = 'done'
    router.replace('/home')
  } catch {
    fail('Не удалось связаться с сервером. Попробуйте позже.')
  }
})
</script>
