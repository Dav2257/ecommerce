# PRD — Ecommerce COD Single Store

**Status:** Final (Open Questions OQ-01 s.d. OQ-05 sudah diputuskan — lihat Section 10)
**Platform:** Web
**Frontend:** Vue.js
**Backend:** Node.js
**Database:** PostgreSQL
**Image Storage:** Cloudinary
**Hosting/Online Infrastructure:** Firebase untuk kebutuhan hosting/domain yang relevan
**Model bisnis:** Single-store ecommerce
**Payment:** Cash on Delivery (COD)
**Role:** Customer, Admin

---

# 1. Problem Statement

Pemilik toko membutuhkan sistem ecommerce yang memungkinkan pelanggan melihat produk, memesan barang, dan menerima barang melalui courier dengan metode pembayaran COD.

Tanpa sistem terintegrasi, proses tersebut harus dilakukan secara manual melalui chat atau pencatatan terpisah. Hal ini menyebabkan:

### Masalah bagi customer

* Tidak memiliki katalog produk yang terstruktur.
* Sulit mengetahui harga dan stok produk.
* Tidak memiliki wishlist untuk menyimpan produk.
* Pemesanan tidak terdokumentasi dengan baik.
* Sulit mengetahui status pesanan.
* Tidak memiliki sistem review produk.
* Tidak memiliki mekanisme refund ketika barang yang diterima tidak sesuai.

### Masalah bagi admin

* Pengelolaan produk dan stok dilakukan secara manual.
* Pesanan dapat terlewat.
* Sulit mengetahui status setiap pesanan.
* Risiko overselling.
* Sulit mengelola pengiriman.
* Sulit menangani refund secara terstruktur.

### Masalah utama yang harus diselesaikan

Sistem harus menyediakan satu alur terintegrasi:

**produk → cart → checkout → order → pengiriman → COD → pemeriksaan barang → selesai/refund**

---

# 2. Target User + Persona

## 2.1 Customer

Customer adalah pengguna yang membeli produk dari toko.

Customer **wajib memiliki akun**.

Customer dapat:

* Registrasi.
* Login.
* Melihat produk.
* Mencari produk.
* Memfilter produk.
* Melihat detail produk.
* Memilih variant.
* Mengelola wishlist.
* Mengelola cart.
* Checkout.
* Memilih alamat.
* Melihat ongkir.
* Membuat order COD.
* Membatalkan order sesuai status.
* Melihat status pengiriman.
* Mengonfirmasi penerimaan.
* Mengonfirmasi pembayaran COD.
* Mengajukan refund jika barang tidak sesuai.
* Memberikan review.

---

## 2.2 Admin

Admin adalah pemilik/pengelola toko.

Admin dapat:

* Login.
* Mengelola produk.
* Mengelola kategori.
* Mengelola variant.
* Mengelola stok.
* Melihat customer.
* Mengelola order.
* Mengatur status pengiriman.
* Mengelola courier.
* Mengelola ongkir berdasarkan kota.
* Mengelola refund.
* Mengelola review.
* Mengirim/mengelola notifikasi.

Tidak ada role super admin.

---

# Persona 1 — Customer

**Nama:** Andi
**Usia:** 22 tahun

### Goal

Membeli produk secara online tanpa harus datang ke toko.

### Behavior

1. Membuka website.
2. Login.
3. Mencari produk.
4. Melihat detail.
5. Memilih variant.
6. Memasukkan produk ke cart.
7. Checkout.
8. Memilih alamat.
9. Memilih COD.
10. Menunggu courier.
11. Membayar ketika barang tiba.
12. Memeriksa barang.
13. Menyelesaikan order atau mengajukan refund.

### Pain Point

* Tidak tahu stok barang.
* Tidak tahu status order.
* Harus melakukan pemesanan lewat chat.
* Tidak memiliki bukti transaksi yang terstruktur.

---

# Persona 2 — Admin

**Nama:** Budi
**Usia:** 35 tahun

### Goal

Mengelola toko, order, stok, dan pengiriman dari satu dashboard.

### Behavior

1. Login dashboard.
2. Mengelola produk.
3. Memantau order baru.
4. Menyiapkan barang.
5. Mengirim barang melalui courier.
6. Memperbarui status order.
7. Menangani order selesai.
8. Menangani refund jika diperlukan.

### Pain Point

* Stok manual.
* Order mudah terlewat.
* Sulit mengetahui order mana yang sedang dikirim.
* Refund sulit dilacak jika dilakukan manual.

---

# 3. Goals dan Non-Goals

## Goals

### Product

