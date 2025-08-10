<template>
  <div class="relative inline-block text-left">
    <button
      @click="isOpen = !isOpen"
      class="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <i :class="isDark ? 'fas fa-moon' : 'fas fa-sun'" class="mr-2"></i>
      {{ isDark ? 'تاریک' : 'روشن' }}
      <svg
        class="ml-2 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
    >
      <button
        @click="setTheme('light')"
        class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2"
      >
        <i class="fas fa-sun"></i>
        حالت روشن
      </button>
      <button
        @click="setTheme('dark')"
        class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2"
      >
        <i class="fas fa-moon"></i>
        حالت تاریک
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isOpen = ref(false)
const isDark = ref(false)

onMounted(() => {
  // اول چک می‌کنیم اگر قبلاً تم ذخیره شده، اعمال کنیم
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
    isDark.value = true
  } else {
    document.documentElement.classList.remove('dark')
    isDark.value = false
  }
})

function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
    isDark.value = true
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
    isDark.value = false
  }
  isOpen.value = false // بستن منو بعد انتخاب تم
}
</script>

<style>
/* برای فونت فارسی می‌تونی اینجا استایل اضافه کنی اگر لازم بود */
</style>
