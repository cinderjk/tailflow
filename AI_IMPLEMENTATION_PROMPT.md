# AI Agent Instruction: Phase 1 Setup

## Context
Gunakan `PROJECT_SPEC.md` dan `DATABASE_SCHEMA.md` sebagai panduan utama. Bangun pondasi aplikasi dengan mengikuti langkah berikut:

## Step 1: Project Initialization
1. Validasi `wrangler.json` agar binding sesuai dengan `DATABASE_SCHEMA.md`:
	- D1 binding: `tailflowdb`
	- R2 binding: `tailflowr2`
2. Install dependencies untuk phase 1:
	- `grapesjs`
	- `grapesjs-tailwind`
	- `drizzle-orm`
	- `drizzle-kit`
	- `@auth/core`

## Step 2: Database Setup
1. Buat folder `/db` dan definisikan skema Drizzle untuk tabel `projects`.
2. Buat file konfigurasi Drizzle (`drizzle.config.ts`) dan set output migrasi.
3. Generate migrasi pertama.
4. Berikan perintah apply migrasi ke D1 (local dan remote) menggunakan Wrangler.

## Step 3: Core Editor Page
1. Buat route Astro: `src/pages/editor/[id].astro`.
2. Render container editor di halaman tersebut dan inisialisasi GrapesJS di client-side script.
3. Tambahkan tombol "Save" yang mengirimkan `editor.getProjectData()` ke endpoint `POST /api/projects/[id]`.

## Step 4: API Routes (Edge Runtime)
1. Buat endpoint Astro di `src/pages/api/projects/[id].ts`.
2. Gunakan env binding Cloudflare D1 `tailflowdb` untuk menyimpan data JSON ke tabel `projects`.
3. Gunakan method `POST` untuk create/update data project berdasarkan `id`.

## Kriteria Teknis
- Gunakan TypeScript Strict Mode.
- Gunakan pola Astro + Cloudflare adapter untuk runtime Edge.
- UI menggunakan Tailwind CSS.
- Struktur minimal yang harus dibuat:
  - `src/pages/editor/[id].astro`
  - `src/pages/api/projects/[id].ts`
  - `db/schema.ts`
  - `drizzle.config.ts`

Berikan struktur folder terlebih dahulu, lalu lanjutkan implementasi file di atas secara bertahap.