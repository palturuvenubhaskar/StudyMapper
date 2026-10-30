# StudyMapper — Speaker Notes & Delivery Guide

Companion to **StudyMapper_Deck.pptx** (18 slides, 16:9). The same guidance is embedded in each slide's PowerPoint notes; this file is the rehearsal script, timing plan and question bank.

---

## Delivery at a glance

| | |
|---|---|
| Deck | 18 slides, 13.333 × 7.5 in (16:9) |
| Running time | 16–18 minutes, plus 5–8 minutes of questions |
| Audience | Mixed technical and non-technical evaluators |
| Tone | Calm, evidence-led, no marketing language |
| Live demo | https://study-mapper.vercel.app/ |
| Repository | https://github.com/palturuvenubhaskar/StudyMapper |

**Colour convention used throughout:** teal = the system and its design; amber = evidence or interpretation; rose = a limitation or problem; green = a passing check.

**If you are short of time:** deliver slides 1, 3, 4, 7, 8, 12, 13, 14, 15 and 18 (about 9 minutes), then offer the demo. Do not skip slide 13 — it is the slide that keeps the claims honest.

---

## Slide-by-slide script

### Slide 1 — Title (≈45 s)

**Purpose:** establish the product, the team and the evidence standard before any technology.

**Say:**
- “StudyMapper is a browser-based study workspace for one student. It turns a syllabus into an adaptive plan, generates study material, and measures what actually needs revision.”
- “The three captures on the right are the running application — dashboard, adaptive planner and a generated Mermaid diagram. They are not mockups.”
- Introduce the team, guide Ms. C. Sravani, and the Department of CSE at ALITS (Autonomous).
- “Everything in this deck is drawn from the repository, the project abstract or the running build.”

**Do not:** read the roll numbers aloud; they are on slide 18 for the record.

**Transition:** “The deck is organised as five acts.”

---

### Slide 2 — Agenda (≈45 s)

**Purpose:** give the audience a map and a reading convention.

**Say:**
- “Five acts: why the system exists, what it does, how it is engineered, what is actually verified, and where it goes next.”
- Point to the outcome line in each card — it tells the audience what they will know by the end of that act.
- “Teal is the system, amber is evidence, rose is a limitation. I will use those colours consistently.”

**Do not:** list all 18 slide titles. The cards already do that.

**Transition:** “Act one starts with the loop the whole product is built around.”

---

### Slide 3 — Abstract & motivation (≈75 s)

**Purpose:** explain the product in one breath, then make the motivation concrete.

**Say:**
- “The system combines curriculum management, AI-assisted content generation, spaced repetition and practice analytics.”
- Walk the four loop nodes: **Plan** uses exam date, topic difficulty and current weakness scores; **Learn** holds generated notes, diagrams and imported PDFs; **Practise** is question banks, mock exams and in-browser coding; **Improve** turns activity into weakness scores and schedules SM-2 reviews.
- “The arrow back to Plan is not a metaphor. It is the same local store being read again.”
- Use the three motivation lines: fixed study time, delayed feedback, scattered tools.

**If asked “is this just ChatGPT wrapped in a UI?”:** “No. The AI is one service inside a loop that also plans, schedules, scores and stores. The loop still runs if the AI is unavailable.”

**Transition:** “That loop exists because the current tools fail in three specific ways.”

---

### Slide 4 — Problem statement (≈60 s)

**Purpose:** define the problem in student terms, not technology terms.

**Say:**
- **Fragmented workflow:** notes, deadlines and tests live in different apps, so context is lost at every switch.
- **Static plans:** a plan made once ignores difficulty, weak areas and slipping dates. The weakest topic gets the same 30 minutes as the strongest.
- **Feedback after the fact:** misconceptions are practised for weeks before marks reveal them.
- “The design implication is the bottom band: one workspace, a plan that recomputes, and measurement inside practice.”

**Do not:** blame students for poor discipline. The argument is that the tools do not respond.

**Transition:** “Those three failures became four objectives.”

---

### Slide 5 — Objectives & scope (≈60 s)

**Purpose:** show that each objective has an observable check, and that scope was deliberately limited.

