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
- **Public URL**: `https://pub-1269ff3669224e919a7b149c0e108f86.r2.dev`

## Environment Bindings (wrangler.json)
- `d1_databases[0].binding`: `tailflowdb`
- `r2_buckets[0].binding`: `tailflowr2`

Contoh struktur di `wrangler.json`:
```json
{
  "d1_databases": [
    {
      "binding": "tailflowdb"
    }
  ],
  "r2_buckets": [
    {
      "binding": "tailflowr2"
    }
  ]
}
```