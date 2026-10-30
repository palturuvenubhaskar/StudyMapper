# StudyMapper — Validation Report

**Prepared:** 28 October 2026  
**Scope:** verification of the claims used in the redesigned 18-slide project presentation, and quality checks on the deck itself.

---

## 1. Repository verification

| Item | Verified value | Source |
|---|---|---|
| Application type | React 19 single-page application built with Vite | `package.json`, `src/main.jsx` |
| Routed views | 46 routes | `src/App.jsx` |
| Local database | 40 Dexie tables over IndexedDB | `src/data/db.js` |
| Authentication | Firebase Auth — Google, email and phone | `src/context/AuthContext.jsx` |
| AI integration | OpenRouter, six-model fallback, streaming, JSON repair | `src/core/api/aiService.js` |
| Adaptive planning | Difficulty-aware plan and panic mode | `src/core/planner/adaptivePlanner.js` |
| Spaced repetition | SM-2 scheduler | `src/core/flashcards/srs.js` |
| Weakness scoring | 0–100 per topic, seven-day window, threshold 40 | `src/core/analytics/weaknessDetector.js` |
| File parsing | PDF, DOCX and image/OCR pipeline | `src/core/files/fileParserService.js` |
| Automated tests | 47 tests in 14 files, all passing | `npx vitest run --pool=threads --maxWorkers=2` |
| Production build | 6.21 s | `npm run build` |
| Live deployment | Reachable; page title “StudyMapper - AI Study Companion” | https://study-mapper.vercel.app/ |
| Interface captures | 19 PNG screenshots from the running app | `presentation/assets/` |

**Screenshot refresh (30 October 2026):** the interface was redesigned after the first capture pass. The three captures used in the deck - dashboard, adaptive planner and generated diagram - were recaptured from the redesigned build at 1440 × 900 (2× DPR) and the deck, PDF and page renders were rebuilt.

### Test-run note

The suite passes **47/47** when run with the threads pool:

```
Test Files  14 passed (14)
Tests       47 passed (47)
Duration    30.74 s
```

The default forks pool timed out while starting workers on the `V:` network drive in this environment. That is a worker-startup/environment issue, not a test failure. The deck therefore reports the pass count and the separately measured **6.21 s production build**, and does not claim the tests ran in 6.21 s.

---

## 2. Presentation quality checks

| Check | Result |
|---|---|
| Slide count | 18 |
| Aspect ratio | 13.333 × 7.5 in (16:9) |
| Background | Near-white `#FFFFFF` with `#F5F8FA` panels |
| Accent system | Teal `#0F7A82`, blue `#2E5C9A`, amber `#B0781C`, green `#2B7A58`, rose `#A64B39` |
| Typography | Calibri; 27 pt titles, 11.5 pt lead/body, 8–9 pt captions |
| Editable elements | Native shapes, connectors, tables and a native doughnut chart — no diagram is a flattened image |
| Screenshots | Genuine captures in framed picture shapes (dashboard, planner, generated diagram, flashcards) |
| Speaker notes | Present on all 18 slides (471–610 characters each) |
| On-slide explanation | Every substantive slide carries a lead sentence, labels and a closing interpretation line |
| Render check | PDF exported with LibreOffice; all 18 pages rendered at 110 dpi and inspected for clipping, overlap and missing glyphs |
| Page furniture | Thin teal edge bar, kicker, accent rule, footer line, “NN / 18” page number |

Minor font substitution can occur when LibreOffice renders Calibri; the PDF preview uses a metric-compatible substitute. PowerPoint on Windows will use Calibri as specified.

---

## 3. Claim-to-evidence matrix

| Claim in the deck | Evidence |
|---|---|
| “47 / 47 automated tests” | Vitest run: 14 files, 47 tests passed |
| “6.21 s production build” | Vite production build measurement |
| “40 database tables” | `db.js` schema declaration |
| “46 routed views” | `App.jsx` route table |
| “six-model fallback, streaming, JSON repair” | `aiService.js` implementation; fallback behaviour covered by tests |
| “SM-2 review queue” | `srs.js` implementation and tests |
| “0–100 weakness score per topic” | `weaknessDetector.js` scoring rules and clamping |
| “19 screens captured from the running application” | 19 screenshot files in `presentation/assets/` |
| “Live demo reachable” | HTTP fetch of the Vercel URL returned the app title |
| Team, guide, department, institution | Project abstract PDF |

### Weakness-score detail used in the Q&A

The detector reads the last seven days of `user_analytics`, then applies: failed coding attempt +30; low accuracy (below 60) adds `(100 − accuracy) × 0.5`; completed pomodoro +10; successful coding attempt −20; generated notes −10. The score is clamped to 0–100 and stored as a weakness at 40 or above.

---

## 4. What the deck deliberately does not claim

- No measured learning-outcome study or classroom trial.
- No multi-institution deployment.
- No teacher, cohort or mentor dashboard.
- No native mobile application.
- No cross-device sync in the current build (listed as future scope).
- No claim that all 40 tables or all 46 routes are equally deep in feature coverage.

These boundaries are stated on slides 5, 13, 14 and 16 rather than hidden in notes.

---

## 5. Known limitations and caveats

1. **Two identical deck files.** `StudyMapper_Project_Presentation.pptx` was locked by PowerPoint during the rebuild; the presentation was closed safely (it had no unsaved changes) and the new deck was copied over the original. `StudyMapper_Deck.pptx` and `StudyMapper_Project_Presentation.pptx` are byte-identical (verified by SHA-256).
2. **PDF preview is a LibreOffice render.** It is suitable for review and for a fallback device; open the PPTX in PowerPoint for the final projection.
3. **No secrets included.** `.env` / `.env.local` values (Firebase, OpenRouter) were not read into the deck, notes or repository.
4. **Screenshot set contains variants.** The 19 files include light-theme variants and detail views of the same screens; the deck presents four of them.
5. **Test environment.** Use the threads pool on the `V:` drive: `npx vitest run --pool=threads --maxWorkers=2`.

---

## 6. Deliverables

| File | Purpose |
|---|---|
| `presentation/StudyMapper_Deck.pptx` | Redesigned 18-slide deck, 16:9, editable, speaker notes |
| `presentation/StudyMapper_Project_Presentation.pptx` | Same redesigned deck under the original submission filename |
| `presentation/StudyMapper_Project_Presentation.pdf` | 18-page PDF preview under the submission filename |
| `presentation/StudyMapper_Presentation_Notes.md` | Full speaking guide, timing, demo path and question bank |
| `presentation/StudyMapper_References.md` | Primary sources, official documentation and method references |
| `presentation/StudyMapper_Validation_Report.md` | This report |
| `presentation/render/StudyMapper_Deck.pdf` | 18-page PDF preview |
| `presentation/render/pages/p01.png … p18.png` | Page renders used for visual QA |

---

## 7. Reproduction commands

```powershell
cd V:\PROJECTS\STUDYMAPPER\presentation
python build_deck.py

& 'C:\Program Files\LibreOffice\program\soffice.exe' `
  --headless --convert-to pdf --outdir render StudyMapper_Deck.pptx

python -c "import pymupdf; doc=pymupdf.open('render/StudyMapper_Deck.pdf'); [page.get_pixmap(dpi=110).save(f'render/pages/p{i+1:02d}.png') for i,page in enumerate(doc)]"
```

```powershell
cd V:\PROJECTS\STUDYMAPPER
npx vitest run --pool=threads --maxWorkers=2
npm run build
```
