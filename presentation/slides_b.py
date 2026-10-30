"""Slides 7-12."""
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from deck_lib import *


def slide_07(prs):
    s = base(prs, "05 · Proposed system", "Nine modules, arranged as three connected lanes",
             "Capture the material, act on it daily, then reflect — and let reflection change the next action.",
             section="The system", page=7)
    lanes = [
        ("CAPTURE\n& ORGANISE", TEAL, TEAL_SOFT, [
            ("Subjects & topics", "A syllabus tree — subject, unit, topic — with progress on every node."),
            ("Notes & imports", "Generate notes, or bring PDFs, DOCX and images through the parsing pipeline."),
            ("Question banks", "Multiple-choice and descriptive questions, with AI-generated model answers."),
        ]),
        ("DECIDE\n& ACT", BLUE, BLUE_SOFT, [
            ("Adaptive planner", "A day-by-day schedule from difficulty, exam date and panic mode."),
            ("Flashcards · SM-2", "Review at the edge of recall; the queue is built from topic and history."),
            ("Coding practice", "Python problems run in the browser through Pyodide — nothing to install."),
        ]),
        ("REFLECT\n& SUSTAIN", AMBER, AMBER_SOFT, [
            ("Analytics & weakness", "A 0–100 score per topic, recomputed from the last seven days."),
            ("Gamification", "XP, levels, streaks, daily quests and achievements for consistency."),
            ("AI assistant", "A study chat with six-model fallback, streaming and JSON repair."),
        ]),
    ]
    for li, (lane, col, tint, mods) in enumerate(lanes):
        y = 1.98 + li * 1.46
        rect(s, 0.62, y, 1.06, 1.18, fill=tint, line=None, radius=0.06)
        add_text(s, 0.66, y + 0.26, 0.98, 0.66, lane, size=8.2, color=col, bold=True,
                 align=PP_ALIGN.CENTER, line=1.15)
        for mi, (name, desc) in enumerate(mods):
            x = 1.88 + mi * 3.63
            card(s, x, y, 3.45, 1.18, fill=WHITE, line=LINE, accent=col)
            add_text(s, x + 3.02, y + 0.12, 0.28, 0.18, f"{li * 3 + mi + 1:02d}",
                     size=6.8, color=MUTED, bold=True, align=PP_ALIGN.RIGHT)
            add_text(s, x + 0.20, y + 0.15, 2.75, 0.24, name, size=10.6, color=INK, bold=True)
            add_text(s, x + 0.20, y + 0.43, 3.05, 0.62, desc, size=8.7, color=MUTED, line=1.18)
    add_text(s, 0.62, 6.30, 12.1, 0.3,
             "Every module writes to the same local store — which is why the third lane can change what the second lane does tomorrow.",
             size=9.2, color=BODY, italic=True)
    notes(s, "Explain the three lanes as a working rhythm rather than a feature list. Capture is where the syllabus, imported material and questions enter. Act is what the student touches every day: the planner, the flashcard queue and the coding workspace. Reflect is where the system earns the word adaptive — analytics, weakness scores and the habit layer feed the next plan. The sentence at the bottom is the key architectural claim: all nine modules share one store, so reflection is not a report; it is an input. If asked which module is the core, say the planner, because it consumes the output of the other eight.")


