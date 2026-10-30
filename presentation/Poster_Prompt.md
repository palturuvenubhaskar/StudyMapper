# StudyMapper — ChatGPT Poster Prompt

Paste the prompt below into ChatGPT in **canvas / code mode**, not image-generation mode.
Image models mangle small text and flowchart labels; HTML/SVG keeps every label crisp and printable.

---

You are a senior information designer and academic poster designer. Create **two coordinated, print-ready posters** for a CSE project called **StudyMapper**. They will sit side by side at a project expo. Each poster must stand alone; together they must cover the problem, objectives, features, applications, working process, architecture, and data flow.

## DELIVERABLE

- `poster-1-overview.html` — project overview.
- `poster-2-working.html` — working process.
- Each file: self-contained HTML + inline CSS + inline SVG, exactly **one A2 portrait page (420 mm × 594 mm)**.
- Include `@page { size: A2 portrait; margin: 0; }`, `body { margin: 0; }`, and `print-color-adjust: exact`.
- No external fonts, images, scripts, CDNs, or frameworks. Font stack: `Inter, "Segoe UI", Arial, sans-serif`.
- Use mm/pt units, not px, so the printed size is exact.
- Each poster must print at 100% with no scrollbars, no browser margins, and no page breaks.
- If HTML is impossible, return two SVGs at 420 × 594 mm; otherwise HTML is required.

## HARD RULES

- Use only the facts in the content bank. Do not invent features, numbers, testimonials, logos, partners, or QR patterns.
- No lorem ipsum, filler, or decorative text. Every word must be intentional.
- Plain English, short labels, no marketing hype.
- All text horizontal. No clipped, overlapping, or overflowing text. Labels sit inside boxes with padding.
- Keep 18 mm safe margins. Nothing touches the page edge.
- Keep it simple: 3–5 sections per poster, one idea per card, no paragraph longer than two lines.
- If a detail is missing, use `[Square Bracket Placeholder]`; never guess.

## SHARED VISUAL SYSTEM

- Background `#FFFFFF`; panels `#F5F8FA`; text `#1F2933`; secondary `#52606D`.
- Accents: teal `#0F7A82` (structure), blue `#2E5C9A` (learn stage), amber `#B0781C` (highlights), green `#2B7A58` (outcomes), rose `#A64B39` (problem only). Teal dominant.
- Type: title 90 pt / 800; subtitle 24 pt / 400; section heading 30 pt / 700; body 17 pt / 400; caption 11.5 pt / 400; big stat 56 pt / 800.
- 12-column grid, 8 mm gutters, 4 mm card radius, 0.6 mm connector lines, arrowheads on flowlines.
- Flat design only: no gradients, shadows, 3D, glow, texture, stock photos, clip art, or fake UI screenshots.
- At least 25% whitespace. Do not fill every cell.
- Diagrams read left-to-right or top-to-bottom. Every box gets a 2–5 word label; every flowchart arrow gets a short verb or result; align boxes to the grid.
- Number sections 01, 02, … with a thin teal rule under the header.

## CONTENT BANK

**Project**
- Name: StudyMapper
- Type: browser-based AI study workspace
- One-liner: “Turns a syllabus into an adaptive study plan, generates study material, and measures what actually needs revision.”
- Live demo: `study-mapper.vercel.app`
- Source: `github.com/palturuvenubhaskar/StudyMapper`
- Team: `[Student Name(s) — Roll No(s)]`
- Guide: Ms. C. Sravani
- Department of CSE, ALITS (Autonomous)

**Problem**
- Tools are fragmented — notes, deadlines and tests live in different apps.
- Plans are static — they ignore difficulty, weak topics and slipping dates.
- Feedback is late — misconceptions are practised for weeks before marks reveal them.

**Objectives**
1. Plan adaptively — rebuild the plan from exam dates, topic difficulty and weakness scores.
2. Generate content — create editable notes, diagrams and question banks on demand.
3. Measure continuously — score every topic 0–100 and target the weakest first.
4. Build consistency — streaks, XP and daily quests keep the loop running.

