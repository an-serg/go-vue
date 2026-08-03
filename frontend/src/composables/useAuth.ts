import { ref } from 'vue'

const isAuthenticated = ref(false)
const checked = ref(false)

export function useAuth() {
  async function checkAuth() {
    try {
      // Проверяем access token
      let response = await fetch('/api/auth/me', {
        credentials: 'include',
      })

      // Если access истек — пробуем обновить
      if (response.status === 401) {
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'x-fingerprint': localStorage.getItem('fingerprint') || '',
          },
        })

        // Если refresh успешный — повторяем /me
        if (refreshResponse.ok) {
          response = await fetch('/api/auth/me', {
            credentials: 'include',
          })
        }
      }

      isAuthenticated.value = response.ok
      checked.value = true

      return response.ok
    } catch {
      isAuthenticated.value = false
      checked.value = true

      return false
    }
  }

  function resetAuth() {
    isAuthenticated.value = false
    checked.value = false
  }

  return {
    isAuthenticated,
    checked,
    checkAuth,
    resetAuth,
  }
}