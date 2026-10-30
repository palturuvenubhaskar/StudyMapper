"""Slides 8-13 of the 13-slide StudyMapper deck."""
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.dml import MSO_LINE_DASH_STYLE
from app_lib import *
from deck_lib import notes


# ---------------------------------------------------------------- 08 method
def slide_08(prs):
    s = base(prs, 8, "07 · Methodology & Algorithm", "How a study action becomes the next plan",
             "A use-case view of what the student can do, and an activity view of what the system does with it.", 32)

    # ---------------- use-case panel
    card(s, 0.60, 1.86, 5.85, 3.98, fill=WHITE, line=EDGE, radius=0.05)
    lab(s, 0.82, 1.99, 2.6, "Use-case view", color=INDIGO, size=8.6)
    txt(s, 0.82, 2.18, 4.0, 0.18, "actor  ·  system boundary  ·  optional actors", size=7.8, color=MUTED)

    rect(s, 0.78, 2.38, 4.45, 3.22, fill=CANVAS, line=EDGE_2, radius=0.04)
    txt(s, 0.84, 2.42, 1.0, 0.18, "StudyMapper", size=7.5, color=INDIGO, bold=True)

    # actor
    stick(s, 1.18, 3.35, scale=0.95)
    txt(s, 0.78, 4.12, 0.82, 0.20, "Student", size=8.6, color=INK, bold=True,
        align=PP_ALIGN.CENTER)

    use_cases = [
        ("Plan study", "exam date · difficulty · available days"),
        ("Study & generate", "notes, diagrams, question banks"),
        ("Practise & test", "mock exams, coding, flashcards"),
        ("Measure & adapt", "weakness score · analytics · re-plan"),
    ]
    for i, (name, sub) in enumerate(use_cases):
        y = 2.52 + i * 0.66
        arr(s, 1.40, 3.72, 2.02, y + 0.29, color=EDGE_2, width=1.0, head=False)
        rect(s, 2.02, y, 2.95, 0.58, fill=WHITE, line=INDIGO_SOFT, radius=0.5)
        txt(s, 2.14, y + 0.06, 2.75, 0.20, name, size=9.4, color=INK, bold=True)
        txt(s, 2.14, y + 0.27, 2.75, 0.18, sub, size=7.0, color=MUTED)

    # optional actors
    pill(s, 5.34, 3.02, 0.98, 0.30, "OpenRouter", fill=WHITE, color=VIOLET, size=7.2,
         line=VIOLET)
    arr(s, 5.32, 3.38, 4.98, 3.47, color=VIOLET, width=1.0,
        dash=MSO_LINE_DASH_STYLE.DASH)
    txt(s, 5.30, 3.50, 1.0, 0.16, "optional", size=6.2, color=MUTED, italic=True)

    pill(s, 5.34, 4.02, 0.98, 0.30, "Pyodide", fill=WHITE, color=MINT_DK, size=7.2,
         line=MINT)
    arr(s, 5.32, 4.16, 4.98, 4.16, color=MINT, width=1.0,
          dash=MSO_LINE_DASH_STYLE.DASH)
    txt(s, 5.30, 4.22, 1.0, 0.16, "in browser", size=6.2, color=MUTED, italic=True)

    txt(s, 0.84, 5.30, 4.30, 0.22,
        "The four core use cases are built in; the two supporting actors are optional.",
        size=7.4, color=MUTED, italic=True)

    # ---------------- activity panel
    card(s, 6.65, 1.86, 6.00, 3.98, fill=WHITE, line=EDGE, radius=0.05)
    lab(s, 6.87, 1.99, 2.6, "Activity view", color=MINT_DK, size=8.6)
    txt(s, 6.87, 2.18, 4.2, 0.18, "one study action, end to end", size=7.8, color=MUTED)

    circle(s, 7.28, 2.40, 0.13, fill=INK)

    def node(x, y, w, text, h=0.42, fill=WHITE, line=EDGE_2, color=INK, size=8.7):
        rect(s, x, y, w, h, fill=fill, line=line, radius=0.12)
        txt(s, x + 0.08, y + h / 2 - 0.10, w - 0.16, 0.20, text, size=size,
            color=color, bold=True, align=PP_ALIGN.CENTER)

    node(7.00, 2.58, 2.45, "Open today's plan")
    node(7.00, 3.10, 2.45, "Study + log event")
    node(7.00, 3.62, 2.45, "Recompute weakness (0–100)")

    diamond(s, 8.22, 4.38, 1.20, 0.64, fill=AMBER_SOFT, line=AMBER, text="≥ 40?",
            size=8.4, color=AMBER_DK)

    node(9.35, 4.16, 2.15, "Flag weak topic", fill=ROSE_SOFT, line=ROSE,
         color=ROSE_DK, size=8.2)
    node(7.00, 5.04, 2.45, "Record progress · next action", fill=MINT_SOFT, line=MINT,
         color=MINT_DK, size=8.2)

    circle(s, 8.15, 5.60, 0.13, fill=INK)
    txt(s, 8.35, 5.56, 0.4, 0.18, "end", size=6.4, color=MUTED)

    arr(s, 7.35, 2.53, 7.35, 2.58, color=BODY, width=1.1)
    arr(s, 7.35, 3.00, 7.35, 3.10, color=BODY, width=1.1)
    arr(s, 7.35, 3.52, 7.35, 3.62, color=BODY, width=1.1)
    elbow(s, [(7.35, 4.04), (7.35, 4.38), (7.62, 4.38)], color=BODY, width=1.1)
    arr(s, 8.82, 4.38, 9.35, 4.38, color=ROSE, width=1.2)
    txt(s, 8.88, 4.14, 0.4, 0.16, "yes", size=6.4, color=ROSE, bold=True)
    arr(s, 8.22, 4.70, 8.22, 5.04, color=MINT_DK, width=1.2)
    txt(s, 8.30, 4.82, 0.3, 0.16, "no", size=6.4, color=MINT_DK, bold=True)
    arr(s, 8.22, 5.46, 8.22, 5.60, color=BODY, width=1.1)

    # loop back to the plan
    elbow(s, [(10.42, 4.16), (10.42, 2.10), (9.10, 2.10), (9.10, 2.56)],
          color=INDIGO, width=1.3)
    txt(s, 10.48, 3.05, 1.0, 0.18, "re-plan on demand", size=6.6, color=INDIGO,
        bold=True)

    # ---------------- equations band
    card(s, 0.60, 5.98, 12.15, 0.92, fill=WHITE, line=EDGE, radius=0.05)
    lab(s, 0.82, 6.09, 4.4, "Weakness score  ·  0–100  ·  last 7 days", color=ROSE, size=7.4)
    txt(s, 0.82, 6.30, 7.45, 0.48,
        "+30 failed code  ·  +0.5 × (100 − accuracy)  ·  +10 pomodoro  ·  "
        "−20 code pass  ·  −10 notes  ·  flag at ≥ 40",
        size=9.6, color=INK, bold=True, line=1.2)
    rect(s, 8.42, 6.10, 0.008, 0.68, fill=EDGE)
    lab(s, 8.62, 6.09, 3.8, "SM-2 scheduler", color=SKY_DEEP, size=7.4)
    txt(s, 8.62, 6.32, 3.95, 0.26, "interval  ←  interval × ease factor",
        size=12.2, color=INK, bold=True)
    txt(s, 8.62, 6.60, 3.95, 0.18, "the queue is built from topic and history",
        size=7.2, color=MUTED, italic=True)

    notes(s, "Two views, one process. The use-case diagram says what the student can do: plan, study and generate, practise and test, measure and adapt. The four core use cases are built in; OpenRouter and Pyodide are optional supporting actors. The activity diagram says what happens after one action: open the plan, study and log the event, recompute the weakness score, then branch. At 40 or above the topic is flagged for revision, and the student can regenerate the plan on demand; below 40 the weakness record is cleared and progress is recorded. SM-2 is a separate scheduler for flashcards, shown in the band at the bottom right. The weights there are fixed and inspectable on purpose: a failed coding attempt adds 30, low accuracy adds half the shortfall, a pomodoro adds 10, a pass subtracts 20 and notes subtract 10.")


