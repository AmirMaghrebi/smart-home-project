<template>
  <div class="flex min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
    <!-- Sidebar -->
    <div
      :class="[
        'h-full w-64 bg-white/10 backdrop-blur-lg border-r border-white/20 transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'fixed top-0 left-0 z-50'
      ]"
    >
      <div class="p-6 border-b border-white/20">
        <h2 class="text-2xl font-bold">{{ $t('dashboard') }}</h2>
      </div>

      <nav class="p-4 flex flex-col space-y-2">
        <router-link
          to="/dashboard/create-place"
          class="w-full text-left p-3 rounded-xl hover:bg-white/20 transition-colors duration-200"
          active-class="bg-white/20"
        >
          🏠 {{ $t('home') }}
        </router-link>
        <br />
        <router-link
          to="/dashboard/reports"
          class="w-full text-left p-3 rounded-xl hover:bg-white/20 transition-colors duration-200"
          active-class="bg-white/20"
        >
          📊 {{ $t('reports') }}
        </router-link>
        <br />
        <router-link
          to="/dashboard/settings"
          class="w-full text-left p-3 rounded-xl hover:bg-white/20 transition-colors duration-200"
          active-class="bg-white/20"
        >
          ⚙️ {{ $t('settings') }}
        </router-link>
        
        
        <br />
        
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
        <h1 class="text-xl font-semibold">
          {{ $t('managing') }} "{{ parentName }}"
        </h1>
        <br></br>
        <br></br>
        <button @click="logout" class="p-2 rounded-lg hover:bg-red-600 bg-red-500">{{ $t('logout') }}</button>
      </header>

      <!-- Page Content -->
      <div class="p-6 flex-1">
        <!-- دکمه افزودن زیرمکان -->
        <button
          @click="showAddModal = true"
          class="glass-effect p-4 rounded-xl mb-6 hover:bg-white/20 transition-colors"
        >
          ＋ {{ $t('add_sub') }}
        </button>

        <!-- کارت‌های زیرمکان -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="sub in subLocations"
            :key="sub.id"
            class="glass-effect rounded-2xl overflow-hidden relative"
          >
            <!-- تصویر با دکمه‌های روی آن -->
            <div class="relative">
              <img
                :src="sub.image || 'https://via.placeholder.com/300x200?text=No+Image'"
                alt="زیرمکان"
                class="w-full h-48 object-cover"
              />
              <!-- دکمه‌های ویرایش و حذف -->
              <div class="absolute top-2 left-2 flex flex-col gap-2">
                <button
                  @click.stop="editSub(sub)"
                  class="p-2 w-8 h-8 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm flex items-center justify-center shadow-md"
                  :title="$t('edit')"
                >
                  ✏️
                </button>
                <button
                  @click.stop="deleteSub(sub.id)"
                  class="p-2 w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm flex items-center justify-center shadow-md"
                  :title="$t('delete')"
                >
                  🗑️
                </button>
              </div>
              <button @click="goToDevices(sub)"
              class="mt-3 p-2 rounded-lg bg-red-600 hover:bg-red-700"
                  :title="$t('manage_devices')">
                  {{ $t('manage_devices') }}
                </button>
            </div>

            <!-- محتوای پایین کارت -->
            <div class="p-4 text-center">
              <h3 class="text-xl font-bold text-center">{{ sub.name }}</h3>
            </div>
          </div>
        </div>

        <!-- مودال افزودن / ویرایش -->
        <div
          v-if="showAddModal || showEditModal"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div class="glass-effect p-6 rounded-2xl w-full max-w-md">
            <h3 class="text-xl font-bold mb-4">
              {{ showAddModal ? $t('add_sub') : $t('edit') }}
            </h3>

            <input
              v-model="currentSub.name"
              type="text"
              :placeholder="$t('sub_name')"
              class="w-full p-3 mb-4 bg-white/10 rounded-lg border border-white/20 text-center"
              dir="auto"
            />

            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="w-full p-3 mb-4 bg-white/10 rounded-lg border border-white/20"
            />

            <!-- پیش‌نمایش تصویر در ویرایش -->
            <div v-if="showEditModal && currentEditingImage" class="mb-4">
              <img
                :src="currentEditingImage"
                alt="پیش‌نمایش"
                class="h-32 mx-auto object-cover rounded"
              />
            </div>

            <div class="flex justify-end space-x-2 space-x-reverse">
              <button
                @click="closeModal"
                class="px-4 py-2 rounded-lg hover:bg-white/20"
              >
                {{ $t('cancel') }}
              </button>
              <button
                @click="saveSub"
                class="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                {{ $t('save') }}
              </button>
            </div>
          </div>
        </div>

        <!-- مودال تأیید حذف -->
        <div
          v-if="showDeleteConfirm"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div class="glass-effect p-6 rounded-2xl w-full max-w-xs text-center">
            
            <p>{{ $t('delete_confirm_text', { name: deleteTarget?.name }) }}</p>
            <div class="flex justify-center gap-2 mt-6">
              <button
                @click="showDeleteConfirm = false"
                class="px-4 py-2 rounded-lg hover:bg-white/20"
              >
                {{ $t('no') }}
              </button>
              <button
                @click="confirmDeleteSub"
                class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
              >
                {{ $t('yes') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

type Device = {
  id: string
  name: string
  type: 'light' | 'window' | 'ac' | 'camera' | 'door' | 'sensor'
  status: 'on' | 'off'
  image?: string
}

type SubLocation = {
  id: string
  name: string
  image?: string
  devices: Device[]
}

type CloudLocation = {
  id: string
  name: string
  image: string
  subLocations: SubLocation[]
}

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

// Sidebar
const sidebarOpen = ref(false)

// مکان اصلی
const parentName = ref('')

// زیرمکان‌ها
const subLocations = ref<Array<{ id: string; name: string; image?: string }>>([])

// مدیریت مودال‌ها
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)

// زیرمکان جاری
const currentSub = ref({ id: '', name: '', image: '' })
const currentEditingImage = ref<string | null>(null)
const deleteTarget = ref<{ id: string; name: string } | null>(null)

// بارگیری داده
onMounted(() => {
  const cloudId = route.params.id as string
  const allClouds = JSON.parse(localStorage.getItem('cloudCards') || '[]')
  const parent = allClouds.find((c: any) => c.id === cloudId)

  if (parent) {
    parentName.value = parent.name
    subLocations.value = parent.subLocations || []
  } else {
    router.push('/dashboard/create-place')
  }
})

// مدیریت تصویر
const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      currentSub.value.image = e.target?.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}

