<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const error = ref('')

function submit() {
  if (auth.login(form.email, form.password)) router.push(String(route.query.redirect ?? '/'))
  else error.value = auth.error
}
</script>

<template>
  <div class="auth-wrap">
    <form class="auth-card stack" @submit.prevent="submit">
      <h1>Masuk</h1>
      <p class="small muted">Demo: email apa saja yang valid, password bebas.</p>

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
          autocomplete="current-password"
          required
        />
      </div>

      <p v-if="error" class="alert alert-error">{{ error }}</p>
      <button class="btn btn-block" type="submit">Masuk</button>
      <p class="small muted">
        Belum punya akun?
        <RouterLink class="link" to="/register">Daftar</RouterLink>
      </p>
    </form>
  </div>
</template>
