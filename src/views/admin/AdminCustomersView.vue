<script setup>
import { computed } from 'vue'
import { customers } from '@/data/mock'
import { useOrderStore } from '@/stores/orders'

const orders = useOrderStore()

const rows = computed(() =>
  customers.map((c) => ({
    ...c,
    totalOrders: orders.orders.filter((o) => o.customerName === c.name).length,
    spent: orders.orders
      .filter((o) => o.customerName === c.name && o.status === 'COMPLETED')
      .reduce((s, o) => s + o.total, 0),
  })),
)
</script>

<template>
  <div class="stack">
    <h1>Customer</h1>
    <p class="small muted">Hanya data profil; password tidak pernah ditampilkan.</p>

    <table class="table card">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Email</th>
          <th>Telepon</th>
          <th class="right">Order</th>
          <th class="right">Belanja</th>
          <th>Bergabung</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in rows" :key="c.id">
          <td>{{ c.name }}</td>
          <td class="tiny">{{ c.email }}</td>
          <td>{{ c.phone }}</td>
          <td class="right">{{ c.totalOrders }}</td>
          <td class="right">{{ c.spent ? `Rp${c.spent.toLocaleString('id-ID')}` : '—' }}</td>
          <td class="tiny muted">{{ new Date(c.createdAt).toLocaleDateString('id-ID') }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.right {
  text-align: right;
}
</style>
