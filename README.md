# Modern Full-Stack Portfolio (Next.js, Tailwind CSS, TypeScript, Supabase)

Aplikasi web portofolio modern, responsif, dan full-stack yang dirancang secara profesional layaknya CV interaktif dan showcase karya digital. Dilengkapi dengan backend Supabase (Auth, PostgreSQL Database, Storage) dan siap dideploy langsung ke **Vercel**.

---

## 🚀 Fitur Unggulan

1. **Modern Stack & App Router:**
   - **Next.js 14 (App Router)** dengan Server-Side Rendering (SSR) & Server Actions.
   - **Tailwind CSS** untuk styling responsif & modern.
   - **TypeScript** untuk keamanan tipe data menyeluruh.
   - **Dark / Light Mode Toggle** dengan persistensi tema (`next-themes`).

2. **Navigasi Bersih & Sticky:**
   - Navbar sticky dengan tautan langsung ke kategori:
     - `Home` (`/`)
     - `Web App` (`/category/web-app`)
     - `Mobile App` (`/category/mobile-app`)
     - `UI/UX` (`/category/ui-ux`)
     - `Business` (`/category/business`)
   - Drawer responsif untuk perangkat mobile / tablet.

3. **Homepage Interaktif (`/`):**
   - **Hero Section:** Nama lengkap, headline profesional, ringkasan diri, tautan media sosial, serta tombol langsung "Download CV" yang terhubung ke file PDF di Supabase Storage.
   - **About & Skills:** Deskripsi diri dan badge keahlian teknis/tools.
   - **Experience & Education:** Timeline vertikal elegan untuk riwayat kerja dan pendidikan.
   - **Featured Projects:** Cuplikan proyek-proyek unggulan dari berbagai kategori.

4. **Halaman Kategori & Detail Proyek (`/category/[slug]` & `/project/[slug]`):**
   - Grid kartu proyek dengan thumbnail, judul, deskripsi singkat, tag tools, dan tautan live demo / GitHub repo.
   - **Media Previewer Terintegrasi:**
     - **Foto:** Galeri gambar dengan fitur Lightbox zoom interaktif dan navigasi keyboard (Esc, panah kiri/kanan).
     - **Video:** Pemutar video HTML5 responsif dengan tombol unduh.
     - **Dokumen (PDF / Presentasi Deck):** Embedded document viewer (`<iframe>`) sehingga pengunjung dapat membaca deck bisnis atau studi kasus langsung di halaman web tanpa wajib mengunduh terlebih dahulu, disertai tombol download berkas.
   - Render studi kasus berformat Markdown (`react-markdown` & `remark-gfm`).

5. **Dashboard Admin Terproteksi (`/admin` & `/login`):**
   - **Supabase Auth:** Autentikasi email dan kata sandi yang aman.
   - **Next.js Middleware:** Melindungi seluruh rute `/admin/*` dari akses publik secara otomatis.
   - **Manajemen Profil & CV:** Form edit profil, data diri, pengalaman kerja, pendidikan, skill, serta upload berkas CV terbaru (PDF).
   - **Manajemen Proyek (CRUD):** 
     - Filter kategori dan pencarian proyek.
     - Form Tambah / Edit proyek dengan **Multi-file Drag & Drop Upload** ke Supabase Storage (mendukung banyak foto, video MP4/WebM, dan PDF/dokumen sekaligus dengan progress bar).

---

## 📁 Struktur Direktori Proyek

