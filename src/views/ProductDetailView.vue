<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { availableStock, categoryById, money, productBySlug, productImage } from '@/data/mock'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/orders'
import { useWishlistStore } from '@/stores/wishlist'

const route = useRoute()
const cart = useCartStore()
const orders = useOrderStore()
const wishlist = useWishlistStore()

const product = computed(() => productBySlug(route.params.slug))
const selected = ref(null)
const qty = ref(1)
const notice = ref('')
const error = ref('')

const current = computed(() => product.value?.variants.find((v) => v.id === selected.value))

function pick(variant) {
  selected.value = variant.id
  qty.value = 1
  notice.value = ''
}

function addToCart() {
  error.value = ''
  notice.value = ''
  const variant = current.value
  if (!variant) {
    error.value = 'Pilih varian dulu.'
    return
  }
  const max = availableStock(variant)
  if (max <= 0) {
    error.value = 'Varian ini stoknya habis.'
    return
  }
  if (qty.value > max) {
    error.value = `Maksimal ${max} untuk varian ini.`
    return
  }
  cart.add(variant.id, qty.value)
  notice.value = `${qty.value} × ${variant.name} masuk keranjang.`
}

const reviews = computed(() => (product.value ? orders.reviewsFor(product.value.id) : []))
const rating = computed(() => (product.value ? orders.ratingFor(product.value.id) : null))
</script>

<template>
  <div class="page container">
    <p v-if="!product" class="empty">
      Produk tidak ditemukan.
      <RouterLink to="/products" class="link">Kembali ke katalog</RouterLink>
    </p>

    <template v-else>
      <nav class="crumbs small muted" aria-label="Breadcrumb">
        <RouterLink to="/products">Katalog</RouterLink>
        <span>/</span>
        <RouterLink
          :to="{ name: 'products', query: { category: categoryById(product.categoryId)?.slug } }"
        >
          {{ categoryById(product.categoryId)?.name }}
        </RouterLink>
        <span>/</span>
        <span aria-current="page">{{ product.name }}</span>
      </nav>

      <div class="split">
        <div class="stack">
          <img class="detail-img" :src="productImage(product)" :alt="product.name" />
          <div class="card stack">
            <h2>Deskripsi</h2>
            <p class="muted">{{ product.description }}</p>
          </div>

          <div class="card stack" id="reviews">
            <div class="row-between">
              <h2>Review</h2>
              <span class="rating" v-if="rating"
                >{{ rating.toFixed(1) }} ★ · {{ reviews.length }} review</span
              >
            </div>
            <p v-if="!reviews.length" class="muted small">Belum ada review untuk produk ini.</p>
            <ul class="stack" v-else>
              <li v-for="r in reviews" :key="r.id" class="panel stack gap-sm">
                <div class="row-between">
                  <strong class="small">{{ r.userName }}</strong>
                  <span class="rating small"
                    >{{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5 - r.rating) }}</span
                  >
                </div>
                <p class="small">{{ r.comment }}</p>
              </li>
            </ul>
          </div>
        </div>

        <aside class="card card-pad stack buy">
          <h1 class="small-title">{{ product.name }}</h1>

          <div class="row-between">
            <strong class="price">{{ current ? money(current.price) : 'Pilih varian' }}</strong>
            <button
              class="btn-link tiny"
              type="button"
              :aria-pressed="wishlist.has(product.id)"
              @click="wishlist.toggle(product.id)"
            >
              {{ wishlist.has(product.id) ? 'Hapus dari wishlist' : '+ Wishlist' }}
            </button>
          </div>

          <div class="stack gap-sm">
            <span class="small muted">Varian</span>
            <div class="variants">
              <button
                v-for="v in product.variants"
                :key="v.id"
                type="button"
                class="btn btn-ghost btn-sm variant"
                :class="{ picked: selected === v.id, out: availableStock(v) <= 0 }"
                :aria-pressed="selected === v.id"
                @click="pick(v)"
              >
                {{ v.name }}
                <span class="tiny muted">{{
                  availableStock(v) > 0 ? availableStock(v) : 'habis'
                }}</span>
              </button>
            </div>
          </div>

          <div class="field">
            <label for="qty">Jumlah</label>
            <div class="qty">
              <button type="button" :disabled="qty <= 1" @click="qty--" aria-label="Kurangi">
                −
              </button>
              <span>{{ qty }}</span>
              <button
                type="button"
                :disabled="!current || qty >= availableStock(current)"
                @click="qty++"
                aria-label="Tambah"
              >
                +
              </button>
            </div>
          </div>

          <p v-if="error" class="alert alert-error">{{ error }}</p>
          <p v-if="notice" class="alert alert-info">{{ notice }}</p>

          <button class="btn btn-block" type="button" @click="addToCart">
            Tambah ke keranjang
          </button>
          <RouterLink to="/cart" class="btn btn-ghost btn-block">Lihat keranjang</RouterLink>
          <p class="tiny muted">Stok level variant. Barang dikirim COD, bayar saat diterima.</p>
        </aside>
      </div>
    </template>
  </div>
</template>

<style scoped>
.crumbs {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.crumbs a:hover {
  text-decoration: underline;
}

.detail-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: var(--radius);
  background: var(--muted);
}

.buy {
  position: sticky;
  top: 84px;
}

.small-title {
  font-size: 1.25rem;
}

.price {
  font-size: 1.1rem;
}

.variants {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.variant {
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  text-align: left;
}

.picked {
  border-color: var(--brand);
  box-shadow: inset 0 0 0 1px var(--brand);
  color: var(--brand);
}

.out {
  opacity: 0.55;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
