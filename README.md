# 🥦 Groceria — Smart Grocery Management App

## Hasil Pengujian

### Pengujian Fungsional (Functional Testing)

| No | Skenario Pengujian              | Input / Aksi                                         | Output yang Diharapkan                                   | Hasil  |
|----|---------------------------------|------------------------------------------------------|----------------------------------------------------------|--------|
| 1  | Register akun baru              | Email & password valid (≥6 karakter)                 | Akun terdaftar, redirect ke halaman login                | Pass |
| 2  | Register dengan password pendek | Password kurang dari 6 karakter                      | Muncul pesan error "Password minimal 6 karakter"         | Pass |
| 3  | Login dengan kredensial valid   | Email & password terdaftar                           | Login berhasil, redirect ke dashboard                    | Pass |
| 4  | Login dengan kredensial salah   | Email/password tidak sesuai                          | Muncul pesan error dari Supabase                         | Pass |
| 5  | Tambah produk ke keranjang      | Klik tombol "+ Keranjang" pada produk                | Item muncul di shopping list, counter bertambah          | Pass |
| 6  | Tambah produk yang sudah ada    | Klik "+ Keranjang" pada produk yang sudah di cart    | Quantity bertambah +1, tidak duplikat                    | Pass |
| 7  | Tambah quantity item            | Klik tombol "+" pada item di shopping list           | Quantity +1, subtotal & total diperbarui                 | Pass |
| 8  | Kurangi quantity item           | Klik tombol "−" pada item di shopping list           | Quantity −1, jika 0 item terhapus otomatis               | Pass |
| 9  | Hapus item dari keranjang       | Klik tombol "✕" pada item                            | Item terhapus dari database dan UI diperbarui            | Pass |
| 10 | Set budget bulanan              | Input angka dan klik "Simpan Budget"                 | Budget tersimpan di localStorage, UI diperbarui          | Pass |
| 11 | Deteksi Mode Hemat              | Total belanja ≥ 80% dari budget                      | Banner "Mode Hemat Aktif" muncul otomatis                | Pass |
| 12 | Auto Shopping List              | Klik tombol "🔄 Auto Shopping List"                  | Item dengan stok ≤ 2 otomatis ditambahkan ke keranjang   | Pass |
| 13 | Notifikasi stok rendah          | Stok salah satu item ≤ 2                             | Banner notifikasi merah muncul dengan nama item          | Pass |
| 14 | Smart Recommendation            | Terdapat riwayat transaksi                           | Muncul daftar rekomendasi produk berdasarkan frekuensi   | Pass |
| 15 | Proses checkout                 | Keranjang berisi item, klik "Bayar Sekarang"         | Transaksi tersimpan, stok diupdate, cart dikosongkan     | Pass |
| 16 | Checkout dengan keranjang kosong| Klik checkout tanpa item                             | Muncul pesan "Keranjang kosong!"                         | Pass |
| 17 | Lihat riwayat transaksi         | Klik menu "📜 Riwayat"                               | Semua transaksi tampil dikelompokkan per sesi + analisis | Pass |
| 18 | Analisis riwayat belanja        | Terdapat minimal 1 transaksi                         | Tampil total pengeluaran, jumlah item, produk terbanyak  | Pass |
| 19 | Kurangi stok manual             | Klik "- Pakai" pada item di Stok Saya                | Stok berkurang 1, UI diperbarui                          | Pass |
| 20 | Logout                          | Klik tombol "Keluar"                                 | Sesi berakhir, redirect ke halaman login                 | Pass |

### Pengujian Antarmuka (UI/UX Testing)

| No | Aspek Pengujian                | Kriteria                                               | Hasil  |
|----|--------------------------------|--------------------------------------------------------|--------|
| 1  | Responsif Mobile (≤600px)      | Layout menyesuaikan, hamburger menu aktif              | Pass |
| 2  | Responsif Tablet (≤900px)      | Grid 2 kolom, hero vertikal                            | Pass |
| 3  | Responsif Desktop (>900px)     | Layout 3 kolom, hero horizontal                        | Pass |
| 4  | Animasi fade-in hero           | Hero section muncul dengan animasi saat load           | Pass |
| 5  | Scroll reveal section          | Elemen muncul animasi saat di-scroll ke dalam viewport | Pass |
| 6  | Navbar sticky & transparan     | Navbar transparan saat top, frosted glass saat scroll  | Pass |
| 7  | Toast notification             | Notifikasi muncul 3 detik lalu menghilang otomatis     | Pass |
| 8  | Progress bar budget            | Bar berubah warna: hijau → orange → merah sesuai % pemakaian | Pass |
| 9  | Smooth scroll navigasi         | Klik link navbar scroll halus ke section tujuan        | Pass |
| 10 | Form validasi kontak           | Field kosong tidak bisa submit, muncul pesan sukses    | Pass |

### Pengujian Keamanan & Autentikasi

| No | Skenario                             | Hasil yang Diharapkan                             | Hasil  |
|----|--------------------------------------|---------------------------------------------------|--------|
| 1  | Akses dashboard tanpa login          | Redirect otomatis ke halaman login                | Pass |
| 2  | Akses checkout tanpa login           | Redirect otomatis ke halaman login                | Pass |
| 3  | Akses history tanpa login            | Redirect otomatis ke halaman login                | Pass |
| 4  | Data terpisah antar pengguna         | Setiap user hanya melihat data miliknya sendiri   | Pass |
| 5  | Session persist setelah refresh      | Pengguna tetap login setelah refresh halaman      | Pass |
