import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { availableStock, productOfVariant, variantById } from '@/data/mock'

// ponytail: cart in-memory, hilang saat refresh. localStorage/backend menyusul.
export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const lines = computed(() =>
    items.value.map((it) => {
      const variant = variantById(it.variantId)
      const product = variant ? productOfVariant(variant.id) : null
      return {
        ...it,
        variant,
        product,
        max: variant ? availableStock(variant) : 0,
        subtotal: variant ? variant.price * it.quantity : 0,
        valid:
          !!variant &&
          !!product &&
          product.status === 'ACTIVE' &&
          it.quantity <= availableStock(variant),
      }
    }),
  )

  const count = computed(() => lines.value.length)
  const subtotal = computed(() => lines.value.reduce((s, l) => s + l.subtotal, 0))
  const invalidLines = computed(() => lines.value.filter((l) => !l.valid))

  function add(variantId, quantity = 1) {
    const variant = variantById(variantId)
    if (!variant) return
    const max = availableStock(variant)
    if (max <= 0) return
    const existing = items.value.find((i) => i.variantId === variantId)
    if (existing) existing.quantity = Math.min(existing.quantity + quantity, max)
    else items.value.push({ variantId, quantity: Math.min(quantity, max) })
  }

  function setQuantity(variantId, quantity) {
    const line = items.value.find((i) => i.variantId === variantId)
    if (!line) return
    const variant = variantById(variantId)
    line.quantity = Math.max(1, Math.min(quantity, variant ? availableStock(variant) : 1))
  }

  function remove(variantId) {
    items.value = items.value.filter((i) => i.variantId !== variantId)
  }

  function clear() {
    items.value = []
  }

  return { items, lines, count, subtotal, invalidLines, add, setQuantity, remove, clear }
})
