<template>
  <div class="relative inline-block text-left" :dir="currentLocale === 'fa' ? 'rtl' : 'ltr'">
    <button
      @click.stop="open = !open"
      class="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg hover:bg-white/20 transition border border-white/20"
    >
      <span :class="`fi fi-${currentFlag}`"></span>
      <span class="mx-2">{{ currentLabel }}</span>
      <svg
        class="w-4 h-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <div
      v-if="open"
      class="absolute mt-2 w-40 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg z-50"
      @click.stop
    >
      <div
        v-for="lang in languages"
        :key="lang.code"
        @click="setLanguage(lang.code)"
        class="flex items-center px-4 py-2 hover:bg-white/20 cursor-pointer transition"
        :class="{ 'flex-row-reverse': currentLocale === 'fa' }"
      >
        <span :class="`fi fi-${lang.flag}`"></span>
        <span class="mx-2">{{ lang.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'flag-icons/css/flag-icons.min.css'
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const open = ref(false)

const languages = [
  { code: 'en', label: 'English', flag: 'gb' },
  { code: 'fa', label: 'فارسی', flag: 'ir' }
]

const currentFlag = ref(languages.find(l => l.code === locale.value)?.flag || 'gb')
const currentLabel = ref(languages.find(l => l.code === locale.value)?.label || 'English')

const currentLocale = computed(() => locale.value)

watch(locale, (newLocale) => {
  const lang = languages.find(l => l.code === newLocale)
  if (lang) {
    currentFlag.value = lang.flag
    currentLabel.value = lang.label
  }
})

function setLanguage(code) {
  locale.value = code
  open.value = false
}

function onClickOutside() {
  open.value = false
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped>
button, .absolute {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>
