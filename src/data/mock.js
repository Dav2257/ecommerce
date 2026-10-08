import { reactive } from 'vue'

// ponytail: data mock in-memory, tanpa DB/API/persistensi.
// Ganti file ini dengan fetch() + backend saat sudah ada server.
// Dipakai langsung oleh store (bukan seed lalu di-copy) supaya edit admin
// kelihatan di katalog tanpa lapisan repository tambahan.

const img = (seed) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
      <rect width="600" height="600" fill="${hashColor(seed)}"/>
      <text x="50%" y="52%" font-family="system-ui,sans-serif" font-size="200"
        fill="#fff" opacity=".85" text-anchor="middle">${initials(seed)}</text>
    </svg>`,
  )}`

const hashColor = (s) => {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360
  return `hsl(${h} 45% 45%)`
}

const initials = (s) =>
  s
    .split('-')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

export const categories = reactive([
  { id: 'c1', name: 'Kaos', slug: 'kaos' },
  { id: 'c2', name: 'Kemeja', slug: 'kemeja' },
  { id: 'c3', name: 'Celana', slug: 'celana' },
  { id: 'c4', name: 'Jaket', slug: 'jaket' },
  { id: 'c5', name: 'Aksesoris', slug: 'aksesoris' },
])

export const products = reactive([
  {
    id: 'p1',
    slug: 'kaos-polos-cotton',
    name: 'Kaos Polos Cotton 30s',
    categoryId: 'c1',
    description:
      'Kaos polos bahan cotton combed 30s, adem dan tidak mudah melar. Cocok untuk pemakaian harian.',
    status: 'ACTIVE',
    variants: [
      { id: 'v1', name: 'Hitam / M', sku: 'KPC-BLK-M', price: 65000, stock: 12, reserved: 0 },
      { id: 'v2', name: 'Hitam / L', sku: 'KPC-BLK-L', price: 65000, stock: 8, reserved: 0 },
      { id: 'v3', name: 'Putih / M', sku: 'KPC-WHT-M', price: 65000, stock: 0, reserved: 0 },
      { id: 'v4', name: 'Putih / L', sku: 'KPC-WHT-L', price: 65000, stock: 5, reserved: 0 },
    ],
  },
  {
    id: 'p2',
    slug: 'kaos-oversize-remix',
    name: 'Kaos Oversize Remix',
    categoryId: 'c1',
    description: 'Potongan oversize dengan jahitan rantai. Bahan katun rajut tebal tapi adem.',
    status: 'ACTIVE',
    variants: [
      { id: 'v5', name: 'Navy / M', sku: 'KOR-NAV-M', price: 89000, stock: 6, reserved: 1 },
      { id: 'v6', name: 'Navy / L', sku: 'KOR-NAV-L', price: 89000, stock: 3, reserved: 0 },
      { id: 'v7', name: 'Maroon / L', sku: 'KOR-MRN-L', price: 89000, stock: 0, reserved: 0 },
    ],
  },
  {
    id: 'p3',
    slug: 'kemeja-fl linen',
    name: 'Kemeja Flax Linen',
    categoryId: 'c2',
    description:
      'Kemeja formal dari linen flax, tegur dan nyaman. Cocok untuk kantor maupun acara santai.',
    status: 'ACTIVE',
    variants: [
      { id: 'v8', name: 'Cream / M', sku: 'KFL-CRM-M', price: 175000, stock: 4, reserved: 0 },
      { id: 'v9', name: 'Cream / L', sku: 'KFL-CRM-L', price: 175000, stock: 2, reserved: 0 },
      { id: 'v10', name: 'Biru / M', sku: 'KFL-BLU-M', price: 175000, stock: 7, reserved: 0 },
    ],
  },
  {
    id: 'p4',
    slug: 'celana-chino-slash',
    name: 'Celana Chino Slim',
    categoryId: 'c3',
    description: 'Celana chino potongan slim, bahan twill stretch. Nyaman untuk gerak harian.',
    status: 'ACTIVE',
    variants: [
      { id: 'v11', name: 'Khaki / 30', sku: 'CCH-KHK-30', price: 159000, stock: 10, reserved: 2 },
      { id: 'v12', name: 'Khaki / 32', sku: 'CCH-KHK-32', price: 159000, stock: 9, reserved: 0 },
      { id: 'v13', name: 'Hitam / 32', sku: 'CCH-BLK-32', price: 159000, stock: 1, reserved: 0 },
    ],
  },
  {
    id: 'p5',
    slug: 'jaket-bomber-rajut',
    name: 'Jaket Bomber Rajut',
    categoryId: 'c4',
    description: 'Bomber rajut dengan lining polypeyester, tahan angin ringan.',
    status: 'ACTIVE',
    variants: [
      { id: 'v14', name: 'Olive / M', sku: 'JBR-OLV-M', price: 249000, stock: 3, reserved: 0 },
      { id: 'v15', name: 'Olive / L', sku: 'JBR-OLV-L', price: 249000, stock: 0, reserved: 0 },
      { id: 'v16', name: 'Hitam / L', sku: 'JBR-BLK-L', price: 249000, stock: 5, reserved: 0 },
    ],
  },
  {
    id: 'p6',
    slug: 'topi-baseball-katun',
    name: 'Topi Baseball Katun',
    categoryId: 'c5',
    description: 'Topi baseball bahan katun twill, adjustable strap.',
    status: 'ACTIVE',
    variants: [
      { id: 'v17', name: 'Hitam', sku: 'TBB-BLK', price: 59000, stock: 15, reserved: 0 },
      { id: 'v18', name: 'Putih', sku: 'TBB-WHT', price: 59000, stock: 0, reserved: 0 },
    ],
  },
  {
    id: 'p7',
    slug: 'tas-ransel-urban',
    name: 'Tas Ransel Urban 20L',
    categoryId: 'c5',
    description: 'Ransel 20 liter dengan compartment laptop 15 inci, bahan poliester coated.',
    status: 'ACTIVE',
    variants: [
      { id: 'v19', name: 'Charcoal', sku: 'TRU-CHR', price: 289000, stock: 4, reserved: 0 },
      { id: 'v20', name: 'Olive', sku: 'TRU-OLV', price: 289000, stock: 2, reserved: 1 },
    ],
  },
])