**Features**
- Capture & organise: subject → topic tree; notes + PDF/DOCX/OCR imports; question banks.
- Decide & act: adaptive planner + panic mode; SM-2 flashcards; in-browser Python coding with an AI tutor.
- Reflect & sustain: weakness analytics; XP, levels, streaks, quests; AI study assistant.
- Also available: mock exams; placement prep (DSA, technical, HR); skill roadmaps.

**Applications**
- Daily and weekly planning for engineering students.
- Semester exam revision led by weak topics.
- Placement preparation: DSA, technical and HR interviews.
- Self-paced upskilling with generated skill roadmaps.
- Audience: individual learners, not institutional timetabling or proctored exams.

**Working loop**
- PLAN — exam date + topic difficulty + weakness score → daily/weekly plan; recomputes when a session slips.
- LEARN — generated notes and Mermaid diagrams; imports PDF, DOCX and images through OCR.
- PRACTISE — question banks, mock exams, coding problems with test cases.
- IMPROVE — updates 0–100 weakness scores and SM-2 review dates; feeds the next plan.
- Loop rule: same local data → next plan.
- Offline: the core loop works without AI; saved content stays available.

**Architecture**
- Interface: React 19 + Vite single-page app; 46 routed views.
- Domain: adaptive planner, SM-2 scheduler, weakness detector, gamification — all local logic.
- Services: OpenRouter AI (six-model fallback, JSON repair); file parser (PDF, DOCX, OCR).
- Data: Dexie over IndexedDB; 40 tables. Firebase Auth is optional identity only.
- Solid lines = runs in the browser. Dashed lines = optional network call.

**Proof**
- 47 automated tests passing · 40 local tables · core loop works offline.

## POSTER 1 — “StudyMapper: Project Overview”

Goal: explain what it is, why it exists, what it does, and where it is used in 60 seconds.

Layout, top to bottom:
- 14% header
- 20% problem + objectives
- 22% key features
- 24% architecture diagram
- 12% applications
- 8% footer

**Header**
- Kicker: “CSE PROJECT · ALITS (AUTONOMOUS)”
- Title: “StudyMapper”
- Subtitle: “An AI-powered learning companion that turns a syllabus into an adaptive study plan.”
- Lead: “It generates study material, measures weak topics, and rebuilds the plan around what needs revision.”
- Thin teal rule.

**01 The problem** — rose accent, 3 bullets:
- Tools are fragmented — notes, deadlines and tests live in different apps.
- Plans are static — they ignore difficulty, weak topics and slipping dates.
- Feedback is late — misconceptions are practised for weeks before marks reveal them.

**02 Objectives** — 4 numbered cards, teal:
1. Plan adaptively — rebuild the plan from exam dates, difficulty and weakness scores.
2. Generate content — editable notes, diagrams and question banks on demand.
3. Measure continuously — score every topic 0–100 and target the weakest first.
4. Build consistency — streaks, XP and daily quests keep the loop running.

**03 Key features** — three columns, three items each, simple 1.5 pt line icons:
- Capture & organise: subject → topic tree; notes + PDF/DOCX/OCR imports; question banks.
- Decide & act: adaptive planner + panic mode; SM-2 flashcards; in-browser Python + AI tutor.
- Reflect & sustain: weakness analytics; XP, levels, streaks, quests; AI study assistant.
- Caption under the columns: “Also: mock exams · placement prep (DSA, technical, HR) · skill roadmaps.”

**04 System at a glance** — main diagram, left to right:
- Student → large rounded “Browser — runs locally” boundary containing four bands: Interface → Domain → Services → Data.
- Interface: “React 19 + Vite · 46 views”
- Domain: “Planner · SM-2 · Weakness · XP”
- Services: “AI (fallback + JSON repair) · Files (PDF/DOCX/OCR)”
- Data: “Dexie / IndexedDB · 40 tables”
- Dashed arrows from Services to “OpenRouter (optional)” and from Interface to “Firebase Auth (optional)”.
- Caption: “Solid lines run locally. Dashed lines are optional network calls. The core loop works offline without AI.”

