<script setup>
import { computed, reactive } from 'vue'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'
import { money } from '@/data/mock'
import { useOrderStore } from '@/stores/orders'

const orders = useOrderStore()

// Satu draft per pengajuan, supaya mengetik di satu baris tidak mengisi yang lain.
const drafts = reactive({})

function draftFor(order) {
  return (drafts[order.id] ??= {
    method: order.refund.refundMethod ?? 'BANK_TRANSFER',
    account: order.refund.refundAccount ?? '',
    reference: order.refund.refundReference ?? '',
    note: '',
  })
}

const list = computed(() => orders.orders.filter((o) => o.refund))

function approve(order) {
  const d = draftFor(order)
  if (!d.account.trim() || !d.reference.trim()) return
  orders.decideRefund(order.id, 'APPROVED', { ...d })
}

function reject(order) {
  orders.decideRefund(order.id, 'REJECTED', { adminNote: draftFor(order).note })
}
</script>

<template>
  <div class="stack">
    <h1>Refund</h1>
    <p class="muted small">
      Setiap pengajuan wajib berakhir APPROVED/COMPLETED atau REJECTED. Dana dikirim manual oleh
      admin, sistem hanya mencatat.
    </p>

    <p v-if="!list.length" class="empty">Belum ada pengajuan refund.</p>

    <article v-for="o in list" :key="o.id" class="card stack">
      <div class="row-between wrap">
        <div class="stack gap-sm">
          <div class="row wrap gap-sm">
            <strong>{{ o.orderNumber }}</strong>
            <OrderStatusBadge :status="o.status" />
            <span class="badge" :class="o.refund.status === 'PENDING' ? 'badge-warn' : 'badge'">
              {{ o.refund.status }}
            </span>
          </div>
          <span class="small muted">{{ o.customerName ?? '—' }} · {{ money(o.total) }}</span>
        </div>
      </div>

      <div class="panel stack gap-sm small">
        <strong>{{ o.refund.reason }}</strong>
        <span class="muted">{{ o.refund.description }}</span>
      </div>

      <div v-if="o.refund.status === 'PENDING'" class="stack">
        <div class="row wrap">
          <div class="field grow">
            <label :for="`m-${o.id}`">Metode</label>
            <select :id="`m-${o.id}`" v-model="draftFor(o).method" class="select">
              <option value="BANK_TRANSFER">Transfer bank</option>
              <option value="E_WALLET">E-wallet</option>
            </select>
          </div>
          <div class="field grow">
            <label :for="`a-${o.id}`">Rekening tujuan</label>
            <input :id="`a-${o.id}`" v-model="draftFor(o).account" class="input" />
          </div>
          <div class="field grow">
            <label :for="`r-${o.id}`">Nomor transaksi</label>
            <input :id="`r-${o.id}`" v-model="draftFor(o).reference" class="input" />
          </div>
        </div>
        <div class="field">
          <label :for="`n-${o.id}`">Catatan admin</label>
          <input :id="`n-${o.id}`" v-model="draftFor(o).note" class="input" />
        </div>
        <div class="row">
          <button class="btn btn-sm" type="button" @click="approve(o)">Setujui</button>
          <button class="btn btn-sm btn-danger" type="button" @click="reject(o)">Tolak</button>
        </div>
      </div>

      <div v-else class="stack gap-sm small">
        <div class="row-between">
          <span class="muted">Metode</span><strong>{{ o.refund.refundMethod ?? '—' }}</strong>
        </div>
        <div class="row-between">
          <span class="muted">Tujuan</span><strong>{{ o.refund.refundAccount ?? '—' }}</strong>
        </div>
        <div class="row-between">
          <span class="muted">Referensi</span><strong>{{ o.refund.refundReference ?? '—' }}</strong>
        </div>
      </div>
    </article>
  </div>
</template>
