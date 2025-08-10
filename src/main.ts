import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import './style.css'
import '@fortawesome/fontawesome-free/css/all.css'
import 'flag-icons/css/flag-icons.min.css'

import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import fa from './locales/fa.json'

const messages = {
  en,
  fa,
}

const i18n = createI18n({
  legacy: false,  // پیشنهاد شده
  locale: 'fa',   // زبان پیش‌فرض
  fallbackLocale: 'en',
  messages,
})

const app = createApp(App)
app.use(i18n)
app.use(router)
app.mount('#app')
