# Project Specification: Cloudflare Page Builder

## Core Objective
Membangun SaaS Page Builder berbasis Tailwind CSS yang berjalan 100% di infrastruktur Cloudflare (Edge).

## Tech Stack
- **Framework**: Astro 5 (Cloudflare Adapter)
- **Host**: Cloudflare Workers (deploy via Wrangler)
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **ORM**: Drizzle ORM
- **Editor**: GrapesJS + grapesjs-tailwind plugin
- **Auth**: Auth.js (`@auth/core`) dengan adapter berbasis Drizzle/D1

## Core Features
- Drag-and-drop komponen Tailwind CSS.
- Simpan state editor ke D1 sebagai JSON string.
- Export hasil desain ke HTML statis + CSS.
- Upload aset gambar langsung ke R2.