# ---------------------------------------------------------------- 09 implementation
def slide_09(prs):
    s = base(prs, 9, "08 · Implementation Details", "A browser app, not a server stack",
             "Every choice removes something to install, host or pay for.", 33)

    groups = [
        ("UI", "Interface", "What the student sees and touches.", SKY, SKY_SOFT, [
            ("React 19", "46 routed views"),
            ("Vite", "6.21 s production build"),
            ("React Router", "route-level structure"),
            ("CSS tokens", "one palette, light + dark"),
        ]),
        ("AI", "Intelligence", "Generation and in-browser computation.", INDIGO, INDIGO_SOFT, [
            ("OpenRouter", "six-model fallback"),
            ("Pyodide", "Python in the browser"),
            ("Mermaid + KaTeX", "diagrams and maths"),
            ("Tesseract · pdf.js · Mammoth", "PDF, DOCX, OCR"),
        ]),
        ("DB", "Data", "Where the study record actually lives.", MINT, MINT_SOFT, [
            ("Dexie.js", "IndexedDB wrapper"),
            ("40 tables", "curriculum to progress"),
            ("Firebase Auth", "optional identity"),
            ("Offline", "the core loop works"),
        ]),
        ("QA", "Quality", "How the build is checked and shown.", AMBER, AMBER_SOFT, [
            ("Vitest", "47 tests in 14 files"),
            ("Vite build", "production bundle"),
            ("Puppeteer", "19 interface captures"),
            ("Vercel", "live demo"),
        ]),
    ]
    for i, (mono, name, purpose, col, tint, items) in enumerate(groups):
        x = MX + i * 3.04
        card(s, x, 1.90, 2.86, 3.62, fill=WHITE, line=EDGE, radius=0.05)
        icon(s, x + 0.20, 2.06, 0.48, mono, color=col, fill=tint, size=9)
        txt(s, x + 0.20, 2.66, 2.4, 0.26, name, size=14.6, color=INK, bold=True)
        txt(s, x + 0.20, 2.94, 2.46, 0.42, purpose, size=8.8, color=MUTED, line=1.15)
        for j, (tech, sub) in enumerate(items):
            y = 3.48 + j * 0.48
            circle(s, x + 0.22, y + 0.07, 0.10, fill=col)
            txt(s, x + 0.40, y, 2.28, 0.20, tech, size=10.6, color=INK, bold=True)
            txt(s, x + 0.40, y + 0.19, 2.28, 0.18, sub, size=7.8, color=MUTED)

    card(s, MX, 5.72, 7.10, 1.12, fill=WHITE, line=EDGE, radius=0.05)
    lab(s, 0.92, 5.84, 2.4, "Runs on", color=MINT_DK, size=8.2)
    txt(s, 0.92, 6.04, 6.6, 0.28, "Any modern browser.", size=16.5, color=INK, bold=True)
    txt(s, 0.92, 6.36, 6.55, 0.24,
        "No GPU  ·  no server  ·  no model hosting  ·  no paid tier",
        size=9.2, color=MUTED)

    card(s, 7.95, 5.72, 4.68, 1.12, fill=WHITE, line=EDGE, radius=0.05)
    lab(s, 8.17, 5.84, 2.4, "Verified by", color=AMBER_DK, size=8.2)
    txt(s, 8.17, 6.04, 4.25, 0.26, "47/47 tests  ·  6.21 s build  ·  19 captures",
        size=11.2, color=INK, bold=True)
    txt(s, 8.17, 6.36, 4.20, 0.20, "the same build on a laptop and the live demo",
        size=8.2, color=MUTED)

    notes(s, "Explain choices by constraint, not by logo. React and Vite keep the feedback loop fast for a small team. OpenRouter avoids model hosting; Pyodide runs Python in the browser, so coding practice needs no execution server. Mermaid and KaTeX render diagrams and maths locally. Dexie is the product's memory, with 40 tables; Firebase is only optional identity. Vitest, the production build and Puppeteer are how claims are checked. The bottom line answers the hardware question: there is nothing to install or host. Any modern browser is enough.")


