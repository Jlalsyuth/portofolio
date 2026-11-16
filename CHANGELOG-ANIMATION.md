# Changelog & Animation System Documentation

Dokumen ini mencatat seluruh pembaruan sistem animasi tingkat lanjut (*Motion Design*), komponen interaktif, serta *Partnership Marquee* kelas dunia yang telah diintegrasikan ke dalam website portofolio Next.js 14+ (App Router).

---

## 1. Daftar File yang Dibuat & Dimodifikasi

### File Baru:
1. **`src/components/CustomCursor.tsx`**
   - Komponen floating cursor kustom dengan *trailing ring* berbasis pegas fisika (*spring physics*) dan *center dot*.
   - Otomatis membesar dan berubah warna saat *hover* elemen interaktif (`button`, `a`, form input, role button).
   - Dilengkapi deteksi otomatis perangkat mobile / layar sentuh (*touch / coarse pointer*) untuk dinonaktifkan secara aman tanpa membebani performa mobile.
2. **`src/components/InteractiveBackground.tsx`**
   - Komponen background dinamis dengan *Subtle Mesh Gradient Orbs* yang mengapung perlahan serta *Glowing Mouse Follower Gradient* yang mengikuti pergerakan kursor di balik konten halaman.
3. **`src/components/RippleEffect.tsx`**
   - Komponen pembungkus efek mikro-animasi klik (*mouse click ripple effect*) yang halus dan modern untuk tombol, kartu, dan link.
4. **`src/components/MotionReveal.tsx`**
   - Kumpulan wrapper utilitas animasi scroll: `MotionReveal` (reveal arah atas, bawah, kiri, kanan, atau skala fade-in), `MotionStaggerContainer`, dan `MotionStaggerItem` (animasi bertingkat / berurutan untuk grid kartu).
5. **`src/components/PartnershipMarquee.tsx`**
   - Komponen *Partnership & Contribution Marquee* dengan *infinite horizontal ticker* yang halus.
   - Menampilkan instansi tempat berkontribusi (seperti PT PLN, Universitas Brawijaya, Telkom Indonesia, Kominfo, Bank Mandiri, Dicoding, GDSC, Startup Studio).
   - Logo bertransisi dari grayscale ke warna penuh saat di-hover, dilengkapi tooltip info peran/kontribusi, serta otomatis *pause on hover*.
6. **`CHANGELOG-ANIMATION.md`** (File ini)
   - Dokumentasi teknis lengkap dan panduan pemeliharaan sistem animasi.

### File yang Dimodifikasi:
1. **`package.json`**
   - Menambahkan dependensi `framer-motion` (versi `^12.x` / modern Next.js 14 App Router compatible).
2. **`src/app/globals.css`**
   - Menambahkan keyframes animasi:
     - `@keyframes marquee` untuk infinite ticker looping.
     - `@keyframes mesh-orb-1`, `mesh-orb-2`, `mesh-orb-3` untuk mesh gradient pernapasan background.
     - `@keyframes ripple` untuk efek ripple klik.
     - `scroll-behavior: smooth` pada root HTML.
3. **`src/components/ProjectCard.tsx`**
   - Ditingkatkan dengan efek **3D Tilt Directional Hover** menggunakan kalkulasi kursor mouse (`useMotionValue`, `useSpring`, `useTransform`).
   - Dilengkapi *dynamic glare spotlight* yang memantulkan kilau cahaya sesuai posisi kursor saat berada di atas kartu.
   - Tombol live demo & GitHub diintegrasikan dengan `RippleEffect`.
4. **`src/app/layout.tsx`**
   - Mengintegrasikan `InteractiveBackground` dan `CustomCursor` secara global di tingkat layout utama.
5. **`src/app/page.tsx` (Homepage)**
   - Mengintegrasikan `MotionReveal` pada Hero Section, About/Skills Section, dan Timeline.
   - Mengintegrasikan `PartnershipMarquee` di bawah Hero section.
   - Mengintegrasikan `MotionStaggerContainer` & `MotionStaggerItem` pada Quick Category Cards dan Featured Projects Grid.
   - Tombol CTA utama (Unduh CV, Hubungi Saya) kini memiliki `RippleEffect`.
6. **`src/app/category/[slug]/page.tsx`**
   - Menambahkan transisi reveal dan stagger animation untuk katalog proyek berdasarkan kategori.
7. **`src/app/project/[slug]/page.tsx`**
   - Menambahkan transisi reveal bertingkat untuk judul proyek, navigasi balik, media viewer, studi kasus markdown, serta CTA demo dengan ripple effect.

---

