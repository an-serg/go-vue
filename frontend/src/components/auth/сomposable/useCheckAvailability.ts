import { ref, watch, reactive } from 'vue'

export function useCheckAvailability(
  type: 'username' | 'email', 
  mode: 'register' | 'login' = 'register', 
  delay = 400
) {
  const value = ref('')
  const available = ref<boolean | null>(null)
  const checking = ref(false)
  const error = ref('')

  let timer: ReturnType<typeof setTimeout> | null = null
  let controller: AbortController | null = null

  const validateFormat = (val: string): string => {
    if (type === 'username') {
      if (val.length < 3) return 'Минимум 3 символа'
      if (!/^[a-zA-Z0-9_]+$/.test(val)) return 'Только буквы, цифры, _'
    }
    if (type === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Некорректный email'
    }
    return ''
  }

  const runCheck = async (val: string) => {
    const formatError = validateFormat(val)
    if (formatError) {
      available.value = false
      error.value = formatError
      checking.value = false
      return
    }

    if (controller) controller.abort()
    controller = new AbortController()

    checking.value = true
    error.value = ''

    try {
      const url = type === 'username'
        ? `/api/auth/username?username=${encodeURIComponent(val)}`
        : `/api/auth/email?email=${encodeURIComponent(val)}`

      const res = await fetch(url, { 
        signal: controller.signal,
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      })
      
      if (!res.ok) throw new Error(res.statusText)

      const text = await res.text()
      
      let data: { exists: boolean }
      try {
        data = text ? JSON.parse(text) : { exists: false }
      } catch {
        throw new Error('Invalid JSON')
      }
      
      if (mode === 'register') {
        available.value = !data.exists
        error.value = data.exists ? 'Уже занято' : ''
      } else {
        available.value = data.exists
        error.value = !data.exists ? 'Аккаунт не найден' : ''
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      
      if (err instanceof Error && err.message === 'Invalid JSON') {
        available.value = null
        error.value = 'Ошибка сервера'
      } else {
        available.value = null
        error.value = 'Ошибка сети'
      }
    } finally {
      checking.value = false
    }
  }

  watch(value, (val) => {
    if (!val) {
      available.value = null
      error.value = ''
      checking.value = false
      if (timer) clearTimeout(timer)
      return
    }

    const formatError = validateFormat(val)
    if (formatError) {
      available.value = false
      error.value = formatError
      checking.value = false
      if (timer) clearTimeout(timer)
      return
    }

    if (timer) clearTimeout(timer)
    checking.value = false
    timer = setTimeout(() => runCheck(val), delay)
  })

  const checkNow = () => {
    if (value.value) runCheck(value.value)
  }

  return reactive({
    value,
    available,
    checking,
    error,
    checkNow
  })
}