1. Menyediakan katalog ecommerce publik.
2. Menyediakan akun customer.
3. Menyediakan product variant.
4. Menyediakan cart.
5. Menyediakan wishlist.
6. Menyediakan checkout.
7. Menyediakan COD.
8. Menyediakan perhitungan ongkir berdasarkan kota.
9. Menyediakan courier/order delivery tracking berbasis status.
10. Menyediakan inventory management.
11. Mencegah overselling.
12. Menyediakan order management.
13. Menyediakan refund.
14. Menyediakan product review.
15. Menyediakan push notification.

### Technical

1. Vue.js sebagai frontend.
2. Node.js sebagai backend.
3. PostgreSQL sebagai database.
4. Cloudinary untuk penyimpanan gambar.
5. Firebase untuk kebutuhan hosting/online/domain yang telah ditentukan.
6. Backend menjadi sumber kebenaran untuk order dan stok.
7. Database transaction digunakan pada proses kritis.

---

## Non-Goals

Tidak termasuk dalam versi ini:

* Marketplace multi-seller.
* Multiple store.
* Payment gateway.
* Online payment.
* Guest checkout.
* Subscription.
* Affiliate.
* Loyalty point.
* Live shopping.
* AI recommendation.
* Chat customer-admin real-time.
* Multi-currency.
* Multi-language.
* Mobile native app.

---

# 4. User Stories

## Customer

* Sebagai customer, saya ingin membuat akun, sehingga saya dapat melakukan pemesanan.
* Sebagai customer, saya ingin login, sehingga saya dapat mengakses akun dan pesanan saya.
* Sebagai customer, saya ingin melihat katalog, sehingga saya dapat mengetahui produk yang dijual.
* Sebagai customer, saya ingin mencari produk, sehingga saya dapat menemukan barang dengan cepat.
* Sebagai customer, saya ingin memfilter produk berdasarkan kategori, sehingga saya dapat menemukan produk yang relevan.
* Sebagai customer, saya ingin melihat detail produk, sehingga saya dapat mengetahui informasi produk sebelum membeli.
* Sebagai customer, saya ingin memilih variant produk, sehingga saya dapat membeli ukuran/warna/variasi yang saya inginkan.
* Sebagai customer, saya ingin mengetahui stok variant, sehingga saya tidak memesan barang yang tidak tersedia.
* Sebagai customer, saya ingin menambahkan produk ke wishlist, sehingga saya dapat menyimpan produk yang ingin saya beli nanti.
* Sebagai customer, saya ingin menambahkan produk ke cart, sehingga saya dapat mempersiapkan pembelian.
* Sebagai customer, saya ingin mengubah jumlah produk di cart, sehingga saya dapat menentukan jumlah yang ingin dibeli.
* Sebagai customer, saya ingin checkout, sehingga saya dapat membuat pesanan.
* Sebagai customer, saya ingin memilih alamat pengiriman, sehingga barang dikirim ke tempat yang benar.
* Sebagai customer, saya ingin mengetahui biaya pengiriman, sehingga saya mengetahui total biaya yang harus dibayar.
* Sebagai customer, saya ingin memilih COD, sehingga saya dapat membayar ketika barang diterima.
* Sebagai customer, saya ingin melihat status order, sehingga saya mengetahui perkembangan pesanan.
* Sebagai customer, saya ingin membatalkan order sebelum dikirim, sehingga saya dapat membatalkan pembelian yang tidak lagi saya inginkan.
* Sebagai customer, saya ingin mengonfirmasi barang telah diterima, sehingga sistem mengetahui bahwa pengiriman selesai.
* Sebagai customer, saya ingin mengonfirmasi pembayaran COD, sehingga transaksi dapat diselesaikan.
* Sebagai customer, saya ingin mengajukan refund jika barang tidak sesuai, sehingga saya dapat menyelesaikan masalah pesanan.
* Sebagai customer, saya ingin memberikan review, sehingga saya dapat memberikan pengalaman kepada pembeli lain.
* Sebagai customer, saya ingin mengedit review saya, sehingga saya dapat memperbaiki penilaian atau komentar.
* Sebagai customer, saya ingin menerima push notification, sehingga saya mengetahui perubahan status order.

---

## Admin

