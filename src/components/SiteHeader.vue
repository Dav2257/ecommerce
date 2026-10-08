<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const search = ref('')
const goSearch = () => {
  router.push({ name: 'products', query: search.value ? { q: search.value } : {} })
}
</script>

<template>
  <header class="site-header">
    <div class="container row-between">
      <RouterLink to="/" class="brand">
        <span class="brand-mark">K</span>
        <span>KiosKita</span>
      </RouterLink>

      <form class="search" role="search" @submit.prevent="goSearch">
        <label class="sr-only" for="site-search">Cari produk</label>
        <input
          id="site-search"
          v-model="search"
          class="input"
          type="search"
          placeholder="Cari produk..."
        />
      </form>

      <nav class="row gap-sm" aria-label="Utama">
        <RouterLink to="/products" class="nav-link">Katalog</RouterLink>
        <RouterLink to="/wishlist" class="nav-link">
          Wishlist <span v-if="wishlist.count" class="badge">{{ wishlist.count }}</span>
        </RouterLink>
        <RouterLink to="/cart" class="nav-link">
          Keranjang <span v-if="cart.count" class="badge">{{ cart.count }}</span>
        </RouterLink>
        <RouterLink v-if="!auth.isLoggedIn" to="/login" class="btn btn-sm">Masuk</RouterLink>
        <template v-else>
          <RouterLink to="/admin" class="nav-link">Admin</RouterLink>
          <RouterLink to="/orders" class="nav-link">Pesanan</RouterLink>
          <RouterLink to="/account" class="nav-link">{{ auth.user.name }}</RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgb(255 255 255 / 55%);
  -webkit-backdrop-filter: blur(var(--glass-blur));
  backdrop-filter: blur(var(--glass-blur));
  border-bottom: 1px solid var(--glass-border);
  box-shadow: 0 1px 0 rgb(255 255 255 / 45%);
}

.site-header .container {
  gap: 1rem;
  min-height: 64px;
  flex-wrap: wrap;
  padding-block: 0.5rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--brand);
  color: #fff;
  font-size: 0.9rem;
}

.search {
  flex: 1;
  min-width: 180px;
  max-width: 380px;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.4rem;
  border-radius: 6px;
  font-size: 0.9rem;
  color: var(--text-soft);
  white-space: nowrap;
}

.nav-link:hover {
  background: var(--muted);
  color: var(--text);
}

.nav-link.router-link-active {
  color: var(--text);
  font-weight: 600;
}

@media (max-width: 720px) {
  .search {
    order: 3;
    max-width: none;
    flex-basis: 100%;
  }
}
</style>
