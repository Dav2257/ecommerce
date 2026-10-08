<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { useOrderStore } from '@/stores/orders'

const admin = useAdminStore()
const orders = useOrderStore()
const router = useRouter()

const nav = [
  { to: '/admin', label: 'Dashboard', exact: true },
  { to: '/admin/orders', label: 'Pesanan' },
  { to: '/admin/refunds', label: 'Refund' },
  { to: '/admin/products', label: 'Produk' },
  { to: '/admin/categories', label: 'Kategori' },
  { to: '/admin/customers', label: 'Customer' },
  { to: '/admin/reviews', label: 'Review' },
  { to: '/admin/shipping', label: 'Ongkir & Kurir' },
]

function logout() {
  admin.logout()
  router.push('/admin/login')
}
</script>

<template>
  <div class="admin">
    <aside class="side">
      <RouterLink to="/" class="brand">
        <span class="brand-mark">K</span>
        <span>KiosKita <small>admin</small></span>
      </RouterLink>

      <nav class="stack gap-sm">
        <RouterLink v-for="n in nav" :key="n.to" :to="n.to" class="side-link" :exact="n.exact">
          {{ n.label }}
          <span
            v-if="n.to === '/admin/refunds' && orders.pendingRefunds.length"
            class="badge badge-warn"
          >
            {{ orders.pendingRefunds.length }}
          </span>
        </RouterLink>
      </nav>

      <button class="btn btn-ghost btn-sm" type="button" @click="logout">Keluar</button>
    </aside>

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.admin {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100vh;
}

.side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0.85rem;
  border-right: 1px solid var(--glass-border);
  background: rgb(255 255 255 / 50%);
  -webkit-backdrop-filter: blur(var(--glass-blur));
  backdrop-filter: blur(var(--glass-blur));
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
}

.brand small {
  display: block;
  font-size: 0.7rem;
  color: var(--text-soft);
  font-weight: 500;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: var(--brand);
  color: #fff;
  font-size: 0.85rem;
}

.side-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  padding: 0.45rem 0.6rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text-soft);
}

.side-link:hover {
  background: rgb(255 255 255 / 60%);
  color: var(--text);
}

.side-link.router-link-active {
  background: rgb(255 255 255 / 72%);
  color: var(--text);
  font-weight: 600;
  box-shadow: inset 2px 0 0 var(--brand);
}

.main {
  padding: 1.5rem 1.75rem 3rem;
  min-width: 0;
}

@media (max-width: 760px) {
  .admin {
    grid-template-columns: 1fr;
  }

  .side {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    border-right: 0;
    border-bottom: 1px solid var(--glass-border);
  }

  .side nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