**Say:**
- Adaptive planning → a plan that visibly changes after practice.
- Content generation → artefacts that exist and are editable inside the app.
- Continuous measurement → a 0–100 weakness score per topic, not one average.
- Consistency → an active streak and completed daily quests.
- “Out of scope: institutional timetabling, formal grading or proctored exams, and a native mobile app. These are scope decisions, not missing pieces.”
- Success criteria: 47/47 tests, a production build, a live deployment and a seeded demo dataset.

**Transition:** “Five strands of existing work inform the design — but none closes the loop for an individual learner.”

---

### Slide 6 — Literature survey (≈60 s)

**Purpose:** position the project honestly against existing categories.

**Say:**
- Adaptive platforms sequence content well but rarely react to one student's week.
- AI tutors generate well but are usually cloud-only and disconnected from the learner's stored data.
- LMS analytics serve the institution, not the next hour of study.
- Spaced repetition is excellent but isolated from the syllabus and exam dates.
- Gamification sustains habit but does not change what is studied.
- “StudyMapper's claim is precise: it connects these strands in one local store. It is not another LMS.”

**If asked for citations:** “The review is a comparative design review, not a systematic literature review. The sources used to verify implementation claims are on slide 17.”

**Transition:** “So what does the system actually contain?”

---

### Slide 7 — Proposed system (≈75 s)

**Purpose:** present nine modules as three working lanes, not a feature list.

**Say:**
- **Capture & organise:** subjects/topics tree, notes and imports, question banks.
- **Decide & act:** adaptive planner, SM-2 flashcards, in-browser coding with Pyodide.
- **Reflect & sustain:** analytics and weakness, gamification, AI assistant.
- “Every module writes to the same local store. That is why the third lane can change what the second lane does tomorrow.”
- “If you ask which module is the core, it is the planner — it consumes the output of the other eight.”

**Transition:** “The architecture shows why those modules can share one store without a server.”

---

### Slide 8 — System architecture (≈90 s)

**Purpose:** make the browser-first, optional-services design unmistakable.

**Say:**
- Top band: React 19 + Vite SPA, 46 routed views, responsive theme.
- Domain band: planner, SM-2 scheduler, weakness detector, gamification — all local logic.
- Services band: AI service (fallback, streaming, JSON repair) and file parser (OCR, PDF, DOCX). “These can fail without stopping study.”
- Data band: Dexie over IndexedDB, 40 tables; Firebase Auth is optional identity, not a dependency.
- “The dashed lines on the right are network calls. Solid lines run in the browser.”
- “Privacy by default: attempts and notes stay in the browser; cloud is opt-in.”

**Do not:** say data syncs to Firebase. It does not; sync is future scope (slide 16).

**Transition:** “The team built this in four vertical slices.”

---

### Slide 9 — Methodology (≈50 s)

**Purpose:** show an iterative method where every phase produced something runnable.

**Say:**
- **Discover:** peer interviews, audit of study tools, feature shortlist and constraints.
- **Design:** 40-table model, 46-route interface map, AI prompt and fallback contracts.
- **Build:** vertical slices, shared component library, AI service with JSON repair.
- **Prove:** 47 automated tests, 6.21 s production build, seeded demo and 19 screens.
- “Every slice shipped with tests. AI output is validated by repair-then-retry, not trusted blindly.”

**Transition:** “The stack was chosen to keep that loop small.”

---

### Slide 10 — Technology stack (≈60 s)

**Purpose:** explain choices by constraint, not by logo.

**Say:**
- **Interface:** React 19 and Vite keep the feedback loop fast for a small team.
- **Intelligence:** OpenRouter avoids model hosting; Pyodide runs Python client-side; Mermaid and KaTeX render diagrams and maths locally.
- **Data:** Dexie is the product's memory; Firebase is only identity; Tesseract/pdf.js/mammoth parse files.
- **Quality:** Vitest, Puppeteer and a production build are how claims are checked.
- “What we avoided: a custom server fleet, model training or hosting, a paid tier, and a separate native build pipeline.”

**Transition:** “The data model is the part that makes the loop coherent.”

---

### Slide 11 — Database design & data flow (≈60 s)

**Purpose:** give a domain map, not a full ER diagram.

