<script setup>
import { computed } from 'vue'
import { productById } from '@/data/mock'
import { useOrderStore } from '@/stores/orders'

const orders = useOrderStore()

const rows = computed(() =>
  orders.reviews.map((r) => ({ ...r, product: productById(r.productId) })),
)
</script>

<template>
  <div class="stack">
    <h1>Review</h1>
    <p class="small muted">
      Customer hanya bisa menulis review untuk order berstatus COMPLETED. Moderasi
      (hapus/sembunyikan) menyusul saat backend ada.
    </p>

    <p v-if="!rows.length" class="empty">Belum ada review.</p>

    <div v-else class="stack">
      <article v-for="r in rows" :key="r.id" class="card stack">
        <div class="row-between wrap">
          <div class="stack gap-sm">
            <strong class="small">{{ r.product?.name ?? 'Produk dihapus' }}</strong>
            <span class="small muted"
              >{{ r.userName }} · {{ new Date(r.createdAt).toLocaleDateString('id-ID') }}</span
            >
          </div>
          <span class="rating">{{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5 - r.rating) }}</span>
        </div>
        <p class="small">{{ r.comment }}</p>
      </article>
    </div>
  </div>
</template>
