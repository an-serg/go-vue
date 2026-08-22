<template>
  <div class="min-h-screen bg-[#DDDFC2] text-[#2C341B] p-4 md:p-8">
    <div class="max-w-3xl mx-auto">

      <RouterLink
        to="/home"
        class="inline-flex items-center gap-2 text-[#688A65] hover:text-[#2C341B] transition-colors mb-6 font-medium"
      >
        <span class="text-lg">←</span> На главную
      </RouterLink>

      <template v-if="profile">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[#94A59C]/20 mb-6">
          <div class="flex items-center gap-5">
            <div class="w-20 h-20 rounded-full bg-[#688A65] flex items-center justify-center text-white font-bold text-2xl shadow-lg shrink-0 overflow-hidden">
              <img v-if="profile.avatar_url" :src="profile.avatar_url" :alt="displayName" class="w-full h-full object-cover" >
              <span v-else>{{ initials }}</span>
            </div>
            <div class="min-w-0">
              <h1 class="text-2xl md:text-3xl font-bold truncate">{{ displayName }}</h1>
              <p class="text-[#688A65] font-medium">@{{ profile.username }}</p>
              <p class="text-[#2C341B]/60 text-sm mt-1 truncate">{{ profile.email }}</p>
              <p v-if="memberSince" class="text-[#94A59C] text-xs mt-1">С нами с {{ memberSince }}</p>
            </div>
          </div>
        </div>

        <div v-if="!emailVerified" class="bg-amber-50 border border-amber-300 rounded-2xl p-5 mb-6">
          <div class="flex items-start gap-3">
            <span class="text-2xl shrink-0">✉️</span>
            <div class="flex-1">
              <p class="font-semibold text-amber-900">Подтвердите email</p>
              <p class="text-sm text-amber-800/80 mt-0.5">
                Адрес <span class="font-medium">{{ profile.email }}</span> ещё не подтверждён.
              </p>
              <p v-if="verificationSent" class="text-sm text-amber-900 mt-3 font-medium">
                Письмо отправлено — проверьте почту 📬
              </p>
              <template v-else>
                <button
                  class="mt-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  :disabled="verificationSending"
                  @click="requestVerification"
                >
                  {{ verificationSending ? 'Отправляем...' : 'Отправить письмо' }}
                </button>
                <p v-if="verificationError" class="text-sm text-red-600 mt-2">{{ verificationError }}</p>
              </template>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[#94A59C]/20 mb-6">
          <h2 class="text-lg font-bold mb-4">О себе</h2>
          <textarea
            v-model="bio"
            rows="4"
            placeholder="Расскажите о себе и любимых книгах..."
            class="w-full px-4 py-3 rounded-xl bg-[#DDDFC2] border-2 text-[#2C341B] placeholder-[#94A59C] focus:outline-none transition-colors resize-none"
            :class="bioOverLimit ? 'border-red-500 focus:border-red-600' : 'border-[#94A59C] focus:border-[#688A65]'"
          />
          <div class="flex items-center justify-between mt-2">
            <span class="text-sm" :class="bioOverLimit ? 'text-red-600' : 'text-[#94A59C]'">
              {{ bio.length }} / {{ BIO_LIMIT }}
            </span>
            <div class="flex items-center gap-3">
              <span v-if="bioSaved" class="text-sm text-green-600 font-medium">Сохранено ✓</span>
              <span v-else-if="bioError" class="text-sm text-red-600">{{ bioError }}</span>
              <button
                class="bg-[#688A65] hover:bg-[#5A7A57] text-white font-medium px-5 py-2 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="!bioDirty || bioOverLimit || bioSaving"
                @click="saveBio"
              >
                {{ bioSaving ? 'Сохраняем...' : 'Сохранить' }}
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[#94A59C]/20">
          <h2 class="text-lg font-bold mb-4">Настройки</h2>

          <div class="flex items-center justify-between py-3 border-b border-[#DDDFC2]">
            <div>
              <p class="font-medium">Язык интерфейса</p>
              <p class="text-sm text-[#94A59C]">Отображение приложения</p>
            </div>
            <select
              v-model="language"
              class="px-4 py-2 rounded-xl bg-[#DDDFC2] border-2 border-[#94A59C] text-[#2C341B] focus:outline-none focus:border-[#688A65] transition-colors cursor-pointer"
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>

          <div class="flex items-center justify-between py-3">
            <div>
              <p class="font-medium">Уведомления на почту</p>
              <p class="text-sm text-[#94A59C]">Новинки и рекомендации</p>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="emailNotifications"
              class="relative w-12 h-7 rounded-full transition-colors shrink-0"
              :class="emailNotifications ? 'bg-[#688A65]' : 'bg-[#94A59C]/40'"
              @click="emailNotifications = !emailNotifications"
            >
              <span
                class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform"
                :class="emailNotifications ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>

          <div class="flex items-center justify-end gap-3 mt-4">
            <span v-if="settingsSaved" class="text-sm text-green-600 font-medium">Сохранено ✓</span>
            <span v-else-if="settingsError" class="text-sm text-red-600">{{ settingsError }}</span>
            <button
              class="bg-[#688A65] hover:bg-[#5A7A57] text-white font-medium px-5 py-2 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="!settingsDirty || settingsSaving"
              @click="saveSettings"
            >
              {{ settingsSaving ? 'Сохраняем...' : 'Сохранить' }}
            </button>
          </div>
        </div>
      </template>

      <div v-else class="text-center text-[#94A59C] py-20">Загрузка профиля...</div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { resendVerification } from '@/composables/useVerification'

const BIO_LIMIT = 500

const store = useUserStore()
const { profile, initials, displayName } = storeToRefs(store)

const bio = ref('')
const language = ref('ru')
const emailNotifications = ref(false)

const bioSaving = ref(false)
const bioSaved = ref(false)
const bioError = ref('')

const settingsSaving = ref(false)
const settingsSaved = ref(false)
const settingsError = ref('')

const verificationSent = ref(false)
const verificationSending = ref(false)
const verificationError = ref('')

const emailVerified = computed(() => profile.value?.email_verified ?? false)

const memberSince = computed(() => {
  const iso = profile.value?.created_at
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
})

const bioDirty = computed(() => bio.value.trim() !== (profile.value?.bio ?? ''))
const bioOverLimit = computed(() => bio.value.length > BIO_LIMIT)

const settingsDirty = computed(
  () =>
    language.value !== (profile.value?.settings?.language ?? 'ru') ||
    emailNotifications.value !== (profile.value?.settings?.emailNotifications ?? false),
)

function syncFromProfile(): void {
  bio.value = profile.value?.bio ?? ''
  language.value = profile.value?.settings?.language ?? 'ru'
  emailNotifications.value = profile.value?.settings?.emailNotifications ?? false
}

watch(profile, syncFromProfile, { immediate: true })
watch(bio, () => { bioSaved.value = false })
watch([language, emailNotifications], () => { settingsSaved.value = false })

onMounted(() => store.ensureLoaded())

async function saveBio(): Promise<void> {
  if (!bioDirty.value || bioOverLimit.value || bioSaving.value) return
  bioSaving.value = true
  bioError.value = ''
  bioSaved.value = false
  try {
    await store.updateProfile({ bio: bio.value.trim() })
    bioSaved.value = true
  } catch (error) {
    bioError.value = error instanceof Error ? error.message : 'Ошибка сохранения'
  } finally {
    bioSaving.value = false
  }
}

async function saveSettings(): Promise<void> {
  if (!settingsDirty.value || settingsSaving.value) return
  settingsSaving.value = true
  settingsError.value = ''
  settingsSaved.value = false
  try {
    await store.updateProfile({
      settings: { language: language.value, emailNotifications: emailNotifications.value },
    })
    settingsSaved.value = true
  } catch (error) {
    settingsError.value = error instanceof Error ? error.message : 'Ошибка сохранения'
  } finally {
    settingsSaving.value = false
  }
}

async function requestVerification(): Promise<void> {
  if (verificationSending.value || !profile.value) return

  verificationSending.value = true
  verificationError.value = ''
  try {
    await resendVerification(profile.value.email)
    verificationSent.value = true
  } catch (error) {
    verificationError.value = error instanceof Error ? error.message : 'Не удалось отправить письмо'
  } finally {
    verificationSending.value = false
  }
}
</script>