export const shippingRates = reactive([
  { city: 'Madiun', province: 'Jawa Timur', fee: 10000 },
  { city: 'Surabaya', province: 'Jawa Timur', fee: 20000 },
  { city: 'Malang', province: 'Jawa Timur', fee: 18000 },
  { city: 'Jakarta', province: 'DKI Jakarta', fee: 32000 },
  { city: 'Bandung', province: 'Jawa Barat', fee: 28000 },
])

export const couriers = reactive([
  { id: 'k1', name: 'JNE Reguler', phone: '0812-1000-0001', status: 'ACTIVE' },
  { id: 'k2', name: 'J&T Express', phone: '0812-1000-0002', status: 'ACTIVE' },
])

export const customers = reactive([
  {
    id: 'u1',
    name: 'Andi Saputra',
    email: 'andi@example.com',
    phone: '081234567890',
    status: 'ACTIVE',
    createdAt: '2026-08-01T09:00:00.000Z',
  },
  {
    id: 'u2',
    name: 'Sinta Dewi',
    email: 'sinta@example.com',
    phone: '081298765432',
    status: 'ACTIVE',
    createdAt: '2026-08-14T09:00:00.000Z',
  },
  {
    id: 'u3',
    name: 'Rudi Hartono',
    email: 'rudi@example.com',
    phone: '085611223344',
    status: 'ACTIVE',
    createdAt: '2026-09-02T09:00:00.000Z',
  },
])