* Sebagai admin, saya ingin login, sehingga hanya saya yang dapat mengelola toko.
* Sebagai admin, saya ingin menambahkan produk, sehingga produk dapat dijual.
* Sebagai admin, saya ingin mengubah produk, sehingga informasi produk tetap akurat.
* Sebagai admin, saya ingin mengatur variant, sehingga produk dapat memiliki pilihan seperti ukuran atau warna.
* Sebagai admin, saya ingin mengatur stok setiap variant, sehingga inventory dapat dikontrol.
* Sebagai admin, saya ingin mengelola kategori, sehingga produk dapat dikelompokkan.
* Sebagai admin, saya ingin melihat order, sehingga saya dapat memproses pembelian.
* Sebagai admin, saya ingin memperbarui status order, sehingga customer dapat mengetahui perkembangan pesanannya.
* Sebagai admin, saya ingin menentukan courier, sehingga proses pengiriman dapat dilacak.
* Sebagai admin, saya ingin mengatur ongkir berdasarkan kota, sehingga biaya pengiriman dapat dihitung otomatis.
* Sebagai admin, saya ingin melihat refund request, sehingga saya dapat memproses komplain customer.
* Sebagai admin, saya ingin mengubah status refund, sehingga customer mengetahui hasil pengajuan.
* Sebagai admin, saya ingin mengelola review, sehingga review yang tidak sesuai aturan dapat ditangani.

---

# 5. Feature Scope

## MVP

### Customer

* Registration.
* Login/logout.
* Profile.
* Address.
* Homepage.
* Product catalog.
* Search.
* Category.
* Product detail.
* Product variant.
* Wishlist.
* Cart.
* Checkout.
* COD.
* Shipping cost.
* Order history.
* Order status.
* Push notification.
* Order cancellation.
* Delivery confirmation.
* Payment confirmation.
* Refund request.
* Review.

### Admin

* Admin authentication.
* Dashboard.
* Product management.
* Category management.
* Variant management.
* Inventory management.
* Customer management.
* Order management.
* Courier management.
* Shipping fee management.
* Refund management.
* Review management.

---

## V2

* Voucher.
* Discount.
* Promo campaign.
* Multiple customer addresses.
* Advanced product filtering.
* Product sorting.
* Advanced dashboard analytics.
* Sales reports.
* Email notification.
* WhatsApp notification.
* Admin activity log.
* Export order/report.
* More advanced courier tracking.

---

## Nanti

* Online payment.
* Payment gateway.
* Multi-store.
* Multi-seller.
* Loyalty point.
* Affiliate.
* AI recommendation.
* AI chatbot.
* Mobile application.
* Subscription.
* Live shopping.

---

# 6. Functional Requirements — MVP

# FR-01 — Authentication

## Customer Registration

Customer wajib melakukan registrasi sebelum dapat melakukan checkout.

Required:

```text
name
email
password
```

System:

* Email harus unik.
* Password harus di-hash.
* Email harus memiliki format valid.
* Password tidak boleh disimpan plaintext.

---

## Customer Login

Customer login menggunakan:

```text
email
password
```

Backend menghasilkan authentication session/token.

---

## Admin Login

Admin memiliki halaman login terpisah.

Admin tidak dapat menggunakan endpoint customer untuk mengakses resource admin.

Backend wajib melakukan authorization.

---

# FR-02 — Product Catalog

Customer dapat melihat:

* Product image.
* Product name.
* Price.
* Category.
* Rating.
* Availability.

Produk inactive tidak ditampilkan.

Jika produk memiliki variant dengan harga berbeda, harga yang ditampilkan harus merepresentasikan range atau harga variant sesuai aturan UI.

**Requirement harga variant perlu konsisten antara catalog dan checkout.**

---

# FR-03 — Product Detail

Detail produk minimal:

```text
image
name
description
category
variant
price
stock
rating
review
```

Customer dapat memilih variant sebelum menambahkan ke cart.

Contoh:

```text
T-Shirt

Color:
○ Black
○ White

Size:
○ S
○ M
○ L
```

Stock berada pada level variant.

---

# FR-04 — Product Variant

Satu product dapat mempunyai banyak variant.

Contoh:

```text
T-Shirt
 ├── Black / S
 ├── Black / M
 ├── Black / L
 ├── White / S
 ├── White / M
 └── White / L
```

Setiap variant memiliki:

```text
sku
price
stock
status
```

Variant yang stoknya 0 tidak dapat dipesan.

---

# FR-05 — Category

Admin dapat:

* Create.
* Read.
* Update.
* Deactivate.

Category memiliki:

```text
name
slug
status
```

Category yang masih digunakan oleh produk tidak boleh dihapus secara hard delete.

---

# FR-06 — Product Management

Admin dapat:

* Create product.
* Update product.
* Deactivate product.
* Upload image.
* Mengatur description.
* Mengatur category.
* Mengatur variant.

Gambar di-upload ke Cloudinary.

PostgreSQL hanya menyimpan:

```text
cloudinary_url
public_id
```

---

