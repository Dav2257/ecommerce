<script setup>
import { computed, reactive } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'
import { couriers, money } from '@/data/mock'
import { useOrderStore } from '@/stores/orders'

const orders = useOrderStore()
const route = useRoute()
const order = computed(() => orders.orderById(route.params.id))

const assign = reactive({ courier: '' })
const refund = reactive({ method: 'BANK_TRANSFER', account: '', reference: '', note: '' })

const NEXT = {
  PENDING: { to: 'CONFIRMED', label: 'Konfirmasi order' },
  CONFIRMED: { to: 'PROCESSING', label: 'Mulai proses' },
  PROCESSING: { to: 'SHIPPED', label: 'Tandai dikirim' },
  SHIPPED: { to: 'DELIVERED', label: 'Tandai sampai' },
}

const canDecide = computed(() => order.value?.refund?.status === 'PENDING')

function approve() {
  if (!refund.account.trim() || !refund.reference.trim()) return
  orders.decideRefund(order.value.id, 'APPROVED', { ...refund })
}

function reject() {
  orders.decideRefund(order.value.id, 'REJECTED', { adminNote: refund.note })
}
</script>

<template>
  <div class="stack">
    <RouterLink to="/admin/orders" class="small link">← Semua pesanan</RouterLink>

    <p v-if="!order" class="empty">Pesanan tidak ditemukan.</p>

    <template v-else>
      <div class="row-between wrap">
        <div class="stack gap-sm">
          <h1>{{ order.orderNumber }}</h1>
          <span class="small muted">
            {{ order.customerName ?? '—' }} ·
            {{ new Date(order.createdAt).toLocaleString('id-ID') }}
          </span>
        </div>
        <OrderStatusBadge :status="order.status" />
      </div>

      <div class="cols">
        <div class="stack">
          <section class="card card-pad stack">
            <h2>Item</h2>
            <table class="table">
              <tbody>
                <tr v-for="i in order.items" :key="i.variantId">
                  <td>
                    {{ i.productName }}
                    <br />
                    <span class="tiny muted">{{ i.variantName }} · {{ i.sku }}</span>
                  </td>
                  <td>{{ i.quantity }} × {{ money(i.price) }}</td>
                  <td class="right">{{ money(i.subtotal) }}</td>
                </tr>
              </tbody>
            </table>
            <hr class="divider" />
            <div class="row-between small">
              <span>Subtotal</span><span>{{ money(order.subtotal) }}</span>
            </div>
            <div class="row-between small">
              <span>Ongkir</span><span>{{ money(order.shippingFee) }}</span>
            </div>
            <div class="row-between">
              <strong>Total</strong><strong>{{ money(order.total) }}</strong>
            </div>
            <p class="tiny muted">
              Harga tersimpan sebagai snapshot; admin tidak bisa mengubahnya.
            </p>
          </section>

          <section v-if="order.refund" class="card card-pad stack">
            <h2>Refund</h2>
            <div class="row-between small">
              <strong>{{ order.refund.reason }}</strong>
              <span
                class="badge"
                :class="order.refund.status === 'PENDING' ? 'badge-warn' : 'badge'"
              >
                {{ order.refund.status }}
              </span>
            </div>
            <p class="small muted">{{ order.refund.description }}</p>

            <div v-if="canDecide" class="stack">
              <div class="row wrap">
                <div class="field grow">
                  <label for="m">Metode</label>
                  <select id="m" v-model="refund.method" class="select">
                    <option value="BANK_TRANSFER">Transfer bank</option>
                    <option value="E_WALLET">E-wallet</option>
                  </select>
                </div>
                <div class="field grow">
                  <label for="a">Rekening / nomor tujuan</label>
                  <input
                    id="a"
                    v-model="refund.account"
                    class="input"
                    placeholder="1234567890 a.n. Andi"
                  />
                </div>
                <div class="field grow">
                  <label for="r">Nomor transaksi</label>
                  <input
                    id="r"
                    v-model="refund.reference"
                    class="input"
                    placeholder="TRX/2026/..."
                  />
                </div>
              </div>
              <div class="field">
                <label for="n">Catatan admin</label>
                <input id="n" v-model="refund.note" class="input" />
              </div>
              <div class="row">
                <button class="btn btn-sm" type="button" @click="approve">Setujui refund</button>
                <button class="btn btn-sm btn-danger" type="button" @click="reject">Tolak</button>
              </div>
              <p class="tiny muted">
                Sistem hanya mencatat; transfer dana dikirim manual oleh admin (OQ-03).
              </p>
            </div>

            <div v-else class="panel stack gap-sm small">
              <div class="row-between">
                <span class="muted">Metode</span
                ><strong>{{ order.refund.refundMethod ?? '—' }}</strong>
              </div>
              <div class="row-between">
                <span class="muted">Tujuan</span
                ><strong>{{ order.refund.refundAccount ?? '—' }}</strong>
              </div>
              <div class="row-between">
                <span class="muted">Referensi</span
                ><strong>{{ order.refund.refundReference ?? '—' }}</strong>
              </div>
              <p v-if="order.refund.adminNote" class="muted">
                Catatan: {{ order.refund.adminNote }}
              </p>
            </div>
          </section>
        </div>

        <aside class="stack">
          <section class="card card-pad stack">
            <h2>Aksi</h2>
            <button
              v-if="NEXT[order.status]"
              class="btn btn-sm"
              type="button"
              @click="orders.setStatus(order.id, NEXT[order.status].to)"
            >
              {{ NEXT[order.status].label }}
            </button>

            <div v-if="order.status === 'PROCESSING'" class="stack">
              <div class="field">
                <label for="k">Kurir</label>
                <select id="k" v-model="assign.courier" class="select">
                  <option value="">Pilih kurir</option>
                  <option
                    v-for="c in couriers.filter((x) => x.status === 'ACTIVE')"
                    :key="c.id"
                    :value="c.name"
                  >
                    {{ c.name }}
                  </option>
                </select>
              </div>
              <button
                class="btn btn-sm"
                type="button"
                :disabled="!assign.courier"
                @click="orders.setStatus(order.id, 'SHIPPED', { courier: assign.courier })"
              >
                Kirim dengan kurir ini
              </button>
            </div>

            <template v-if="order.status === 'SHIPPED'">
              <p class="small muted">Kurir: {{ order.courier ?? 'belum ditugaskan' }}</p>
              <button
                class="btn btn-sm btn-ghost"
                type="button"
                @click="orders.deliveryFailed(order.id)"
              >
                Kurir gagal mengantar
              </button>
            </template>

            <p
              v-if="['CANCELLED', 'COMPLETED', 'REFUNDED'].includes(order.status)"
              class="small muted"
            >
              Order sudah final, tidak ada aksi lagi.
            </p>
          </section>

          <section class="card card-pad stack">
            <h2>Dikirim ke</h2>
            <p class="small">
              <strong>{{ order.address.recipientName }}</strong
              ><br />
              {{ order.address.phone }}<br />
              {{ order.address.address }}<br />
              {{ order.address.city }}, {{ order.address.postalCode }}
            </p>
            <p class="tiny muted">Snapshot alamat, tidak ikut berubah bila customer edit profil.</p>
          </section>

          <section class="card card-pad stack">
            <h2>Riwayat status</h2>
            <ul class="timeline">
              <li v-for="(h, i) in order.history" :key="i" class="timeline-step done">
                <span class="timeline-dot" />
                <span class="small">
                  {{ h.status }}
                  <span class="muted">· {{ new Date(h.at).toLocaleString('id-ID') }}</span>
                </span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cols {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 320px;
  align-items: start;
}

.right {
  text-align: right;
}

.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
}

@media (max-width: 900px) {
  .cols {
    grid-template-columns: 1fr;
  }
}
</style>
