<template>
  <div class="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen">
    <router-view />
  </div>
  <div>
    <LanguageSwitcher />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();


</script>