def slide_08(prs):
    s = base(prs, "06 · Architecture", "A browser-first architecture with optional services",
             "The core study loop keeps working with no server; AI and identity are services, not dependencies.",
             section="The system", page=8)
    bands = [
        ("CLIENT", ["React 19 + Vite SPA", "46 routed views", "Responsive + theme"], 3),
        ("DOMAIN\nLOGIC", ["Adaptive planner", "SM-2 scheduler", "Weakness detector", "Gamification"], 4),
        ("SERVICES", ["AI service · fallback, streaming, JSON repair", "File parser · OCR, PDF, DOCX"], 2),
        ("DATA &\nIDENTITY", ["Dexie.js · 40 tables · offline", "Firebase Auth · optional"], 2),
    ]
    for i, (label, chips, n) in enumerate(bands):
        y = 1.96 + i * 1.10
        rect(s, 1.86, y, 7.66, 0.94, fill=MIST, line=LINE, radius=0.05)
        rect(s, 0.62, y, 1.10, 0.94, fill=TEAL_DK, radius=0.05)
        add_text(s, 0.62, y, 1.10, 0.94, label, size=7.8, color=WHITE, bold=True,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, line=1.1)
        gap = 0.12
        cw = (7.42 - gap * (n - 1)) / n
        for j, c in enumerate(chips):
            x = 1.98 + j * (cw + gap)
            chip(s, x, y + 0.20, cw, 0.54, c, fill=WHITE, color=INK, size=8.4,
                 line=LINE, radius=0.12)
        if i < 3:
            arrow(s, 5.60, y + 0.94, 5.60, y + 1.10, color=TEAL, width=1.2)

    # external services
    add_text(s, 9.72, 1.94, 3.0, 0.2, "EXTERNAL SERVICES", size=7.8, color=MUTED, bold=True)
    ext = [
        ("OpenRouter API", "Free-tier models · 6-model fallback · streaming · JSON repair", 4.16),
        ("Firebase Auth", "Google, email and phone sign-in — optional", 5.26),
    ]
    for name, desc, y in ext:
        card(s, 9.72, y, 3.0, 0.94, fill=WHITE, line=LINE, accent=AMBER, accent_w=0.20)
        add_text(s, 9.92, y + 0.13, 2.65, 0.22, name, size=9.2, color=INK, bold=True)
        add_text(s, 9.92, y + 0.36, 2.62, 0.5, desc, size=7.6, color=MUTED, line=1.15)
        arrow(s, 9.54, y + 0.47, 9.70, y + 0.47, color=AMBER, width=1.0,
              dash=MSO_LINE_DASH_STYLE.DASH)

    # legend / why card
    rect(s, 9.72, 1.96, 3.0, 1.34, fill=MIST, line=LINE, radius=0.05)
    add_text(s, 9.92, 2.05, 2.65, 0.2, "WHY IT MATTERS", size=7.4, color=TEAL, bold=True)
    add_text(s, 9.92, 2.24, 2.65, 0.42,
             "Study continues on a weak connection; generated content is cached locally.",
             size=7.6, color=BODY, line=1.16)
    arrow(s, 9.92, 2.76, 10.24, 2.76, color=INK, width=1.2, head=False)
    add_text(s, 10.32, 2.68, 2.25, 0.18, "Runs in the browser", size=7.0, color=MUTED)
    arrow(s, 9.92, 3.04, 10.24, 3.04, color=AMBER, width=1.2, head=False,
          dash=MSO_LINE_DASH_STYLE.DASH)
    add_text(s, 10.32, 2.96, 2.25, 0.18, "Needs the network", size=7.0, color=MUTED)

    rect(s, 0.62, 6.42, 8.90, 0.44, fill=TEAL_SOFT, radius=0.3)
    add_text(s, 0.86, 6.52, 8.5, 0.25,
             "Privacy by default: attempts and notes stay in the browser; cloud is opt-in.",
             size=8.6, color=TEAL_DK, bold=True)
    notes(s, "Walk the diagram from the top. The client is ordinary React; nothing exotic. The domain band is where the product logic lives and it is all local: the planner, the SM-2 scheduler, the weakness detector and the gamification rules. The services band shows two things that can fail without breaking study: the AI service and the file parser. The data band is the foundation — Dexie over IndexedDB — with Firebase Auth as an optional service on the right, connected by a dashed line because it needs the network. The point to land: AI and login are not load-bearing for the study loop.")


