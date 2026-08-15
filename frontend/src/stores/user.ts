import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { UserProfile, UpdateProfilePayload } from '@/types/user'

type Status = 'idle' | 'loading' | 'ready' | 'guest'

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null)
  const status = ref<Status>('idle')

  const isAuthenticated = computed(() => status.value === 'ready' && profile.value !== null)

  const displayName = computed(() => profile.value?.nick ?? 'Читатель')

  const initials = computed(() => {
    const [first = '', second = ''] = (profile.value?.nick ?? '').trim().split(/\s+/).filter(Boolean)
    if (!first) return '·'
    return (second ? first.charAt(0) + second.charAt(0) : first.slice(0, 2)).toUpperCase()
  })

  async function request(input: string, init?: RequestInit): Promise<Response> {
    const response = await fetch(input, { credentials: 'include', ...init })
    if (response.status !== 401) return response

    const refreshed = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: { 'x-fingerprint': localStorage.getItem('fingerprint') ?? '' },
    })
    if (!refreshed.ok) return response

    return fetch(input, { credentials: 'include', ...init })
  }

  async function load(): Promise<void> {
    status.value = 'loading'
    try {
      const response = await request('/api/users/me')
      if (!response.ok) {
        profile.value = null
        status.value = 'guest'
        return
      }
      profile.value = (await response.json()) as UserProfile
      status.value = 'ready'
    } catch {
      profile.value = null
      status.value = 'guest'
    }
  }

  async function ensureLoaded(): Promise<void> {
    if (status.value === 'idle') await load()
  }

  async function updateProfile(payload: UpdateProfilePayload): Promise<void> {
    const response = await request('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null
      throw new Error(body?.message ?? 'Не удалось сохранить изменения')
    }
    profile.value = (await response.json()) as UserProfile
  }

  function reset(): void {
    profile.value = null
    status.value = 'idle'
  }

  return { profile, status, isAuthenticated, displayName, initials, load, ensureLoaded, updateProfile, reset }
})
