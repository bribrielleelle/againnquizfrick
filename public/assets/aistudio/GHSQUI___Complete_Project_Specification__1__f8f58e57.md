# **GHSQUI — Complete Project Specification**

Everything about the project in one document: purpose, technology, design, data, features, all five phases with status, the full test plan, deployment runbook, and all 50 launch questions. The repo (`bribrielleelle/quiz2`, branches `main` and `feature/phase1-decisions` kept content-identical) remains the source of truth; this canvas consolidates `README.md` and all files under `docs/`.

**Current status — October 2026**

| Phase | Scope | Status |
| ----- | ----- | ----- |
| 1 | Product decisions, specification, design | ✅ DONE |
| 2 | Foundation, database, accounts | ✅ DONE |
| 3 | Quiz-taking, scoring, history (+ both individual features, seeded content, admin bootstrap) | ✅ DONE |
| 4 | Teacher authoring, CSV import, invite codes | ✅ DONE |
| 5 | Leaderboards, QA, production | 🔶 IN PROGRESS (spec, fact-check, accessibility polish done; QA run \+ deployment remain) |

## **1\. Purpose**

A web app where students take quizzes (Pusheen trivia), review their completed-attempt history, and compare results on leaderboards. Teachers maintain quiz questions through an editor or a validated CSV import. Built as a high school project: one shared specification plus two individually designed features, with five themed launch quizzes.

## **2\. Technology, environments, and setup**

* **Frontend:** plain HTML, CSS, and browser JavaScript (no frameworks).  
* **Server:** Node.js 24 LTS \+ Express 5\. One server serves static files and JSON APIs.  
* **Database:** PostgreSQL via `pg`, parameterized SQL only.  
* **Persistence:** all durable data in PostgreSQL; survives restarts.  
* **Auth:** server-managed sessions, `HttpOnly` cookies, bcrypt password hashing.  
* **Dev/QA:** Replit workspace \+ its development Postgres. **Production:** Replit Deployment with a separate database — never point prod at dev data.  
* **Secrets in environment variables only** (`DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production`, `ADMIN_BOOTSTRAP_SECRET`); never committed.

**Setup (Replit workspace):**

1. `git pull origin main`  
2. Set `DATABASE_URL` (Replit-provisioned Postgres) and `SESSION_SECRET` in Replit Secrets  
3. `npm install && npm run migrate && npm run seed && npm start`  
4. Register your account, then bootstrap the first teacher/admin: `npm run make-admin -- <username>` (requires `ADMIN_BOOTSTRAP_SECRET`)

## **3\. Users, roles, and provisioning**

**Players:** register/log in/out, browse published quizzes, take them, submit and see score \+ percentage, retry (each retry is a separate completed attempt), view their own history, view leaderboards.

**Teachers/admins:** everything a player can do, plus the question editor, CSV preview/import, quiz settings (time limit, publish/unpublish), and invite-code generation.

**Server-enforced rules:**

* Role checks on every protected API route — hiding frontend controls is never the only barrier.  
* Public registration can never select the teacher/admin role and has no role field.  
* Staff provisioning: single-use invite codes with expiry (any staff member generates; code shown once, only its hash stored). The very first staff account per environment comes from a one-time bootstrap script using an environment secret.

## **4\. Quiz behavior**

* Five published quizzes at launch, each with **at least ten questions**; every question has a prompt, exactly four choices, and exactly one correct answer.  
* Submission is the completion event: unsubmitted quizzes are never counted, and no completed-attempt record exists before submission.  
* On submission: raw score, question count, percentage. Retry starts a new attempt.  
* Completed attempts are immutable: score, question count, and completion time never change if content is later edited.  
* Publishing gate: a quiz cannot be published (or stay published) with fewer than ten valid questions. Deleting or reassigning a question that would drop a published quiz below ten automatically unpublishes it, with a warning.  
* A question that appears in any submitted attempt cannot be deleted (history protection); it can be edited or reassigned instead.