// باز کردن مودال افزودن
const openAdd = () => {
  currentSub.value = { id: '', name: '', image: '' }
  currentEditingImage.value = null
  showAddModal.value = true
}

// باز کردن مودال ویرایش
const editSub = (sub: { id: string; name: string; image?: string }) => {
  currentSub.value = { ...sub }
  currentEditingImage.value = sub.image || null
  showEditModal.value = true
}

// حذف زیرمکان
const deleteSub = (id: string) => {
  const sub = subLocations.value.find(s => s.id === id)
  if (sub) {
    deleteTarget.value = { id, name: sub.name }
    showDeleteConfirm.value = true
  }
}

// تأیید حذف
const confirmDeleteSub = () => {
  if (deleteTarget.value?.id) {
    subLocations.value = subLocations.value.filter(s => s.id !== deleteTarget.value?.id)
    saveToParent()
  }
  showDeleteConfirm.value = false
  deleteTarget.value = null
}

// ذخیره زیرمکان
const saveSub = () => {
  if (!currentSub.value.name) return

  if (showAddModal.value) {
    subLocations.value.push({
      id: Date.now().toString(),
      name: currentSub.value.name,
      image: currentSub.value.image
    })
  } else if (showEditModal.value && currentSub.value.id) {
    const index = subLocations.value.findIndex(s => s.id === currentSub.value.id)
    if (index !== -1) {
      subLocations.value[index] = { ...currentSub.value }
    }
  }

  saveToParent()
  closeModal()
}

// ذخیره در مکان اصلی
const saveToParent = () => {
  const cloudId = route.params.id as string
  const allClouds = JSON.parse(localStorage.getItem('cloudCards') || '[]')
  const updated = allClouds.map((c: any) => {
    if (c.id === cloudId) {
      return { ...c, subLocations: subLocations.value }
    }
    return c
  })
  localStorage.setItem('cloudCards', JSON.stringify(updated))
}

// بستن مودال
const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  currentSub.value = { id: '', name: '', image: '' }
  currentEditingImage.value = null
}

// خروج
const logout = () => {
  localStorage.removeItem('username')
  router.push('/login')
}

//تابع رفتن به دیوایس
const goToDevices = (sub: SubLocation) => {
  router.push(`/dashboard/devices/${route.params.id}/${sub.id}`)
}
</script>

<style scoped>
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>