**05 Applications** — 2 × 2 chips:
- Daily + weekly planning for engineering students.
- Semester revision led by weak topics.
- Placement prep: DSA, technical, HR.
- Self-paced upskilling with roadmaps.
- One line underneath: “Built for individual learners, not institutional timetabling or proctored exams.”

**Footer**
- Proof strip: “47 automated tests · 40 local tables · core loop works offline”
- Left: team and guide line.
- Right: `study-mapper.vercel.app` and `github.com/palturuvenubhaskar/StudyMapper`.
- Two QR placeholders, each a 22 × 22 mm white square with a 0.4 mm grey border and the centred label “QR”; captions “Live demo” and “Source code”. Do not draw a fake QR pattern.
- Visual hierarchy: title → architecture → objectives → features → applications.

## POSTER 2 — “StudyMapper: How It Works”

Goal: explain the working process in one clear flow.

Layout, top to bottom:
- 12% header
- 36% four-stage loop
- 15% student journey
- 20% AI pipeline
- 9% data strip
- 8% footer

**Header**
- Kicker: “WORKING PROCESS”
- Title: “How StudyMapper Works”
- Subtitle: “Plan → Learn → Practise → Improve → replan.”
- Thin teal rule.

**Hero — four-stage loop** (dominant visual):
- 2 × 2 grid: PLAN top-left (teal), LEARN top-right (blue), PRACTISE bottom-right (amber), IMPROVE bottom-left (green).
- Clockwise arrows; return arrow from IMPROVE to PLAN labelled “Weakness scores + missed sessions update tomorrow’s plan”.
- Centre circle: “One local data store”.
- Each card: three short bullets.
  - PLAN: “exam date · difficulty · weakness score” / “builds daily + weekly plan” / “recomputes when a session slips”
  - LEARN: “generated notes” / “Mermaid diagrams” / “PDF · DOCX · OCR imports”
  - PRACTISE: “question banks” / “mock exams” / “coding with test cases”
  - IMPROVE: “0–100 weakness score” / “SM-2 review dates” / “XP · streak · quests”
- Note underneath: “If AI is offline, saved content and the core loop still work.”

**Student journey** — full-width flowchart, 6 steps:
Sign in → Create subject → Add topics or upload syllabus → Generate plan → Study & practise → Review & replan.
- Numbered circles, arrows, 2–4 words per step.

**AI content pipeline** — full-width flowchart, 6 steps:
Request → Build prompt → OpenRouter (six-model fallback) → Validate + repair JSON → Render + save → Display.
- Dashed branch from OpenRouter: “AI unavailable → show saved content”.
- Caption: “Generated material is validated before it reaches the screen, and stays editable.”

**Data strip**
- Small diagram: rounded “Browser” boundary containing “React UI” ↔ “Dexie / IndexedDB · 40 tables”; dashed lines out to “Firebase Auth (optional)” and “OpenRouter (optional)”.
- Caption: “Notes and attempts stay in the browser. Cloud services are opt-in.”

**Footer**
- Loop line: “PLAN → LEARN → PRACTISE → IMPROVE”
- Proof strip: “47 automated tests · 40 local tables · core loop works offline”
- Team and guide line; live demo and source URLs.
- Visual hierarchy: loop → journey → AI pipeline → data strip.

## FINISHING CHECKS

Before returning, verify and fix:
- “StudyMapper” spelling (one word, capital S and M).
- A2 size, 18 mm margins, no overflow, no overlap, no cut text.
- Every flowchart arrow has a label; every diagram is understandable without the body copy.
- Body ≥ 17 pt; captions ≥ 11 pt.
- Only the defined accent colours; no extra hues.
- No invented facts or QR patterns.
- Both posters share the same header, grid, type and footer — they must look like one family.
- At 50% zoom, headings and diagram labels remain legible.

## OUTPUT ORDER

1. A short list of every placeholder I must replace.
2. Complete HTML for Poster 1 in one code block.
3. Complete HTML for Poster 2 in one code block.
4. Four lines: how to print to A2 PDF and check scale.

Do not ask questions. Make reasonable layout decisions and produce the files.