## **5\. Visual theme**

Four-color palette, retro-arcade styling, light mode default \+ dark mode toggle (remembered per browser).

| Role | Light (default) | Dark |
| ----- | ----- | ----- |
| Page background | `#fffdee` cream | `#1b140d` deep espresso |
| Cards and panels | `#ffffff` | `#31261c` espresso |
| Text and primary lines | `#31261c` espresso brown | `#fffdee` cream |
| Accent — buttons, badges, highlights, 1st place | `#fbd1e6` blush pink | `#fbd1e6` blush pink |
| Muted text | `#878787` warm gray | `#878787` warm gray |

*   
  Typography: Poppins headings, Inter body, "Press Start 2P" only for timers/scores.  
* Pixel touches: hard offset shadows, pixel-corner cards, uppercase PRESS-START buttons — used sparingly so teacher tools stay readable.  
* Branding stays original: Pusheen imagery is subject matter only, never in the app's UI or logo (copyright/trademark).  
* CSS variables (`--navy`, `--gold`, `--bg`, … — names historical) with a dark-mode override; toggling is a single attribute change.

## **6\. Pages and navigation**

Nav on every page: GHSQUI badge → Quizzes · Leaderboards · My History (+ Teacher link for staff) — user name, LOG IN/OUT, theme toggle.

| Page | Who | What |
| ----- | ----- | ----- |
| `/` quiz list | all visitors (taking requires login) | one card per published quiz: title, description, count, TIMED badge, PRESS START |
| `/quiz.html?id=X` | players | one question per screen, A–D chunky buttons, counter \+ pixel countdown when timed, NEXT/PREV; time-up locks and auto-submits |
| result | players (after submit) | big pixel score `8/10 · 80%`, NEW HIGH SCORE header on perfect, RETRY \+ REVIEW ANSWERS |
| `/review.html` | attempt owner, staff | read-only per-question review: your answer (CORRECT\!/MISS), correct answer, explanation |
| `/history.html` | players | own completed attempts: quiz, score, %, time, REVIEW link per row |
| `/leaderboards.html` | signed-in users | OVERALL tab \+ per-quiz selector; gold rank-1 row |
| `/login.html`, `/register.html` | unauthenticated | pixel card forms; register has optional "Teacher invite code" field |
| `/teacher.html` | teacher/admin only | question editor, quiz settings \+ publish, CSV import, invite codes |

**Leaderboard rules (deterministic):**

* **Overall:** rank by total completed attempts, descending; only users with ≥ 1 attempt; ties by username ascending.  
* **Per quiz:** rank by best score descending; ties by more completed attempts first, then username ascending; shows best `score / total` and try count.  
* Usernames only — never emails. Only submitted attempts count.

## **7\. Data model**

Relational, FKs \+ constraints, UTC timestamps, delete behavior that never silently erases history.

* **users:** id, username (unique, normalized), email (unique, normalized), password hash, role (`player`/`teacher`/`admin`), created.  
* **quizzes:** id, title (unique), description, publication state (`draft`/`published`), time limit minutes (nullable), created/updated.  
* **questions:** id, quiz id, prompt, choices A–D, correct choice (A–D), optional explanation, ordering, created/updated.  
* **attempts:** id, user, quiz, score, question count, start time, completion time; immutable completion record.  
* **attempt\_answers:** attempt \+ question PK, selected choice (NULL \= unanswered); enables Feature 2 review.  
* **invite\_codes:** code hash (SHA-256), created by, expiry, used by/used time, single use enforced.

## **8\. API outline**