## 2. Penjelasan Teknis & Cara Kerja Animasi

### A. Framer Motion Scroll-Triggered Reveal
- **Cara Kerja**: Menggunakan prop `whileInView` dan `viewport={{ once: true, margin: '-40px' }}` agar animasi hanya dijalankan sekali ketika elemen pertama kali masuk ke dalam viewport browser.
- **Optimasi**:
  - `once: true` mencegah kalkulasi ulang layout browser ketika pengguna melakukan scroll bolak-balik.
  - Memanfaatkan *GPU-accelerated properties* (`transform` dan `opacity`) untuk menghindari browser reflow/repaint berat.

### B. Interactive Background & Glowing Mouse Follower
- **Cara Kerja**: Komponen mendengarkan koordinat mouse klien (`clientX`, `clientY`) lalu dialirkan ke `useMotionValue` yang dihaluskan oleh `useSpring({ damping: 30, stiffness: 180 })`.
- **Mesh Gradients**: 3 buah orb gradient dengan animasi rotasi/translasi skala CSS murni (`@keyframes mesh-orb-*`) yang berjalan pada *compositor thread* tanpa membebani JavaScript thread utama.
- **Layering**: Diletakkan pada `pointer-events-none` dengan z-index `0`, sehingga interaktivitas tombol/link di atasnya tetap 100% responsif.

### C. 3D Tilt & Glare Card Interaction (`ProjectCard.tsx`)
- **Cara Kerja**:
  - Mengambil `getBoundingClientRect()` kartu saat event `onMouseMove`.
  - Menghitung deviasi posisi kursor terhadap titik tengah kartu dalam rentang `-0.5` hingga `0.5`.
  - Ditransformasi menjadi sudut rotasi 3D `-7deg` sampai `7deg` via `useTransform` dan `rotateX`/`rotateY`.
  - Glare spotlight bergerak secara radial mengikuti koordinat kursor di atas kartu dengan gradien radial transparan.
- **Pelepasan**: Saat `onMouseLeave`, rotasi dikembalikan secara mulus ke posisi awal `0deg` oleh spring physics.

### D. Interactive Ripple Click Effect (`RippleEffect.tsx`)
- **Cara Kerja**: Setiap klik mendeteksi posisi `clientX` dan `clientY` relatif terhadap kontainer pembungkus, lalu menciptakan elemen lingkar yang membesar (`scale(0)` ke `scale(1)`) dan memudar (`opacity: 0.75` ke `opacity: 0`) dalam durasi 600ms, lalu dibersihkan dari state memori.

### E. Custom Fluid Cursor (`CustomCursor.tsx`)
- **Cara Kerja**: Menggabungkan dot berkecepatan 1:1 dengan outer ring yang mengikuti menggunakan `useSpring` ber-damping halus.
- **Hover Detection**: Mendengarkan `mouseover` untuk elemen `a, button, input, [role="button"]` dan secara instan memperbesar skala ring cursor dari 36px ke 54px serta mengubah ketebalan border.
- **Mobile Friendly**: Memeriksa `window.matchMedia('(pointer: coarse)')` dan `ontouchstart`—komponen otomatis return `null` pada perangkat seluler/tablet demi kenyamanan pengguna layar sentuh.

### F. Infinite Partnership Marquee (`PartnershipMarquee.tsx`)
- **Cara Kerja**: Menggunakan teknik array duplication `[...partners, ...partners]` yang digerakkan oleh CSS `@keyframes marquee` dari `0%` ke `-50%`.
- **Interaktivitas**:
  - Memiliki utilitas Tailwind `hover:[animation-play-state:paused]`, sehingga ticker berhenti bergerak saat kursor diarahkan ke logo untuk memudahkan pengguna membaca.
  - Logo awal berformat grayscale `filter grayscale` dan bertransisi ke warna penuh saat hover.
  - Dilengkapi tooltip floating yang menampilkan peran kontribusi dan kategori instansi.

---

## 3. Dependensi Tambahan

Jika Anda mengkloning repositori ini di lingkungan baru, pastikan menginstal dependensi berikut:

```bash
npm install framer-motion
```

Seluruh paket lain (`lucide-react`, `tailwindcss`, `clsx`, `tailwind-merge`) sudah terkonfigurasi dan kompatibel sepenuhnya.

---

## 4. Status Pengujian Build

Proses verifikasi produksi telah dijalankan dan lulus 100% tanpa error TypeScript maupun warning bundling:
- `npm run build` : **✓ Compiled successfully (8/8 static/dynamic routes)**
- App Router compatibility: **Pass**
- Hydration mismatch safety: **Pass**
