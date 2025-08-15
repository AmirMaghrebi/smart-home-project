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
          {{ $t('devices_in') }} "{{ subLocationName }}"
        </h1>
        <button @click="logout" class="p-2 rounded-lg hover:bg-red-600 bg-red-500">{{ $t('logout') }}</button>
      </header>

      <!-- Page Content -->
      <div class="p-4 flex-1 overflow-y-auto">
        <!-- دکمه افزودن دستگاه -->
        <button
          @click="showAddModal = true"
          class="glass-effect px-4 py-2 rounded-lg mb-4 hover:bg-white/20 text-sm"
        >
          + {{ $t('add_device') }}
        </button>

        <!-- لیست دستگاه‌ها -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div
            v-for="device in devices"
            :key="device.id"
            class="glass-effect rounded-xl overflow-hidden relative w-48 h-64 mx-auto flex flex-col items-center"
          >
            <!-- سه‌نقطه منو -->
            <button
              @click="showDeviceMenu(device)"
              class="absolute top-2 left-2 p-1 bg-white/20 rounded"
            >
              <i class="fas fa-ellipsis-v text-sm"></i>
            </button>

            <!-- آیکون و کنترل -->
            <div class="flex flex-col items-center p-4 mt-2">
              <!-- آیکون بر اساس نوع -->
              <Icon
                :icon="getIcon(device)"
                class="w-16 h-16"
                :class="device.type === 'door_opener' ? 'text-blue-300' : 'text-yellow-300'"
              />

              <h3 class="mt-3 text-lg font-bold">{{ device.name }}</h3>

              <!-- سوییچ برای لامپ -->
              <label
                v-if="device.type === 'switch_1_channel'"
                class="mt-4 inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  :checked="device.status === 'on'"
                  @change="toggleDevice(device)"
                  class="sr-only peer"
                />
                <div
                  class="relative w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"
                ></div>
              </label>

              <!-- کلید فشاری برای درب بازکن -->
              <button
                v-if="device.type === 'door_opener'"
                @mousedown="pressDoorOpener(device)"
                @touchstart="pressDoorOpener(device)"
                @mouseup="releaseDoorOpener(device)"
                @touchend="releaseDoorOpener(device)"
                :class="[
                  'mt-4 w-16 h-16 rounded-full flex items-center justify-center transition',
                  device.status === 'on' ? 'bg-green-600 scale-105' : 'bg-gray-600'
                ]"
              >
                <i class="fas fa-hand-pointer text-2xl"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- مودال منوی دستگاه -->
        <div
          v-if="activeDeviceMenu"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div class="glass-effect p-5 rounded-xl w-full max-w-xs text-center">
            <h3 class="text-base font-bold mb-4">{{ $t('options') }}</h3>
            <button
              @click="openEditModal()"
              class="block w-full p-2 mb-2 rounded hover:bg-white/20"
            >
              {{ $t('rename') }}
            </button>
            <button
              @click="confirmDeleteDevice()"
              class="block w-full p-2 rounded bg-red-500 hover:bg-red-600"
            >
              {{ $t('delete') }}
            </button>
            <button
              @click="closeDeviceMenu()"
              class="block w-full p-2 mt-4 rounded hover:bg-white/20"
            >
              {{ $t('cancel') }}
            </button>
          </div>
        </div>

        <!-- مودال افزودن/ویرایش -->
        <div
          v-if="showAddModal || showEditModal"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div class="glass-effect p-5 rounded-xl w-full max-w-md">
            <h3 class="text-lg font-bold mb-3">
              {{ showAddModal ? $t('add_device') : $t('edit') }}
            </h3>

            <input
              v-model="currentDevice.name"
              type="text"
              :placeholder="$t('device_name')"
              class="w-full p-2 mb-3 bg-white/10 rounded border border-white/20 text-sm"
            />

            <!-- فیلد MAC Address -->
            <input
              v-model="currentDevice.mac"
              type="text"
              placeholder="MAC Address (مثلاً AA:BB:CC:DD:EE:FF)"
              class="w-full p-2 mb-3 bg-white/10 rounded border border-white/20 text-sm"
            />

            <!-- انتخاب نوع دستگاه -->
            <select
              v-model="currentDevice.type"
              class="w-full p-2 mb-3 bg-indigo-900 rounded border border-white/20 text-sm text-white"
            >
              <option value="switch_1_channel">{{ $t('device_types.switch_1_channel') }}</option>
              <option value="door_opener">{{ $t('device_types.door_opener') }}</option>
            </select>

            <div class="flex justify-end gap-2">
              <button
                @click="closeModal"
                class="px-3 py-1 rounded-lg hover:bg-white/20 text-sm"
              >
                {{ $t('cancel') }}
              </button>
              <button
                @click="saveDevice"
                class="px-3 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm"
              >
                {{ $t('save') }}
              </button>
            </div>
          </div>
        </div>

        <!-- مودال تأیید حذف -->
        <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="glass-effect p-5 rounded-xl w-full max-w-xs text-center">
            <h3 class="text-base font-bold mb-2">{{ $t('confirm_delete') }}</h3>
            <p class="text-sm">{{ $t('delete_confirm_text', { name: deleteTarget?.name }) }}</p>
            <div class="flex justify-center gap-2 mt-4">
              <button
                @click="showDeleteConfirm = false"
                class="px-3 py-1 rounded-lg hover:bg-white/20 text-sm"
              >
                {{ $t('no') }}
              </button>
              <button
                @click="confirmDelete()"
                class="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm"
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

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