```text
portofolio/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── layout.tsx              # Shell & sub-bar navigasi admin
│   │   │   ├── page.tsx                # Dashboard: CRUD proyek & editor profil/CV
│   │   │   └── projects/
│   │   │       ├── new/page.tsx        # Form tambah proyek + multi-file upload
│   │   │       └── [id]/edit/page.tsx  # Form edit proyek
│   │   ├── api/
│   │   │   └── auth/signout/route.ts   # Route handler logout admin
│   │   ├── category/
│   │   │   └── [slug]/page.tsx         # Halaman filter kategori proyek
│   │   ├── project/
│   │   │   └── [slug]/page.tsx         # Halaman detail proyek & media previewer
│   │   ├── login/
│   │   │   └── page.tsx                # Halaman login Supabase Auth
│   │   ├── globals.css                 # Konfigurasi Tailwind & CSS variables
│   │   ├── layout.tsx                  # Root layout, ThemeProvider, Toast, Navbar, Footer
│   │   └── page.tsx                    # Homepage: Hero, Timeline, Skills, Showcase
│   ├── components/
│   │   ├── Navbar.tsx                  # Sticky navbar + menu mobile
│   │   ├── Footer.tsx                  # Footer portofolio
│   │   ├── ThemeToggle.tsx             # Toggle Dark / Light mode
│   │   ├── ThemeProvider.tsx           # Provider next-themes
│   │   ├── ToastProvider.tsx           # Notifikasi toast sonner
│   │   ├── ProjectCard.tsx             # Kartu preview proyek
│   │   ├── MediaViewer.tsx             # Lightbox foto, HTML5 video & PDF iframe viewer
│   │   ├── MultiFileUpload.tsx         # Drag & Drop upload multi-file ke Supabase
│   │   ├── Timeline.tsx                # Timeline vertikal pengalaman & pendidikan
│   │   └── SkeletonCard.tsx            # Loading skeletons
│   ├── lib/
│   │   ├── types.ts                    # Definisi tipe data TypeScript
│   │   ├── utils.ts                    # Helper cn, slugify, category mappings
│   │   ├── data.ts                     # Fallback initial seed data
│   │   └── supabase/
│   │       ├── client.ts               # Browser client Supabase (@supabase/ssr)
│   │       ├── server.ts               # Server client Supabase dengan cookies
│   │       └── middleware.ts           # Session validator & protector rute admin
│   └── middleware.ts                   # Next.js route protection middleware
├── supabase-schema.sql                 # Skrip SQL lengkap (Tabel, RLS, Storage & Seed)
├── .env.example                        # Contoh konfigurasi variabel lingkungan
├── next.config.mjs                     # Konfigurasi Next.js (optimasi gambar)
├── tailwind.config.ts                  # Konfigurasi tema & warna Tailwind
├── tsconfig.json                       # Konfigurasi TypeScript
└── package.json
```

---

## 🛠️ Langkah-Langkah Konfigurasi Supabase

### 1. Buat Proyek Baru di Supabase
1. Masuk ke [Supabase Dashboard](https://supabase.com/dashboard) dan buat proyek baru (*New Project*).
2. Catat **Project URL** dan **Project API Key (`anon public`)** yang ada di menu **Project Settings -> API**.

### 2. Eksekusi Skrip SQL Database & Storage
1. Di Supabase Dashboard, buka menu **SQL Editor**.
2. Klik tombol **New Query**.
3. Buka file `supabase-schema.sql` di repositori ini, salin seluruh isinya, tempel ke dalam SQL Editor, lalu klik **Run**.
4. Skrip tersebut secara otomatis akan:
   - Membuat tabel `projects` dan `profile`.
   - Mengaktifkan **Row Level Security (RLS)** dengan policy SELECT publik dan modifikasi khusus akun terautentikasi.
   - Membuat Storage Bucket publik bernama `portfolio-assets`.
   - Mengonfigurasi Storage RLS policy agar publik dapat melihat/mengunduh dan hanya admin yang dapat mengunggah/menghapus.
   - Memasukkan data awal contoh (*seed data*) sehingga portofolio langsung tampak hidup.

### 3. Buat Akun Pengguna Admin
1. Buka menu **Authentication -> Users** di Supabase Dashboard.
2. Klik **Add User** -> **Create User**.
3. Masukkan Email dan Password untuk akun Admin Anda, lalu centang **Auto Confirm User**.
4. Akun ini yang akan digunakan untuk login di halaman `/login` portofolio Anda.

---

## 💻 Menjalankan di Komputer Lokal (Local Development)

1. Salin file `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Isi nilai kredensial Supabase Anda di `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
4. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.
5. Akses [http://localhost:3000/login](http://localhost:3000/login) untuk masuk ke panel admin `/admin`.

---

## 🚢 Panduan Deployment ke Vercel

1. **Push Proyek ke GitHub / GitLab:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit modern portfolio"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```

2. **Deploy di Vercel:**
   - Masuk ke [Vercel Dashboard](https://vercel.com).
   - Klik **Add New...** -> **Project**.
   - Pilih repositori Git Anda dan klik **Import**.
   - Di bagian **Environment Variables**, tambahkan:
     - `NEXT_PUBLIC_SUPABASE_URL`: URL proyek Supabase Anda.
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon key publik Supabase Anda.
   - Klik **Deploy**.
   - Dalam hitungan menit, portofolio Anda telah tayang secara online dengan performa tinggi dan sertifikat SSL otomatis!
