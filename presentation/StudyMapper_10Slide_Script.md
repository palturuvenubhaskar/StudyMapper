# StudyMapper — 10-Slide Delivery Sheet

Companion to **StudyMapper_10Slide.pptx**. Ten slides, about ten minutes, then questions.
Speaker notes are embedded in the PowerPoint file as well.

| # | Slide | Time | The one sentence to land |
|---|---|---|---|
| 1 | Title | 0:45 | "A study workspace that turns a syllabus into a plan which reacts to what the student gets wrong." |
| 2 | Agenda | 0:30 | "Five moves: why, what, how, proof, next." |
| 3 | Abstract & motivation | 1:15 | "The loop is plan → learn → practise → improve, and the same records feed the next plan." |
| 4 | Problem & objectives | 1:15 | "Students do not lack material; they lack a system that responds." |
| 5 | Literature survey | 1:00 | "Each category solves a piece; none closes the loop for one learner." |
| 6 | System architecture | 1:15 | "Everything that matters runs in the browser; the network is optional." |
| 7 | Methodology & algorithm | 1:15 | "Fixed, inspectable weights turn activity into a 0–100 weakness score." |
| 8 | Implementation | 1:00 | "No server, no GPU, no model hosting, no paid tier." |
| 9 | Results | 1:15 | "47/47 tests and a 6.21 s build prove completeness — not learning gains." |
| 10 | Conclusion & future | 1:00 | "The loop is built; the classroom pilot is the next experiment." |

## Demo path (2 minutes, if the network works)

Dashboard → Study Planner (regenerate) → a generated topic with a diagram → Flashcards (SM-2) → Analytics (weakness score).

Offline fallback: the screenshots on slides 1 and 9, plus the PDF.

## Five questions you will probably get

**1. Is the AI doing the teaching?**
No. It drafts notes, questions and diagrams that the student can edit. The planner, practice, scoring and storage run without it.

**2. What happens if the AI fails?**
Six-model fallback, streaming and JSON repair. If every model fails, study continues; generated content already saved stays local.

**3. Where is the data?**
IndexedDB through Dexie, 40 tables. Firebase Auth is optional identity. There is no cross-device sync in this build.

**4. How is the weakness score calculated?**
Last seven days: failed coding +30; low accuracy adds `(100 − accuracy) × 0.5`; pomodoro +10; coding pass −20; notes −10. Clamped 0–100, flagged at 40.

**5. Is the planner automatic?**
It is generated from the exam date, topic difficulty and weakness scores, and regenerated from the planner screen. Panic mode compresses what remains.

## Three numbers to remember

**47/47** tests · **6.21 s** build · **40** tables

## Do not claim

Learning gains, institutional deployment, a teacher dashboard, a native app, or cross-device sync. Slide 9 says this out loud.
