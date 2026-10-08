<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/orders'
import { useWishlistStore } from '@/stores/wishlist'

const auth = useAuthStore()
const cart = useCartStore()
const orders = useOrderStore()
const wishlist = useWishlistStore()

const completed = () => orders.orders.filter((o) => o.status === 'COMPLETED').length
const rated = () => {
  const ids = new Set(
    orders.orders
      .filter((o) => o.status === 'COMPLETED')
      .flatMap((o) => o.items.map((i) => i.productId)),
  )
  return [...ids].filter((id) => orders.hasReviewed(id)).length
}
</script>

<template>
  <div class="page container">
    <h1>Akun saya</h1>
    <p class="muted small">Data di bawah sementara, hilang saat halaman dimuat ulang.</p>

    <div class="row wrap gap-sm" style="margin: 1rem 0">
      <RouterLink to="/orders" class="btn btn-ghost btn-sm"
        >Pesanan ({{ orders.orders.length }})</RouterLink
      >
      <RouterLink to="/wishlist" class="btn btn-ghost btn-sm"
        >Wishlist ({{ wishlist.count }})</RouterLink
      >
      <RouterLink to="/cart" class="btn btn-ghost btn-sm">Keranjang ({{ cart.count }})</RouterLink>
      <button class="btn btn-danger btn-sm" type="button" @click="auth.logout">Keluar</button>
    </div>

    <div class="split">
      <div class="stack">
        <section class="card card-pad stack">
          <h2>Profil</h2>
          <div class="row-between small">
            <span class="muted">Nama</span><strong>{{ auth.user.name }}</strong>
          </div>
          <div class="row-between small">
            <span class="muted">Email</span><strong>{{ auth.user.email }}</strong>
          </div>
          <div class="row-between small">
            <span class="muted">Telepon</span><strong>{{ auth.user.phone }}</strong>
          </div>
          <div class="row-between small">
            <span class="muted">Rekening (tujuan refund)</span
            ><strong>{{ auth.user.bankAccount }}</strong>
          </div>
          <div class="row-between small">
            <span class="muted">E-wallet</span><strong>{{ auth.user.ewalletAccount }}</strong>
          </div>
        </section>

        <section class="card card-pad stack">
          <h2>Alamat tersimpan</h2>
          <ul class="stack list">
            <li v-for="a in auth.user.addresses" :key="a.id" class="panel stack gap-sm">
              <div class="row-between">
                <strong class="small">{{ a.recipientName }}</strong>
                <span v-if="a.isDefault" class="badge">Utama</span>
              </div>
              <span class="small">{{ a.phone }}</span>
              <span class="small muted">
                {{ a.address }}, {{ a.city }} {{ a.postalCode }}, {{ a.province }}
              </span>
            </li>
          </ul>
        </section>
      </div>

      <aside class="card card-pad stack">
        <h2>Ringkasan</h2>
        <div class="row-between small">
          <span>Order selesai</span><strong>{{ completed() }}</strong>
        </div>
        <div class="row-between small">
          <span>Review ditulis</span><strong>{{ rated() }}</strong>
        </div>
        <hr class="divider" />
        <p class="tiny muted">
          Backend belum ada: session, cart, wishlist, dan order semuanya hanya di memory browser.
        </p>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.list {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
