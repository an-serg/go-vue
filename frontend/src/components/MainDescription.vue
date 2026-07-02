<template>
    <div class="min-h-screen bg-[#DDDFC2] text-center py-12 px-4">
        
        <div class="max-w-6xl mx-auto">
            
            <!-- Иконка книги -->
            <div class="mb-8">
                <svg class="w-12 h-12 mx-auto text-[#2C341B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" 
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            </div>

            <!-- Заголовок -->
            <h1 class="text-5xl md:text-7xl font-bold text-[#2C341B] mb-4 tracking-tight">
                BookTook
            </h1>

            <!-- Подзаголовок -->
            <p class="text-xl md:text-2xl font-medium text-[#2C341B]/80 mb-4">
                Социальная сеть для тех, кто читает
            </p>

            <!-- Описание -->
            <p class="text-base md:text-lg font-medium text-[#2C341B]/60 mb-10 max-w-2xl mx-auto leading-relaxed">
                Делись прочитанными книгами, пиши обзоры, находи единомышленников 
                и следи за тем, что читают твои друзья
            </p>

            <!-- Кнопка коричневатая -->
            <button 
                @click="start"
                class="group inline-flex items-center px-8 py-3 text-lg text-[#DDDFC2] font-medium bg-[#5C4A3A] hover:bg-[#7A6450] rounded-full transition-all duration-300 shadow-xl"
            >
                Начать
                <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </button>

            <!-- Фичи с фоном 688A65 -->
            <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-[#DDDFC2]">
                
                <!-- Фича 1 -->
                <div class="p-6 rounded-2xl shadow-lg bg-[#70896dc5] hover:bg-[#688a65cf] transition-colors">
                    <svg class="w-8 h-8 mx-auto mb-3 text-[#DDDFC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <div class="text-[#DDDFC2] font-bold mb-1">Моя полка</div>
                    <div class="text-sm font-medium text-[#DDDFC2]/80">Собери свою библиотеку</div>
                </div>

                <!-- Фича 2 -->
                <div class="p-6 rounded-2xl shadow-lg bg-[#70896dc5] hover:bg-[#688a65cf] transition-colors">
                    <svg class="w-8 h-8 mx-auto mb-3 text-[#DDDFC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <div class="text-[#DDDFC2] font-bold mb-1">Обзоры</div>
                    <div class="text-sm font-medium text-[#DDDFC2]/80">Делись мнением</div>
                </div>

                <!-- Фича 3 -->
                <div class="p-6 rounded-2xl shadow-lg bg-[#70896dc5] hover:bg-[#688a65cf] transition-colors">
                    <svg class="w-8 h-8 mx-auto mb-3 text-[#DDDFC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <div class="text-[#DDDFC2] font-bold mb-1">Друзья</div>
                    <div class="text-sm font-medium text-[#DDDFC2]/80">Находи читателей</div>
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