<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="page container">
    <div class="empty">
      <h1>404</h1>
      <p>Halaman tidak ditemukan.</p>
      <RouterLink to="/" class="link">Kembali ke beranda</RouterLink>
    </div>
  </div>
</template>
