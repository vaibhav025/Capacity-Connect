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

Remaining limitations: the visual prototype’s secondary create/upload actions show demo confirmations; production needs Supabase Auth session middleware on every Express route, direct signed Storage uploads, full assessment question authoring/submission persistence, and seeded Auth-linked records.
