# Strava Roast — Improvement Plan

> Order of execution: **Phase 1 → 2 → 3 → 4**. Each phase is independently shippable.
> Findings referenced below come from the full-repo audit (Aug 2026).

---

## Phase 1 — Scalability & Security Foundation

### 1.1 Move all secrets & token handling server-side
Current state: `VITE_STRAVA_CLIENT_SECRET` is inlined into the public JS bundle and used
for the OAuth code exchange directly from the browser (`src/services/stravaAuth.js:87,148`).
Access + refresh tokens live in `localStorage` (`strava_auth` key) — any XSS = account takeover.

- [ ] Create/extend backend (`VITE_BACKEND_URL`) with these endpoints:
  - `GET  /api/auth/strava/login`      → builds Strava authorize URL (client secret stays server-side)
  - `GET  /api/auth/strava/callback`   → validates `state`, exchanges `code` for tokens, sets session cookie
  - `POST /api/auth/strava/refresh`    → refreshes access token server-side
  - `POST /api/auth/logout`            → clears session cookie
- [ ] Store tokens **only on the server**, keyed by an opaque session ID in an
  **httpOnly, Secure, SameSite=Lax cookie**. Remove all localStorage token usage:
  - `strava_auth` (`stravaAuth.js`), `strava_roast_data` (`Roast.tsx:35`),
    `strava_profile` (`Dashboard.tsx:111`)
- [ ] Delete `VITE_STRAVA_CLIENT_SECRET` from frontend env entirely; add `.env.example`
  documenting only safe public vars (`VITE_BACKEND_URL`).

### 1.2 Harden OAuth flow
- [ ] Generate `state` with proper entropy (crypto.getRandomValues, ≥128-bit) and
  **validate it in Callback.jsx** (currently ignored — CSRF risk).
- [ ] Validate token-response shape server-side; verify athlete identity before creating session.

### 1.3 Frontend auth becomes session-based
- [ ] Replace `stravaAuth.js` internals with a thin client that calls backend endpoints;
  keep the same exported API (`isAuthenticated`, `getValidAccessToken`, etc.) so pages change minimally.
- [ ] Rewrite `ProtectedRoute.jsx` to check a real session endpoint (`GET /api/auth/me`)
  instead of a forgeable localStorage flag.
- [ ] Fix logout key mismatch: `DashboardNav.tsx:30` clears `"strava_token"` but real key is
  `"strava_auth"` — moot after migration to cookies, but ensure logout hits `/api/auth/logout`.

### 1.4 Transport & headers
- [ ] Remove insecure fallback `http://localhost:5000` (`roastAPI.ts:3`) — fail loudly if
  `VITE_BACKEND_URL` is unset in prod build.
- [ ] Add security headers via `vercel.json`: CSP, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy. CSP will mitigate residual XSS risk.
- [ ] Stop sending raw access token to `/api/roast/*`; backend uses its own stored token
  for the session. Chat endpoint stops accepting client-supplied `userData`.

### 1.5 Scalability groundwork
- [ ] Break up `Dashboard.tsx` (2,172 lines) into feature components/hooks:
  `MapSection`, `StatsGrid`, `YearProgress`, `HighlightsSection`, plus a `useStravaData` hook.
- [ ] Adopt React Query properly (provider exists, zero usage): all Strava/backend fetches
  become cached queries with stale times — fewer API calls, better UX.
- [ ] Asset pipeline: compress `public/new-bg-runners.png` (9.7 MB), animal PNGs (6.6–7.5 MB each),
  convert to WebP/AVIF; lazy-load heavy routes with `React.lazy`.
- [ ] Code-splitting: route-level lazy imports for Dashboard/Roast/Cards.

---

## Phase 2 — Fix Critical Bugs (audit findings)

Security-critical items are resolved by Phase 1 architecture. Remaining concrete fixes:

- [ ] **Token logged to console** — remove `console.log("Token:", token)` (`Roast.tsx:74`);
  strip remaining debug logs (`DataTest.jsx` ×29, `RoastCard.tsx:15-16`, `MusicPlayer.tsx`).
