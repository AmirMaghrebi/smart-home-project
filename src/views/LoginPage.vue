<template>


  <main
    class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4"
    :dir="currentLocale === 'fa' ? 'rtl' : 'ltr'"
    :lang="currentLocale"
  >
    <div class="glass-effect p-8 rounded-3xl max-w-md w-full">
      <div class="text-center mb-8">
        <div
          class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-home text-white text-3xl" aria-hidden="true"></i>
          <span class="sr-only">{{ $t('home') }}</span>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">{{ $t('home') }}</h1>
        <p class="text-gray-300">{{ $t('welcome') }}</p>
      </div>
<div class=" flex justify-center">
  <LanguageSwitcher />
</div>
<div class="mt-4 flex justify-center">
 
</div>
      <div class="space-y-4 mb-6">
        <button
          @click="loginWithPassword"
          class="login-option w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl flex items-center justify-center space-x-3 space-x-reverse"
        >
          <i class="fas fa-key" aria-hidden="true"></i>
          <span>{{ $t('login_with_password') }}</span>
        </button>

        <button
          @click="loginWithFingerprint"
          class="login-option w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl flex items-center justify-center space-x-3 space-x-reverse"
        >
          <i class="fas fa-fingerprint" aria-hidden="true"></i>
          <span>{{ $t('login_with_fingerprint') }}</span>
        </button>

        <button
          @click="loginWithFace"
          class="login-option w-full bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl flex items-center justify-center space-x-3 space-x-reverse"
        >
          <i class="fas fa-user-circle" aria-hidden="true"></i>
          <span>{{ $t('login_with_face') }}</span>
        </button>
      </div>


      <div v-if="showPasswordInput" class="space-y-4">
        <div class="relative">
          <input
            v-model="username"
            type="text"
            autocomplete="username"
            class="w-full bg-white/10 text-white p-4 pr-12 rounded-xl border border-white/20 focus:border-blue-500 focus:outline-none placeholder:text-gray-300"
            :placeholder="$t('enter_username')"
            @keyup.enter="authenticate"
          />
          <i
            class="fas fa-user absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg pointer-events-none"
            aria-hidden="true"
          ></i>
        </div>

        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            class="w-full bg-white/10 text-white p-4 pl-12 rounded-xl border border-white/20 focus:border-blue-500 focus:outline-none placeholder:text-gray-300"
            :placeholder="$t('enter_password')"
            @keyup.enter="authenticate"
          />
          <button
            type="button"
            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
            :aria-pressed="showPassword"
            :title="showPassword ? $t('hide_password') : $t('show_password')"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" aria-hidden="true"></i>
            <span class="sr-only">{{ showPassword ? $t('hide_password') : $t('show_password') }}</span>
          </button>
        </div>

        <button
          @click="authenticate"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl"
        >
          {{ $t('login') }}
        </button>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { locale, t } = useI18n()
const router = useRouter()

const currentLocale = ref(locale.value)
const showPasswordInput = ref(false)
const showPassword = ref(false)
const username = ref('')
const password = ref('')

watch(currentLocale, (newLocale) => {
  locale.value = newLocale
})

function loginWithPassword() {
  showPasswordInput.value = true
}

function loginWithFingerprint() {
  alert(t('detecting_fingerprint'))
  setTimeout(() => {
    localStorage.setItem('username', 'کاربر اثرانگشتی')
    router.push('/dashboard')
  }, 1500)
}

function loginWithFace() {
  alert(t('detecting_face'))
  setTimeout(() => {
    localStorage.setItem('username', 'کاربر تشخیص چهره')
    router.push('/dashboard')
  }, 2000)
}

function authenticate() {
  if (!username.value || !password.value) {
    alert(t('fill_all_fields'));
    return;
  }

  const DEFAULT_CREDENTIALS = [
    { username: "admin", password: "123456" },
    { username: "user", password: "654321" }
  ];

  const isValid = DEFAULT_CREDENTIALS.some(
    cred => cred.username === username.value && cred.password === password.value
  );

  if (isValid) {
    localStorage.setItem('username', username.value);
    router.push({ name: 'Dashboard' }); // مستقیم برو به داشبورد
  } else {
    alert(t('invalid_credentials')); // فقط اگه اشتباهه پیام بده
  }
}


</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Vazirmatn', sans-serif;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-option {
  transition: all 0.3s ease;
}

.login-option:hover {
  transform: scale(1.05);
}

</style>