# FR-07 — Inventory

Inventory berada pada level variant.

Contoh:

```text
Variant A
stock = 10
reserved_stock = 2
available_stock = 8
```

Secara logical:

```text
available_stock =
stock - reserved_stock
```

Customer hanya dapat membeli:

```text
quantity <= available_stock
```

---

# FR-08 — Stock Reservation

Karena stok baru benar-benar berkurang ketika pembayaran COD berhasil, sistem harus melakukan reservation ketika order dibuat.

Contoh:

```text
Initial stock = 10

Customer order = 3

stock = 10
reserved = 3

available = 7
```

Customer lain hanya dapat membeli maksimal 7.

Reservation harus dilepas jika order:

* Cancelled.
* Expired (setelah 24 jam, lihat OQ-01).
* Failed delivery setelah admin memutuskan tidak dikirim ulang.
* Refund disetujui.

> Untuk COD, order yang sudah dikirim tidak boleh kehilangan reservation sampai status pembayaran/penyelesaian order ditentukan. Reservation tidak expire untuk order berstatus `SHIPPED`.

---

# FR-09 — Wishlist

Customer dapat:

* Add wishlist.
* Remove wishlist.
* View wishlist.

Constraint:

```text
UNIQUE(user_id, product_id)
```

Produk inactive tetap dapat muncul di wishlist dengan status unavailable.

---

# FR-10 — Cart

Cart memiliki:

```text
product_variant
quantity
```

Customer dapat:

* Add.
* Remove.
* Update quantity.

Sistem harus memvalidasi kembali:

* Product status.
* Variant status.
* Current price.
* Available stock.

Validasi dilakukan saat checkout, bukan hanya saat item dimasukkan ke cart.

---

# FR-11 — Address

Customer wajib memiliki alamat untuk checkout.

Field:

```text
recipient_name
phone
address
city
province
postal_code
```

---

# FR-12 — Shipping Fee

Ongkir dihitung berdasarkan kota.

Admin memiliki konfigurasi:

```text
city
shipping_fee
```

Contoh:

```text
Madiun → Rp10.000
Surabaya → Rp20.000
Malang → Rp18.000
```

Saat checkout:

```text
subtotal
+
shipping_fee
=
total
```

**Tidak menggunakan API shipping eksternal pada MVP.**

---

# FR-13 — Courier

Admin dapat menentukan courier untuk order.

Courier minimal memiliki:

```text
id
name
phone
status
```

Courier tidak menjadi role login terpisah dalam MVP.

Courier hanya direpresentasikan sebagai data pengiriman yang dikelola admin.

---

# FR-14 — Checkout

Checkout menampilkan:

### Order items

```text
Product
Variant
Quantity
Price
Subtotal
```

### Shipping

```text
Recipient
Address
City
Shipping fee
```

### Payment

```text
COD
```

### Total

```text
Subtotal + Shipping Fee
```

Customer harus melakukan confirmation sebelum order dibuat.

---

# FR-15 — Order Creation

Ketika customer menekan `Place Order`, backend harus:

1. Memvalidasi authentication.
2. Memvalidasi cart.
3. Memvalidasi product.
4. Memvalidasi variant.
5. Memvalidasi price.
6. Memvalidasi available stock.
7. Membuat order.
8. Membuat order items.
9. Membuat snapshot alamat.
10. Membuat snapshot harga.
11. Membuat stock reservation.
12. Mengosongkan item cart yang berhasil dipesan.
13. Mengirim notification.
14. Commit transaction.

Semua operasi database kritis harus berada dalam transaction.

---

# FR-16 — Order Status

Status utama:

```text
PENDING
CONFIRMED
PROCESSING
SHIPPED
DELIVERED
COMPLETED
CANCELLED
REFUND_REQUESTED
REFUNDED
```

Flow normal:

```text
PENDING
   ↓
CONFIRMED
   ↓
PROCESSING
   ↓
SHIPPED
   ↓
DELIVERED
   ↓
COMPLETED
```

Cancellation:

```text
PENDING
   ↓
CANCELLED
```

Refund:

```text
DELIVERED
   ↓
REFUND_REQUESTED
   ↓
REFUNDED
```

---

# FR-17 — COD

Payment method hanya:

```text
COD
```

Tidak ada payment gateway.

Payment status:

```text
UNPAID
PAID
```

Sebelum barang diterima:

```text
UNPAID
```

Setelah customer membayar courier:

```text
PAID
```

---

# FR-18 — Delivery Flow

Flow:

```text
Admin
   ↓
Process Order
   ↓
Assign Courier
   ↓
SHIPPED
   ↓
Courier membawa barang
   ↓
DELIVERED
```

