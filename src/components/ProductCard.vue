<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { availableStock, categoryById, money, productImage } from '@/data/mock'
import { useWishlistStore } from '@/stores/wishlist'
import { useOrderStore } from '@/stores/orders'

const props = defineProps({ product: { type: Object, required: true } })
const wishlist = useWishlistStore()
const orders = useOrderStore()

const inStock = computed(() => props.product.variants.reduce((s, v) => s + availableStock(v), 0))
const priceRange = computed(() => {
  const prices = props.product.variants.map((v) => v.price)
  return Math.min(...prices) === Math.max(...prices)
    ? money(prices[0])
    : `${money(Math.min(...prices))} - ${money(Math.max(...prices))}`
})
</script>

<template>
  <article class="card stack">
    <RouterLink :to="{ name: 'product-detail', params: { slug: product.slug } }">
      <img class="product-thumb" :src="productImage(product)" :alt="product.name" loading="lazy" />
    </RouterLink>

    <div class="stack gap-sm">
      <span class="tiny muted">{{ categoryById(product.categoryId)?.name }}</span>
      <h3>
        <RouterLink :to="{ name: 'product-detail', params: { slug: product.slug } }">
          {{ product.name }}
        </RouterLink>
      </h3>
    </div>

    <div class="row-between">
      <strong>{{ priceRange }}</strong>
      <span class="rating small" :aria-label="`Rating ${orders.ratingFor(product.id) ?? 0}`">
        {{ orders.ratingFor(product.id) ? orders.ratingFor(product.id).toFixed(1) : '–' }} ★
      </span>
    </div>

    <div class="row-between">
      <span class="tiny" :class="inStock > 0 ? 'muted' : 'out'">
        {{ inStock > 0 ? `Stok ${inStock}` : 'Stok habis' }}
      </span>
      <button
        class="btn-link tiny"
        type="button"
        :aria-pressed="wishlist.has(product.id)"
        @click="wishlist.toggle(product.id)"
      >
        {{ wishlist.has(product.id) ? 'Hapus' : '+ Wishlist' }}
      </button>
    </div>
  </article>
</template>

<style scoped>
article {
  transition:
    box-shadow 0.15s ease,
    transform 0.15s ease;
}

article:hover {
  box-shadow: var(--shadow);
}

article:hover h3 a {
  text-decoration: underline;
}

.out {
  color: var(--danger);
  font-weight: 600;
}
</style>
