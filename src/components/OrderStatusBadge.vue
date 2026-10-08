<script setup>
import { ORDER_FLOW } from '@/stores/orders'

const props = defineProps({ status: { type: String, required: true } })

const TONE = {
  PENDING: 'badge-warn',
  CONFIRMED: 'badge',
  PROCESSING: 'badge',
  SHIPPED: 'badge',
  DELIVERED: 'badge',
  COMPLETED: 'badge',
  CANCELLED: 'badge-grey',
  REFUND_REQUESTED: 'badge-warn',
  REFUNDED: 'badge-grey',
}
</script>

<template>
  <span class="badge" :class="TONE[props.status] ?? 'badge-grey'">
    {{ ORDER_FLOW[props.status] ?? props.status }}
  </span>
</template>
