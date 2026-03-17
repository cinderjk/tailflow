type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

interface Env {
  tailflowdb: D1Database;
  tailflowr2: R2Bucket;
  SESSION: KVNamespace;
}

declare namespace App {
  interface Locals extends Runtime {}
}
