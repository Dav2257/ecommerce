<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'
import { money } from '@/data/mock'
import { CANCELLABLE, useOrderStore } from '@/stores/orders'

const route = useRoute()
const orders = useOrderStore()

const order = computed(() => orders.orderById(route.params.id))
const showRefund = ref(false)
const error = ref('')

const REFUND_REASONS = [
  'Barang salah',
  'Variant salah',
  'Barang rusak',
  'Barang tidak sesuai deskripsi',
  'Barang kurang',
]

const refund = reactive({ reason: '', description: '', evidence: '' })

const STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED']
const currentStep = computed(() => {
  if (!order.value) return -1
  if (['CANCELLED', 'REFUND_REQUESTED', 'REFUNDED'].includes(order.value.status)) return -1
  return STEPS.indexOf(order.value.status)
})

function doCancel() {
  orders.cancel(order.value.id)
}

function doConfirm() {
  orders.confirmReceived(order.value.id)
}

function doRefund() {
  error.value = ''
  if (!refund.reason || !refund.description.trim()) {
    error.value = 'Alasan dan keterangan wajib diisi.'
    return
  }
  orders.requestRefund(order.value.id, {
    reason: refund.reason,
    description: refund.description,
  })
  showRefund.value = false
}
</script>

<template>
  <div class="page container">
    <p v-if="!order" class="empty">
      Pesanan tidak ditemukan. <RouterLink to="/orders" class="link">Kembali</RouterLink>
    </p>

    <template v-else>
      <div class="row-between wrap">
        <div class="stack gap-sm">
          <h1>{{ order.orderNumber }}</h1>
          <span class="small muted">
            Dibuat {{ new Date(order.createdAt).toLocaleString('id-ID') }}
          </span>
        </div>
        <OrderStatusBadge :status="order.status" />
      </div>

      <div class="split">
        <div class="stack">
          <section v-if="currentStep >= 0" class="card card-pad stack">
            <h2>Status pengiriman</h2>
            <ol class="timeline">
              <li
                v-for="(step, i) in STEPS"
                :key="step"
                class="timeline-step"
                :class="{ done: i < currentStep, current: i === currentStep }"
              >
                <span class="timeline-dot" />
                <span class="small">{{ step }}</span>
              </li>
            </ol>
            <p class="tiny muted">
              Status di frontend ini belum digerakkan admin (belum ada backend). Coba tombol demo di
              bawah.
            </p>
            <div class="row wrap">
              <button
                v-if="order.status === 'PENDING'"
                class="btn btn-sm btn-ghost"
                type="button"
                @click="orders.setStatus(order.id, 'CONFIRMED')"
              >
                Demo: konfirmasi
              </button>
              <button
                v-if="order.status === 'CONFIRMED'"
                class="btn btn-sm btn-ghost"
                type="button"
                @click="orders.setStatus(order.id, 'PROCESSING')"
              >
                Demo: proses
              </button>
              <button
                v-if="order.status === 'PROCESSING'"
                class="btn btn-sm btn-ghost"
                type="button"
                @click="orders.setStatus(order.id, 'SHIPPED', { courier: 'JNE Reguler' })"
              >
                Demo: kirim
              </button>
              <button
                v-if="order.status === 'SHIPPED'"
                class="btn btn-sm btn-ghost"
                type="button"
                @click="orders.setStatus(order.id, 'DELIVERED')"
              >
                Demo: sampai
              </button>
            </div>
          </section>

          <section v-if="order.status === 'DELIVERED'" class="card card-pad stack">
            <h2>Barang sudah sampai?</h2>
            <p class="small muted">
              Cek barangnya dulu. Kalau sesuai, konfirmasi dan bayar COD ke kurir.
            </p>
            <div class="row wrap">
              <button class="btn" type="button" @click="doConfirm">
                Barang sesuai — konfirmasi
              </button>
              <button class="btn btn-danger" type="button" @click="showRefund = true">
                Barang tidak sesuai — refund
              </button>
            </div>
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
            <p class="tiny muted">
              Admin yang mengirim dana di luar sistem; status di sini hanya catatan.
            </p>
          </section>

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
          </section>
        </div>

        <aside class="card card-pad stack">
          <h2>Pembayaran</h2>
          <div class="row-between small">
            <span>Subtotal</span><span>{{ money(order.subtotal) }}</span>
          </div>
          <div class="row-between small">
            <span>Ongkir</span><span>{{ money(order.shippingFee) }}</span>
          </div>
          <hr class="divider" />
          <div class="row-between">
            <strong>Total</strong><strong>{{ money(order.total) }}</strong>
          </div>
          <div class="row-between small"><span>Metode</span><span>COD</span></div>
          <div class="row-between small">
            <span>Status bayar</span
            ><span>{{ order.paymentStatus === 'PAID' ? 'Lunas' : 'Belum' }}</span>
          </div>
          <div v-if="order.courier" class="row-between small">
            <span>Kurir</span><span>{{ order.courier }}</span>
          </div>

          <hr class="divider" />
          <h2>Dikirim ke</h2>
          <p class="small">
            <strong>{{ order.address.recipientName }}</strong
            ><br />
            {{ order.address.phone }}<br />
            {{ order.address.address }}<br />
            {{ order.address.city }}, {{ order.address.postalCode }}
          </p>

          <button
            v-if="CANCELLABLE.includes(order.status)"
            class="btn btn-danger btn-block"
            type="button"
            @click="doCancel"
          >
            Batalkan pesanan
          </button>
        </aside>
      </div>

      <div v-if="showRefund" class="modal-backdrop" @click.self="showRefund = false">
        <form class="card card-pad stack modal" @submit.prevent="doRefund">
          <h2>Ajukan refund</h2>
          <p class="small muted">
            Ceritakan kendalanya. Bukti foto wajib (belum diunggah di demo).
          </p>
          <div class="field">
            <label for="rs">Alasan</label>
            <select id="rs" v-model="refund.reason" class="select" required>
              <option value="" disabled>Pilih alasan</option>
              <option v-for="r in REFUND_REASONS" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
          <div class="field">
            <label for="rd">Keterangan</label>
            <textarea id="rd" v-model="refund.description" class="textarea" required />
          </div>
          <div class="field">
            <label for="re">Link bukti foto</label>
            <input id="re" v-model="refund.evidence" class="input" placeholder="https://..." />
          </div>
          <p v-if="error" class="alert alert-error">{{ error }}</p>
          <div class="row">
            <button class="btn btn-sm" type="submit">Kirim pengajuan</button>
            <button class="btn btn-ghost btn-sm" type="button" @click="showRefund = false">
              Batal
            </button>
          </div>
        </form>
      </div>
    </template>
  </div>
</template>

<style scoped>
.right {
  text-align: right;
}

.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgb(20 22 26 / 45%);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 50;
}

.modal {
  width: min(460px, 100%);
  box-shadow: var(--shadow);
}
</style>
