<template>
  <div class="min-h-screen bg-[#DDDFC2] text-[#2C341B] p-4 md:p-8">
    
    <div class="max-w-6xl mx-auto mb-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p class="text-[#688A65] text-lg mb-1">{{ greeting }},</p>
          <h1 class="text-4xl md:text-5xl font-bold tracking-tight">booklover_anna ✨</h1>
          <p class="text-[#2C341B]/70 mt-3 h-6 text-lg font-medium">{{ typewriterText }}</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="bg-[#2C341B] text-[#DDDFC2] px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <span class="animate-pulse">🔥</span> 12 дней
          </div>
          <div class="w-12 h-12 rounded-full bg-[#688A65] flex items-center justify-center text-white font-bold text-lg shadow-lg">
            АК
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto mb-8">
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-[#94A59C]/20">
        <p class="text-sm font-medium text-[#688A65] mb-3">Какое настроение для чтения сегодня?</p>
        <div class="flex gap-3 flex-wrap">
          <button v-for="m in moods" :key="m.key" @click="setMood(m.key)" 
            class="px-4 py-2 rounded-xl bg-[#DDDFC2] hover:bg-[#688A65] hover:text-white transition-all text-sm font-medium"
            :class="{ 'bg-[#688A65] text-white': activeMood === m.key }">
            {{ m.label }}
          </button>
        </div>
        <p v-if="moodResult" class="mt-3 text-sm font-medium text-[#2C341B] animate-fade-in">{{ moodResult }}</p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div class="lg:col-span-2 space-y-6">
        
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-[#94A59C]/20">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-xl font-bold">📚 Моя полка</h2>
            <span class="text-xs text-[#94A59C] bg-[#DDDFC2] px-3 py-1 rounded-full">наведи на книгу</span>
          </div>
          <div class="flex gap-2 items-end h-[220px] overflow-x-auto pb-2" style="perspective: 1000px;">
            <div v-for="(book, i) in books" :key="i" 
              class="relative flex-shrink-0 w-[100px] cursor-pointer transition-all duration-500 hover:-translate-y-3"
              :style="{ height: book.height + 'px' }">
              <div class="absolute inset-0 rounded-r-md rounded-l-sm shadow-xl flex flex-col justify-between p-3 border-l-4"
                :class="[book.bg, book.border]">
                <span class="text-xs font-bold leading-tight" :class="book.text">{{ book.title }}</span>
                <span class="text-[10px]" :class="book.authorColor">{{ book.author }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[#2C341B] rounded-2xl p-6 text-[#DDDFC2] relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-[#688A65] rounded-full blur-3xl opacity-20"></div>
          <h2 class="text-xl font-bold mb-2 relative z-10">🔮 Гадание на книге</h2>
          <p class="text-[#94A59C] text-sm mb-4 relative z-10">Задай вопрос духу библиотеки и кликни</p>
          <button @click="tellFortune" :disabled="fortuneLoading"
            class="relative z-10 bg-[#688A65] hover:bg-[#94A59C] text-white px-6 py-3 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-70">
            {{ fortuneLoading ? 'Тасуем страницы...' : (fortuneShown ? 'Спросить ещё' : 'Узнать судьбу') }}
          </button>
          <div v-if="fortuneShown" class="mt-4 relative z-10 animate-fade-in">
            <div class="bg-[#DDDFC2]/10 rounded-xl p-4 border border-[#688A65]/30">
              <p class="text-sm text-[#94A59C] mb-1">Тебе выпала книга:</p>
              <p class="text-lg font-bold text-white">{{ fortuneBook }}</p>
              <p class="text-sm text-[#DDDFC2] mt-2 italic">{{ fortuneAdvice }}</p>
            </div>
          </div>
        </div>

      </div>

      <div class="space-y-6">
        
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-[#94A59C]/20">
          <h3 class="font-bold mb-4">📊 Статистика</h3>
          <div class="space-y-4">
            <div v-for="(stat, i) in stats" :key="i">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm text-[#688A65]">{{ stat.label }}</span>
                <span class="text-2xl font-bold">{{ stat.value }}</span>
              </div>
              <div class="w-full bg-[#DDDFC2] rounded-full h-2">
                <div class="h-2 rounded-full transition-all duration-1000" 
                  :class="stat.color" :style="{ width: stat.percent + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 shadow-sm border border-[#94A59C]/20 text-center">
          <h3 class="font-bold mb-2">🌳 Дерево чтения</h3>
          <p class="text-xs text-[#94A59C] mb-4">Каждая книга — новая ветка</p>
          <div class="text-6xl mb-2">{{ treeEmoji }}</div>
          <p class="text-sm text-[#688A65] font-medium">{{ treeStatus }}</p>
          <div class="mt-3 flex justify-center gap-1">
            <div v-for="n in 5" :key="n" class="w-2 h-2 rounded-full"
              :class="n <= treeLevel ? 'bg-[#688A65]' : 'bg-[#DDDFC2] border border-[#94A59C]'"></div>
          </div>
          <p class="text-[10px] text-[#94A59C] mt-1">{{ treeLevel }} из 5 до следующего уровня</p>
        </div>

        <div class="bg-[#688A65] rounded-2xl p-5 text-white relative overflow-hidden">
          <div class="absolute -bottom-4 -right-4 text-8xl opacity-10">❝</div>
          <p class="text-sm font-medium relative z-10 mb-3">Цитата дня</p>
          <p class="text-lg italic leading-relaxed relative z-10">"Читать хорошие книги — значит разговаривать с самыми лучшими людьми прошедших времен."</p>
          <p class="text-sm text-[#DDDFC2] mt-3 relative z-10">— Рене Декарт</p>
        </div>

      </div>
    </div>

    <div class="max-w-6xl mx-auto mt-12 text-center text-[#94A59C] text-sm">
      <p>BookTook — потому что книги выбирают нас 🦉</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const greeting = ref('')
const typewriterText = ref('')
const activeMood = ref('')
const moodResult = ref('')

const fortuneLoading = ref(false)
const fortuneShown = ref(false)
const fortuneBook = ref('')
const fortuneAdvice = ref('')

const treeEmoji = ref('🌱')
const treeStatus = ref('Маленький росток')
const treeLevel = ref(3)

const books = [
  { title: 'Преступление и наказание', author: 'Достоевский', height: 180, bg: 'bg-[#2C341B]', text: 'text-[#DDDFC2]', authorColor: 'text-[#94A59C]', border: 'border-[#688A65]' },
  { title: '1984', author: 'Оруэлл', height: 195, bg: 'bg-[#688A65]', text: 'text-white', authorColor: 'text-[#DDDFC2]', border: 'border-[#2C341B]' },
  { title: 'Мастер и Маргарита', author: 'Булгаков', height: 170, bg: 'bg-[#94A59C]', text: 'text-white', authorColor: 'text-[#2C341B]', border: 'border-[#DDDFC2]' },
  { title: 'Война и мир', author: 'Толстой', height: 185, bg: 'bg-[#DDDFC2]', text: 'text-[#2C341B]', authorColor: 'text-[#688A65]', border: 'border-[#688A65]' },
  { title: 'Евгений Онегин', author: 'Пушкин', height: 175, bg: 'bg-[#2C341B]', text: 'text-[#DDDFC2]', authorColor: 'text-[#94A59C]', border: 'border-[#94A59C]' },
]

const moods = [
  { key: 'cozy', label: '☕ Уютное' },
  { key: 'epic', label: '⚔️ Эпичное' },
  { key: 'mystery', label: '🕵️ Загадочное' },
  { key: 'romantic', label: '🌹 Романтичное' },
  { key: 'sad', label: '🌧️ Грустное' },
]

const moodMap: Record<string, { book: string; advice: string }> = {
  cozy: { book: '«К чёрту на рога» Терри Пратчетт', advice: 'Завари крепкий чай и укутайся в плед.' },
  epic: { book: '«Властелин колец» Толкин', advice: 'Сегодня ты — герой своей истории.' },
  mystery: { book: '«Шерлок Холмс» Конан Дойл', advice: 'Внимание к деталям откроет истину.' },
  romantic: { book: '«Гордость и предубеждение» Остин', advice: 'Любовь ждёт тех, кто читает между строк.' },
  sad: { book: '«Маленький принц» Экзюпери', advice: 'Ты навсегда в ответе за тех, кого приручил.' },
}

const stats = [
  { label: 'Прочитано', value: 24, percent: 48, color: 'bg-[#688A65]' },
  { label: 'Страниц сегодня', value: 42, percent: 35, color: 'bg-[#2C341B]' },
  { label: 'Время чтения', value: 156, percent: 62, color: 'bg-[#94A59C]' },
]

const fortunes = [
  { book: '«451 градус по Фаренгейту»', advice: 'Иногда нужно сжечь старое, чтобы освободить место для нового.' },
  { book: '«Мастер и Маргарита»', advice: 'Рукописи не горят. Твои идеи важны.' },
  { book: '«Алиса в Стране чудес»', advice: 'Сегодня стоит свернуть с привычного пути.' },
  { book: '«Сто лет одиночества»', advice: 'Семья — это не только кровь, но и выбор.' },
  { book: '«Над пропастью во ржи»', advice: 'Будь хранителем искренности в этом мире.' },
  { book: '«Портрет Дориана Грея»', advice: 'Красота внутри важнее, чем снаружи.' },
]

function setMood(key: string) {
  activeMood.value = key
  const m = moodMap[key]
  if (!m) return
  moodResult.value = 'Рекомендация: ' + m.book
}

function tellFortune() {
  fortuneLoading.value = true
  setTimeout(() => {
    const f = fortunes[Math.floor(Math.random() * fortunes.length)]
    if (!f) {
      fortuneLoading.value = false
      return
    }
    fortuneBook.value = f.book
    fortuneAdvice.value = f.advice
    fortuneShown.value = true
    fortuneLoading.value = false
  }, 800)
}

const phrases = [
  'Книга — лучший друг молчаливый...',
  'Сегодня отличный день для новой главы',
  'Читай, мечтай, открывай миры',
  'Одна страница — один шаг к мудрости',
]
let phraseIdx = 0
let charIdx = 0
let deleting = false
let typeTimer: ReturnType<typeof setTimeout>

function type() {
  const current = phrases[phraseIdx]
  if (!current) return

  if (deleting) {
    typewriterText.value = current.substring(0, charIdx - 1)
    charIdx--
  } else {
    typewriterText.value = current.substring(0, charIdx + 1)
    charIdx++
  }

  let speed = deleting ? 30 : 80
  if (!deleting && charIdx === current.length) {
    speed = 2000
    deleting = true
  } else if (deleting && charIdx === 0) {
    deleting = false
    phraseIdx = (phraseIdx + 1) % phrases.length
    speed = 500
  }

  typeTimer = setTimeout(type, speed)
}

onMounted(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) greeting.value = 'Доброе утро'
  else if (hour >= 12 && hour < 17) greeting.value = 'Добрый день'
  else if (hour >= 17 && hour < 23) greeting.value = 'Добрый вечер'
  else greeting.value = 'Доброй ночи'

  type()
})

onUnmounted(() => {
  clearTimeout(typeTimer)
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>