**Say:**
- **Curriculum:** subject → unit → topic → topic content.
- **Practice:** question bank, mock exam, attempt, flashcard/SM-2.
- **Planning:** study plan, plan item, study session, panic mode.
- **Progress:** profile/XP, achievement, daily quest, weakness score.
- “40 tables in total, one Dexie database, no server in the core loop.”
- Walk the four steps: write locally → React live queries → AI enrichment writes back → recent events recompute weakness and feed the next plan.

**If asked for the full schema:** offer to show `src/data/db.js`; the slide deliberately shows the four clusters a listener needs.

**Transition:** “This is what the student actually sees.”

---

### Slide 12 — Interface & key features (≈75 s)

**Purpose:** let non-technical listeners relax and see the product.

**Say:**
- “The dashboard opens with one next action — ‘jump back in’ — not a wall of metrics.”
- “Level, XP, streak and daily quests sit beside academic progress, because consistency is part of the problem.”
- “Search, focus timer and question banks are one click away; this is built for a real evening, not a demo.”
- Mention the breadth list: mock exams, coding practice, placement prep, skill roadmaps, AI assistant, analytics.
- “All captures come from the running build, not a design mockup.”

**Do not:** claim every module is equally deep. The discussion slide says breadth was a deliberate trade-off.

**Transition:** “So what is actually verified?”

---

### Slide 13 — Results (≈90 s)

**Purpose:** report results at the level they were measured.

**Say:**
- 47/47 automated tests across 14 files; 6.21 s production build; 40 Dexie tables; 46 routed views.
- Seeded demo: 38 topics, 18 note sets, 8 questions, 10-day plan, 12-day streak.
- Evidence table: automated suite, data layer, AI service, interface, deployment.
- “The donut is a pass-rate visual, not a research result.”
- **The key sentence:** “This evidences functional completeness and build health. It does not yet evidence learning gains — a classroom study is future work.”

**If asked “how many users?”:** “None yet beyond the demo dataset. This is a single-student build; a classroom pilot is the next step.”

**Transition:** “That boundary is part of the contribution.”

---

### Slide 14 — Discussion & contributions (≈75 s)

**Purpose:** state contributions as mechanisms and limitations without defensiveness.

**Say:**
- **Closed loop, not a bundle:** planning, content, practice and measurement share one data model.
- **AI with a safety net:** six-model fallback, streaming and JSON repair; generated material stays editable.
- **Local-first:** the core loop runs offline; identity is optional.
- **Does not claim:** no measured learning-outcome study, no multi-institution deployment, no teacher/cohort dashboard, no native mobile app.
- Trade-offs: local-first buys privacy and offline study at the cost of sync; AI authoring buys speed at the cost of review; breadth buys a complete loop at the cost of depth.

**If asked “what would you deepen first?”:** “The planner and the weakness model — they are the two places where better evidence would most change behaviour.”

**Transition:** “So what should the audience remember?”

---

### Slide 15 — Conclusion (≈50 s)

**Purpose:** close on three pillars and the measured evidence.

**Say:**
- **Adaptive:** plans recompute from exam date, difficulty and measured weakness; regenerate on demand.
- **Explainable:** a topic is flagged weak at 40+ in the last seven days; the rule set is documented.
- **Local-first:** notes, plans and attempts live in IndexedDB; AI and sign-in are optional.
- Repeat only measured facts: 47/47 tests, 6.21 s build, 19 interface captures.
- Acknowledge the institution and guide.

**Do not:** add new claims in the conclusion.

**Transition:** “The next step is evidence, then scale.”

---

### Slide 16 — Future scope (≈50 s)

**Purpose:** show a sequenced roadmap, not a wish list.

**Say:**
- **Now → 3 months:** classroom pilot with a pre/post quiz; optional sync; accessibility pass.
- **Next year:** native mobile shell; mentor view (aggregate, not surveillance); content review queue.
- **Beyond:** multi-language content; LMS integration; longitudinal study.
- “The sequencing is deliberate: prove that the loop helps a student learn before adding surface area.”
- “If you ask what is realistically next, it is the pilot and the accessibility pass — both can start immediately.”

**Transition:** “The sources used to verify the deck are on the next slide.”

---

### Slide 17 — References (≈30 s)

**Purpose:** show the evidence policy, not read a bibliography.

