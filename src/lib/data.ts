import { Project, Profile } from './types';

export const FALLBACK_PROFILE: Profile = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  full_name: 'Fahri Ramadhan',
  headline: 'Senior Full-Stack Engineer & Product Architect',
  about: 'Saya seorang Software Engineer dan Product Architect yang berfokus pada pembangunan produk digital modern berskala tinggi. Berpengalaman lebih dari 5 tahun dalam ekosistem JavaScript/TypeScript (Next.js, Node.js), arsitektur cloud, database terdistribusi, serta perancangan antarmuka pengguna yang elegan dan responsif.',
  experience: [
    {
      role: 'Lead Full-Stack Engineer',
      company: 'Tech Innovate Labs',
      period: '2023 - Sekarang',
      description: 'Memimpin tim rekayasa perangkat lunak dalam merancang arsitektur modern berbasis Next.js dan backend serverless Supabase/PostgreSQL yang melayani lebih dari 100k pengguna aktif bulanan.',
    },
    {
      role: 'Senior Frontend Developer',
      company: 'Nusantara Digital Solusindo',
      period: '2021 - 2023',
      description: 'Mengembangkan design system internal, mempercepat waktu render Core Web Vitals hingga 40%, dan membangun aplikasi web interaktif skala enterprise.',
    },
    {
      role: 'Mobile & Web Developer',
      company: 'Kreatif Inovasi Asia',
      period: '2019 - 2021',
      description: 'Mengembangkan aplikasi mobile lintas platform dengan Flutter/React Native dan integrasi RESTful API serta WebSocket real-time.',
    },
  ],
  education: [
    {
      degree: 'Sarjana Ilmu Komputer (S.Kom)',
      institution: 'Universitas Indonesia',
      period: '2015 - 2019',
      description: 'Fokus pada Rekayasa Perangkat Lunak, Sistem Terdistribusi, dan Interaksi Manusia-Komputer. Lulus dengan predikat Cum Laude.',
    },
  ],
  skills: [
    'Next.js (App Router)',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Supabase',
    'PostgreSQL',
    'Node.js',
    'React Native',
    'Flutter',
    'Figma / UI/UX',
    'Docker',
    'GraphQL',
    'REST API',
    'Git & CI/CD',
    'Product Analytics',
  ],
  contact_email: 'fahri.ramadhan@example.com',
  social_links: {
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    website: 'https://fahri.dev',
  },
  cv_file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
};

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'SaaS Analytics & Growth Dashboard',
    slug: 'saas-analytics-growth-dashboard',
    category: 'Web App',
    short_description: 'Platform analitik waktu nyata untuk memantau metrik pendapatan, retensi pengguna, dan funnel konversi secara otomatis.',
    content: `### Latar Belakang & Masalah
Banyak perusahaan rintisan (startup) kesulitan melacak metrik SaaS utama seperti MRR, churn rate, dan LTV secara terpadu karena data tersebar di berbagai gateway pembayaran dan platform analitik.

### Solusi & Arsitektur
Kami merancang platform analitik terpusat yang mengintegrasikan data dari Stripe, database PostgreSQL, dan event tracking pengguna. Dashboard ini menyajikan visualisasi data interaktif, insight berbasis anomali, serta ekspor laporan otomatis.

### Fitur Utama
1. **Real-time Revenue Monitoring:** Visualisasi grafik interaktif per jam, hari, dan bulan.
2. **Cohort Retention Analysis:** Matriks retensi pengguna dengan pemfilteran dinamis.
3. **Role-Based Access Control:** Manajemen tim dengan hak akses multi-tingkat.
4. **Automated Export & Alerts:** Pengiriman laporan PDF harian ke Slack dan Email.

### Hasil & Dampak
Mengurangi waktu audit keuangan mingguan sebesar 65% dan memberikan visibilitas penuh terhadap tren churn pengguna sebelum berdampak besar pada pendapatan.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    media_files: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        name: 'Main Dashboard Overview',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        name: 'Analytics & Chart View',
      },
      {
        type: 'document',
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
        name: 'Case Study & Tech Architecture.pdf',
      },
    ],
    tech_stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Chart.js'],
    live_url: 'https://demo-saas-dashboard.vercel.app',
    repo_url: 'https://github.com/example/saas-analytics',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Nusantara Pay - Smart Digital Wallet',
    slug: 'nusantara-pay-smart-digital-wallet',
    category: 'Mobile App',
    short_description: 'Aplikasi dompet digital berbasis mobile dengan pemindaian QRIS kilat, transfer antar-bank gratis, dan pembukuan keuangan otomatis.',
    content: `### Ringkasan Proyek
