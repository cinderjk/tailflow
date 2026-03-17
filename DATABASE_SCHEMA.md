# Database & Storage Schema

## Cloudflare D1 (Table: projects)
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  data_json TEXT, -- Store GrapesJS state here
  html_content TEXT,
  user_id TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);
```

## Cloudflare R2 (Storage Logic)
- **Path**: `buckets/user-assets/[user_id]/[file_name]`
- **Public URL**: Menggunakan custom domain atau R2.dev untuk akses gambar di dalam canvas.

## Environment Bindings (wrangler.toml)
- `[[d1_databases]]`: binding = "DB"
- `[[r2_buckets]]`: binding = "BUCKET"