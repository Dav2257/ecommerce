<script setup>
import { RouterLink } from 'vue-router'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'
import { money } from '@/data/mock'
import { useOrderStore } from '@/stores/orders'

const orders = useOrderStore()
</script>

<template>
  <div class="page container">
    <h1>Pesanan saya</h1>

    <p v-if="!orders.orders.length" class="empty">
      Belum ada pesanan. <RouterLink to="/products" class="link">Mulai belanja</RouterLink>
    </p>

    <div v-else class="stack">
      <RouterLink
        v-for="o in orders.orders"
        :key="o.id"
        class="card stack row-between"
        :to="{ name: 'order-detail', params: { id: o.id } }"
      >
        <div class="stack gap-sm">
          <div class="row wrap gap-sm">
            <strong>{{ o.orderNumber }}</strong>
            <OrderStatusBadge :status="o.status" />
            <span class="badge badge-grey"
              >Bayar: {{ o.paymentStatus === 'PAID' ? 'Lunas' : 'Belum' }}</span
            >
          </div>
          <span class="small muted">
            {{ o.items.length }} produk · {{ new Date(o.createdAt).toLocaleString('id-ID') }} ·
            {{ o.address.city }}
          </span>
        </div>
        <div class="stack amount">
          <strong>{{ money(o.total) }}</strong>
          <span class="small link">Lihat detail →</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.amount {
  text-align: right;
}
</style>
