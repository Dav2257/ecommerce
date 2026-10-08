<script setup>
import { RouterLink } from 'vue-router'
import { money } from '@/data/mock'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
</script>

<template>
  <div class="page container">
    <h1>Keranjang</h1>

    <p v-if="!cart.lines.length" class="empty">
      Keranjang masih kosong. <RouterLink to="/products" class="link">Cari produk</RouterLink>
    </p>

    <div v-else class="split">
      <div class="stack">
        <p v-if="cart.invalidLines.length" class="alert alert-error">
          {{ cart.invalidLines.length }} item sudah tidak valid (produk/varian nonaktif atau stok
          kurang). Hapus atau kurangi jumlahnya sebelum checkout.
        </p>

        <ul class="stack list">
          <li v-for="line in cart.lines" :key="line.variant.id" class="card row wrap">
            <RouterLink :to="{ name: 'product-detail', params: { slug: line.product.slug } }">
              <strong class="grow">{{ line.product.name }}</strong>
            </RouterLink>
            <span class="small muted">{{ line.variant.name }}</span>
            <span class="small">{{ money(line.variant.price) }}</span>

            <div class="qty">
              <button
                type="button"
                :disabled="line.quantity <= 1"
                @click="cart.setQuantity(line.variant.id, line.quantity - 1)"
                aria-label="Kurangi"
              >
                −
              </button>
              <span>{{ line.quantity }}</span>
              <button
                type="button"
                :disabled="line.quantity >= line.max"
                @click="cart.setQuantity(line.variant.id, line.quantity + 1)"
                aria-label="Tambah"
              >
                +
              </button>
            </div>

            <strong style="width: 7.5rem; text-align: right">{{ money(line.subtotal) }}</strong>
            <button
              class="btn btn-danger btn-sm"
              type="button"
              @click="cart.remove(line.variant.id)"
            >
              Hapus
            </button>
          </li>
        </ul>
      </div>

      <aside class="card card-pad stack">
        <h2>Ringkasan</h2>
        <div class="row-between small">
          <span>Subtotal</span><strong>{{ money(cart.subtotal) }}</strong>
        </div>
        <div class="row-between small muted">
          <span>Ongkir</span><span>Dihitung di checkout</span>
        </div>
        <hr class="divider" />
        <RouterLink
          to="/checkout"
          class="btn btn-block"
          :class="{ 'btn-ghost': cart.invalidLines.length }"
          :aria-disabled="cart.invalidLines.length > 0"
          @click="cart.invalidLines.length && $event.preventDefault()"
        >
          Lanjut checkout
        </RouterLink>
        <button class="btn-link tiny" type="button" @click="cart.clear()">
          Kosongkan keranjang
        </button>
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

li strong.grow {
  flex: 1;
  min-width: 10rem;
}
</style>
