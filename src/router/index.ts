import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/LoginPage.vue'
import Dashboard from '@/views/Dashboard.vue'
import CreatePlaceView from '@/views/CreatePlaceView.vue'
import ReportsView from '@/views/ReportsView.vue'
import SettingsView from '@/views/SettingsView.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((_to, _from, next) => {
  next()
})

export default router