// --- تایپ‌ها ---
export type DeviceType = 'switch_1_channel' | 'door_opener'

export type Device = {
  id: string
  name: string
  type: DeviceType
  status: 'on' | 'off'
  mac?: string
}

// --- وضعیت ---
const sidebarOpen = ref(false)
const subLocationName = ref('')
const devices = ref<Device[]>([])

const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)

const currentDevice = ref({
  id: '',
  name: '',
  type: 'switch_1_channel' as DeviceType,
  status: 'off' as 'on' | 'off',
  mac: ''
})

const deleteTarget = ref<{ id: string; name: string } | null>(null)
const activeDeviceMenu = ref<Device | null>(null)

const cloudId = ref('')
const subLocationId = ref('')

// --- بارگیری داده ---
onMounted(() => {
  cloudId.value = route.params.cloudId as string
  subLocationId.value = route.params.subId as string

  const allClouds = JSON.parse(localStorage.getItem('cloudCards') || '[]')
  const cloud = allClouds.find((c: any) => c.id === cloudId.value)

  if (cloud) {
    const sub = cloud.subLocations?.find((s: any) => s.id === subLocationId.value)
    if (sub) {
      subLocationName.value = sub.name
      devices.value = (sub.devices || []).map(d => ({
        id: d.id,
        name: d.name,
        type: d.type,
        status: d.status || 'off',
        mac: d.mac || ''
      }))
    } else {
      router.push(`/dashboard/sub-locations/${cloudId.value}`)
    }
  } else {
    router.push('/dashboard/create-place')
  }
})

// --- منطق دستگاه‌ها ---
const toggleDevice = (device: Device) => {
  device.status = device.status === 'on' ? 'off' : 'on'
  saveToDevice()
}

// --- منطق درب بازکن (فشاری) ---
const pressDoorOpener = (device: Device) => {
  device.status = 'on'
  saveToDevice()
}

const releaseDoorOpener = (device: Device) => {
  setTimeout(() => {
    device.status = 'off'
    saveToDevice()
  }, 1000) // 0.5 ثانیه فعال می‌مونه
}

// --- آیکون بر اساس نوع ---
const getIcon = (device: Device) => {
  return device.type === 'door_opener'
    ? 'lucide:door-open'
    : device.status === 'on'
      ? 'fluent:lightbulb-20-filled'
      : 'fluent:lightbulb-20-regular'
}

// --- ذخیره در localStorage ---
const saveToDevice = () => {
  const allClouds = JSON.parse(localStorage.getItem('cloudCards') || '[]')
  const updated = allClouds.map((cloud: any) => {
    if (cloud.id === cloudId.value) {
      return {
        ...cloud,
        subLocations: cloud.subLocations?.map((sub: any) => {
          if (sub.id === subLocationId.value) {
            return { ...sub, devices: devices.value }
          }
          return sub
        })
      }
    }
    return cloud
  })
  localStorage.setItem('cloudCards', JSON.stringify(updated))
}

// --- منوی سه‌نقطه ---
const showDeviceMenu = (device: Device) => {
  activeDeviceMenu.value = device
}

const closeDeviceMenu = () => {
  activeDeviceMenu.value = null
}

const openEditModal = () => {
  if (!activeDeviceMenu.value) return
  currentDevice.value = { ...activeDeviceMenu.value }
  showEditModal.value = true
  closeDeviceMenu()
}

// --- حذف دستگاه ---
const confirmDeleteDevice = () => {
  if (activeDeviceMenu.value) {
    deleteTarget.value = { id: activeDeviceMenu.value.id, name: activeDeviceMenu.value.name }
    showDeleteConfirm.value = true
    closeDeviceMenu()
  }
}

const confirmDelete = () => {
  if (deleteTarget.value?.id) {
    devices.value = devices.value.filter(d => d.id !== deleteTarget.value?.id)
    saveToDevice()
  }
  showDeleteConfirm.value = false
  deleteTarget.value = null
}

// --- مدیریت مودال ---
const openAdd = () => {
  currentDevice.value = {
    id: '',
    name: '',
    type: 'switch_1_channel',
    status: 'off',
    mac: ''
  }
  showAddModal.value = true
}

const saveDevice = () => {
  if (!currentDevice.value.name) return

  const newDevice = {
    id: currentDevice.value.id || Date.now().toString(),
    name: currentDevice.value.name,
    type: currentDevice.value.type,
    status: currentDevice.value.status,
    mac: currentDevice.value.mac
  }

  if (showAddModal.value) {
    devices.value.push(newDevice)
  } else if (showEditModal.value && currentDevice.value.id) {
    const index = devices.value.findIndex(d => d.id === currentDevice.value.id)
    if (index !== -1) {
      devices.value[index] = newDevice
    }
  }

  saveToDevice()
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  currentDevice.value = {
    id: '',
    name: '',
    type: 'switch_1_channel',
    status: 'off',
    mac: ''
  }
}

const logout = () => {
  localStorage.removeItem('username')
  router.push('/login')
}
</script>

<style scoped>
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

input, select, button {
  font-size: 0.875rem;
}
</style>