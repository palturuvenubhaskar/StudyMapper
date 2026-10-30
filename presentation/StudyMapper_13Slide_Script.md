# StudyMapper — 13-slide delivery sheet

**Deck:** `StudyMapper_13Slide.pptx` · **PDF:** `StudyMapper_13Slide.pdf`
**Run time:** about 12 minutes, leaving 3–5 minutes for questions.
**Rule:** one idea per slide. The slide is the visual; these lines are the spine.

## Timing and one sentence per slide

| # | Slide | Time | One sentence to say | Move to the next slide with |
|---|---|---|---|---|
| 1 | Title | 0:30 | StudyMapper turns a syllabus into a plan, generates practice, and scores weakness — all in the browser. | "Here is the route." |
| 2 | Agenda | 0:30 | Four moves: frame the problem, design the system, prove it, then close. | "Start with why it exists." |
| 3 | Abstract & Motivation | 1:15 | Four screens from the running build, all reading and writing one local record. | "So what is missing today?" |
| 4 | Problem Statement | 1:00 | The gap is response, not content: four tools, no shared record, and feedback that arrives after the exam. | "Here is our response." |
| 5 | Project Objectives | 1:00 | Four goals: a plan that recomputes, material on demand, practice that measures, and one local record. | "What do others already do?" |
| 6 | Literature Survey | 1:15 | Five approaches each solve part of the problem; none closes the loop for one learner. | "This is how the parts connect." |
| 7 | System Architecture | 1:30 | Interface, domain rules and local data — with AI and identity as optional edges. | "Now the decision logic." |
| 8 | Methodology & Algorithm | 1:45 | One action: study, log the event, score weakness, then flag the topic or record progress; re-plan on demand. | "This is what it runs on." |
| 9 | Implementation Details | 1:00 | A browser app: React, Dexie, OpenRouter and Pyodide — nothing to host. | "What is actually verified?" |
| 10 | Results & Analysis | 1:00 | 47/47 tests, a 6.21 s build, 40 tables and 46 views — functional evidence, not learning gains. | "What does it add up to?" |
| 11 | Conclusion | 0:45 | Adaptive, explainable, local-first — the loop is built; the learning study is next. | "What comes after that?" |
| 12 | Future Scope | 0:45 | Prove the loop helps a student learn before adding surface area. | "The sources behind the claims." |
| 13 | References | 0:20 | Primary sources first; official documentation only where a claim needed it. | "Questions." |

## Delivery cues

- **Slide 1:** do not read the names or roll numbers aloud. Let the team card sit on screen.
- **Slide 3:** pause on the question — *can a student's own activity shape the next plan?* The honest answer is partial, and slide 8 explains how.
- **Slide 6:** do not read all six cards. Pick the contrast: adaptive platforms sequence well but do not react to one student's week; AI tutors generate well but are usually cloud-only.
- **Slide 7:** walk the diagram left to right with your hand. The arrows matter more than the labels.
- **Slide 8:** trace the diamond. Say "40 or above" and "below 40" out loud; that is the algorithm in one breath.
- **Slide 10:** say the "not claimed" line out loud. It buys credibility for the numbers above it.
- **Slide 13:** do not read the references. Point to the repository link and stop.

## Likely questions — answer plainly

**Does the planner use the weakness score?**
No. The planner is generated from the exam date, topic difficulty and available days, and panic mode compresses it when time is short. The weakness score is a separate detector that shows what to revisit; the student can regenerate the plan on demand. The loop is user-driven, not automatic.

**Does every quiz or mock exam update the weakness score?**
The detector scores the events stored in `user_analytics` over the last seven days. The weights and threshold are implemented and unit-tested, but not every screen writes a scored event yet: today the main scored events are pomodoros and generated notes, and the coding event name needs aligning with the detector. Extending scored coverage to coding, quizzes and mock exams is the next engineering step.

**How does the weakness score work?**
It is 0–100 over seven days, clamped at both ends and flagged at 40. A failed coding attempt adds 30; low accuracy adds `0.5 × (100 − accuracy)`; a pomodoro adds 10; a coding pass subtracts 20; generated notes subtract 10.

**How does SM-2 fit in?**
SM-2 schedules flashcards, separately from the weakness detector. The interval grows by the ease factor; ratings are mapped to the SM-2 scale. It is not the planner and it is not the weakness score.

**Why 40 Dexie tables?**
Each domain entity has its own table: curriculum, question banks, attempts, plans, flashcards, analytics, gamification and progress. Local-first means the browser is the database, so the schema is explicit rather than hidden behind an API.

**Why no server?**
Privacy, offline study and zero hosting cost. The trade-off is no cross-device sync and no teacher view — both are stated as future scope, not claimed as present.

**Are these learning gains?**
No. The numbers prove functional completeness and build health: 47/47 tests in 14 files, a 6.21 s production build, 40 tables, 46 routed views. A classroom pre/post study is the next step.

**What is the biggest limitation?**
The loop is not fully automatic: the weakness score does not yet feed the planner directly, and not every screen writes a scored event. The pieces are built and tested; closing that wiring is the honest next step.

**Is there cross-device sync?**
No. The core loop is local to one browser. Account-based, conflict-safe sync is in the "next year" horizon.

**Why OpenRouter?**
It avoids model hosting and gives a six-model fallback with streaming and JSON repair. AI is optional: planning, notes editing, practice and analytics still work without it.

**What about privacy?**
Study records stay in IndexedDB on the device. AI calls are the only outbound path, and they are optional.

**Why these references?**
The repository, the project abstract and the live app are the primary sources; the rest are official documentation used to confirm specific behaviour. No secondary blog posts or unattributed claims.

## Facts to keep straight

- **47/47** tests in **14** files; **6.21 s** production build; **40** Dexie tables; **46** routed views; **19** interface captures.
- Weakness: **0–100**, last **7** days, threshold **40**; weights above; clamp 0–100.
- Planner: exam date, topic difficulty, available days, panic mode; regenerated on demand.
- SM-2: flashcards only; interval × ease factor.
- Not present: cross-device sync, teacher dashboard, proctoring, native app, measured learning gains.
- Live demo: `https://study-mapper.vercel.app/` · Repository: `github.com/palturuvenubhaskar/StudyMapper`