Setelah barang sampai, customer harus dapat melakukan konfirmasi.

---

# FR-19 — Customer Delivery Confirmation

Customer melihat:

> Barang sudah sampai?

Customer dapat memilih:

### Barang sesuai

```text
Confirm Received
```

Order:

```text
DELIVERED
→ COMPLETED
```

Customer kemudian membayar COD.

Payment:

```text
UNPAID
→ PAID
```

Stock reservation menjadi stock deduction final.

---

### Barang tidak sesuai

Customer memilih:

```text
Request Refund
```

Order:

```text
DELIVERED
→ REFUND_REQUESTED
```

Customer harus memberikan alasan refund.

---

# FR-20 — Refund

Customer dapat mengajukan refund ketika barang yang diterima tidak sesuai.

Minimal:

```text
reason
description
evidence_image
```

**Bukti gambar** direkomendasikan disimpan di Cloudinary.

Contoh alasan:

* Barang salah.
* Variant salah.
* Barang rusak.
* Barang tidak sesuai deskripsi.
* Barang kurang.

Admin dapat:

```text
Approve
Reject
```

Jika approve:

```text
REFUND_REQUESTED
→ REFUNDED
```

Karena pembayaran dilakukan secara COD kepada courier, uang dikembalikan di luar sistem melalui transfer bank atau e-wallet (lihat OQ-03). Admin mencatat metode, rekening tujuan, dan nomor transaksi pengembalian.

Sistem hanya mencatat status dan bukti pengembalian; admin yang mengirim uangnya.

---

# FR-21 — Order Cancellation

Customer dapat membatalkan order selama belum masuk tahap pengiriman.

Contoh:

```text
PENDING → CANCELLED
CONFIRMED → CANCELLED
PROCESSING → CANCELLED
```

Order yang sudah:

```text
SHIPPED
DELIVERED
COMPLETED
```

tidak dapat menggunakan cancellation biasa.

Reservation stock dikembalikan ketika cancellation berhasil.

---

# FR-22 — Order History

Customer dapat melihat:

* Order number.
* Date.
* Products.
* Variant.
* Quantity.
* Total.
* Status.
* Courier.
* Payment status.

---

# FR-23 — Admin Order Management

Admin dapat:

* View orders.
* Search order.
* Filter status.
* View order detail.
* Confirm order.
* Process order.
* Assign courier.
* Mark shipped.
* Mark delivered jika diperlukan.
* Melihat status pembayaran.
* Memproses refund.

Admin tidak boleh mengubah historical price/order item secara langsung.

---

# FR-24 — Review

Customer hanya dapat memberikan review jika:

```text
order_status = COMPLETED
```

Review:

```text
rating: 1–5
comment
```

Constraint:

```text
UNIQUE(user_id, product_id)
```

Customer hanya boleh memiliki satu review untuk satu produk.

Jika customer tidak puas, review dapat diedit.

---

# FR-25 — Push Notification

Sistem menyediakan push notification untuk event penting.

### Customer notification

Contoh:

```text
Order berhasil dibuat.
```

```text
Order telah dikonfirmasi.
```

```text
Order sedang diproses.
```

```text
Order telah dikirim.
```

```text
Order telah sampai.
```

```text
Refund Anda sedang diproses.
```

```text
Refund Anda telah disetujui.
```

### Admin notification

Contoh:

```text
Pesanan baru masuk.
```

```text
Customer mengajukan refund.
```

Implementasi push notification menggunakan Firebase Cloud Messaging atau mekanisme Firebase yang sesuai.

---

# FR-26 — Customer Management

Admin dapat melihat:

```text
name
email
phone
status
created_at
total_orders
```

Admin tidak dapat melihat password.

---

# FR-27 — Dashboard Admin

Dashboard minimal menampilkan:

```text
Total Orders
Pending Orders
Processing Orders
Shipping Orders
Completed Orders
Refund Requests
```

Dashboard tidak membutuhkan analytics kompleks pada MVP.

---

# 7. Data Model

## Users

```text
users
├── id UUID PK
├── name
├── email UNIQUE
├── password_hash
├── phone
├── role
├── status
├── bank_account
├── ewallet_account
├── created_at
└── updated_at
```

`bank_account` dan `ewallet_account` dipakai sebagai tujuan pengembalian refund COD (lihat OQ-03).

Role:

```text
ADMIN
CUSTOMER
```

---

## Addresses

```text
addresses
├── id UUID PK
├── user_id FK
├── recipient_name
├── phone
├── address
├── city
├── province
├── postal_code
├── is_default
├── created_at
└── updated_at
```

