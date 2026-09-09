# CAPACITY CONNECT

IMD Learning Management System hackathon prototype. The repo uses React/Vite + TypeScript, Express, and Supabase PostgreSQL/Auth/Storage/RLS.

## Run

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

Open `http://localhost:5173`. Without credentials, the isolated demo adapter provides seeded UI data and the competency flow. With Supabase values, run `supabase/migrations/001_capacity_connect.sql`, then `supabase/seed.sql`, and create Auth users/profiles for live data. Put `SUPABASE_SERVICE_ROLE_KEY` only in the server environment.

Demo accounts: `admin@imd.gov.in`, `trainer@imd.gov.in`, and `trainee@imd.gov.in`, password `password`. The login selector simulates the three approved roles for the demo.

## Motion UI

The interface is split into layout, UI, trainee, trainer and admin components. See [the complete motion implementation guide](docs/MOTION-IMPLEMENTATION.md) for installation commands, the directory tree, and complete code for the four critical components and their dependencies.

The login uses a lazy Vanta Net background with renderer cleanup. The root integrates Lenis with reduced-motion support. Course cards include spring hover motion, keyboard/touch quick actions and animated progress rings. Trainer screens provide file staging, drag and keyboard reordering, and question authoring. Competency mapping calls the Node endpoint and shows a cancellable scan, results or an error. Recharts supports animated charts and interactive series highlighting.

```bash
npm run typecheck
npm run build
# In another terminal, with npm run dev running:
npm run test:e2e
```

Tests use locally installed Microsoft Edge. Screenshots are written to the ignored `artifacts/` directory.

Remaining limitations: the LMS still uses simulated login and seeded UI data. Bookmarks, approval decisions and authoring drafts last only for the current session. Content files are staged locally, not uploaded. Practice scores are not submitted. Existing secondary screens retain prototype actions. Production needs Supabase Auth session middleware on every Express route, signed Storage uploads, assessment authoring/submission persistence, and seeded Auth-linked records. Configure production `/api` routing before deployment.
