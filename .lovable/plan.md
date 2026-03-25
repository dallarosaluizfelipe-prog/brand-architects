

## Diagnosis

All 3 analytics tables (`site_page_views`, `site_events`, `site_form_submissions`) have **0 records**. The root cause:

- `useAnalytics` and `trackFormSubmission` send data to `/api/track` — a **Vercel serverless function** (`api/track.js`)
- This endpoint only works when deployed to Vercel. In the Lovable preview (and any non-Vercel environment), `/api/track` returns 404, so nothing is recorded
- Even on Vercel, geo headers (`x-vercel-ip-country`, etc.) are Vercel-specific

## Solution

Replace the `/api/track` serverless approach with **direct Supabase inserts from the client**. This works because:
- All 3 tables already have `anon_insert` RLS policies (INSERT allowed for anonymous users)
- No sensitive data is involved — these are public analytics events
- No serverless function needed

### Changes

**1. Rewrite `src/hooks/useAnalytics.ts`**
- Remove `sendTrack` / `sendBeacon` / `fetch('/api/track')` logic entirely
- Import the Supabase client directly
- `trackPageView`: insert into `site_page_views` via `supabase.from('site_page_views').insert({...})`
- `trackEvent`: insert into `site_events` via `supabase.from('site_events').insert({...})`
- `trackFormSubmission`: insert into `site_form_submissions` via `supabase.from('site_form_submissions').insert({...})`
- Keep session ID logic, `useAnalytics` hook behavior (route tracking + WhatsApp interceptor) unchanged
- Geo data (country/region/city) won't be available client-side — those columns will be null (acceptable tradeoff; could be added later via an IP geolocation API if needed)
- `user_agent` will be set via `navigator.userAgent`

**2. Keep `api/track.js` as-is** (for Vercel deployments that may still receive beacons from cached pages)

**3. Update `context.md` and `essential.md`** with the change log

### What this fixes
- Dashboard will start showing real pageviews, WhatsApp clicks, and form submissions immediately
- Works in both Lovable preview and Vercel production
- No new dependencies or migrations needed