---

## Categories

```text
categories
├── id UUID PK
├── name
├── slug UNIQUE
├── status
├── created_at
└── updated_at
```

---

## Products

```text
products
├── id UUID PK
├── category_id FK
├── name
├── slug UNIQUE
├── description
├── status
├── created_at
└── updated_at
```

Harga tidak wajib berada di `products` jika semua harga ditentukan oleh variant.

---

## Product Images

```text
product_images
├── id UUID PK
├── product_id FK
├── cloudinary_url
├── cloudinary_public_id
├── sort_order
└── created_at
```

---

## Product Variants

```text
product_variants
├── id UUID PK
├── product_id FK
├── sku UNIQUE
├── name
├── price
├── stock
├── reserved_stock
├── status
├── created_at
└── updated_at
```

Contoh:

```text
Product:
T-Shirt

Variants:
Black / S
Black / M
Black / L
```

---

## Wishlist

```text
wishlists
├── id UUID PK
├── user_id FK
├── product_id FK
└── created_at
```

Constraint:

```text
UNIQUE(user_id, product_id)
```

---

## Cart

```text
carts
├── id UUID PK
├── user_id FK
├── created_at
└── updated_at
```

---

## Cart Items

```text
cart_items
├── id UUID PK
├── cart_id FK
├── variant_id FK
├── quantity
└── created_at
```

Constraint:

```text
UNIQUE(cart_id, variant_id)
```

---

## Shipping Rates

```text
shipping_rates
├── id UUID PK
├── city
├── province
├── fee
├── status
├── created_at
└── updated_at
```

---

## Couriers

```text
couriers
├── id UUID PK
├── name
├── phone
├── status
├── created_at
└── updated_at
```

---

## Orders

```text
orders
├── id UUID PK
├── order_number UNIQUE
├── user_id FK
├── courier_id FK
├── subtotal
├── shipping_fee
├── total
├── payment_method
├── payment_status
├── order_status
├── shipping_address_snapshot
├── created_at
└── updated_at
```

---

## Order Items

```text
order_items
├── id UUID PK
├── order_id FK
├── product_id FK
├── variant_id FK
├── product_name
├── variant_name
├── sku
├── price
├── quantity
├── subtotal
└── created_at
```

Product/variant name dan price disimpan sebagai **snapshot**.

---

## Stock Reservations

Disarankan menggunakan entity terpisah.

```text
stock_reservations
├── id UUID PK
├── order_id FK
├── variant_id FK
├── quantity
├── status
├── expires_at
├── created_at
└── released_at
```

Status:

```text
ACTIVE
RELEASED
CONSUMED
EXPIRED
```

`expires_at` = `created_at` + 24 jam (lihat OQ-01). Order `SHIPPED` tidak mengikuti expiry.

---

## Reviews

```text
reviews
├── id UUID PK
├── user_id FK
├── product_id FK
├── order_id FK
├── rating
├── comment
├── status
├── created_at
└── updated_at
```

Constraint:

```text
UNIQUE(user_id, product_id)
```

---

## Refunds

```text
refunds
├── id UUID PK
├── order_id FK
├── user_id FK
├── reason
├── description
├── evidence_image_url
├── evidence_image_public_id
├── evidence_video_url
├── evidence_video_public_id
├── status
├── admin_note
├── refund_method
├── refund_account
├── refund_reference
├── refunded_at
├── created_at
└── updated_at
```

Evidence foto wajib, video opsional (lihat OQ-04).

Status:

```text
PENDING
APPROVED
REJECTED
COMPLETED
```

Refund method:

```text
BANK_TRANSFER
E_WALLET
```

Pengembalian uang dikirim manual oleh admin di luar sistem (lihat OQ-03).

---

## Notifications

```text
notifications
├── id UUID PK
├── user_id FK
├── title
├── message
├── type
├── reference_id
├── is_read
├── created_at
└── read_at
```

---

## Entity Relationship

```text
USER
 │
 ├── ADDRESS
 │
 ├── CART
 │    └── CART_ITEM
 │          └── PRODUCT_VARIANT
 │
 ├── WISHLIST
 │    └── PRODUCT
 │
 ├── ORDER
 │    ├── ORDER_ITEM
 │    │    └── PRODUCT_VARIANT
 │    │
 │    ├── STOCK_RESERVATION
 │    │
 │    ├── REFUND
 │    │
 │    └── COURIER
 │
 ├── REVIEW
 │    └── PRODUCT
 │
 └── NOTIFICATION


CATEGORY
   │
   └── PRODUCT
          ├── PRODUCT_IMAGE
          └── PRODUCT_VARIANT
```

