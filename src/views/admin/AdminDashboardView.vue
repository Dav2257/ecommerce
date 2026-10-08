<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'
import { money } from '@/data/mock'
import { useOrderStore } from '@/stores/orders'

const orders = useOrderStore()

const stats = computed(() => [
  { label: 'Total order', value: orders.orders.length, to: '/admin/orders' },
  {
    label: 'Menunggu',
    value: orders.orders.filter((o) => o.status === 'PENDING').length,
    to: '/admin/orders?status=PENDING',
  },
  {
    label: 'Diproses',
    value: orders.orders.filter((o) => ['CONFIRMED', 'PROCESSING'].includes(o.status)).length,
    to: '/admin/orders?status=PROCESSING',
  },
  {
    label: 'Dikirim',
    value: orders.orders.filter((o) => o.status === 'SHIPPED').length,
    to: '/admin/orders?status=SHIPPED',
  },
  {
    label: 'Selesai',
    value: orders.orders.filter((o) => o.status === 'COMPLETED').length,
    to: '/admin/orders?status=COMPLETED',
  },
  { label: 'Refund', value: orders.pendingRefunds.length, to: '/admin/refunds' },
])

const revenue = computed(() =>
  orders.orders
    .filter((o) => ['COMPLETED', 'REFUNDED'].includes(o.status))
    .reduce((s, o) => s + o.total, 0),
)
const recent = computed(() => orders.orders.slice(0, 5))
</script>

<template>
  <div class="stack">
    <h1>Dashboard</h1>

    <div class="cards">
      <RouterLink v-for="s in stats" :key="s.label" :to="s.to" class="card stat">
        <span class="small muted">{{ s.label }}</span>
        <strong>{{ s.value }}</strong>
      </RouterLink>
    </div>

    <section class="card card-pad stack">
      <div class="row-between">
        <h2>Pesanan terbaru</h2>
        <RouterLink to="/admin/orders" class="link small">Semua pesanan →</RouterLink>
      </div>
      <p v-if="!recent.length" class="muted small">Belum ada pesanan masuk.</p>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Kota</th>
            <th>Status</th>
            <th class="right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in recent" :key="o.id">
            <td>
              <RouterLink class="link" :to="`/admin/orders/${o.id}`">{{
                o.orderNumber
              }}</RouterLink>
            </td>
            <td>{{ o.customerName ?? '—' }}</td>
            <td>{{ o.address.city }}</td>
            <td><OrderStatusBadge :status="o.status" /></td>
            <td class="right">{{ money(o.total) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <p class="small muted">
      Omzet tercatat dari order selesai: <strong>{{ money(revenue) }}</strong
      >. Analytics kompleks belum ada di MVP.
    </p>
  </div>
</template>

<style scoped>
.cards {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.stat {
  display: grid;
  gap: 0.2rem;
}

.stat strong {
  font-size: 1.5rem;
  letter-spacing: -0.02em;
}

.stat:hover {
  box-shadow: var(--shadow);
}

.right {
  text-align: right;
}
</style>
