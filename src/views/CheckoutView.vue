<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { money, shippingFeeFor, shippingRates } from '@/data/mock'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/orders'

const auth = useAuthStore()
const cart = useCartStore()
const orders = useOrderStore()
const router = useRouter()

const addresses = computed(() => auth.user?.addresses ?? [])
const selectedAddressId = ref(
  addresses.value.find((a) => a.isDefault)?.id ?? addresses.value[0]?.id ?? null,
)
const showForm = ref(!selectedAddressId.value)
const placing = ref(false)

const form = reactive({
  recipientName: auth.user?.name ?? '',
  phone: auth.user?.phone ?? '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  isDefault: false,
})

const address = computed(
  () => addresses.value.find((a) => a.id === selectedAddressId.value) ?? null,
)
const shippingFee = computed(() => (address.value ? shippingFeeFor(address.value.city) : null))
const cityUnknown = computed(() => !!address.value && shippingFee.value === null)
const total = computed(() => cart.subtotal + (shippingFee.value ?? 0))

const blocked = computed(
  () =>
    cart.invalidLines.length > 0 ||
    !cart.lines.length ||
    !address.value ||
    shippingFee.value === null ||
    placing.value,
)

function saveAddress() {
  if (!form.recipientName || !form.phone || !form.address || !form.city || !form.postalCode) return
  auth.addAddress({ ...form })
  const added = addresses.value[addresses.value.length - 1]
  selectedAddressId.value = added.id
  showForm.value = false
}

function placeOrder() {
  if (blocked.value) return
  placing.value = true
  const order = orders.create({
    lines: cart.lines,
    address: address.value,
    shippingFee: shippingFee.value,
    userName: auth.user.name,
  })
  cart.clear()
  router.push({ name: 'order-detail', params: { id: order.id } })
}
</script>

<template>
  <div class="page container">
    <h1>Checkout</h1>

    <p v-if="!cart.lines.length" class="empty">
      Keranjang kosong. <RouterLink to="/products" class="link">Cari produk dulu</RouterLink>
    </p>

    <div v-else class="split">
      <div class="stack">
        <section class="card card-pad stack">
          <h2>Alamat pengiriman</h2>

          <div v-if="addresses.length" class="stack gap-sm">
            <label
              v-for="a in addresses"
              :key="a.id"
              class="radio card"
              :class="{ picked: selectedAddressId === a.id }"
            >
              <input v-model="selectedAddressId" type="radio" :value="a.id" name="address" />
              <span>
                <strong>{{ a.recipientName }}</strong> · {{ a.phone }}
                <br />
                <span class="small muted">{{ a.address }}, {{ a.city }} {{ a.postalCode }}</span>
              </span>
            </label>
          </div>

          <button
            v-if="!showForm"
            class="btn btn-ghost btn-sm"
            type="button"
            @click="showForm = true"
          >
            Pakai alamat lain
          </button>

          <form v-if="showForm" class="stack" @submit.prevent="saveAddress">
            <div class="row wrap">
              <div class="field grow">
                <label for="rn">Nama penerima</label>
                <input id="rn" v-model="form.recipientName" class="input" required />
              </div>
              <div class="field grow">
                <label for="ph">Telepon</label>
                <input id="ph" v-model="form.phone" class="input" required />
              </div>
            </div>
            <div class="field">
              <label for="ad">Alamat</label>
              <textarea id="ad" v-model="form.address" class="textarea" required />
            </div>
            <div class="row wrap">
              <div class="field grow">
                <label for="ct">Kota</label>
                <select id="ct" v-model="form.city" class="select" required>
                  <option value="" disabled>Pilih kota</option>
                  <option v-for="r in shippingRates" :key="r.city" :value="r.city">
                    {{ r.city }}
                  </option>
                </select>
              </div>
              <div class="field grow">
                <label for="pv">Provinsi</label>
                <input id="pv" v-model="form.province" class="input" required />
              </div>
              <div class="field">
                <label for="pc">Kode pos</label>
                <input
                  id="pc"
                  v-model="form.postalCode"
                  class="input"
                  inputmode="numeric"
                  required
                />
              </div>
            </div>
            <label class="check"
              ><input v-model="form.isDefault" type="checkbox" /> Jadikan alamat utama</label
            >
            <div class="row">
              <button class="btn btn-sm" type="submit">Simpan alamat</button>
              <button
                v-if="addresses.length"
                class="btn btn-ghost btn-sm"
                type="button"
                @click="showForm = false"
              >
                Batal
              </button>
            </div>
          </form>
        </section>

        <section class="card card-pad stack">
          <h2>Item</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Qty</th>
                <th class="right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="l in cart.lines" :key="l.variant.id">
                <td>
                  {{ l.product.name }}
                  <br />
                  <span class="tiny muted"
                    >{{ l.variant.name }} · {{ money(l.variant.price) }}</span
                  >
                </td>
                <td>{{ l.quantity }}</td>
                <td class="right">{{ money(l.subtotal) }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="card card-pad stack">
          <h2>Pembayaran</h2>
          <label class="radio card picked">
            <input type="radio" checked name="payment" />
            <span>
              <strong>Bayar di tempat (COD)</strong>
              <br />
              <span class="small muted">Bayar ke kurir saat barang diterima.</span>
            </span>
          </label>
        </section>
      </div>

      <aside class="card card-pad stack">
        <h2>Total</h2>
        <div class="row-between small">
          <span>Subtotal</span><strong>{{ money(cart.subtotal) }}</strong>
        </div>
        <div class="row-between small">
          <span>Ongkir</span>
          <strong>{{ shippingFee === null ? '—' : money(shippingFee) }}</strong>
        </div>
        <hr class="divider" />
        <div class="row-between">
          <strong>Total</strong><strong>{{ money(total) }}</strong>
        </div>

        <p v-if="cityUnknown" class="alert alert-error">
          Ongkir untuk kota ini belum diatur admin.
        </p>
        <p v-if="cart.invalidLines.length" class="alert alert-error">
          Ada item invalid di keranjang. Kembali ke keranjang untuk memperbaiki.
        </p>

        <RouterLink v-if="cart.invalidLines.length" to="/cart" class="btn btn-ghost btn-block">
          Perbaiki keranjang
        </RouterLink>
        <button class="btn btn-block" type="button" :disabled="blocked" @click="placeOrder">
          {{ placing ? 'Memproses...' : 'Buat pesanan COD' }}
        </button>
        <p class="tiny muted">
          Konfirmasi dulu — setelah tombol ditekan, pesanan dibuat dan stok direserve.
        </p>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.right {
  text-align: right;
}

.radio {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  cursor: pointer;
}

.radio.picked {
  border-color: var(--brand);
  box-shadow: inset 0 0 0 1px var(--brand);
}

.check {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.88rem;
}
</style>