def slide_09(prs):
    s = base(prs, "07 · Method", "Built in four phases, each ending in a working slice",
             "The project followed a vertical-slice method: every phase produced something runnable and testable, not a document.",
             section="The system", page=9)
    phases = [
        ("01  DISCOVER", TEAL, ["Peer interviews on study habits", "Audit of existing study tools", "Feature shortlist and constraints"],
         "Problem statement + feature list", "Understand the student's week before choosing features."),
        ("02  DESIGN", TEAL_DK, ["40-table data model", "46-route interface map", "AI prompt and fallback contracts"],
         "Schema + interface map", "Decide the data model before writing screens."),
        ("03  BUILD", TEAL, ["Vertical feature slices", "Shared component library", "AI service with JSON repair"],
         "Working modules", "Keep the application runnable at every step."),
        ("04  PROVE", TEAL_DK, ["47 automated tests", "Production build in 6.21 s", "Seeded demo + 19 screens"],
         "Verified build and live demo", "Turn every claim into evidence an examiner can check."),
    ]
    for i, (name, col, acts, art, why) in enumerate(phases):
        x = 0.62 + i * 2.98
        chevron(s, x, 1.94, 3.10, 0.52, name, fill=col, size=9.2, first=(i == 0))
        card(s, x, 2.62, 2.92, 3.22, fill=WHITE, line=LINE, accent=col)
        add_text(s, x + 0.20, 2.78, 2.5, 0.2, "ACTIVITIES", size=7.2, color=MUTED, bold=True)
        add_text(s, x + 0.20, 2.98, 2.55, 1.2,
                 "\n".join("·  " + a for a in acts), size=8.7, color=BODY, line=1.28)
        rect(s, x + 0.20, 4.18, 2.52, 0.008, fill=LINE)
        add_text(s, x + 0.20, 4.26, 2.5, 0.2, "ARTEFACT", size=7.2, color=col, bold=True)
        add_text(s, x + 0.20, 4.44, 2.55, 0.4, art, size=8.8, color=INK, bold=True, line=1.1)
        rect(s, x + 0.20, 4.92, 2.52, 0.008, fill=LINE)
        add_text(s, x + 0.20, 5.00, 2.5, 0.2, "WHY THIS PHASE", size=6.8, color=MUTED, bold=True)
        add_text(s, x + 0.20, 5.18, 2.55, 0.52, why, size=7.8, color=MUTED, italic=True, line=1.14)

    rect(s, 0.62, 6.02, 12.10, 0.74, fill=MIST, line=LINE, radius=0.06)
    add_text(s, 0.86, 6.13, 2.2, 0.2, "ITERATION & QUALITY", size=7.8, color=TEAL, bold=True)
    add_text(s, 0.86, 6.34, 11.55, 0.3,
             "Every slice shipped with tests. AI output is validated by repair-then-retry, not trusted blindly.",
             size=9.4, color=BODY)
    notes(s, "Describe the method honestly: it was iterative and slice-based, not waterfall. Discover produced the feature list and constraints. Design produced the 40-table schema and the route map before most of the UI existed. Build moved feature by feature, keeping the app runnable. Prove is the phase students often skip — here it means an automated suite, a production build, a seeded dataset and a live deployment. The bottom band matters for technical listeners: the AI layer parses, validates and repairs structured JSON, and retries with another model rather than showing a failure to the student.")


