import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

// ponytail: session mock, reset tiap refresh. Backend auth menyusul.
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const error = ref('')

  const isLoggedIn = computed(() => !!user.value)

  function login(email, password) {
    error.value = ''
    if (!email || !password) {
      error.value = 'Email dan password wajib diisi.'
      return false
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      error.value = 'Format email tidak valid.'
      return false
    }
    user.value = {
      id: 'u1',
      name: email.split('@')[0],
      email,
      phone: '0812-3456-7890',
      bankAccount: '1234567890 a.n. Andi Saputra',
      ewalletAccount: '081234567890 (GoPay)',
      addresses: [
        {
          id: 'a1',
          recipientName: 'Andi Saputra',
          phone: '081234567890',
          address: 'Jl. Merdeka No. 12 RT 04 RW 09',
          city: 'Madiun',
          province: 'Jawa Timur',
          postalCode: '63122',
          isDefault: true,
        },
      ],
    }
    return true
  }

  function register(name, email, password) {
    error.value = ''
    if (!name || !email || !password) {
      error.value = 'Nama, email, dan password wajib diisi.'
      return false
    }
    if (password.length < 6) {
      error.value = 'Password minimal 6 karakter.'
      return false
    }
    return login(email, password)
  }

  function logout() {
    user.value = null
  }

  function addAddress(address) {
    if (!user.value) return
    if (address.isDefault) user.value.addresses.forEach((a) => (a.isDefault = false))
    user.value.addresses.push({ ...address, id: `a${user.value.addresses.length + 1}` })
  }

  return { user, error, isLoggedIn, login, register, logout, addAddress }
})