---

# 8. Edge Cases & Failure States

## E-01 — Stock Habis Saat Checkout

Customer melihat stock tersedia, tetapi customer lain lebih dulu melakukan checkout.

Backend melakukan validasi ulang.

Jika tidak tersedia:

```text
409 Conflict
```

Checkout dibatalkan.

---

## E-02 — Dua Customer Membeli Stok Terakhir

Database transaction + locking/reservation harus memastikan hanya satu transaksi mendapatkan stok.

Tidak boleh terjadi:

```text
stock = -1
```

---

## E-03 — Customer Membatalkan Order

Reservation dilepaskan.

```text
reserved_stock -= quantity
```

Available stock kembali bertambah.

---

## E-04 — Order Expired

Jika reservation memiliki expiration time dan customer/order tidak lagi valid:

```text
ACTIVE
→ EXPIRED
```

Stock dikembalikan.

Reservation expire otomatis setelah 24 jam sejak order dibuat (lihat OQ-01). Order yang sudah `SHIPPED` tidak ikut expire.

---

## E-05 — Customer Menutup Browser Saat Checkout

Cart tetap tersimpan.

Tidak boleh membuat order jika customer belum melakukan final confirmation.

---

## E-06 — Customer Double Click "Place Order"

Backend harus menggunakan idempotency mechanism atau request protection.

Tidak boleh menghasilkan:

```text
ORDER-001
ORDER-002
```

untuk satu tindakan checkout yang sama.

---

## E-07 — Admin Memproses Order yang Sudah Cancelled

Backend harus menolak perubahan status ilegal.

---

## E-08 — Customer Membatalkan Order yang Sudah Shipped

Ditolak.

Customer harus menggunakan mekanisme refund jika barang sudah diterima dan tidak sesuai.

---

## E-09 — Courier Tidak Dapat Mengantar

Status tambahan:

```text
DELIVERY_FAILED
```

Flow: `SHIPPED → DELIVERY_FAILED → SHIPPED` (percobaan ulang).

Reservation tetap `ACTIVE` selama percobaan ulang. Admin yang memutuskan aksi berikutnya.

---

## E-10 — Barang Tidak Sesuai

Customer:

```text
DELIVERED
→ REFUND_REQUESTED
```

Customer dapat upload bukti.

Admin melakukan review.

---

## E-11 — Refund Ditolak

```text
REFUND_REQUESTED
→ REFUND_REJECTED
```

Order tetap memiliki histori refund.

---

## E-12 — Produk Dinonaktifkan

Product tidak muncul pada catalog.

Namun product tetap tersedia pada historical order.

---

## E-13 — Variant Dinonaktifkan

Variant tidak dapat dipesan.

Historical order tetap menampilkan variant tersebut.

---

## E-14 — Cloudinary Upload Gagal

Product tidak boleh dianggap memiliki gambar berhasil jika upload gagal.

Admin harus mendapatkan error dan dapat retry.

---

## E-15 — Push Notification Gagal

Order tetap diproses.

Notification failure tidak boleh membatalkan transaction order.

---

## E-16 — Database Failure

Checkout harus atomic.

Jika:

```text
order created
```

tetapi:

```text
stock reservation failed
```

maka transaction harus rollback.

---

## E-17 — Customer Mengubah Alamat Setelah Order

Order menggunakan:

```text
shipping_address_snapshot
```

Alamat yang sudah tersimpan pada order tidak berubah ketika customer mengubah alamat profile.

---

## E-18 — Harga Produk Berubah

Harga pada order tidak ikut berubah.

Order menggunakan price snapshot.

---

# 9. Success Metrics

## Product Metrics

### 1. Checkout Completion Rate

Target awal:

**≥ 70%**

---

### 2. Successful Order Creation

Target:

**≥ 95% checkout attempt berhasil menjadi order**, di luar error yang berasal dari input customer.

---

### 3. Stock Accuracy

Target:

**100%**

Tidak boleh terdapat negative stock.

---

### 4. Overselling

Target:

**0 kasus**

---

### 5. Order Visibility

100% order yang berhasil dibuat harus muncul pada dashboard admin.

---

### 6. COD Completion Rate

Mengukur:

```text
Completed COD Orders
--------------------
All Delivered Orders
```

Target awal:

**≥ 90%**

---

### 7. Refund Resolution

100% refund request harus memiliki status akhir:

```text
APPROVED/COMPLETED
atau
REJECTED
```

Tidak boleh menggantung tanpa status.

---

## Technical Metrics

### API Error Rate

Target:

**< 1%**

---

