<template>
    <div class="min-h-screen bg-blue-950 text-center py-12 px-4">
        
        <div class="max-w-6xl mx-auto">
            
            <!-- Иконка книги -->
            <div class="mb-6">
                <svg class="w-16 h-16 mx-auto text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            </div>

            <!-- Заголовок -->
            <h1 class="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
                BookTook
            </h1>

            <!-- Подзаголовок -->
            <p class="text-xl md:text-2xl text-cyan-200 mb-4 font-light">
                Социальная сеть для тех, кто читает
            </p>

            <!-- Описание -->
            <p class="text-base md:text-lg text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                Делись прочитанными книгами, пиши обзоры, находи единомышленников 
                и следи за тем, что читают твои друзья
            </p>

            <!-- Кнопка -->
            <button 
                @click="start"
                class="group shadow-xl inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-full transition-all duration-200 hover:scale-105"
            >
                Начать
                <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </button>

            <!-- Фичи -->
            <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-white/60">
                
                <!-- Фича 1 -->
                <div class="p-6 rounded-2xl shadow-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div class="text-3xl mb-2">📚</div>
                    <div class="font-medium text-white mb-1">Моя полка</div>
                    <div class="text-sm">Собери свою библиотеку</div>
                </div>

                <!-- Фича 2 -->
                <div class="p-6 rounded-2xl shadow-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div class="text-3xl mb-2">✍️</div>
                    <div class="font-medium text-white mb-1">Обзоры</div>
                    <div class="text-sm">Делись мнением</div>
                </div>

                <!-- Фича 3 -->
                <div class="p-6 rounded-2xl shadow-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div class="text-3xl mb-2">👥</div>
                    <div class="font-medium text-white mb-1">Друзья</div>
                    <div class="text-sm">Находи читателей</div>
                </div>

            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
const start = () => {
    alert('Переход к регистрации...')
}
</script>