<template>
  <div class="flex min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
    <!-- Sidebar -->
    <div
      :class="['h-full w-64 bg-white/10 backdrop-blur-lg border-r border-white/20 transition-transform duration-300', 
              sidebarOpen ? 'translate-x-0' : '-translate-x-full', 'fixed top-0 left-0 z-50']"
    >
      <div class="p-6 border-b border-white/20">
        <h2 class="text-2xl font-bold">{{ $t('dashboard') }}</h2>
      </div>

      <nav class="p-4 flex flex-col space-y-2">
        <router-link 
          to="/dashboard/create-place" 
          class="w-full text-left p-3 rounded-xl hover:bg-white/20 transition-colors duration-200"
          active-class="bg-white/20"
        >🏠 {{ $t('home') }}</router-link>
<br>
        <router-link 
          to="/dashboard/reports" 
          class="w-full text-left p-3 rounded-xl hover:bg-white/20 transition-colors duration-200"
          active-class="bg-white/20"
        >📊 {{ $t('reports') }}</router-link>
<br>
        <router-link 
          to="/dashboard/settings" 
          class="w-full text-left p-3 rounded-xl hover:bg-white/20 transition-colors duration-200"
          active-class="bg-white/20"
        >⚙️ {{ $t('settings') }}</router-link>
<br>

         <div class="mt-auto pt-6">
          <LanguageSwitcher />
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div 
      class="flex-1 flex flex-col transition-all duration-300"
      :style="{ marginLeft: sidebarOpen ? '16rem' : '0' }"
    >
      <!-- Topbar -->
      <header class="flex items-center justify-between p-4 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 rounded-lg hover:bg-white/20 z-60">
          <i class="fas fa-bars text-lg"></i>
        </button>
        <h1 class="text-xl font-semibold">{{ username }} </h1>
        
        <h1 class="text-xl font-semibold">{{ $t('welcome') }}</h1>
        <br></br>
<br>

        <button @click="logout" class="p-2 rounded-lg hover:bg-red-600 bg-red-500">{{ $t('logout') }}</button>
      </header>

      <!-- Dynamic Content -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const router = useRouter()
const sidebarOpen = ref(false)
const username = localStorage.getItem('username') || 'کاربر'

function logout() {
  localStorage.removeItem('username')
  router.push('/login')
}


</script>

<style scoped>
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>