def slide_10(prs):
    s = base(prs, "08 · Technology", "A deliberately small stack for a browser-only product",
             "Chosen for a small team, browser-only deployment and an offline-first study loop.",
             section="Engineering", page=10)
    cols = [
        ("01", "Interface", "What the student sees and touches.", TEAL, [
            ("React 19", "Component model for 46 routed views."),
            ("Vite", "Fast dev loop; 6.21 s production build."),
            ("CSS custom properties", "One token set drives light and dark themes."),
        ]),
        ("02", "Intelligence", "Generation and in-browser computation.", BLUE, [
            ("OpenRouter", "Free-tier models with a six-model fallback chain."),
            ("Pyodide", "Python runs client-side for coding practice."),
            ("Mermaid + KaTeX", "Diagrams and mathematical notation, rendered locally."),
        ]),
        ("03", "Data", "Where the study record actually lives.", AMBER, [
            ("Dexie.js + IndexedDB", "40-table local store; live queries; offline."),
            ("Firebase Auth", "Google, email and phone identity — optional."),
            ("File APIs", "PDF, DOCX and image parsing through Tesseract and pdf.js."),
        ]),
        ("04", "Quality", "How the build is checked and shown.", GREEN, [
            ("Vitest", "47 automated tests across the core modules."),
            ("Puppeteer", "Seeded demo data and genuine interface captures."),
            ("Build + PDF", "Production bundle and a shareable preview export."),
        ]),
    ]
    for i, (num, name, purpose, col, items) in enumerate(cols):
        x = 0.62 + i * 3.06
        rect(s, x, 1.94, 2.92, 3.98, fill=WHITE, line=LINE, radius=0.04)
        rect(s, x, 1.94, 2.92, 0.06, fill=col)
        add_text(s, x + 0.20, 2.10, 0.4, 0.2, num, size=8, color=col, bold=True)
        add_text(s, x + 0.20, 2.30, 2.5, 0.28, name, size=13.5, color=INK, bold=True)
        add_text(s, x + 0.20, 2.62, 2.55, 0.36, purpose, size=8.2, color=MUTED, line=1.12)
        for j, (tech, why) in enumerate(items):
            y = 3.10 + j * 0.92
            add_text(s, x + 0.20, y, 2.55, 0.22, tech, size=9.0, color=INK, bold=True)
            add_text(s, x + 0.20, y + 0.21, 2.55, 0.56, why, size=7.7, color=MUTED, line=1.13)
            if j < 2:
                rect(s, x + 0.20, y + 0.84, 2.5, 0.006, fill=LINE)
    rect(s, 0.62, 6.06, 12.10, 0.62, fill=MIST, line=LINE, radius=0.06)
    add_text(s, 0.86, 6.16, 2.4, 0.2, "WHAT WE AVOIDED", size=7.4, color=TEAL, bold=True)
    add_text(s, 0.86, 6.34, 11.55, 0.26,
             "A custom server fleet  ·  model training or hosting  ·  a paid tier  ·  a separate native build pipeline.",
             size=8.8, color=BODY)
    notes(s, "Do not read every tool. Give the rationale per column. Interface: React and Vite keep the feedback loop fast for a small team. Intelligence: OpenRouter means no model training or hosting, Pyodide means coding practice needs no server execution, Mermaid and KaTeX mean diagrams and maths are rendered in the browser. Data: Dexie is the product's memory, Firebase is only identity. Quality: Vitest, Puppeteer and a production build are how claims are checked. The last line is a genuine engineering constraint — the whole project must be demonstrable without paid infrastructure.")


