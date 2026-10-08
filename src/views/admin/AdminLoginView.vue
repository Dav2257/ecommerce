<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { useAdminStore } from '@/stores/admin'

const admin = useAdminStore()
const router = useRouter()
const form = reactive({ email: 'admin@kioskita.test', password: 'admin123' })
const error = ref('')

function submit() {
  if (admin.login(form.email, form.password)) router.push('/admin')
  else error.value = admin.error
}
</script>

<template>
  <div class="auth-wrap">
    <form class="auth-card stack" @submit.prevent="submit">
      <p class="tiny muted">Halaman admin terpisah dari akun customer.</p>
      <h1>Admin masuk</h1>

      <div class="field">
        <label for="em">Email</label>
        <input id="em" v-model="form.email" class="input" type="email" required />
      </div>
      <div class="field">
        <label for="pw">Password</label>
        <input id="pw" v-model="form.password" class="input" type="password" required />
      </div>

      <p v-if="error" class="alert alert-error">{{ error }}</p>
      <button class="btn btn-block" type="submit">Masuk dashboard</button>
      <p class="small muted">
        <RouterLink to="/" class="link">← Kembali ke toko</RouterLink>
      </p>
    </form>
  </div>
</template>
