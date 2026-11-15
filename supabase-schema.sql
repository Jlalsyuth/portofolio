-- ==============================================================================
-- SKRIP SQL SUPABASE LENGKAP: DATABASE SCHEMA, RLS, STORAGE, & SEED DATA
-- Aplikasi Portofolio Modern Full-Stack (Next.js & Supabase)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL: projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Web App', 'Mobile App', 'UI/UX', 'Business')),
    short_description TEXT,
    content TEXT, -- Mendukung format Markdown / Rich Text
    thumbnail_url TEXT,
    media_files JSONB DEFAULT '[]'::jsonb, -- Array of { type: 'image' | 'video' | 'document', url: string, name: string }
    tech_stack TEXT[] DEFAULT '{}',
    live_url TEXT,
    repo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indeks untuk performa query
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- 3. TABEL: profile
CREATE TABLE IF NOT EXISTS public.profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    headline TEXT,
    about TEXT,
    experience JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    skills TEXT[] DEFAULT '{}',
    contact_email TEXT,
    social_links JSONB DEFAULT '{}'::jsonb, -- { linkedin: '', github: '', twitter: '', instagram: '', website: '' }
    cv_file_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Aktifkan RLS pada kedua tabel
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

-- Policy untuk tabel `projects`:
-- Publik (anon) dan Admin (authenticated) dapat membaca (SELECT)
CREATE POLICY "Allow public read access for projects"
    ON public.projects
    FOR SELECT
    USING (true);

-- Hanya user yang terautentikasi (Admin) yang dapat INSERT, UPDATE, DELETE
CREATE POLICY "Allow authenticated users to insert projects"
    ON public.projects
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update projects"
    ON public.projects
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete projects"
    ON public.projects
    FOR DELETE
    TO authenticated
    USING (true);

-- Policy untuk tabel `profile`:
-- Publik dapat membaca (SELECT)
CREATE POLICY "Allow public read access for profile"
    ON public.profile
    FOR SELECT
    USING (true);

-- Hanya user terautentikasi (Admin) yang dapat memodifikasi profil
CREATE POLICY "Allow authenticated users to insert profile"
    ON public.profile
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update profile"
    ON public.profile
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. KONFIGURASI SUPABASE STORAGE BUCKET: portfolio-assets
-- Masukkan konfigurasi bucket publik 'portfolio-assets'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio-assets',
    'portfolio-assets',
    true,
    52428800, -- 50MB per file
    ARRAY[
        'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/gif',
        'video/mp4', 'video/webm', 'video/quicktime',
        'application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 52428800;

-- Storage Policies untuk bucket `portfolio-assets`:
-- Siapapun (publik) boleh membaca/mengunduh file di bucket portfolio-assets
CREATE POLICY "Public Read Portfolio Assets"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'portfolio-assets');

-- Hanya user terautentikasi (Admin) yang dapat upload/insert file
CREATE POLICY "Authenticated Insert Portfolio Assets"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-assets');

-- Hanya user terautentikasi (Admin) yang dapat memperbarui file
CREATE POLICY "Authenticated Update Portfolio Assets"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-assets')
    WITH CHECK (bucket_id = 'portfolio-assets');

-- Hanya user terautentikasi (Admin) yang dapat menghapus file
CREATE POLICY "Authenticated Delete Portfolio Assets"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-assets');

-- ==============================================================================
-- 6. DATA CONTOH AWAL (SEED DATA)
-- Memberikan data profil & proyek awal sehingga portofolio langsung tampak hidup
-- ==============================================================================