* `POST /api/auth/register` · `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me`  
* `GET /api/quizzes` — published quizzes with counts  
* `GET /api/quizzes/:quizId` — question set \+ server-signed start token (timed-mode start event; no attempt record yet)  
* `POST /api/quizzes/:quizId/attempts` — submits with the start token; server verifies it, enforces the deadline, and scores. Untimed quizzes use the same flow.  
* `GET /api/me/attempts` — own history  
* `GET /api/me/attempts/:attemptId/review` — owner-only (staff too) answer review  
* `GET /api/leaderboards` · `GET /api/quizzes/:quizId/leaderboard`  
* Teacher-only under `/api/teacher/...`: quiz settings and publish/unpublish, question create/update/delete, CSV template download/preview/import, invite-code create/list.

Scoring is always computed server-side from the server's own answer key; the browser never supplies a score or start time (the start token is HMAC-signed and verified). An initialized attempt is not a completion record — it counts only once submitted.

## **9\. Individual features (the two selected beyond the shared spec)**

### **Feature 1 — Timed quiz mode**

* Teacher sets an optional per-quiz time limit (minutes; blank/0 \= untimed), stored on the quiz, editable in the teacher area.  
* Taking a timed quiz: the server stamps and signs a start time with the questions; the client counts down from the server time (gold pixel timer). Untimed quizzes show no countdown.  
* At 0:00: questions lock, "TIME'S UP\!" flash, auto-submit of whatever was answered. Unanswered questions are stored NULL and scored incorrect — this counts as a completed attempt.  
* Server enforcement: submission recomputes elapsed time from the signed token. Manual submission within deadline \+ 30s grace scores normally; later is treated exactly like auto-submit (`late: true`).

**Acceptance:** 1-minute quiz auto-submits on expiry and appears in history with unanswered scored incorrect · untimed quiz shows no countdown · post-deadline submissions score only received answers · records survive restarts.

### **Feature 2 — Post-quiz answer review with explanations**

* Teachers attach optional explanations per question (editor \+ CSV `explanation` column).  
* Immediately after submission, the result page lists every question with your answer, the correct answer (gold CORRECT\! / red MISS), and the explanation when present.  
* Every attempt stores one answer row per question, so the same read-only review is reachable from history after restarts.  
* Owner-only: another player's review returns "not found" (no existence leak); staff may view any.

**Acceptance:** per-question right/wrong with explanations after submit · review reachable from history after a restart · another player cannot open someone else's review · NULL answers show as missed.

Out of scope: gamification extras (badges, streaks, XP) — possible future additions after QA.

## **10\. Security rules**

* Password hashes only (bcrypt, per-password salts, work factor 12); never plaintext, never logged.  
* Sessions: `HttpOnly`, appropriate `SameSite`, `Secure` in production.  
* Server-side validation of all input: registration, login, submissions, teacher data.  
* Parameterized SQL for every user-supplied value.  
* Leaderboards expose usernames only, never emails.  
* Authorization: role checks on teacher routes; ownership checks on personal history/reviews.  
* Usernames constrained to `[A-Za-z0-9_-]{3,30}` (blocks injection); teacher UI escapes all rendered content.

## **11\. Development phases**

### **Phase 1 — Product decisions, specification, design — DONE**

Quiz subjects/titles/audience confirmed (five Pusheen trivia sets); two individual features chosen; staff provisioning decided (invite codes \+ one-time bootstrap); CSV import confirmed add-only; page flows, access rules, schema, API outline, CSV template, acceptance criteria finalized; GitHub repo \+ commit practices.

### **Phase 2 — Foundation, database, accounts — DONE**

Node 24 \+ npm scripts \+ Express 5; static frontend \+ JSON APIs from one server; dev and prod Postgres configured without committed credentials; repeatable SQL migrations (001\_init); registration/login/logout/sessions with hashing and server-side role checks; basic error handling. *(Outstanding: commit `package-lock.json` after the first `npm install` in Replit.)*

### **Phase 3 — Quiz-taking, scoring, history — DONE**

