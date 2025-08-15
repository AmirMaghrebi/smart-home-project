import { createRouter, createWebHistory } from 'vue-router'

// کامپوننت‌ها
import Login from '@/views/LoginPage.vue'
import Dashboard from '@/views/Dashboard.vue'
import CreatePlaceView from '@/views/CreatePlaceView.vue'
import ReportsView from '@/views/ReportsView.vue'
import SettingsView from '@/views/SettingsView.vue'

// روت‌ها
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      { path: 'create-place', name: 'CreatePlace', component: CreatePlaceView },
      { path: 'reports', name: 'Reports', component: ReportsView },
      { path: 'settings', name: 'Settings', component: SettingsView }
    ]
  },
  {
    path: '/dashboard/sub-locations/:id',
    name: 'SubLocations',
    component: () => import('@/views/SubLocationsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/devices/:cloudId/:subId',
    name: 'Devices',
    component: () => import('@/views/DeviceView.vue'),
    meta: { requiresAuth: true }
  }
]

// 🔥 مهم: base باید با vite.config.js یکی باشه
const router = createRouter({
  history: createWebHistory('/smart-home-project/'), // ✅ مثل vite.config.js
  routes
})

// ✅ منطق احراز هویت ساده
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('username') // یا token

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login') // اگر لاگین نکرده، به لاگین برو
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard/create-place') // اگر لاگین کرده، به داشبورد برو
  } else {
    next() // ادامه بده
  }
})

// ✅ تایپ‌ها — فقط برای داده، مشکلی به روت نداره
export type Device = {
  id: string
  name: string
  type: string
  status: 'on' | 'off'
  mac?: string
}

export type SubLocation = {
  id: string
  name: string
  image?: string
  devices: Device[]
}

export type CloudLocation = {
  id: string
  name: string
  image: string
  subLocations: SubLocation[]
}

export default router