- [ ] **OAuth state validation** in `Callback.jsx` (if not already done in Phase 1).
- [ ] **Logout no-op bug** — key mismatch `strava_token` vs `strava_auth` (Phase 1 supersedes).
- [ ] **No token response validation** — handled server-side in Phase 1.
- [ ] Remove/reroute debug page `/data-test` (`DataTest.jsx`, 537 lines of PII-dumping console logs).
- [ ] Add lint guard so this class of bug can't return: extend ESLint to `*.{js,jsx}`,
  enable `no-console` (warn), turn `@typescript-eslint/no-unused-vars` back ON.
- [ ] Enable `tsc -b` in the build script so type errors block builds.

---

## Phase 3 — Wrap Page UI Update

Scope: the year-in-review "wrapped" experience (Dashboard/Cards flow).

### 3.1 Cleanup first
- [ ] Delete dead components: `AsciiRun`, `PixelShoe`, `PixelField`, `NovaGrain`,
  `StatsCard`, `TornEdge` (+ dead util `carPersonality.ts`).
- [ ] Remove unused shadcn `ui/*` wrappers (~39 files) and unused deps
  (recharts, embla, react-day-picker, react-hook-form, zod, radix extras).

### 3.2 Redesign
- [ ] Story-style vertical sections (tap/swipe or scroll-snap): intro → big stats →
  map highlight → personality reveal → share card.
- [ ] Animated number counters + scroll-triggered reveals (GSAP already available —
  see `.claude/skills/gsap-*`).
- [ ] Consistent design tokens in `tailwind.config.ts` (spacing/type scale) to stop
  per-commit one-off styling drift.
- [ ] Mobile-first: wrapped is primarily shared/ viewed on phones.
- [ ] Share/export: generate an OG-image style summary card (canvas render) for
  social sharing.

### 3.3 Polish
- [ ] Skeleton/loading states per section (no more blocking spinner on full payload).
- [ ] Reduced-motion support (`prefers-reduced-motion`) for GSAP animations.

---

## Phase 4 — Leaderboard

New feature. Requires backend since raw Strava tokens should never reach the client (Phase 1 prerequisite).

### 4.1 Data model (backend)
- [ ] Table/collection `leaderboard_entries`:
  `{ athlete_id, name, avatar_url, metric, value, period (week|month|year), updated_at }`
- [ ] Metrics to rank on (pick v1 set): total distance, longest run, biggest week,
  roast score / "suffering score" (fun angle that fits the product).

### 4.2 Backend API
- [ ] `GET /api/leaderboard?metric=&period=` → top N (auth required, session cookie).
- [ ] `GET /api/leaderboard/me?metric=&period=` → current user's rank + neighbors.
- [ ] Sync job or on-demand refresh pulling from Strava via server-held tokens;
  rate-limit aware (respect Strava API limits).

### 4.3 Frontend
- [ ] New route `/leaderboard` (lazy-loaded, protected).
- [ ] Components: `LeaderboardTable` (podium top-3 + list), `MetricTabs`
  (distance / longest run / week), `PeriodToggle` (week/month/year), `MyRankCard`.
- [ ] Opt-in privacy toggle: users choose display name vs first-name-only participation.
- [ ] Live updates via polling with React Query (refetchInterval) — websockets overkill for v1.

---

## Suggested commit sequence

1. `chore: repo hygiene` — single lockfile (drop bun.lockb), delete desktop.ini files, README rewrite, .env.example
2. `feat(security): server-side OAuth + session cookies` (Phase 1.1–1.3)
3. `feat(security): headers, CSP, fail-fast backend URL` (Phase 1.4)
4. `refactor: split Dashboard.tsx, react-query adoption, asset compression` (Phase 1.5)
5. `fix: strip debug logging, eslint/ts hardening, remove data-test route` (Phase 2)
6. `feat(ui): wrap page redesign` (Phase 3)
7. `feat(leaderboard): backend + UI` (Phase 4)