Quiz list, quiz-taking flow, submission result, retry; five approved quizzes seeded with 10 questions each (50 total); server-calculated scores persisted exactly once; personal history; per-question answers persisted for review; unsubmitted attempts never stored. Both individual features were pulled forward and shipped here, plus the seeded launch content and the one-time first-admin bootstrap script.

### **Phase 4 — Teacher authoring and CSV import — DONE**

Teacher-only question editor (create/edit/reassign/delete with the auto-unpublish rule and history protection); quiz settings including time limit and publish/unpublish with the ten-question gate; downloadable CSV template (valid titles listed in comment lines), preview with row-level validation, transactional add-only import (any invalid row rejects the whole file); single-use invite-code generation; server-side role checks on all `/api/teacher` routes.

### **Phase 5 — Leaderboards, QA, production — IN PROGRESS**

Delivered so far: leaderboard UI confirmed live (built in Phase 3 with deterministic ranking); QA \+ deployment specification generated (`docs/phase5-qa-and-deployment.md`); accessibility polish (aria labels, accessible theme-toggle name, announced leaderboard empty state); all ten Quiz 5 answers re-verified current (October 2026). **Remaining: run the QA checklist in the dev workspace, then deploy to production with its separate database.**

## **12\. Acceptance criteria (16)**

1. Five published quizzes, each with ≥ 10 questions and exactly four choices per question.  
2. Registration, login, logout work; plaintext passwords never persisted.  
3. Players cannot access teacher operations, including by calling an API route directly.  
4. A player can complete a quiz, see score and percentage, retry, and see every submitted attempt in their own history.  
5. No unsubmitted quiz is counted as a completion.  
6. The overall leaderboard ranks by completed-attempt count.  
7. Each quiz leaderboard shows each user's best score and attempt count, ranked primarily by best score.  
8. Leaderboards show usernames, not emails.  
9. Teachers can create and edit questions and assign them to quizzes.  
10. CSV upload has a preview and row-level validation; invalid files are not partially imported.  
11. Data survives an app restart.  
12. Development and production use separate PostgreSQL databases.  
13. Two separately specified, functional additions demonstrated in the deployed app: (a) timed mode with server-enforced expiry and auto-submit; (b) post-quiz answer review with teacher-written explanations.  
14. A timed quiz auto-submits at expiry, recorded and scored with unanswered as incorrect; untimed quizzes behave as before.  
15. Players can review submitted answers immediately and later from history; only the owner and staff can view a review.  
16. Only a valid, unused, unexpired invite code or the one-time bootstrap can create staff; ordinary registration always yields a player.

## **13\. QA test plan**

Run in the Replit dev workspace against `main`. Full steps in `docs/phase5-qa-and-deployment.md`; summary:

| \# | Test | Expected |
| ----- | ----- | ----- |
| 1 | Browse quiz list, open a quiz | 5 quizzes, ≥ 10 questions each, 4 choices |
| 2 | Register/login/logout \+ DB check | bcrypt hashes (`$2a$…`), no plaintext |
| 3 | Player opens `/teacher.html` and calls `/api/teacher/quizzes` | access message \+ 403 on every teacher route |
| 4 | Complete, score, retry, history | score \+ % shown; attempts separate rows |
| 5 | Abandon a quiz mid-way | nothing in history or leaderboards |
| 6 | Two users, different totals, OVERALL board | ranked by attempts; ties alphabetical |
| 7 | Retake one quiz, per-quiz board | one row per user: best score, tries; ranked best score → tries → username |
| 8 | Inspect both boards | usernames only |
| 9 | Teacher adds/edits/reassigns a question | saves and appears |
| 10 | CSV: bad row preview, then valid import | exact row errors, nothing written; then import succeeds with count |
| 11 | Submit → restart server → reload | data identical |
| 12 | Compare dev vs prod `DATABASE_URL` | different; no dev test data in prod |
| 13 | Demo Features 1 & 2 in the deployed app | both work |
| 14 | 1-minute quiz left to expire | auto-submit flash; unanswered scored incorrect; untimed shows no countdown |
| 15 | Review after submit, from history, as another player | owner \+ staff see it; other player gets "not found" |
| 16 | Register w/o code, with code, reuse code | player → teacher → reuse rejected |