**Say:**
- “The repository and the project abstract are the primary sources. The rest are official documentation used to confirm specific technical behaviour.”
- “No secondary blog posts or unattributed claims are cited.”
- For SM-2, point to Woźniak's original description and the Anki manual as the reference implementation.
- “The repository link is the fastest way for an evaluator to inspect the code after the presentation.”

---

### Slide 18 — Thank you (≈30 s)

**Purpose:** invite questions and leave the links visible.

**Say:**
- “Thank you. The live demo and the repository are both available for review.”
- Offer a two-minute demo path: dashboard → planner → generated topic → flashcards.
- Use the earlier slides as references for architecture and evidence.

---

## Demo path (if the network is available)

1. **Dashboard** — one next action, streak, daily quests (slide 12).
2. **Study planner** — show difficulty/exam date inputs and a generated day-by-day plan (slides 7–8).
3. **Topic** — open a generated note with a Mermaid diagram (slide 1).
4. **Flashcards** — show the SM-2 queue and a review (slide 7).
5. **Analytics** — show a weakness score and explain the 7-day window (slides 11, 15).

**Offline fallback:** use the 19 captured screenshots in `presentation/assets/` and the rendered PDF. Never depend on the live network for the core narrative.

---

## Question bank

**1. Is the AI doing the teaching?**
No. It assists with notes, questions, diagrams and explanations. The student can edit generated material, and the core loop — curriculum, planner, practice, analytics — runs without AI.

**2. What happens if OpenRouter fails?**
The AI service tries a six-model fallback chain, repairs malformed JSON and streams partial output. If all models fail, the app surfaces the failure but study continues; generated content is cached locally.

**3. Where is student data stored?**
In IndexedDB through Dexie, across 40 tables. Firebase Auth provides optional Google/email/phone identity. There is no cross-device sync in this build; sync is future scope.

**4. How is the weakness score calculated?**
A 0–100 score per topic over the last seven days: failed coding attempt +30; low accuracy (below 60) adds `(100 − accuracy) × 0.5`; each completed pomodoro +10; a successful coding attempt −20; generating notes −10. The result is clamped to 0–100 and flagged as a weakness at 40 or above.

**5. Is the planner automatic?**
The planner generates a difficulty-aware, day-by-day plan from the exam date, topic difficulty and current weakness scores. Regeneration is triggered from the planner screen; panic mode compresses the remaining schedule when the exam is close.

**6. How does SM-2 work here?**
Each flashcard stores an ease factor, interval and repetition count. A review updates them using the SM-2 rule, so cards return at the edge of recall rather than on a fixed schedule.

**7. How do you know the system works?**
47 automated tests across 14 files pass; the production build completes in 6.21 s; 40 tables are created, seeded and queried; 19 screens were captured from the running app; the live deployment is reachable. These verify functional completeness and build health, not learning gains.

**8. Why not use a server and a normal database?**
The product is a personal study workspace that must work on a weak connection. Local-first storage gives instant reads, offline study and privacy by default. A server would add cost and operational work without improving the core loop.

**9. What is the biggest technical challenge?**
Keeping AI output reliable enough to use: structured JSON, streaming responses, model fallback and repair. The second is keeping 40 tables coherent while the UI stays fast.

**10. What is the biggest limitation?**
There is no classroom study yet, so the project cannot claim learning gains. It also has no teacher dashboard, no native app and no sync.

**11. How would this scale to a institution?**
Add optional sync with conflict handling, a mentor/cohort view that aggregates rather than surveils, and a content review queue. The local-first core stays; the institution layer is additive.

**12. What is next?**
A classroom pilot with a pre/post quiz, an accessibility pass, optional sync, then mobile and LMS integration. The pilot comes first because it is the missing evidence.

---

## Rehearsal checklist

- [ ] Open the deck in PowerPoint and confirm 16:9, Calibri, and that all shapes are editable.
- [ ] Check speaker notes are visible in Presenter View on every slide.
- [ ] Rehearse slides 13–14 aloud; they carry the claim discipline.
- [ ] Prepare the live demo tab and the offline PDF fallback.
- [ ] Keep the deck on a local drive; the presentation should not depend on the V: network drive.
- [ ] Arrive with the PDF preview on a second device if possible.
- [ ] Do not read bullets verbatim; each slide has one sentence to land.

