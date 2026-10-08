<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import { products } from '@/data/mock'
import { useWishlistStore } from '@/stores/wishlist'

const wishlist = useWishlistStore()
const items = computed(() => products.filter((p) => wishlist.has(p.id)))
</script>

<template>
  <div class="page container">
    <h1>Wishlist</h1>

    <p v-if="!items.length" class="empty">
      Belum ada wishlist. <RouterLink to="/products" class="link">Jelajahi katalog</RouterLink>
    </p>

    <div v-else class="grid-products">
      <ProductCard v-for="p in items" :key="p.id" :product="p" />
    </div>
  </div>
</template>