**Feature tests:** (F1) expiry auto-submit \+ history with incorrect unanswered; untimed unchanged; late manual submission treated as auto-submit. (F2) per-question review with explanations immediately and from history after restart; ownership enforced.

**Security spot-checks:** player 403 on teacher routes · review ownership (404, no leak) · invite codes single-use \+ expiry \+ hashed · username regex blocks injection · parameterized SQL throughout.

## **14\. Accessibility and responsive checks**

* Keyboard-only walkthrough of every page (Tab/Enter/Space) — nav, choices, forms, selects, theme toggle.  
* Every input labeled or aria-labeled (leaderboard picker, file upload, theme toggle via app.js).  
* Contrast ≥ 4.5:1 for body text in both themes (espresso/cream, cream/espresso).  
* Visible focus rings on all interactive elements in both themes.  
* Responsive at \~360px: nav wraps, single column, tappable buttons.  
* Color never the only signal (CORRECT\!/MISS text); countdown shows numbers; form errors are readable text; leaderboard empty state uses `role="status"`.

## **15\. Deployment runbook (Replit)**

**Pre-deploy:** all QA passes · `package-lock.json` committed · quiz content final with ≥ 10 per published quiz.

1. Create the production Postgres (separate from dev).  
2. Deployment secrets: `DATABASE_URL` (prod), `SESSION_SECRET` (new random), `NODE_ENV=production`, `ADMIN_BOOTSTRAP_SECRET` (temporary).  
3. Deploy from `main`.  
4. `npm run migrate && npm run seed` against prod (seed is idempotent; or load content via CSV import).  
5. Register your production account, run `npm run make-admin -- <username>`, then **remove `ADMIN_BOOTSTRAP_SECRET`**.  
6. Further staff via invite codes in the Teacher area.

**Post-deploy smoke test:** register/login/logout · five quizzes playable, attempts appear in history \+ both leaderboards · timed auto-submit \+ review explanations · teacher area reachable for staff, 403 for players · dev test data absent (proves separate DB) · data persists across a redeploy.

**Rollback:** redeploy the previous commit; the database is untouched by app-code rollbacks.

## **16\. Launch quiz content — all 50 questions**

Five Pusheen trivia quizzes (replacing the original academic-subject plan), each 10 questions, mixed difficulty (E/M/H), verified against Wikipedia's Pusheen article and official bios; explanations only on tricky items. Full drafts with CSV-ready text: `docs/quiz-content-plan.md`; live content: `db/seed.js`.

**Quiz 1 — Meet Pusheen** (the character herself; 5E/4M/1M-H)

1. What kind of animal is Pusheen? B) a cat — E  
2. What color is Pusheen? C) gray  
3. Official bio: Pusheen is a \_\_\_ cat. D) female  
4. "Puisín," the word behind her name, is kitten in which language? C) Irish *(family nickname)*  
5. Pusheen is a plump gray \_\_\_ cat. B) tabby  
6. Official bio: loves blogging, snacking, and… A) going on adventures  
7. The unicorn version of Pusheen? A) Pusheenicorn  
8. The mermaid version? A) Purrmaid  
9. The dinosaur version? A) Pusheenosaurus Rex  
10. Pusheen's official birthday? B) February 18 *(celebrated yearly)*

**Quiz 2 — Pusheen's Family Tree** (family \+ the real cat; 4E/5M/1H)

1. Pusheen's mother? A) Sunflower  
2. Pusheen's father? C) Biscuit  
3. Little sister and best friend? A) Stormy  
4. Little brother? B) Pip  
5. Pip's fur color? C) black  
6. Stormy idolizes… B) Pusheen  
7. Stormy is a role model to… A) Pip  
8. Stormy's hobbies: adventuring, intellectual pursuits, and… C) grooming herself  
9. The real cat lives with the creator's parents in which state? C) Illinois *(trap: the town of Oregon, Illinois — not the state)*  
10. Which family member's name doubles as a breakfast food? D) Biscuit — H

