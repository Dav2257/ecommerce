import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { seedOrders, seedReviews, variantById } from '@/data/mock'

export const ORDER_FLOW = {
  PENDING: 'Menunggu konfirmasi',
  CONFIRMED: 'Dikonfirmasi',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  DELIVERED: 'Sampai',
  DELIVERY_FAILED: 'Gagal diantar',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
  REFUND_REQUESTED: 'Refund diproses',
  REFUNDED: 'Refund selesai',
}

export const CANCELLABLE = ['PENDING', 'CONFIRMED', 'PROCESSING']

// ponytail: order + review in-memory, hilang saat refresh. Backend menyusul.
export const useOrderStore = defineStore('orders', () => {
  const orders = ref(seedOrders.map((o) => ({ ...o })))
  const reviews = ref([...seedReviews])
  let counter = orders.value.length

  const active = computed(() =>
    orders.value.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status)),
  )

  const orderById = (id) => orders.value.find((o) => o.id === id)

  // Stok direserve saat order dibuat (FR-08) dan dilepas saat cancel/refund.
  function reserve(items) {
    for (const it of items) {
      const v = variantById(it.variantId)
      if (v) v.reserved += it.quantity
    }
  }

  function release(items) {
    for (const it of items) {
      const v = variantById(it.variantId)
      if (v) v.reserved = Math.max(0, v.reserved - it.quantity)
    }
  }

  function create({ lines, address, shippingFee, userName }) {
    const items = lines.map((l) => ({
      productId: l.product.id,
      variantId: l.variant.id,
      productName: l.product.name,
      variantName: l.variant.name,
      sku: l.variant.sku,
      price: l.variant.price,
      quantity: l.quantity,
      subtotal: l.subtotal,
    }))
    const subtotal = items.reduce((s, i) => s + i.subtotal, 0)
    const order = {
      id: `o${++counter}`,
      orderNumber: `COD-${String(counter).padStart(4, '0')}`,
      items,
      address: { ...address },
      shippingFee,
      subtotal,
      total: subtotal + shippingFee,
      paymentMethod: 'COD',
      paymentStatus: 'UNPAID',
      status: 'PENDING',
      courier: null,
      createdAt: new Date().toISOString(),
      refund: null,
      customerName: userName,
      history: [{ status: 'PENDING', at: new Date().toISOString() }],
    }
    reserve(items)
    orders.value.unshift(order)
    return order
  }

  function setStatus(id, status, extra = {}) {
    const order = orderById(id)
    if (!order || order.status === status) return
    order.status = status
    Object.assign(order, extra)
    order.history.push({ status, at: new Date().toISOString() })
  }

  function cancel(id) {
    const order = orderById(id)
    if (!order || !CANCELLABLE.includes(order.status)) return false
    release(order.items)
    setStatus(id, 'CANCELLED')
    return true
  }

  // Barang sesuai -> COMPLETED + bayar COD ke kurir (FR-19).
  function confirmReceived(id) {
    const order = orderById(id)
    if (!order || order.status !== 'DELIVERED') return false
    for (const it of order.items) {
      const v = variantById(it.variantId)
      if (!v) continue
      v.reserved = Math.max(0, v.reserved - it.quantity)
      v.stock -= it.quantity
    }
    setStatus(id, 'COMPLETED', { paymentStatus: 'PAID' })
    return true
  }

  // Barang tidak sesuai -> REFUND_REQUESTED, reservation dilepas (FR-20).
  function requestRefund(id, { reason, description }) {
    const order = orderById(id)
    if (!order || order.status !== 'DELIVERED') return false
    release(order.items)
    order.refund = {
      reason,
      description,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    }
    setStatus(id, 'REFUND_REQUESTED')
    return true
  }

  // Approve/reject refund dicatat admin; dana dikirim manual di luar sistem (OQ-03).
  const pendingRefunds = computed(() =>
    orders.value.filter((o) => o.refund && o.refund.status === 'PENDING'),
  )

  function decideRefund(id, decision, { method, account, reference, adminNote }) {
    const order = orderById(id)
    if (!order?.refund || order.refund.status !== 'PENDING') return false
    order.refund.status = decision
    order.refund.adminNote = adminNote ?? ''
    if (decision === 'APPROVED') {
      Object.assign(order.refund, {
        refundMethod: method,
        refundAccount: account,
        refundReference: reference,
        refundedAt: new Date().toISOString(),
      })
      order.paymentStatus = 'PAID'
      setStatus(id, 'REFUNDED')
    } else {
      setStatus(id, 'DELIVERED')
    }
    return true
  }

  // Kurir gagal mengantar -> SHIPPED lagi, reservation tetap (E-09/OQ-02).
  function deliveryFailed(id) {
    return setStatus(id, 'DELIVERY_FAILED')
  }

  const reviewsFor = (productId) => reviews.value.filter((r) => r.productId === productId)
  const hasReviewed = (productId) => reviews.value.some((r) => r.productId === productId)
  const myReview = (productId, userName) =>
    reviews.value.find((r) => r.productId === productId && r.userName === userName)

  const ratingFor = (productId) => {
    const list = reviewsFor(productId)
    if (!list.length) return null
    return list.reduce((s, r) => s + r.rating, 0) / list.length
  }

  function addReview({ productId, userName, rating, comment }) {
    const existing = myReview(productId, userName)
    if (existing) Object.assign(existing, { rating, comment, updatedAt: new Date().toISOString() })
    else
      reviews.value.push({
        id: `r${reviews.value.length + 1}`,
        productId,
        userName,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      })
  }

  // Review hanya boleh untuk order COMPLETED (FR-24).
  const canReview = (productId) =>
    orders.value.some(
      (o) => o.status === 'COMPLETED' && o.items.some((i) => i.productId === productId),
    )

  return {
    orders,
    reviews,
    active,
    orderById,
    create,
    setStatus,
    cancel,
    confirmReceived,
    requestRefund,
    reviewsFor,
    hasReviewed,
    myReview,
    ratingFor,
    addReview,
    canReview,
    pendingRefunds,
    decideRefund,
    deliveryFailed,
  }
})
