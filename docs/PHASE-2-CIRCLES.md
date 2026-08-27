# RunWrapped — Phase 2: Monthly Friend Leaderboards ("Circles")

> Goal: turn RunWrapped from an end-of-year novelty into a **monthly habit** — something
> people open every month, not once a year. Keep it a small, fun side project.

---

## Context: current architecture (why this plan is shaped the way it is)

- **Auth:** Strava OAuth. Activities are **fetched live from Strava on the client each session**
  and stats are computed client-side (`useWrapStats`). **Activities are never persisted.**
- **Backend:** Express + MongoDB (thin). `User` model stores only `stravaId`, name, `profile`,
  `joinedAt`, `lastLogin`. Backend does image proxy + Gemini roast. No token storage, no session
  system beyond Strava OAuth.

That one fact — *nothing is persisted today* — is the keystone of Phase 2.

---

## Club vs Group — the decision

Intuition says "use the Strava **club** — friends are already in it, zero setup." But Strava's
API undercuts that:

- `GET /clubs/{id}/activities` returns each activity's athlete as **"Firstname L." with no athlete
  ID**, and only the **recent** feed (not full history).
- So you **cannot reliably attribute a run to a specific person** (two "Rahul S." collide, and
  you miss earlier-in-month runs). An accurate per-person monthly leaderboard from club data is
  effectively impossible.

Key realization: an accurate leaderboard **only works for people who've logged into RunWrapped**
anyway (you can only read a person's real, full data through *their own* Strava auth). Once that's
true, "club" vs "group" doesn't change the data source — both compute each member's stats from
their own login. The club's only advantage (pre-existing membership) evaporates.

### ✅ Decision: **app-native invite-code Groups ("Circles")**

- More accurate, more in our control, not more work.
- Make joining as frictionless as a club: **one tap on a shared link.**
- Optional later nice-to-have: seed a Circle from a Strava club's member list.

---

## The one principle everything hangs on

**Never live-fetch other people's data.** Each user's monthly totals are computed **from their own
login** and **cached in Mongo**. The leaderboard just reads those cached rows. This keeps it:

- **Accurate** (full data via each user's own auth),
- **Rate-limit-safe** (no per-viewer Strava calls — N users = N cheap DB reads/writes),
- **Small** (aggregates only, no activity storage).

---

## 1. Data model (3 tiny collections)

```txt
MonthlyStat
  { stravaId, month: "2026-01", distanceKm, runs, timeMin,
    elevationM, activeDays, streak, updatedAt }        // one doc per user per month

Circle
  { code: "RUN-7F3K", name, ownerStravaId, createdAt } // the group

CircleMember
  { circleCode, stravaId, firstname, profile, joinedAt, sharing: true }
```

`User` gains nothing required (optionally a `handle`). That's the whole schema.

---

## 2. Auth without building a session system

On any write, the client sends its **Strava access token**; the backend calls Strava `/athlete`
**once** to resolve the **real** `stravaId`, then upserts.

- ✅ Nobody can post someone else's stats (you'd need their token).
- ✅ Avoids building JWT/session infra.
- Small and safe.

---

## 3. Endpoints (~5)

| Method & path | Purpose |
|---|---|
| `POST /stats/sync` | Client computes this month's `MonthlyStat`; backend verifies token → upserts. Called on every visit. Cheap — no extra Strava calls beyond what the recap already fetched. |
| `POST /circles` | Create a Circle (returns `code` + share link). |
| `POST /circles/:code/join` | Join a Circle. |
| `GET /circles/:code/leaderboard?month=` | Ranked members (reads cached `MonthlyStat`s). |
| `PATCH /circles/:code/me` | Toggle `sharing` (privacy) / leave. |

---

## 4. Frontend (reuses existing theme + card engine)

- **Create / Join Circle** screen — invite link `/circle/RUN-7F3K`.
- **Leaderboard view** — reuse the pastel `Card` / `StatBody` styling: ranked rows
  (avatar, name, primary metric), **your rank highlighted**, a metric toggle.
- **"Your standing" hook** on the monthly recap:
  *"You're #3 in Weekend Warriors this month."* — this is the re-open driver.

---

## 5. Ranking metrics

- **Default: distance.** Toggle to **runs / time / activeDays / streak**.
- **Feature consistency (active days) prominently** — it rewards *showing up*, not just being
  fastest, which keeps casual friends engaged. (A pure-distance board that one person always wins
  kills retention.)

---

## 6. Privacy & edge cases (small but must-haves)

- **Opt-in per Circle** (`sharing` flag) + leave-Circle.
- Only count `type === "Run"`.
- Handle empty months gracefully.
- **Disable writes in `?mock` mode** so fake data never hits the DB.

---

## 7. Rate-limit strategy

Sync writes an **aggregate only** (no new Strava calls beyond the recap's existing fetch), so
**N users = N cheap DB upserts, not N Strava hits.** This is the entire reason to persist —
Strava allows ~200 req/15 min and ~2000/day per app.

---

## Build order (each step is shippable)

1. **Milestone 1 — the keystone:** `MonthlyStat` schema + `POST /stats/sync` + call it on recap
   visit. *No UI.* Just start collecting data. Everything else is cheap after this exists.
2. **Milestone 2:** Circles CRUD + join link + basic leaderboard endpoint.
3. **Milestone 3:** Leaderboard UI in the RunWrapped theme + "your standing" on the recap.
4. **Milestone 4 (polish):** privacy toggle, metric switcher, shareable
   "I'm #2 this month" card.

### Explicitly deferred (to keep it small)

Email / push nudges · real-time updates · background token refresh · seeding-from-club.
**None are needed to launch.**

---

## Open questions before building

1. Does the app already have a real login/session on the backend, or is Strava auth purely
   client-side? (Affects whether the token-verify approach fits as-is.)
2. Start **Milestone 1** first (low-risk keystone), or refine the plan further?

---

## Phasing recap (where this sits)

- **Phase 1 (done/underway):** Monthly recap + monthly shareable card — pure reuse of Wrap/Cards,
  no backend change. Ships the "come back monthly" behavior.
- **Phase 2 (this doc):** Persist monthly aggregates → Circles (friend leaderboards).
- **Phase 3+ (later):** notifications, head-to-head challenges, monthly goals/badges.