**Quiz 3 — Pusheen's Pals** (Sloth, Bo, Cheek; 3E/4M/3H)

1. Sloth is… A) a sloth  
2. Bo is… A) a parakeet *(corrected from a common misconception)*  
3. Cheek is… C) a hamster  
4. Cheek's color? A) yellow  
5. Cheek bakes in his… C) miniature kitchen  
6. Thoughtful, quiet, takes his time? B) Sloth  
7. Cheek shares treats with… C) his larger animal friends  
8. What hasn't Cheek noticed about his creations? B) they're bite-sized — H *(bio: everyone is too nice to point it out)*  
9. Sloth, Bo, Cheek are friends that are not what? C) pets *(Wikipedia: "non-pet friends")*  
10. The creators' original dog in Everyday Cute comics? D) Carm — H *(short for Carmen)*

**Quiz 4 — The Story of Pusheen** (creator \+ brand history; 1E/6M/3H)

1. Who created Pusheen? B) Claire Belton  
2. Co-created with…? A) Andrew Duff  
3. First appeared in what year? C) 2010  
4. On what website? A) Everyday Cute  
5. First strip was called…? B) Pusheen Things — H *(May 2010\)*  
6. 2013 comic collection? A) I Am Pusheen the Cat  
7. 2021 sequel? B) The Many Lives of Pusheen the Cat  
8. Famous through sticker sets on…? C) Facebook  
9. Stickers first launched (April 2013\) on…? B) Android — H *(main Facebook site later that year)*  
10. Pusheen Corp headquarters city? D) Chicago

**Quiz 5 — Pusheen Merch & Media Mania** (business side; 1E/7M/2H — **all ten facts re-verified current, October 2026**)

1. Official plush maker? B) GUND *(since 2014\)*  
2. The Pusheen Box is… A) a mystery subscription box  
3. The cat version is called… B) Cat Kit  
4. Items per box? C) 7–10 *(over \$100 value)*  
5. Box items are… B) exclusive to the box  
6. Pet retail chain that carries Pusheen? B) Petco  
7. Bookstore chain? C) Barnes & Noble  
8. Collectible figure type? A) vinyl figures *(Pusheen × Funko)*  
9. Blogging platform that spread early GIFs? C) Tumblr  
10. 2017 office suburb? D) Park Ridge *(workspace for artists and photographers)*

**Content policy:** correct answers distributed across A–D · explanations only on tricky questions (they feed Feature 2's review) · Pusheen imagery never in the app's UI or logo · Quiz 5 merch/platform facts drift fastest — re-verify if launch slips by many months.

## **17\. Decisions made**

* Five launch quizzes are the Pusheen trivia sets, replacing the earlier academic-subject plan. Pusheen is subject matter only; app artwork stays original (copyright/trademark).  
* The two individual features: timed quiz mode, and post-quiz answer review with explanations.  
* Staff provisioning via single-use invite codes; first staff account per environment via one-time bootstrap script with an environment secret.  
* CSV import is add-only; edits to existing questions happen in the editor.  
* Attempts store the selected answer per question (enables Feature 2); answer-by-answer review is in scope through Feature 2\.  
* Color scheme: the four-color palette — \#fffdee cream, \#fbd1e6 blush pink, \#878787 warm gray, \#31261c espresso brown — replacing the original navy \+ gold. Layout, typography, and arcade styling unchanged.  
* Specification-review clarifications: CSV `quiz` column matches existing titles (never IDs; import never creates quizzes); deleting a question that would drop a published quiz below ten unpublishes it; timed attempts start when the server signs a start token while serving questions, verified at submission.

