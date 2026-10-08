<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import { availableStock, categories, products } from '@/data/mock'

const route = useRoute()
const router = useRouter()

const q = ref(String(route.query.q ?? ''))
const category = ref(String(route.query.category ?? ''))
const sort = ref('newest')
const inStockOnly = ref(false)

watch([q, category], () => {
  router.replace({
    name: 'products',
    query: { ...(q.value && { q: q.value }), ...(category.value && { category: category.value }) },
  })
})

const filtered = computed(() => {
  let list = products.filter((p) => p.status === 'ACTIVE')

  if (category.value)
    list = list.filter(
      (p) => categories.find((c) => c.slug === category.value)?.id === p.categoryId,
    )

  const needle = q.value.trim().toLowerCase()
  if (needle)
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.variants.some(
          (v) => v.name.toLowerCase().includes(needle) || v.sku.toLowerCase().includes(needle),
        ),
    )

  if (inStockOnly.value) list = list.filter((p) => p.variants.some((v) => availableStock(v) > 0))

  const bySort = {
    'price-asc': (a, b) =>
      Math.min(...a.variants.map((v) => v.price)) - Math.min(...b.variants.map((v) => v.price)),
    'price-desc': (a, b) =>
      Math.max(...b.variants.map((v) => v.price)) - Math.max(...a.variants.map((v) => v.price)),
    newest: (a, b) => a.id.localeCompare(b.id),
  }
  return [...list].sort(bySort[sort.value])
})
</script>

<template>
  <div class="page container">
    <h1>Katalog</h1>
    <p class="muted small">Filter dan pencarian berjalan di browser (mock data, tanpa server).</p>

    <div class="filters card card-pad stack">
      <div class="row wrap">
        <div class="field grow">
          <label for="q">Cari</label>
          <input id="q" v-model="q" class="input" type="search" placeholder="Nama, warna, SKU..." />
        </div>
        <div class="field">
          <label for="cat">Kategori</label>
          <select id="cat" v-model="category" class="select">
            <option value="">Semua</option>
            <option v-for="c in categories" :key="c.id" :value="c.slug">{{ c.name }}</option>
          </select>
        </div>
        <div class="field">
          <label for="sort">Urutkan</label>
          <select id="sort" v-model="sort" class="select">
            <option value="newest">Terbaru</option>
            <option value="price-asc">Harga termurah</option>
            <option value="price-desc">Harga termahal</option>
          </select>
        </div>
        <label class="check"> <input v-model="inStockOnly" type="checkbox" /> Stok tersedia </label>
      </div>
    </div>

    <p class="small muted">{{ filtered.length }} produk</p>

    <div v-if="filtered.length" class="grid-products">
      <ProductCard v-for="p in filtered" :key="p.id" :product="p" />
    </div>
    <p v-else class="empty">Tidak ada produk yang cocok.</p>
  </div>
</template>

<style scoped>
.filters {
  margin: 1rem 0;
}

.check {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  align-self: end;
  padding-bottom: 0.55rem;
  font-size: 0.88rem;
  white-space: nowrap;
}
</style>