# ---------------------------------------------------------------- 10 results
def slide_10(prs):
    s = base(prs, 10, "09 · Results & Experimental Analysis", "What is verified — and what is not",
             "Functional completeness and build health, measured. Learning gains are the next study.", 33)

    stats = [("47/47", "tests passing", MINT), ("6.21 s", "production build", SKY),
             ("40", "database tables", INDIGO), ("46", "routed views", AMBER)]
    for i, (num, label, col) in enumerate(stats):
        x = MX + i * 3.04
        card(s, x, 1.90, 2.86, 1.00, fill=WHITE, line=EDGE, radius=0.05)
        txt(s, x + 0.20, 1.99, 1.8, 0.44, num, size=24, color=col, bold=True)
        txt(s, x + 0.20, 2.47, 2.4, 0.22, label, size=9.4, color=MUTED)

    # test wall
    card(s, MX, 3.16, 3.42, 2.90, fill=WHITE, line=EDGE, radius=0.05)
    lab(s, 0.92, 3.30, 2.8, "Test wall", color=MINT_DK, size=8.4)
    txt(s, 0.92, 3.50, 2.9, 0.18, "47 tests  ·  14 files  ·  0 failures", size=7.8, color=MUTED)
    for i in range(47):
        col_i, row_i = i % 8, i // 8
        x = 0.94 + col_i * 0.28
        y = 3.80 + row_i * 0.28
        rect(s, x, y, 0.20, 0.20, fill=MINT, line=None, radius=0.28)
    txt(s, 0.92, 5.62, 3.0, 0.30, "47 / 47", size=15.5, color=MINT_DK, bold=True)
    txt(s, 1.78, 5.70, 2.2, 0.20, "passing, no skips", size=8.2, color=MUTED)

    # before / after
    card(s, 4.28, 3.16, 3.72, 2.90, fill=WHITE, line=EDGE, radius=0.05)
    lab(s, 4.50, 3.30, 3.2, "Before → with StudyMapper", color=INDIGO, size=8.2)
    txt(s, 4.50, 3.50, 3.2, 0.18, "workflow comparison, not an experiment", size=7.2,
        color=MUTED, italic=True)
    pairs = [("Four apps", "One workspace"),
             ("Plan made once", "Plan recomputed"),
             ("Exam feedback", "Practice feedback")]
    for i, (a, b) in enumerate(pairs):
        y = 3.84 + i * 0.64
        txt(s, 4.50, y, 1.32, 0.24, a, size=8.6, color=MUTED)
        arr(s, 5.82, y + 0.10, 6.08, y + 0.10, color=INDIGO, width=1.1)
        txt(s, 6.14, y - 0.01, 1.72, 0.26, b, size=9.2, color=INK, bold=True)

    # UI output
    shot_card(s, "assets/shot_dashboard10.png", 8.16, 3.16, 4.47, 2.20,
              "Dashboard", "progress, level and streak", accent=INDIGO)

    card(s, MX, 6.20, 11.93, 0.56, fill=ROSE_SOFT, line=None, radius=0.06)
    txt(s, 0.92, 6.31, 1.7, 0.20, "NOT CLAIMED", size=7.6, color=ROSE, bold=True)
    txt(s, 1.92, 6.30, 10.4, 0.30,
        "Learning gains  ·  institutional deployment  ·  teacher dashboard  ·  native app  ·  cross-device sync",
        size=9.8, color=ROSE_DK, bold=True)

    notes(s, "Be precise about what these numbers mean. 47 tests across 14 files pass, the production build takes 6.21 seconds, the database has 40 tables and the app exposes 46 routed views. The test wall is a visual count, not a new metric. The before/after panel is a workflow comparison, not an experiment. The screenshot is the dashboard, with level, streak and progress read from stored records. The sentence to land is the rose band: this proves functional completeness and build health, not learning gains. A classroom study is future work.")