export const seedReviews = [
  {
    id: 'r1',
    productId: 'p1',
    userName: 'Andi',
    rating: 5,
    comment: 'Bahannya adem, sesuai deskripsi. Packing rapi.',
    createdAt: '2026-09-12T10:00:00.000Z',
  },
  {
    id: 'r2',
    productId: 'p1',
    userName: 'Sinta',
    rating: 4,
    comment: 'Bagus, cuma jahitannya agak rada tipis.',
    createdAt: '2026-09-20T08:30:00.000Z',
  },
  {
    id: 'r3',
    productId: 'p3',
    userName: 'Rudi',
    rating: 5,
    comment: 'Linen-nya bagus banget, recommended.',
    createdAt: '2026-10-01T13:00:00.000Z',
  },
]

// Order contoh supaya dashboard admin tidak kosong. Reservation-nya sudah
// ikut tercermin di field `reserved` tiap variant.
export const seedOrders = [
  {
    id: 'o1',
    orderNumber: 'COD-0001',
    customerName: 'Andi Saputra',
    items: [
      {
        productId: 'p1',
        variantId: 'v1',
        productName: 'Kaos Polos Cotton 30s',
        variantName: 'Hitam / M',
        sku: 'KPC-BLK-M',
        price: 65000,
        quantity: 2,
        subtotal: 130000,
      },
    ],
    address: {
      recipientName: 'Andi Saputra',
      phone: '081234567890',
      address: 'Jl. Merdeka No. 12 RT 04 RW 09',
      city: 'Madiun',
      province: 'Jawa Timur',
      postalCode: '63122',
    },
    shippingFee: 10000,
    subtotal: 130000,
    total: 140000,
    paymentMethod: 'COD',
    paymentStatus: 'UNPAID',
    status: 'DELIVERED',
    courier: 'J&T Express',
    createdAt: '2026-10-02T08:00:00.000Z',
    refund: null,
    history: [
      { status: 'PENDING', at: '2026-10-02T08:00:00.000Z' },
      { status: 'CONFIRMED', at: '2026-10-02T09:00:00.000Z' },
      { status: 'PROCESSING', at: '2026-10-02T10:00:00.000Z' },
      { status: 'SHIPPED', at: '2026-10-02T14:00:00.000Z' },
      { status: 'DELIVERED', at: '2026-10-05T09:00:00.000Z' },
    ],
  },
  {
    id: 'o2',
    orderNumber: 'COD-0002',
    customerName: 'Sinta Dewi',
    items: [
      {
        productId: 'p4',
        variantId: 'v11',
        productName: 'Celana Chino Slim',
        variantName: 'Khaki / 30',
        quantity: 1,
        subtotal: 159000,
      },
      {
        productId: 'p6',
        variantId: 'v17',
        productName: 'Topi Baseball Katun',
        variantName: 'Hitam',
        sku: 'TBB-BLK',
        price: 59000,
        quantity: 1,
        subtotal: 59000,
      },
    ],
    address: {
      recipientName: 'Sinta Dewi',
      phone: '081298765432',
      address: 'Jl. Pahlawan 45',
      city: 'Surabaya',
      province: 'Jawa Timur',
      postalCode: '60171',
    },
    shippingFee: 20000,
    subtotal: 218000,
    total: 238000,
    paymentMethod: 'COD',
    paymentStatus: 'UNPAID',
    status: 'PENDING',
    courier: null,
    createdAt: '2026-10-07T11:30:00.000Z',
    refund: null,
    history: [{ status: 'PENDING', at: '2026-10-07T11:30:00.000Z' }],
  },
]

export const money = (n) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n)

export const productBySlug = (slug) => products.find((p) => p.slug === slug)
export const productById = (id) => products.find((p) => p.id === id)
export const categoryById = (id) => categories.find((c) => c.id === id)
// Objek asli (bukan copy) supaya mutasi stok di store benar-benar tersimpan.
export const variantById = (id) =>
  products.flatMap((p) => p.variants).find((v) => v.id === id) ?? null
export const productOfVariant = (id) =>
  products.find((p) => p.variants.some((v) => v.id === id)) ?? null
export const availableStock = (v) => v.stock - v.reserved
export const shippingFeeFor = (city) =>
  shippingRates.find((r) => r.city.toLowerCase() === String(city ?? '').toLowerCase())?.fee ?? null
export const productImage = (p) => img(p.slug)
