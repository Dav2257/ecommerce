<script setup>
import { RouterLink } from 'vue-router'
import SiteHeader from '@/components/SiteHeader.vue'
</script>

<template>
  <SiteHeader />
  <main>
    <RouterView />
  </main>
  <footer class="site-footer">
    <div class="container row-between small muted">
      <span>KiosKita — demo frontend, data masih mock di memory.</span>
      <span>Bayar di tempat (COD)</span>
    </div>
  </footer>
</template>

<style scoped>
main {
  min-height: calc(100vh - 128px);
}

.site-footer {
  border-top: 1px solid var(--glass-border);
  padding: 1rem 0;
  background: rgb(255 255 255 / 45%);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
</style>