Nusantara Pay adalah aplikasi mobile finansial yang dirancang untuk mempermudah transaksi mikro sehari-hari bagi masyarakat Indonesia, didukung oleh keamanan enkripsi biometrik dan sertifikasi PCI-DSS.

### Solusi & Arsitektur
- **Frontend:** React Native & Expo untuk antarmuka yang mulus 60 FPS pada iOS dan Android.
- **Backend:** Node.js microservices terhubung dengan Supabase dan core banking sandbox.
- **Security:** Autentikasi biometrik Face ID / Fingerprint, tokenized session, dan dynamic QR generator.

### Pencapaian
Mencapai rating 4.8 di Play Store dalam 3 bulan pertama rilis dengan lebih dari 50.000 transaksi berhasil per hari tanpa downtime yang berarti.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    media_files: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
        name: 'Mobile Wallet Home',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
        name: 'QRIS Scan Flow',
      },
      {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        name: 'Mobile Demo Walkthrough.mp4',
      },
    ],
    tech_stack: ['React Native', 'TypeScript', 'Tailwind CSS', 'Supabase Auth', 'Zustand'],
    live_url: 'https://play.google.com',
    repo_url: 'https://github.com/example/nusantara-pay',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'EduSphere - Interactive Learning Platform Redesign',
    slug: 'edusphere-interactive-learning-redesign',
    category: 'UI/UX',
    short_description: 'Rancangan UI/UX menyeluruh untuk platform e-learning modern yang berfokus pada aksesibilitas siswa dan gamifikasi pembelajaran.',
    content: `### Masalah
Tingkat drop-off pengguna pada kursus online EduSphere lama mencapai 48% karena tata letak navigasi yang membingungkan dan ketiadaan motivasi interaktif bagi siswa.

### Metodologi Desain
1. **User Research:** Wawancara mendalam dengan 25 siswa dan 10 pengajar.
2. **Wireframing & Prototyping:** Eksplorasi 4 alternatif wireframe di Figma dengan iterasi cepat.
3. **Design System:** Pembuatan komponen UI atomik, palet warna inklusif kontras tinggi (WCAG AAA), serta tipografi terbaca.
4. **Gamifikasi:** Sistem XP, badge pencapaian, dan papan peringkat mingguan.

### Hasil Uji Kegunaan
Meningkatkan completion rate kursus sebesar 34% dan skor SUS (System Usability Scale) naik dari 62 menjadi 88.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    media_files: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
        name: 'Course Player Interface',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        name: 'Gamification Badges',
      },
      {
        type: 'document',
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
        name: 'EduSphere UI/UX Case Study Deck.pdf',
      },
    ],
    tech_stack: ['Figma', 'Design System', 'User Research', 'Prototyping', 'WCAG AAA'],
    live_url: 'https://figma.com',
    repo_url: '',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'AgriLink - B2B Fresh Produce Supply Chain Deck',
    slug: 'agrilink-b2b-fresh-produce-deck',
    category: 'Business',
    short_description: 'Penyusunan model bisnis B2B dan pitch deck ekspansi pasar untuk memotong rantai pasok komoditas pertanian langsung dari petani ke jaringan Horeka.',
    content: `### Ringkasan Bisnis
AgriLink memotong 4 lapis tengkulak tradisional dengan menghubungkan kelompok tani lokal langsung dengan hotel, restoran, dan katering (HOREKA) melalui sistem pemesanan terjadwal dan cold chain logistics.

### Unit Economics & Analisis Pasar
- **TAM:** $4.2 Miliar di pasar komoditas perkotaan Indonesia.
- **Gross Margin:** 24% dengan efisiensi rute pengiriman berbasis algoritma klastering.
- **Customer Retention:** 89% pesanan berulang per bulan dari 120+ mitra restoran.

### Yang Disertakan Dalam Proyek Ini
Dokumen pitch deck lengkap, analisis keuangan 3 tahun (financial projection model), serta studi kelayakan operasional gudang pendingin.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    media_files: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
        name: 'AgriLink Market Overview',
      },
      {
        type: 'document',
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
        name: 'AgriLink Investor Deck.pdf',
      },
    ],
    tech_stack: ['Business Modeling', 'Pitch Deck', 'Market Research', 'Financial Projection'],
    live_url: '',
    repo_url: '',
    created_at: new Date().toISOString(),
  },
];
