# Capacity Connect — PS 26075

## Product assessment

The statement asks for organisational capacity building, not just a catalogue of courses. A strong demonstration should show a complete evidence chain: training need → suitable expertise → learning → assessment → demonstrated completion → feedback.

The previous prototype had strong motion and layout, but enrollment reset on navigation, resource buttons opened alerts, certificates were pre-awarded, announcements did not publish content, and the demo matching endpoint returned identical results for different subjects. These undermine the ability to demonstrate the core problem statement.

## Implemented improvements

- IMD mission panel with learning evidence calculated from actual local demo actions.
- Four subject-specific paths containing three readable field notes each.
- Enrollment and module completion saved in browser storage and reflected in the catalogue and trainee dashboard.
- Subject-specific knowledge checks gated behind enrollment and completion. Passing threshold: 70%. Practice remains available separately.
- Certificates appear only after all notes are completed and the check is passed. Download produces a text record explicitly marked as a demonstration credential.
- Course rating and written feedback, visible alongside scores and progress in trainer performance.
- Professional profiles covering qualifications, work experience, interests, skills and certificate descriptions, with completion feedback and persistence.
- Admin announcement composer with type and audience selection; published notices appear on the relevant role dashboards.
- Convenient, explicitly labelled demo role switching.
- Competency rankings computed from sample evidence using the existing weighted model. Radar, satellite and Python requests produce different leaders. Missing skills are explained, unapproved trainers excluded, and unrelated candidates omitted.
- Bearer-token and approved-admin checks added to the existing live approval endpoint.

## Suggested five-minute demonstration

1. **Admin:** Start on the dashboard. Explain that aggregate organisational statistics are samples; the evidence panel tracks actual local actions. Open competency mapping and compare radar with satellite requirements.
2. **Admin:** Publish a trainee announcement for an upcoming workshop.
3. **Trainee:** Switch using the labelled role selector. Show the announcement, then fill qualifications and experience in the professional profile.
4. **Trainee:** Enroll in the radar course. Read and mark all three notes complete. Open the knowledge check, answer both questions and show the earned certificate. Download its record.
5. **Trainee:** Return to the course and provide feedback.
6. **Trainer:** Open Performance to show the learner's course progress, score and feedback. Demonstrate the existing content staging and questionnaire builder separately.
7. **Close:** Explain how the same evidence chain would feed a future station/subject competency coverage dashboard. Do not describe that future dashboard as already implemented.

## Honest boundaries for the presentation

This is a single-browser demonstration, not production multi-user operation. Browser storage is editable, shared by demo roles, and unsuitable as an authentication or assessment authority. Role-specific pages and controls are UI behaviour, not a security boundary. Existing demo login is not secure signup/login.

The short notes and two-question assessments are illustrative and require subject-expert review. Self-reported profile evidence is not verified. Downloaded records are not official certificates. The trainer's uploader stages files; it does not publish a durable shared media library. Questionnaire publication, deadlines and attempt limits remain implementation work.

Production priorities:

1. Supabase Auth signup/login, verified accounts, pending approval, protected sessions, server-resolved roles and audited role changes.
2. Audit and harden all SQL policies before deployment. The original migration enables RLS on only part of the schema, and its profile update policy needs field restrictions to prevent self-approval. The added API admin guard does not fix database policies.
3. Server-side assessment grading and deadlines; never expose answer keys to learners in production. Add immutable attempts, reviewed content and issued certificate verification.
4. Private object storage, signed resource access, upload validation and durable trainer publishing.
5. A multi-user repository layer replacing browser state, audit logging, notification delivery and cross-device syncing.
6. Evaluate matching on expert-labelled requirements. The displayed weighted score is a decision aid, not an AI accuracy claim or a probability.

## Validation

- TypeScript checks and Vite production build.
- Seven Playwright journeys covering motion cleanup, mobile layout, learning-to-certificate flow, persistence, profiles, announcement audience filtering and existing trainer interactions.
- Two Node tests covering subject-sensitive matching, missing evidence, unknown subjects and approved-user eligibility.
- Build retains the existing warning for the lazy-loaded Three.js chunk.

Commands:

```sh
npm run dev
npm run typecheck
npm run build
npx playwright test
node --test --test-isolation=none server/services/competency.test.js
```

Playwright expects the development server on port 5173 and installed Microsoft Edge.