-- Seed Profil
INSERT INTO public.profile (id, full_name, headline, about, experience, education, skills, contact_email, social_links, cv_file_url)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Fahri Ramadhan',
    'Senior Full-Stack Engineer & Product Architect',
    'Saya seorang Software Engineer dan Product Architect yang berfokus pada pembangunan produk digital modern berskala tinggi. Berpengalaman lebih dari 5 tahun dalam ekosistem JavaScript/TypeScript (Next.js, Node.js), arsitektur cloud, database terdistribusi, serta perancangan antarmuka pengguna yang elegan dan aksesibel.',
    '[
        {
            "role": "Lead Full-Stack Engineer",
            "company": "Tech Innovate Labs",
            "period": "2023 - Sekarang",
            "description": "Memimpin tim rekayasa perangkat lunak dalam merancang arsitektur micro-frontend berbasis Next.js dan backend serverless Supabase/PostgreSQL yang melayani lebih dari 100k pengguna aktif bulanan."
        },
        {
            "role": "Senior Frontend Developer",
            "company": "Nusantara Digital Solusindo",
            "period": "2021 - 2023",
            "description": "Mengembangkan design system internal, mempercepat waktu render Core Web Vitals hingga 40%, dan membangun aplikasi web interaktif skala enterprise."
        },
        {
            "role": "Mobile & Web Developer",
            "company": "Kreatif Inovasi Asia",
            "period": "2019 - 2021",
            "description": "Mengembangkan aplikasi mobile lintas platform dengan Flutter/React Native dan integrasi RESTful API serta WebSocket real-time."
        }
    ]'::jsonb,
    '[
        {
            "degree": "Sarjana Ilmu Komputer (S.Kom)",
            "institution": "Universitas Indonesia",
            "period": "2015 - 2019",
            "description": "Fokus pada Rekayasa Perangkat Lunak, Sistem Terdistribusi, dan Interaksi Manusia-Komputer. Lulus dengan predikat Cum Laude."
        }
    ]'::jsonb,
    ARRAY[
        'Next.js (App Router)', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 
        'PostgreSQL', 'Node.js', 'React Native', 'Flutter', 'Figma / UI/UX', 
        'Docker', 'GraphQL', 'REST API', 'Git & CI/CD', 'Product Analytics'
    ],
    'fahri.ramadhan@example.com',
    '{
        "linkedin": "https://linkedin.com/in/fahri-ramadhan",
        "github": "https://github.com/fahri-ramadhan",
        "twitter": "https://twitter.com/fahri_dev",
        "website": "https://fahri.dev"
    }'::jsonb,
    'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Proyek: Web App
INSERT INTO public.projects (title, slug, category, short_description, content, thumbnail_url, media_files, tech_stack, live_url, repo_url)
VALUES (
    'SaaS Analytics & Growth Dashboard',
    'saas-analytics-growth-dashboard',
    'Web App',
    'Platform analitik waktu nyata untuk memantau metrik pendapatan, retensi pengguna, dan funnel konversi secara otomatis.',
    '### Latar Belakang & Masalah
Banyak perusahaan rintisan (startup) kesulitan melacak metrik SaaS utama seperti MRR, churn rate, dan LTV secara terpadu karena data tersebar di berbagai gateway pembayaran dan platform analitik.

### Solusi
Kami merancang platform analitik terpusat yang mengintegrasikan data dari Stripe, database PostgreSQL, dan event tracking pengguna. Dashboard ini menyajikan visualisasi data interaktif, insight berbasis anomali, serta ekspor laporan otomatis.

### Fitur Utama
1. **Real-time Revenue Monitoring:** Visualisasi grafik interaktif per jam, hari, dan bulan.
2. **Cohort Retention Analysis:** Matriks retensi pengguna dengan pemfilteran dinamis.
3. **Role-Based Access Control:** Manajemen tim dengan hak akses multi-tingkat.
4. **Automated Export & Alerts:** Pengiriman laporan PDF harian ke Slack dan Email.

### Hasil & Dampak
Mengurangi waktu audit keuangan mingguan sebesar 65% dan memberikan visibilitas penuh terhadap tren churn pengguna sebelum berdampak besar pada pendapatan.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    '[
        {"type": "image", "url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", "name": "Main Dashboard Overview"},
        {"type": "image", "url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80", "name": "Analytics & Chart View"},
        {"type": "document", "url": "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf", "name": "Case Study & Tech Architecture.pdf"}
    ]'::jsonb,
    ARRAY['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Chart.js'],
    'https://demo-saas-dashboard.vercel.app',
    'https://github.com/fahri-ramadhan/saas-analytics'
)
ON CONFLICT (slug) DO UPDATE SET live_url = EXCLUDED.live_url, repo_url = EXCLUDED.repo_url;

