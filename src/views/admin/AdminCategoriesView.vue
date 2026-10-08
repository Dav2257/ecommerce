<script setup>
import { reactive, ref } from 'vue'
import { categories } from '@/data/mock'
import { useAdminStore } from '@/stores/admin'

const admin = useAdminStore()
const form = reactive({ id: '', name: '' })
const error = ref('')

function save() {
  if (!form.name.trim()) {
    error.value = 'Nama kategori wajib diisi.'
    return
  }
  admin.saveCategory({ ...form })
  form.id = ''
  form.name = ''
  error.value = ''
}

const edit = (c) => {
  form.id = c.id
  form.name = c.name
}

const reset = () => {
  form.id = ''
  form.name = ''
}
</script>

<template>
  <div class="stack">
    <h1>Kategori</h1>

    <form class="card card-pad row wrap" @submit.prevent="save">
      <div class="field grow">
        <label for="cn">Nama kategori</label>
        <input id="cn" v-model="form.name" class="input" placeholder="Sepatu" required />
      </div>
      <button class="btn btn-sm" type="submit">{{ form.id ? 'Ubah' : 'Tambah' }}</button>
      <button v-if="form.id" class="btn btn-ghost btn-sm" type="button" @click="reset">
        Batal
      </button>
    </form>

    <p v-if="error" class="alert alert-error">{{ error }}</p>

    <table class="table card">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Slug</th>
          <th class="right">Dipakai produk</th>
          <th>Status</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in categories" :key="c.id">
          <td>{{ c.name }}</td>
          <td class="tiny muted">{{ c.slug }}</td>
          <td class="right">{{ admin.categoryUsage(c.id) }}</td>
          <td>
            <span class="badge" :class="c.status === 'ACTIVE' ? '' : 'badge-grey'">{{
              c.status
            }}</span>
          </td>
          <td class="right">
            <button class="btn-link tiny" type="button" @click="edit(c)">Ubah</button>
            <button class="btn-link tiny" type="button" @click="admin.toggleCategory(c.id)">
              {{ c.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p class="tiny muted">
      Kategori hanya dinonaktifkan, tidak dihapus — kategori yang masih dipakai produk harus tetap
      ada (FR-05).
    </p>
  </div>
</template>

<style scoped>
.right {
  text-align: right;
}
</style>
