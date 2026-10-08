<script setup>
import { computed } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { categories, products } from '@/data/mock'

const featured = computed(() => products.slice(0, 4))
</script>

<template>
  <div>
    <section class="hero">
      <div class="container row-between wrap">
        <div class="stack">
          <span class="badge">COD • Ready stok</span>
          <h1>Pakaian lokal, dikirim dari toko kami.</h1>
          <p class="muted">
            Pilih produk, bayar saat barang sampai di tangan Anda. Tanpa payment gateway, tanpa
            drama refund manual.
          </p>
          <div class="row wrap">
            <RouterLink to="/products" class="btn">Lihat katalog</RouterLink>
            <RouterLink to="/register" class="btn btn-ghost">Buat akun</RouterLink>
          </div>
        </div>
        <ul class="points">
          <li><strong>Ongkir per kota</strong><span>Dihitung otomatis saat checkout</span></li>
          <li><strong>Stok real-time</strong><span>Tidak bisa oversell</span></li>
          <li><strong>Refund terstruktur</strong><span>Ada bukti dan status jelas</span></li>
        </ul>
      </div>
    </section>

    <section class="page container stack">
      <div class="row-between">
        <h2>Produk pilihan</h2>
        <RouterLink to="/products" class="link small">Lihat semua →</RouterLink>
      </div>
      <div class="grid-products">
        <ProductCard v-for="p in featured" :key="p.id" :product="p" />
      </div>
    </section>

    <section class="page container stack">
      <h2>Kategori</h2>
      <div class="row wrap">
        <RouterLink
          v-for="c in categories"
          :key="c.id"
          class="btn btn-ghost"
          :to="{ name: 'products', query: { category: c.slug } }"
        >
          {{ c.name }}
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  border-bottom: 1px solid var(--glass-border);
  padding: 2.5rem 0;
}

.hero .container {
  gap: 2rem;
}

.hero h1 {
  max-width: 22ch;
}

.hero p {
  max-width: 52ch;
}

.points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
  min-width: 260px;
}

.points li {
  border-radius: var(--radius);
  padding: 0.75rem 0.9rem;
  display: grid;
  gap: 0.1rem;
}

.points span {
  font-size: 0.85rem;
  color: var(--text-soft);
}
</style>