# ---------------------------------------------------------------- 11 conclusion
def slide_11(prs):
    s = base(prs, 11, "10 · Conclusion", "A complete, working learning loop",
             "What the project contributes — stated as mechanisms, not adjectives.", 33)

    pillars = [
        ("ADAPTIVE", INDIGO, "The plan is an output, not a document.",
         "Exam date, topic difficulty and panic mode recompute the schedule on demand."),
        ("EXPLAINABLE", SKY, "Every flag traces to a stored record.",
         "A 0–100 score over seven days, a threshold of 40 and fixed, documented weights."),
        ("LOCAL-FIRST", MINT, "Study survives a bad connection.",
         "Notes, plans and attempts live in Dexie; AI and sign-in are optional."),
    ]
    for i, (name, col, claim, detail) in enumerate(pillars):
        x = MX + i * 4.04
        card(s, x, 1.90, 3.85, 1.62, fill=WHITE, line=EDGE, radius=0.05)
        txt(s, x + 0.20, 2.04, 3.4, 0.18, name, size=8.4, color=col, bold=True)
        txt(s, x + 0.20, 2.28, 3.42, 0.46, claim, size=13.6, color=INK, bold=True, line=1.08)
        txt(s, x + 0.20, 2.80, 3.40, 0.56, detail, size=8.8, color=MUTED, line=1.16)

    lab(s, 0.70, 3.82, 4.0, "What the project contributes", color=INDIGO, size=8.4)
    contrib = [
        ("A closed loop, not a bundle",
         "Planning, content, practice and measurement share one data model, so evidence shows what to revisit."),
        ("AI with a safety net",
         "Six-model fallback, streaming and JSON repair; generated material stays editable."),
        ("Local-first by design",
         "The core loop runs offline; identity is never required for study."),
    ]
    for i, (title, desc) in enumerate(contrib):
        y = 4.10 + i * 0.66
        rect(s, 0.70, y + 0.02, 0.05, 0.46, fill=INDIGO)
        txt(s, 0.88, y - 0.02, 6.9, 0.22, title, size=11.2, color=INK, bold=True)
        txt(s, 0.88, y + 0.21, 6.9, 0.40, desc, size=8.8, color=MUTED, line=1.15)

    card(s, 8.28, 3.82, 4.35, 2.18, fill=WHITE, line=EDGE, radius=0.05)
    lab(s, 8.50, 3.95, 3.2, "Evidence at a glance", color=AMBER_DK, size=8.2)
    ev = [("47/47", "tests", MINT), ("6.21 s", "build", SKY),
          ("40", "tables", INDIGO), ("46", "views", AMBER)]
    for i, (num, label, col) in enumerate(ev):
        x = 8.50 + (i % 2) * 1.98
        y = 4.24 + (i // 2) * 0.64
        txt(s, x, y, 1.35, 0.30, num, size=15.5, color=col, bold=True)
        txt(s, x, y + 0.29, 1.35, 0.18, label, size=7.8, color=MUTED)
    pill(s, 8.50, 5.54, 3.85, 0.32, "Live demo  ·  study-mapper.vercel.app",
         fill=INDIGO, color=WHITE, size=7.8)

    grad(s, MX, 6.18, 11.93, 0.66, INDIGO, VIOLET, angle=0, radius=0.08)
    txt(s, 0.94, 6.28, 11.4, 0.44,
        "The loop is built and verified. Whether it improves learning is the experiment ahead.",
        size=14.2, color=WHITE, bold=True)

    notes(s, "Land the three claims, one sentence each. Adaptive means the plan is generated from the exam date and topic difficulty, and can be recomputed on demand — not written once. Explainable means a student or examiner can trace why a topic is flagged weak or why it appears tomorrow — the data is in the same store, the weights are fixed, the threshold is 40. Local-first means the product survives a bad connection and treats cloud services as optional. The contributions are stated as mechanisms, not adjectives. Close on the gradient band: the loop is built; the learning study is next.")


# ---------------------------------------------------------------- 12 future
def slide_12(prs):
    s = base(prs, 12, "11 · Future Scope & Enhancements", "Evidence first, then scale",
             "The next step is a classroom study; the roadmap follows from what that study reveals.", 33)

    horizons = [
        ("NOW → 3 MONTHS", SKY, SKY_SOFT, [
            ("Classroom pilot", "Pre/post quiz with a real cohort — the first test of learning impact."),
            ("Optional sync", "Account-based, conflict-safe sync without losing local speed."),
            ("Accessibility pass", "Keyboard paths, contrast and screen-reader labels."),
        ], "pre/post gain in one cohort"),
        ("NEXT YEAR", INDIGO, INDIGO_SOFT, [
            ("Native mobile shell", "Capture small study sessions between classes."),
            ("Mentor view", "A cohort view for teachers — aggregate, not surveillance."),
            ("Content review queue", "Check AI-generated material before sharing."),
        ], "weekly active students · review turnaround"),
        ("BEYOND", VIOLET, VIOLET_SOFT, [
            ("Multi-language content", "Localise notes and questions, not just the interface."),
            ("LMS integration", "LTI-style hand-off to institutional course spaces."),
            ("Longitudinal study", "A multi-semester evaluation with an education department."),
        ], "multi-semester retention and outcomes"),
    ]
    for i, (label, col, tint, items, signal) in enumerate(horizons):
        x = MX + i * 4.04
        card(s, x, 1.90, 3.85, 4.02, fill=WHITE, line=EDGE, radius=0.05)
        rect(s, x, 1.90, 3.85, 0.48, fill=tint, radius=0.05)
        txt(s, x + 0.20, 2.03, 3.4, 0.22, label, size=8.6, color=col, bold=True)
        for j, (title, desc) in enumerate(items):
            y = 2.58 + j * 0.98
            txt(s, x + 0.20, y, 3.42, 0.24, title, size=12.4, color=INK, bold=True)
            txt(s, x + 0.20, y + 0.24, 3.42, 0.58, desc, size=8.8, color=MUTED, line=1.15)
            if j < 2:
                rect(s, x + 0.20, y + 0.86, 3.40, 0.006, fill=EDGE)
        rect(s, x + 0.20, 5.42, 3.40, 0.006, fill=EDGE)
        txt(s, x + 0.20, 5.52, 3.4, 0.18, "HOW WE WILL KNOW", size=6.8, color=col, bold=True)
        txt(s, x + 0.20, 5.70, 3.42, 0.20, signal, size=7.4, color=BODY, bold=True)

    arr(s, MX, 6.22, 12.63, 6.22, color=EDGE_2, width=1.3)
    for i in range(3):
        circle(s, MX + i * 4.04 + 1.88, 6.14, 0.16, fill=horizons[i][1])
    txt(s, 0.70, 6.42, 11.9, 0.30,
        "Prove the loop helps a student learn before adding surface area.",
        size=13.0, color=INK, bold=True)

    notes(s, "The sequencing argument is the slide. The first horizon is not more features; it is a classroom pilot with a pre/post design, because that is the missing evidence. Optional sync and accessibility make the product usable beyond one browser. The next year is about reach and review: mobile, a mentor view that aggregates rather than surveils, and a workflow for checking AI content. Beyond that is institutional integration and a longitudinal study. If asked what is realistically next, answer the pilot and the accessibility pass — both are small enough to start immediately.")


# ---------------------------------------------------------------- 13 references
def slide_13(prs):
    s = base(prs, 13, "12 · References", "Sources used to verify this work",
             "Primary sources first; technical documentation only where it was needed to confirm a claim.", 33)

    left = [
        ("1", "P. Venubhaskar et al., “StudyMapper: AI-Driven Personalized Learning and Academic Management System”, project abstract, ALITS, 2026–27."),
        ("2", "StudyMapper source repository, GitHub — github.com/palturuvenubhaskar/StudyMapper. Accessed 28 October 2026."),
        ("3", "StudyMapper live application — study-mapper.vercel.app. Accessed 28 October 2026."),
        ("4", "Meta Open Source, React 19 documentation — react.dev. Accessed 28 October 2026."),
        ("5", "Vite documentation — vite.dev. Build tooling and the production bundle."),
        ("6", "Dexie.js documentation — dexie.org. IndexedDB schema, transactions and live queries."),
        ("7", "Google, Firebase Authentication documentation — firebase.google.com/docs/auth."),
    ]
    right = [
        ("8", "OpenRouter API documentation — openrouter.ai/docs. Model routing, streaming and fallback."),
        ("9", "Pyodide documentation — pyodide.org. Python runtime in the browser."),
        ("10", "Tesseract.js, pdf.js and Mammoth.js documentation. PDF, DOCX and OCR parsing."),
        ("11", "Mermaid — mermaid.js.org; KaTeX — katex.org. Diagrams and mathematical notation."),
        ("12", "P. A. Woźniak, “SuperMemo 2: Algorithm and implementation”, 1987. Basis of the SM-2 scheduler."),
        ("13", "Anki manual — docs.ankiweb.net. Reference implementation of spaced repetition."),
        ("14", "Vitest documentation — vitest.dev. Unit testing for Vite."),
    ]
    for x, head, refs in ((0.70, "PRIMARY & PLATFORM", left), (6.78, "LIBRARIES & METHODS", right)):
        card(s, x, 1.90, 5.85, 4.55, fill=WHITE, line=EDGE, radius=0.05)
        lab(s, x + 0.22, 2.04, 4.6, head, color=INDIGO, size=8.2)
        for i, (num, text) in enumerate(refs):
            y = 2.40 + i * 0.57
            txt(s, x + 0.22, y, 0.34, 0.20, num, size=8.6, color=INDIGO, bold=True)
            txt(s, x + 0.54, y - 0.01, 5.06, 0.54, text, size=8.5, color=BODY, line=1.14)
            if i < 6:
                rect(s, x + 0.22, y + 0.50, 5.38, 0.005, fill=EDGE)

    txt(s, MX, 6.62, 11.9, 0.22,
        "All web sources accessed October 2026  ·  Repository: github.com/palturuvenubhaskar/StudyMapper  ·  Live: study-mapper.vercel.app",
        size=8.2, color=MUTED, italic=True)

    notes(s, "Do not read the references. Explain the policy: the repository, the abstract and the live app are the primary sources; the rest are official documentation used to confirm specific technical behaviour. No secondary blog posts or unattributed claims are cited. If an examiner asks about the SM-2 formulation, point to Woźniak's original description and the Anki manual as the reference implementation. The repository link is also the fastest way for an evaluator to inspect the code after the presentation.")


if __name__ == "__main__":
    print("slides 8-13 module")