def slide_11(prs):
    s = base(prs, "09 · Data model", "The schema mirrors how a student thinks",
             "Subjects contain topics, topics produce practice, and practice feeds progress — all in one local store.",
             section="Engineering", page=11)
    clusters = [
        ("CURRICULUM", "4 levels", TEAL, [
            ("Subject", "Unit"), ("Topic", "Topic content")]),
        ("PRACTICE", "questions · exams · cards", BLUE, [
            ("Question bank", "Mock exam"), ("Attempt", "Flashcard · SM-2")]),
        ("PLANNING", "schedule", AMBER, [
            ("Study plan", "Plan item"), ("Study session", "Panic mode")]),
        ("PROGRESS", "signals", GREEN, [
            ("Profile · XP", "Achievement"), ("Daily quest", "Weakness score")]),
    ]
    for i, (label, sub, col, chips) in enumerate(clusters):
        x = 0.62 + (i % 2) * 3.50
        y = 1.94 + (i // 2) * 2.10
        rect(s, x, y, 3.30, 1.96, fill=MIST, line=LINE, radius=0.05)
        add_text(s, x + 0.18, y + 0.12, 2.0, 0.2, label, size=7.6, color=col, bold=True)
        add_text(s, x + 2.90, y + 0.12, 0.28, 0.2, str(i + 1), size=7.6, color=MUTED,
                 align=PP_ALIGN.RIGHT, bold=True)
        add_text(s, x + 0.18, y + 0.31, 2.9, 0.18, sub, size=7.2, color=MUTED, italic=True)
        for r, row in enumerate(chips):
            for c, name in enumerate(row):
                cx = x + 0.18 + c * 1.58
                cy = y + 0.62 + r * 0.58
                chip(s, cx, cy, 1.48, 0.42, name, fill=WHITE, color=BODY, size=8.6,
                     line=LINE, radius=0.14)
    add_text(s, 0.62, 6.18, 7.0, 0.3, "40 tables in total · one Dexie database · no server in the core loop",
             size=8.6, color=TEAL, bold=True)

    # data flow
    rect(s, 7.62, 1.94, 5.10, 4.62, fill=WHITE, line=LINE, radius=0.04)
    add_text(s, 7.84, 2.08, 4.6, 0.2, "HOW DATA MOVES", size=7.8, color=TEAL, bold=True)
    steps = [
        ("Write locally", "Every action is a Dexie transaction — no network round trip."),
        ("React", "Live queries update the interface immediately, on every screen."),
        ("Enrich", "AI notes and questions are written back into the same tables."),
        ("Recompute", "Recent events update weakness scores and feed the next study plan."),
    ]
    for i, (t, d) in enumerate(steps):
        y = 2.34 + i * 0.96
        circle(s, 7.86, y, 0.34, fill=TEAL_SOFT, text=str(i + 1), tcolor=TEAL, size=8)
        add_text(s, 8.34, y - 0.02, 4.1, 0.22, t, size=10, color=INK, bold=True)
        add_text(s, 8.34, y + 0.22, 4.15, 0.55, d, size=8.5, color=MUTED, line=1.18)
        if i < 3:
            rect(s, 8.02, y + 0.37, 0.008, 0.56, fill=LINE)
    rect(s, 7.86, 6.00, 4.60, 0.42, fill=TEAL_SOFT, radius=0.3)
    add_text(s, 8.02, 6.09, 4.35, 0.26,
             "Offline-first: no server is needed to study.", size=8.4, color=TEAL_DK, bold=True)
    notes(s, "The left side is a domain map, not a full entity-relationship diagram. Curriculum is the tree the student builds; Practice is everything generated or attempted; Planning is the schedule; Progress is the evidence layer. Say that the full schema has 40 tables, but these four clusters are the ones a listener needs to understand the product. On the right, the four-step flow is the important part: writes happen locally first, the UI reacts through live queries, AI enrichment writes back into the same tables, and recomputation is what makes the loop close. There is no server round trip in the core study path.")


def slide_12(prs):
    s = base(prs, "10 · Interface", "A calm interface built around one question: what next?",
             "Every screen is organised around the next action, not around a dashboard of everything the system knows.",
             section="Engineering", page=12)
    framed_shot(s, "assets/dashboard-light.png", 0.62, 1.94, 7.42, 4.52,
                caption="Dashboard at 1440 × 900 — the same build used for the demo, seeded with sample data.")

    add_text(s, 8.38, 1.98, 4.2, 0.2, "WHAT TO NOTICE", size=7.8, color=TEAL, bold=True)
    callouts = [
        ("01", "One next action", "The dashboard opens with “jump back in”, not a wall of metrics."),
        ("02", "Progress you can feel", "Level, XP, streak and daily quests sit beside academic progress."),
        ("03", "Built for a real evening", "Search, focus timer and question banks are one click away."),
    ]
    for i, (n, t, d) in enumerate(callouts):
        y = 2.18 + i * 1.22
        add_text(s, 8.40, y, 0.4, 0.2, n, size=8, color=TEAL, bold=True)
        add_text(s, 8.78, y - 0.02, 3.9, 0.24, t, size=10.8, color=INK, bold=True)
        add_text(s, 8.78, y + 0.24, 3.9, 0.55, d, size=8.8, color=MUTED, line=1.18)
        if i < 2:
            rect(s, 8.40, y + 1.02, 4.2, 0.006, fill=LINE)

    add_text(s, 8.38, 5.78, 4.2, 0.2, "ALSO IN THE BUILD", size=7.4, color=MUTED, bold=True)
    extra = ["Mock exams", "Coding practice", "Placement prep", "Skill roadmaps", "AI assistant", "Analytics"]
    for i, t in enumerate(extra):
        x = 8.38 + (i % 2) * 2.18
        y = 6.00 + (i // 2) * 0.28
        add_text(s, x, y, 2.1, 0.2, "·  " + t, size=8.2, color=BODY)
    notes(s, "This is the slide where non-technical listeners relax, so spend time on the screen. Point out the hierarchy: greeting and resume, then three signals — subjects, progress, level and streak — then daily quests and achievements. The focus timer is visible without being dominant. The inset shows the SM-2 review queue, which is the same scheduler described earlier. The right-hand callouts explain the design intent; the list at the bottom is breadth, not a claim that every module is equally deep. All captures come from the running build, not a design mockup.")
