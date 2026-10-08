import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

// ponytail: wishlist in-memory, hilang saat refresh.
export const useWishlistStore = defineStore('wishlist', () => {
  const productIds = ref([])

  const has = (id) => productIds.value.includes(id)
  const count = computed(() => productIds.value.length)

  function toggle(id) {
    productIds.value = has(id)
      ? productIds.value.filter((x) => x !== id)
      : [...productIds.value, id]
  }

  return { productIds, has, count, toggle }
})
