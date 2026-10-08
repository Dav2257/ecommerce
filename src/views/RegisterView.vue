<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({ name: '', email: '', password: '' })
const error = ref('')

function submit() {
  if (auth.register(form.name, form.email, form.password)) router.push('/')
  else error.value = auth.error
}
</script>

<template>
  <div class="auth-wrap">
    <form class="auth-card stack" @submit.prevent="submit">
      <h1>Daftar</h1>
      <p class="small muted">
        Akun wajib untuk checkout. Ini versi mock, data hilang saat refresh.
      </p>

      <div class="field">
        <label for="nm">Nama</label>
        <input id="nm" v-model="form.name" class="input" autocomplete="name" required />
      </div>
      <div class="field">
        <label for="em">Email</label>
        <input
          id="em"
          v-model="form.email"
          class="input"
          type="email"
          autocomplete="email"
          required
        />
      </div>
      <div class="field">
        <label for="pw">Password</label>
        <input
          id="pw"
          v-model="form.password"
          class="input"
          type="password"
          autocomplete="new-password"
          minlength="6"
          required
        />
      </div>

      <p v-if="error" class="alert alert-error">{{ error }}</p>
      <button class="btn btn-block" type="submit">Daftar</button>
      <p class="small muted">
        Sudah punya akun?
        <RouterLink class="link" to="/login">Masuk</RouterLink>
      </p>
    </form>
  </div>
</template>
