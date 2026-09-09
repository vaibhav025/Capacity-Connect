import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { InteractiveHero } from "../components/layout/InteractiveHero";
import { AnimatedButtons } from "../components/ui/AnimatedButtons";
import type { Role } from "../types/domain";
export function Login() {
  const nav = useNavigate();
  const [role, setRole] = useState<Role>("admin");
  return (
    <div className="login-page">
      <InteractiveHero>
        <div className="brand light">
          <span className="brand-mark">✦</span> CAPACITY CONNECT
        </div>
        <div className="login-message">
          <p className="eyebrow">INDIA METEOROLOGICAL DEPARTMENT</p>
          <h1>
            Grow capability.
            <br />
            <em>Forecast better.</em>
          </h1>
          <p>
            A governed learning ecosystem connecting the right people, knowledge
            and competencies.
          </p>
        </div>
        <div className="orbit">
          <span>◌</span>
          <span>↗</span>
          <span>✦</span>
        </div>
      </InteractiveHero>
      <div className="login-form">
        <div className="brand">
          <span className="brand-mark">✦</span> CAPACITY CONNECT
        </div>
        <div className="form-copy">
          <h2>Welcome back</h2>
          <p>Sign in to your learning workspace.</p>
        </div>
        <label>
          Work email
          <input
            key={role}
            defaultValue={
              role === "admin" ? "admin@imd.gov.in" : role + "@imd.gov.in"
            }
            type="email"
          />
        </label>
        <label>
          Password
          <input defaultValue="password" type="password" />
        </label>
        <div className="demo-roles">
          <small>Demo role</small>
          <div>
            {(["admin", "trainer", "trainee"] as Role[]).map((r) => (
              <button
                aria-pressed={role === r}
                className={role === r ? "selected" : ""}
                onClick={() => setRole(r)}
                key={r}
              >
                {r[0].toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <AnimatedButtons
          className="primary wide"
          onClick={() => nav(`/${role}/dashboard`)}
        >
          Enter demo workspace <ChevronRight size={17} />
        </AnimatedButtons>
        <p className="login-foot">
          Demo environment · Supabase-ready architecture
        </p>
      </div>
    </div>
  );
}
