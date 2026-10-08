<script setup>
import { computed, reactive, ref } from 'vue'
import { availableStock, categories, money, productImage, products } from '@/data/mock'
import { useAdminStore } from '@/stores/admin'

const admin = useAdminStore()
const editing = ref(null)
const error = ref('')

const product = reactive({ id: '', name: '', categoryId: 'c1', description: '' })
const variant = reactive({ id: '', name: '', sku: '', price: 0, stock: 0 })

const q = ref('')
const list = computed(() => {
  const needle = q.value.trim().toLowerCase()
  return needle ? products.filter((p) => p.name.toLowerCase().includes(needle)) : products
})

const lowStock = computed(() => admin.lowStock)

function openNew() {
  Object.assign(product, { id: '', name: '', categoryId: categories[0].id, description: '' })
  Object.assign(variant, { id: '', name: '', sku: '', price: 0, stock: 0 })
  editing.value = 'new'
  error.value = ''
}

function openEdit(p) {
  Object.assign(product, {
    id: p.id,
    name: p.name,
    categoryId: p.categoryId,
    description: p.description,
  })
  editing.value = p.id
  error.value = ''
}

function saveProduct() {
  if (!product.name.trim()) {
    error.value = 'Nama produk wajib diisi.'
    return
  }
  const saved = admin.saveProduct({ ...product })
  if (variant.name.trim() && variant.price > 0) {
    admin.saveVariant(saved.id, { ...variant })
    Object.assign(variant, { id: '', name: '', sku: '', price: 0, stock: 0 })
  }
  editing.value = null
}
</script>

<template>
  <div class="stack">
    <div class="row-between wrap">
      <h1>Produk</h1>
      <button class="btn btn-sm" type="button" @click="openNew">Tambah produk</button>
    </div>

    <section v-if="lowStock.length" class="card card-pad stack">
      <h2>Stok menipis</h2>
      <p class="small muted">Reserved sudah dikeluarkan dari angka tersedia.</p>
      <ul class="stack gap-sm small">
        <li v-for="s in lowStock" :key="s.variant.id">
          {{ s.product.name }} — {{ s.variant.name }}
          <strong :class="{ danger: s.available <= 0 }">tersisa {{ s.available }}</strong>
        </li>
      </ul>
    </section>

    <div class="card card-pad row">
      <div class="field grow">
        <label for="q">Cari produk</label>
        <input id="q" v-model="q" class="input" type="search" />
      </div>
    </div>

    <p v-if="error" class="alert alert-error">{{ error }}</p>

    <div class="stack">
      <article v-for="p in list" :key="p.id" class="card stack">
        <div class="row wrap">
          <img class="thumb" :src="productImage(p)" :alt="p.name" />
          <div class="stack gap-sm grow">
            <div class="row wrap gap-sm">
              <strong>{{ p.name }}</strong>
              <span class="badge" :class="p.status === 'ACTIVE' ? '' : 'badge-grey'">
                {{ p.status }}
              </span>
            </div>
            <span class="small muted">
              {{ categories.find((c) => c.id === p.categoryId)?.name }} ·
              {{ p.variants.length }} varian
            </span>
          </div>
          <button class="btn btn-ghost btn-sm" type="button" @click="openEdit(p)">Ubah</button>
          <button class="btn btn-sm btn-ghost" type="button" @click="admin.toggleProduct(p.id)">
            {{ p.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan' }}
          </button>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Varian</th>
              <th>SKU</th>
              <th class="right">Harga</th>
              <th class="right">Stok</th>
              <th class="right">Tersedia</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in p.variants" :key="v.id" :class="{ off: v.status !== 'ACTIVE' }">
              <td>{{ v.name }}</td>
              <td class="tiny muted">{{ v.sku }}</td>
              <td class="right">{{ money(v.price) }}</td>
              <td class="right">{{ v.stock }}</td>
              <td class="right">{{ availableStock(v) }}</td>
              <td class="right">
                <button
                  class="btn-link tiny"
                  type="button"
                  @click="admin.toggleVariant(p.id, v.id)"
                >
                  {{ v.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </article>
    </div>

    <div v-if="editing" class="modal-backdrop" @click.self="editing = null">
      <form class="card card-pad stack modal" @submit.prevent="saveProduct">
        <h2>{{ editing === 'new' ? 'Tambah produk' : 'Ubah produk' }}</h2>
        <div class="field">
          <label for="pn">Nama</label>
          <input id="pn" v-model="product.name" class="input" required />
        </div>
        <div class="field">
          <label for="pc">Kategori</label>
          <select id="pc" v-model="product.categoryId" class="select">
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="field">
          <label for="pd">Deskripsi</label>
          <textarea id="pd" v-model="product.description" class="textarea" />
        </div>

        <fieldset class="stack">
          <legend class="small muted">Varian pertama (opsional)</legend>
          <div class="row wrap">
            <div class="field grow">
              <label for="vn">Nama varian</label>
              <input id="vn" v-model="variant.name" class="input" placeholder="Hitam / M" />
            </div>
            <div class="field">
              <label for="vs">SKU</label>
              <input id="vs" v-model="variant.sku" class="input" placeholder="KPC-BLK-M" />
            </div>
          </div>
          <div class="row wrap">
            <div class="field grow">
              <label for="vp">Harga</label>
              <input id="vp" v-model.number="variant.price" class="input" type="number" min="0" />
            </div>
            <div class="field grow">
              <label for="vt">Stok</label>
              <input id="vt" v-model.number="variant.stock" class="input" type="number" min="0" />
            </div>
          </div>
        </fieldset>

        <div class="row">
          <button class="btn btn-sm" type="submit">Simpan</button>
          <button class="btn btn-ghost btn-sm" type="button" @click="editing = null">Batal</button>
        </div>
        <p class="tiny muted">
          Upload gambar ke Cloudinary belum ada; gambar produk masih placeholder SVG.
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.thumb {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  object-fit: cover;
}

.right {
  text-align: right;
}

.off {
  opacity: 0.55;
}

.danger {
  color: var(--danger);
}

fieldset {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.75rem;
  margin: 0;
}

ul {
  margin: 0;
  padding-left: 1.1rem;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgb(20 22 26 / 45%);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 50;
}

.modal {
  width: min(520px, 100%);
  max-height: 90vh;
  overflow: auto;
}
</style>
