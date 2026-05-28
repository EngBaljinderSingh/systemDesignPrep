# Low-Cost Hosting Plan ($5-$10/month)

## Goal
Run the full app (frontend + backend + database) on a single small VPS with a real domain and
automatic HTTPS, keeping monthly spend in the $5-$10 range.

## What changed in code/config
- Added low-cost runtime profile: `backend/src/main/resources/application-lowcost.yml`
- Added cache provider toggle and disabled expensive defaults in low-cost mode
- Added in-memory cache fallback: `InMemorySessionCacheAdapter` (no Redis needed)
- Added `SemanticCache` interface + `NoOpSemanticCache` so the app starts without Redis/VectorStore
- Made Redis cache adapter conditional for standard deployments
- Added low-cost compose stack: `docker-compose.lowcost.yml`
- Added Caddy reverse proxy (`Caddyfile`) for automatic free HTTPS via Let's Encrypt
- CORS origins now driven by `CORS_ALLOWED_ORIGINS` env var (no longer hardcoded to localhost)
- Fixed conversation history: USER/ASSISTANT roles are now preserved when calling the LLM
- Fixed ModelRouterService default model names to avoid dead routing
- Removed unused `langchain4j-ollama` dependency (smaller JAR, faster build)
- Frontend feature flag for code runner (Piston disabled in low-cost mode)

## Recommended deployment architecture
```
Internet → Caddy (ports 80/443, auto TLS) → frontend (nginx:3000)
                                           → backend  (Spring Boot:8080)
                                           → postgres (localhost only)
```

All four containers run on a **single 1 vCPU / 1-2 GB RAM VPS** via Docker Compose.

## Cost model
| Item                            | Monthly cost |
|---------------------------------|-------------|
| Hetzner CX22 VPS (2 vCPU, 4 GB)| $4.15       |
| Domain (annualised)             | ~$1.00      |
| OpenRouter AI (optional cap)    | $0-$2.00    |
| **Total**                       | **~$5-$7**  |

> Tip: The Hetzner CAX11 (ARM, 2 vCPU, 4 GB) is ~$3.50/month — cheapest option.

## Provider options
- **Hetzner CX22 / CAX11** — best price/performance; recommended
- Contabo VPS S — lower price, variable performance
- DigitalOcean Droplet Basic (1 GB) — near upper end of budget
- Fly.io free tier — suits hobby/testing; limited resources

## Deploy steps
1. **Provision Ubuntu 22.04 VPS** and note the public IP.
2. **Point DNS** — add an `A` record for your domain pointing to the VPS IP.
   Wait for DNS propagation (usually <5 min with low TTL).
3. **Install Docker** on the VPS:
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```
4. **Clone the repository** on the VPS:
   ```bash
   git clone https://github.com/your-org/systemDesignPrep.git
   cd systemDesignPrep
   ```
5. **Create `.env`** file with at minimum:
   ```env
   DB_PASSWORD=<strong-random-password>
   DOMAIN=yourdomain.com
   CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   OPENROUTER_API_KEY=<optional>
   SILICONFLOW_API_KEY=<optional>
   ```
6. **Start the low-cost stack**:
   ```bash
   docker compose -f docker-compose.lowcost.yml up -d --build
   ```
   Caddy will automatically obtain a Let's Encrypt certificate for your domain.
7. **Verify**:
   ```bash
   curl https://yourdomain.com/api/v1/actuator/health
   # Should return {"status":"UP"}
   ```

## Cost guardrails
- Keep AI model budget capped (prefer smaller/cheaper OpenRouter models for routine requests).
- Keep logs at `INFO` in production (`application-lowcost.yml` already sets this).
- Disable non-essential always-on services unless needed for a short period.
- Use one-node architecture until traffic justifies scale-out.
- Set a hard spending limit in your OpenRouter dashboard.

## Upgrade path (when traffic grows)
- Re-enable Redis by setting `SDP_CACHE_PROVIDER=redis` and adding a Redis service.
- Move Postgres to a managed DB only when operational overhead exceeds savings.
- Add the Prometheus + Grafana stack from `infra/prometheus/` only when troubleshooting frequency increases.
- Split frontend to a CDN (Cloudflare Pages free tier) to offload static asset bandwidth.