### Critical Transaction Failure

Target:

**0**

---

### Duplicate Order

Target:

**0**

---

### Negative Stock

Target:

**0**

---

### Unauthorized Access

Target:

**0**

Customer tidak boleh mengakses:

* Admin dashboard.
* Customer lain.
* Order customer lain.
* Admin API.

---

# 10. Keputusan Bisnis (Open Questions — SUDAH SELESAI)

Detail implementasi bisnis di bawah ini sudah diputuskan dan mengikat implementasi.

## OQ-01 — Durasi Stock Reservation

**Keputusan: 24 jam.**

Reservation berlaku 24 jam sejak order dibuat. Setelah itu:

```text
ACTIVE → EXPIRED
```

Reserved stock dilepas dan `available_stock` bertambah kembali.

Order yang sudah masuk `SHIPPED` **tidak** ikut expire — reservation tetap dipegang sampai pembayaran/penyelesaian order ditentukan, karena barang sudah dalam perjalanan.

Ekspirasi dijalankan oleh scheduled job (cron) pada backend.

---

## OQ-02 — Delivery Failure

**Keputusan: kirim ulang, reservation tetap.**

Jika courier gagal mengantar:

```text
SHIPPED → DELIVERY_FAILED → SHIPPED (percobaan ulang)
```

Reservation tetap `ACTIVE` selama percobaan ulang berlangsung. Admin yang memutuskan untuk mengulang.

`DELIVERY_FAILED` hanya mencatat kegagalan, bukan akhir alur order.

---

## OQ-03 — Refund COD

**Keputusan: transfer bank atau e-wallet, dikirim manual oleh admin.**

Karena pembayaran diterima customer secara langsung kepada courier, pengembalian uang dilakukan di luar sistem.

Sistem mencatat:

```text
refund_method      (BANK_TRANSFER | E_WALLET)
refund_account     (nomor rekening / nomor e-wallet tujuan)
refund_reference   (nomor transaksi pengembalian)
refunded_at
```

Data rekening/e-wallet customer disimpan sebagai bagian dari profil customer.

Barang tidak wajib dikembalikan ke toko; hal tersebut ditentukan admin saat memproses refund.

---

## OQ-04 — Bukti Refund

**Keputusan: foto wajib, video opsional.**

Customer wajib mengunggah minimal 1 foto bukti ke Cloudinary. Video bersifat opsional.

Foto disimpan di Cloudinary, PostgreSQL hanya menyimpan `cloudinary_url` dan `cloudinary_public_id`.

---

## OQ-05 — Status DELIVERED

**Keputusan: admin yang mengubah status menjadi `DELIVERED`.**

Courier bukan role sistem pada MVP. Courier hanya data pengiriman yang dikelola admin.

Alur: admin menandai `DELIVERED`, lalu customer melakukan konfirmasi penerimaan (`COMPLETED`) atau mengajukan refund (`REFUND_REQUESTED`).

---

# 11. Definition of Done

Product dinyatakan **DONE** apabila skenario utama berikut berhasil dilakukan secara end-to-end.

### Customer

```text
Register
 ↓
Login
 ↓
Browse Product
 ↓
Search
 ↓
Category
 ↓
Product Detail
 ↓
Select Variant
 ↓
Add Cart
 ↓
Checkout
 ↓
Select Address
 ↓
System Calculate Shipping
 ↓
COD
 ↓
Place Order
```

### Admin

```text
Receive Order
 ↓
Confirm Order
 ↓
Process Order
 ↓
Assign Courier
 ↓
Ship Order
```

### Delivery

```text
Courier
 ↓
Deliver
 ↓
Customer Receives
 ↓
Customer Pays COD
 ↓
Customer Checks Product
```

### Barang sesuai

```text
Customer Confirm
 ↓
Order COMPLETED
 ↓
Stock Reservation → CONSUMED
 ↓
Stock Deducted
 ↓
Customer Can Review
```

### Barang tidak sesuai

```text
Customer
 ↓
Refund Request
 ↓
Upload Evidence
 ↓
Admin Review
 ↓
Approve / Reject
 ↓
Refund Completed / Rejected
```

### Sistem harus menjamin

```text
Authentication
Authorization
Stock Consistency
Stock Reservation
Order Consistency
Price Snapshot
Address Snapshot
COD Status
Refund Tracking
Review Validation
Push Notification
```

Dengan demikian, versi ini bukan sekadar **catalog ecommerce**, tetapi sudah mendefinisikan **siklus transaksi lengkap untuk single-store ecommerce berbasis COD**, dari customer pertama kali masuk sampai order selesai atau masuk proses refund.