-- Seed Proyek: Mobile App
INSERT INTO public.projects (title, slug, category, short_description, content, thumbnail_url, media_files, tech_stack, live_url, repo_url)
VALUES (
    'Nusantara Pay - Smart Digital Wallet',
    'nusantara-pay-smart-digital-wallet',
    'Mobile App',
    'Aplikasi dompet digital berbasis mobile dengan pemindaian QRIS kilat, transfer antar-bank gratis, dan pembukuan keuangan otomatis.',
    '### Ringkasan Proyek
Nusantara Pay adalah aplikasi mobile finansial yang dirancang untuk mempermudah transaksi mikro sehari-hari bagi masyarakat Indonesia, didukung oleh keamanan enkripsi biometrik dan sertifikasi PCI-DSS.

### Solusi & Arsitektur
- **Frontend:** React Native & Expo untuk antarmuka yang mulus 60 FPS pada iOS dan Android.
- **Backend:** Node.js microservices terhubung dengan Supabase dan core banking sandbox.
- **Security:** Autentikasi biometrik Face ID / Fingerprint, tokenized session, dan dynamic QR generator.

### Pencapaian
Mencapai rating 4.8 di Play Store dalam 3 bulan pertama rilis dengan lebih dari 50.000 transaksi berhasil per hari tanpa downtime yang berarti.',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    '[
        {"type": "image", "url": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80", "name": "Mobile Wallet Home"},
        {"type": "image", "url": "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80", "name": "QRIS Scan Flow"},
        {"type": "video", "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", "name": "Mobile Demo Walkthrough"}
    ]'::jsonb,
    ARRAY['React Native', 'TypeScript', 'Tailwind CSS', 'Supabase Auth', 'Zustand'],
    'https://play.google.com/store/apps',
    'https://github.com/fahri-ramadhan/nusantara-pay'
)
ON CONFLICT (slug) DO UPDATE SET live_url = EXCLUDED.live_url, repo_url = EXCLUDED.repo_url;

-- Seed Proyek: UI/UX
INSERT INTO public.projects (title, slug, category, short_description, content, thumbnail_url, media_files, tech_stack, live_url, repo_url)
VALUES (
    'EduSphere - Interactive Learning Platform Redesign',
    'edusphere-interactive-learning-redesign',
    'UI/UX',
    'Rancangan UI/UX menyeluruh untuk platform e-learning modern yang berfokus pada aksesibilitas siswa dan gamifikasi pembelajaran.',
    '### Masalah
Tingkat drop-off pengguna pada kursus online EduSphere lama mencapai 48% karena tata letak navigasi yang membingungkan dan ketiadaan motivasi interaktif bagi siswa.

### Metodologi Desain
1. **User Research:** Wawancara mendalam dengan 25 siswa dan 10 pengajar.
2. **Wireframing & Prototyping:** Eksplorasi 4 alternatif wireframe di Figma dengan iterasi cepat.
3. **Design System:** Pembuatan komponen UI atomik, palet warna inklusif kontras tinggi (WCAG AAA), serta tipografi terbaca.
4. **Gamifikasi:** Sistem XP, badge pencapaian, dan papan peringkat mingguan.

### Hasil Uji Kegunaan
Meningkatkan completion rate kursus sebesar 34% dan skor SUS (System Usability Scale) naik dari 62 menjadi 88.',
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    '[
        {"type": "image", "url": "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80", "name": "Course Player Interface"},
        {"type": "image", "url": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80", "name": "Gamification Badges"},
        {"type": "document", "url": "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf", "name": "EduSphere UI/UX Case Study Deck.pdf"}
    ]'::jsonb,
    ARRAY['Figma', 'Design System', 'User Research', 'Prototyping', 'WCAG AAA'],
    'https://www.figma.com/community',
    'https://github.com/fahri-ramadhan/edusphere-redesign'
)
ON CONFLICT (slug) DO UPDATE SET live_url = EXCLUDED.live_url, repo_url = EXCLUDED.repo_url;

-- Seed Proyek: Business
INSERT INTO public.projects (title, slug, category, short_description, content, thumbnail_url, media_files, tech_stack, live_url, repo_url)
VALUES (
    'AgriLink - B2B Fresh Produce Supply Chain Deck',
    'agrilink-b2b-fresh-produce-deck',
    'Business',
    'Penyusunan model bisnis B2B dan pitch deck ekspansi pasar untuk memotong rantai pasok komoditas pertanian langsung dari petani ke jaringan Horeka.',
    '### Ringkasan Bisnis
AgriLink memotong 4 lapis tengkulak tradisional dengan menghubungkan kelompok tani lokal langsung dengan hotel, restoran, dan katering (HOREKA) melalui sistem pemesanan terjadwal dan cold chain logistics.

### Unit Economics & Analisis Pasar
- **TAM:** \$4.2 Miliar di pasar komoditas perkotaan Indonesia.
- **Gross Margin:** 24% dengan efisiensi rute pengiriman berbasis algoritma klastering.
- **Customer Retention:** 89% pesanan berulang per bulan dari 120+ mitra restoran.

### Yang Disertakan Dalam Proyek Ini
Dokumen pitch deck lengkap, analisis keuangan 3 tahun (financial projection model), serta studi kelayakan operasional gudang pendingin.',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    '[
        {"type": "image", "url": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80", "name": "AgriLink Market Overview"},
        {"type": "document", "url": "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf", "name": "AgriLink Investor Deck.pdf"}
    ]'::jsonb,
    ARRAY['Business Modeling', 'Pitch Deck', 'Market Research', 'Financial Projection'],
    'https://agrilink-supply.vercel.app',
    'https://github.com/fahri-ramadhan/agrilink-deck'
)
ON CONFLICT (slug) DO UPDATE SET live_url = EXCLUDED.live_url, repo_url = EXCLUDED.repo_url;
