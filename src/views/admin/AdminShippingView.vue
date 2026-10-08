<script setup>
import { reactive, ref } from 'vue'
import { couriers, money, shippingRates } from '@/data/mock'
import { useAdminStore } from '@/stores/admin'

const admin = useAdminStore()
const rate = reactive({ city: '', province: '', fee: 0 })
const courier = reactive({ id: '', name: '', phone: '' })

function saveRate() {
  if (!rate.city.trim() || rate.fee <= 0) return
  admin.saveRate({ ...rate })
  rate.city = ''
  rate.province = ''
  rate.fee = 0
}

function saveCourier() {
  if (!courier.name.trim() || !courier.phone.trim()) return
  admin.saveCourier({ ...courier })
  courier.id = ''
  courier.name = ''
  courier.phone = ''
}
</script>

<template>
  <div class="stack">
    <h1>Ongkir & Kurir</h1>

    <section class="stack">
      <h2>Ongkir per kota</h2>
      <form class="card card-pad row wrap" @submit.prevent="saveRate">
        <div class="field grow">
          <label for="c">Kota</label>
          <input id="c" v-model="rate.city" class="input" placeholder="Kediri" required />
        </div>
        <div class="field grow">
          <label for="p">Provinsi</label>
          <input id="p" v-model="rate.province" class="input" placeholder="Jawa Timur" required />
        </div>
        <div class="field">
          <label for="f">Ongkir</label>
          <input id="f" v-model.number="rate.fee" class="input" type="number" min="0" required />
        </div>
        <button class="btn btn-sm" type="submit">{{ rate.city ? 'Tambah' : 'Simpan' }}</button>
      </form>

      <table class="table card">
        <thead>
          <tr>
            <th>Kota</th>
            <th>Provinsi</th>
            <th class="right">Ongkir</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in shippingRates" :key="r.city">
            <td>
              {{ r.city }}
              <input
                class="inline"
                type="number"
                min="0"
                :value="r.fee"
                :aria-label="`Ongkir ${r.city}`"
                @change="admin.saveRate({ ...r, fee: Number($event.target.value) })"
              />
            </td>
            <td>
              <input
                class="inline"
                :value="r.province"
                :aria-label="`Provinsi ${r.city}`"
                @change="admin.saveRate({ ...r, province: $event.target.value })"
              />
            </td>
            <td class="right">{{ money(r.fee) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="stack">
      <h2>Kurir</h2>
      <form class="card card-pad row wrap" @submit.prevent="saveCourier">
        <div class="field grow">
          <label for="kn">Nama</label>
          <input id="kn" v-model="courier.name" class="input" placeholder="SiCepat" required />
        </div>
        <div class="field grow">
          <label for="kp">Telepon</label>
          <input id="kp" v-model="courier.phone" class="input" placeholder="0812-..." required />
        </div>
        <button class="btn btn-sm" type="submit">Tambah kurir</button>
      </form>

      <table class="table card">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Telepon</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in couriers" :key="c.id">
            <td>{{ c.name }}</td>
            <td>{{ c.phone }}</td>
            <td>
              <span class="badge" :class="c.status === 'ACTIVE' ? '' : 'badge-grey'">{{
                c.status
              }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <p class="tiny muted">Kurir bukan role login di MVP, hanya data pengiriman (FR-13).</p>
    </section>
  </div>
</template>

<style scoped>
.right {
  text-align: right;
}

.inline {
  width: 8rem;
  padding: 0.25rem 0.4rem;
  border: 1px solid transparent;
  border-radius: 6px;
  margin-left: 0.4rem;
}

.inline:hover,
.inline:focus {
  border-color: var(--border);
}
</style>
