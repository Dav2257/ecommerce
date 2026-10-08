<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'
import { couriers, money } from '@/data/mock'
import { useOrderStore } from '@/stores/orders'

const orders = useOrderStore()
const route = useRoute()
const router = useRouter()

const q = ref('')
const status = ref(String(route.query.status ?? ''))
const error = ref('')

const NEXT = {
  PENDING: { to: 'CONFIRMED', label: 'Konfirmasi' },
  CONFIRMED: { to: 'PROCESSING', label: 'Proses' },
  PROCESSING: { to: 'SHIPPED', label: 'Kirim' },
  SHIPPED: { to: 'DELIVERED', label: 'Tandai sampai' },
}

const list = computed(() => {
  let out = orders.orders
  if (status.value) out = out.filter((o) => o.status === status.value)
  const needle = q.value.trim().toLowerCase()
  if (needle)
    out = out.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(needle) ||
        (o.customerName ?? '').toLowerCase().includes(needle) ||
        o.address.recipientName.toLowerCase().includes(needle),
    )
  return out
})

const statuses = computed(() => [...new Set(orders.orders.map((o) => o.status))])

const assign = ref({})
function ship(id) {
  const courier = assign.value[id]
  if (!courier) {
    error.value = 'Pilih kurir dulu sebelum kirim.'
    return
  }
  error.value = ''
  orders.setStatus(id, 'SHIPPED', { courier })
}

function retryDelivery(id) {
  orders.setStatus(id, 'SHIPPED')
}
</script>

<template>
  <div class="stack">
    <div class="row-between wrap">
      <h1>Pesanan</h1>
      <RouterLink to="/admin/refunds" class="btn btn-ghost btn-sm">
        Refund ({{ orders.pendingRefunds.length }})
      </RouterLink>
    </div>

    <div class="card card-pad row wrap">
      <div class="field grow">
        <label for="q">Cari</label>
        <input
          id="q"
          v-model="q"
          class="input"
          type="search"
          placeholder="No. order atau nama customer"
        />
      </div>
      <div class="field">
        <label for="st">Status</label>
        <select id="st" v-model="status" class="select">
          <option value="">Semua</option>
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
    </div>

    <p v-if="error" class="alert alert-error">{{ error }}</p>
    <p v-if="!list.length" class="empty">Tidak ada pesanan yang cocok.</p>

    <div v-else class="stack">
      <article v-for="o in list" :key="o.id" class="card stack">
        <div class="row-between wrap">
          <div class="stack gap-sm">
            <div class="row wrap gap-sm">
              <strong>{{ o.orderNumber }}</strong>
              <OrderStatusBadge :status="o.status" />
              <span class="badge badge-grey">{{
                o.paymentStatus === 'PAID' ? 'Lunas' : 'Belum bayar'
              }}</span>
            </div>
            <span class="small muted">
              {{ o.customerName ?? '—' }} · {{ o.address.city }} ·
              {{ new Date(o.createdAt).toLocaleString('id-ID') }}
            </span>
          </div>
          <strong>{{ money(o.total) }}</strong>
        </div>

        <ul class="items small">
          <li v-for="i in o.items" :key="i.variantId">
            {{ i.productName }} — {{ i.variantName }} · {{ i.quantity }} × {{ money(i.price) }}
          </li>
        </ul>

        <hr class="divider" />

        <div class="row wrap">
          <RouterLink :to="`/admin/orders/${o.id}`" class="btn btn-ghost btn-sm">Detail</RouterLink>

          <button
            v-if="NEXT[o.status]"
            class="btn btn-sm"
            type="button"
            @click="orders.setStatus(o.id, NEXT[o.status].to)"
          >
            {{ NEXT[o.status].label }}
          </button>

          <template v-if="o.status === 'PROCESSING'">
            <select v-model="assign[o.id]" class="select assign" aria-label="Pilih kurir">
              <option value="">Pilih kurir</option>
              <option
                v-for="c in couriers.filter((x) => x.status === 'ACTIVE')"
                :key="c.id"
                :value="c.name"
              >
                {{ c.name }}
              </option>
            </select>
            <button class="btn btn-sm" type="button" @click="ship(o.id)">Kirim</button>
          </template>

          <button
            v-if="o.status === 'DELIVERY_FAILED'"
            class="btn btn-sm"
            type="button"
            @click="retryDelivery(o.id)"
          >
            Coba kirim ulang
          </button>
          <button
            v-if="o.status === 'SHIPPED'"
            class="btn btn-ghost btn-sm"
            type="button"
            @click="orders.deliveryFailed(o.id)"
          >
            Kurir gagal
          </button>

          <RouterLink
            v-if="['CANCELLED', 'COMPLETED', 'REFUND_REQUESTED', 'REFUNDED'].includes(o.status)"
            class="btn btn-sm btn-ghost"
            :to="`/admin/orders/${o.id}`"
          >
            Lihat refund
          </RouterLink>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.items {
  margin: 0;
  padding-left: 1.1rem;
  color: var(--text-soft);
}

.assign {
  width: auto;
  min-width: 150px;
}
</style>
