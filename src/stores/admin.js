import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  availableStock,
  categories,
  couriers,
  money,
  productImage,
  products,
  shippingRates,
} from '@/data/mock'

// ponytail: mutasi langsung ke array reaktif di mock.js (satu sumber kebenaran),
// tanpa repository/store terpisah per entitas. Backend menyusul.
export const useAdminStore = defineStore('admin', () => {
  const isLoggedIn = ref(false)
  const error = ref('')
  let nextId = products.length + 1

  const lowStock = computed(() =>
    products
      .filter((p) => p.status === 'ACTIVE')
      .flatMap((p) =>
        p.variants
          .filter((v) => availableStock(v) <= 2)
          .map((v) => ({ product: p, variant: v, available: availableStock(v) })),
      ),
  )

  function login(email, password) {
    error.value = ''
    if (!email || !password) {
      error.value = 'Email dan password wajib diisi.'
      return false
    }
    isLoggedIn.value = true
    return true
  }

  function logout() {
    isLoggedIn.value = false
  }

  // --- produk (FR-06) ---
  function saveProduct(payload) {
    if (payload.id) {
      const p = products.find((x) => x.id === payload.id)
      if (p) Object.assign(p, payload)
      return p
    }
    const product = {
      id: `p${nextId++}`,
      slug: `${payload.name}-${nextId}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      status: 'ACTIVE',
      description: '',
      variants: [],
      ...payload,
    }
    products.push(product)
    return product
  }

  const toggleProduct = (id) => {
    const p = products.find((x) => x.id === id)
    if (p) p.status = p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  }

  const saveVariant = (productId, payload) => {
    const p = products.find((x) => x.id === productId)
    if (!p) return null
    const existing = payload.id && p.variants.find((v) => v.id === payload.id)
    if (existing) {
      Object.assign(existing, payload)
      return existing
    }
    const v = {
      id: `v${products.flatMap((x) => x.variants).length + nextId++}`,
      reserved: 0,
      status: 'ACTIVE',
      ...payload,
    }
    p.variants.push(v)
    return v
  }

  const toggleVariant = (productId, variantId) => {
    const v = products.find((x) => x.id === productId)?.variants.find((x) => x.id === variantId)
    if (v) v.status = v.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  }

  // --- kategori (FR-05) ---
  const saveCategory = (payload) => {
    if (payload.id) {
      const c = categories.find((x) => x.id === payload.id)
      if (c) Object.assign(c, payload)
      return c
    }
    const c = {
      id: `c${categories.length + 1}`,
      slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      status: 'ACTIVE',
      ...payload,
    }
    categories.push(c)
    return c
  }

  const toggleCategory = (id) => {
    const c = categories.find((x) => x.id === id)
    if (c) c.status = c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  }

  const categoryUsage = (id) => products.filter((p) => p.categoryId === id).length

  // --- ongkir & kurir (FR-12/13) ---
  const saveRate = (payload) => {
    if (payload.id) {
      const r = shippingRates.find((x) => x.city === payload.city)
      if (r) Object.assign(r, payload)
      return r
    }
    shippingRates.push({ ...payload })
    return payload
  }

  const saveCourier = (payload) => {
    if (payload.id) {
      const c = couriers.find((x) => x.id === payload.id)
      if (c) Object.assign(c, payload)
      return c
    }
    couriers.push({ id: `k${couriers.length + 1}`, status: 'ACTIVE', ...payload })
    return payload
  }

  return {
    isLoggedIn,
    error,
    lowStock,
    login,
    logout,
    saveProduct,
    toggleProduct,
    saveVariant,
    toggleVariant,
    saveCategory,
    toggleCategory,
    categoryUsage,
    saveRate,
    saveCourier,
    money,
    productImage,
  }
})
