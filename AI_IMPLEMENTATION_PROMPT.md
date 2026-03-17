# AI Agent Instruction: Phase 1 Setup

## Context
Gunakan `PROJECT_SPEC.md` dan `DATABASE_SCHEMA.md` sebagai panduan utama. Bangun pondasi aplikasi dengan mengikuti langkah berikut:

## Step 1: Project Initialization
1. Jalankan `npm create cloudflare@latest` untuk Next.js project.
2. Setup `wrangler.toml` dengan binding D1 dan R2.
3. Install dependencies: `grapesjs`, `grapesjs-tailwind`, `drizzle-orm`, `@auth/core`.

## Step 2: Database Setup
1. Buat folder `/db` dan definisikan skema Drizzle untuk tabel `projects`.
2. Generate migrasi pertama dan berikan perintah untuk menjalankannya via wrangler.

## Step 3: Core Editor Page
1. Buat Route `/editor/[id]` (Client Component).
2. Inisialisasi GrapesJS di dalam `useEffect`.
3. Tambahkan tombol "Save" yang mengirimkan `editor.getProjectData()` ke API Route `/api/projects/[id]`.

## Step 4: API Routes (Edge Runtime)
1. Buat API Route POST `/api/projects/[id]` yang berjalan di Edge Runtime.
2. Gunakan binding `process.env.DB` untuk menyimpan data JSON ke D1.

## Kriteria Teknis
- Gunakan TypeScript Strict Mode.
- Pastikan semua API Route memiliki `export const runtime = 'edge'`.
- UI menggunakan Tailwind CSS dan Shadcn/UI.

Berikan struktur folder dan file `wrangler.toml` terlebih dahulu sebelum menulis kode lainnya.