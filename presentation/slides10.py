"""StudyMapper - 10-slide short deck.

A presentation cut of the full deck: bigger type, one visual per slide,
fewer words. All facts are the verified ones from the long deck.
"""
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.dml import MSO_LINE_DASH_STYLE
from deck_lib import *
import deck_lib as D


# ---------------------------------------------------------------- helpers
def base10(prs, kicker, title, lead=None, page=None, title_size=33):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s, WHITE)
    add_text(s, 0.75, 0.38, 9.0, 0.24, kicker.upper(), size=10.5, color=TEAL, bold=True)
    add_text(s, 0.75, 0.64, 11.9, 0.62, title, size=title_size, color=INK, bold=True, line=0.95)
    if lead:
        add_text(s, 0.75, 1.34, 11.4, 0.56, lead, size=16.5, color=BODY, line=1.12)
    add_text(s, 0.75, 7.12, 8.0, 0.2,
             "StudyMapper  ·  ten-slide overview", size=9, color=MUTED)
    if page is not None:
        add_text(s, 11.0, 7.10, 1.58, 0.24, f"{page:02d} / 10", size=10, color=MUTED,
                 align=PP_ALIGN.RIGHT, bold=True)
    return s


def pill(s, x, y, w, h, text, fill=TEAL_SOFT, color=TEAL, size=10):
    shp = rect(s, x, y, w, h, fill=fill, line=None, radius=0.5)
    tf = shp.text_frame
    tf.margin_left = tf.margin_right = Inches(0.08)
    tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = text
    r.font.size = Pt(size)
    r.font.bold = True
    r.font.name = FONT
    r.font.color.rgb = color
    return shp


def ring(s, x, y, d, color, width=1.6):
    shp = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(x), Inches(y), Inches(d), Inches(d))
    shp.fill.background()
    shp.line.color.rgb = color
    shp.line.width = Pt(width)
    shp.shadow.inherit = False
    D._strip_style(shp)
    return shp


def state_dot(s, cx, cy, state):
    if state == "yes":
        circle(s, cx - 0.10, cy - 0.10, 0.20, fill=GREEN)
    elif state == "part":
        ring(s, cx - 0.10, cy - 0.10, 0.20, AMBER, 1.8)
    else:
        rect(s, cx - 0.11, cy - 0.018, 0.22, 0.036, fill=LINE)


def arr(s, x1, y1, x2, y2, color=MUTED, width=1.4, head=True):
    c = arrow(s, x1, y1, x2, y2, color=color, width=width, head=head)
    c.shadow.inherit = False
    D._strip_style(c)
    return c


# ---------------------------------------------------------------- slides
def slide_01(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s, WHITE)

    s.shapes.add_picture("assets/logo_clean.png", Inches(0.75), Inches(0.50), width=Inches(2.55))

    add_text(s, 0.75, 1.42, 6.4, 0.24, "ACADEMIC PROJECT  ·  2026–27", size=10.5,
             color=TEAL, bold=True)
    add_text(s, 0.72, 1.66, 6.6, 0.95, "StudyMapper", size=58, color=INK, bold=True, line=0.95)
    add_text(s, 0.75, 2.66, 6.35, 0.85,
             "AI-driven personalised learning\nand academic management",
             size=23, color=BODY, line=1.12)

    add_text(s, 0.75, 3.86, 6.2, 0.2, "TEAM", size=10, color=MUTED, bold=True)
    add_text(s, 0.75, 4.10, 6.4, 0.66,
             "P. Venubhaskar  ·  T. Vasanth  ·  V. Adarsh Kumar\nB. Sai Vikas  ·  C. Narendra",
             size=14.5, color=INK, bold=True, line=1.3)
    add_text(s, 0.75, 4.78, 6.4, 0.22,
             "252G5A0520  ·  252G5A0528  ·  252G5A0532  ·  252G5A0501  ·  252G5A0502",
             size=9.5, color=MUTED)

    add_text(s, 0.75, 5.44, 6.2, 0.2, "GUIDE", size=10, color=MUTED, bold=True)
    add_text(s, 0.75, 5.66, 6.3, 0.26, "Ms. C. Sravani", size=14, color=INK, bold=True)

    add_text(s, 0.75, 6.06, 6.4, 0.55,
             "Department of Computer Science & Engineering\nAnantha Lakshmi Institute of Technology & Sciences (Autonomous)",
             size=11.5, color=MUTED, line=1.3)

    # product shot
    framed_shot(s, "assets/shot_dashboard10.png", 7.32, 1.42, 5.28, 3.62,
                caption="The running build — dashboard at 1440 × 900", cap_size=9.5)
    add_text(s, 7.39, 5.20, 5.1, 0.24, "Live demo  ·  study-mapper.vercel.app",
             size=11.5, color=TEAL, bold=True)
    add_text(s, 7.39, 5.50, 5.1, 0.5,
             "Every number and screen in this deck comes from the repository or the running app.",
             size=11, color=MUTED, line=1.25)

    notes(s, "Open with the product, not the technology: StudyMapper turns a syllabus into a study plan that reacts to what the student gets wrong. The screenshot is the running build. Introduce the team and guide briefly; the roll numbers are on screen for the record, so do not read them aloud. Set the evidence standard now: every claim in the next nine slides is checked against the repository or the live app.")


def slide_02(prs):
    s = base10(prs, "01 · Agenda", "Ten slides, one story",
               "Why it exists  →  what it does  →  how it works  →  what is proven  →  what comes next.",
               page=2)
    items = [
        ("01", "Title & team"),
        ("02", "Agenda"),
        ("03", "Abstract & motivation"),
        ("04", "Problem & objectives"),
        ("05", "Literature survey"),
        ("06", "System architecture"),
        ("07", "Methodology & algorithm"),
        ("08", "Implementation details"),
        ("09", "Results & analysis"),
        ("10", "Conclusion, future & references"),
    ]
    for i, (num, label) in enumerate(items):
        col = i // 5
        row = i % 5
        x = 0.75 + col * 6.05
        y = 2.10 + row * 0.94
        circle(s, x, y, 0.50, fill=TEAL_SOFT, text=num, tcolor=TEAL, size=11)
        add_text(s, x + 0.74, y + 0.10, 4.9, 0.32, label, size=17, color=INK, bold=True)
        if row < 4:
            rect(s, x + 0.25, y + 0.60, 0.008, 0.30, fill=LINE)

    add_text(s, 0.75, 6.72, 11.8, 0.26,
             "Short version: about ten minutes, then questions.",
             size=12, color=MUTED, italic=True)

    notes(s, "Use this as a map, not a list. Point to the five moves in the lead sentence: the first half explains the problem and the design, the second half shows the engineering and the evidence. Say the deck is deliberately short so there is time for questions. Do not read the ten titles aloud.")


def slide_03(prs):
    s = base10(prs, "02 · Abstract & motivation", "One loop: plan, learn, practise, improve",
               "A syllabus becomes a plan that reacts to what the student actually gets wrong.",
               page=3)

    nodes = [
        ("PLAN", "Exam date · difficulty · weak scores", TEAL),
        ("LEARN", "Notes, diagrams, imported PDFs", BLUE),
        ("PRACTISE", "Question banks, mock exams, code", AMBER),
        ("IMPROVE", "Weakness scores and SM-2 reviews", GREEN),
    ]
    nw, gap = 2.72, 0.34
    for i, (name, sub, col) in enumerate(nodes):
        x = 0.72 + i * (nw + gap)
        rect(s, x, 2.36, nw, 1.38, fill=MIST, line=None, radius=0.06)
        add_text(s, x + 0.22, 2.54, nw - 0.4, 0.30, name, size=17, color=col, bold=True)
        add_text(s, x + 0.22, 2.92, nw - 0.42, 0.62, sub, size=12, color=BODY, line=1.2)
        if i < 3:
            arr(s, x + nw + 0.04, 3.05, x + nw + gap - 0.04, 3.05, color=MUTED, width=1.6)

    # return path
    y_ret = 4.18
    last_x = 0.72 + 3 * (nw + gap) + nw / 2
    first_x = 0.72 + nw / 2
    arr(s, last_x, 3.74, last_x, y_ret, color=GREEN, width=1.4, head=False)
    arr(s, last_x, y_ret, first_x, y_ret, color=GREEN, width=1.4, head=False)
    arr(s, first_x, y_ret, first_x, 3.80, color=GREEN, width=1.4)
    add_text(s, 3.6, y_ret + 0.08, 6.0, 0.24,
             "the same records, recomputed", size=11, color=GREEN, italic=True,
             align=PP_ALIGN.CENTER)

    add_text(s, 0.75, 4.78, 6.0, 0.22, "WHY IT MATTERS", size=10, color=MUTED, bold=True)
    reasons = [
        ("Fixed study time", "The same hours for every topic, whatever its difficulty."),
        ("Late feedback", "Mistakes surface at the exam, not during practice."),
        ("Scattered tools", "Notes, deadlines and tests live in different apps."),
    ]
    for i, (t, d) in enumerate(reasons):
        x = 0.75 + i * 3.97
        rect(s, x, 5.06, 3.78, 1.22, fill=WHITE, line=LINE, radius=0.06)
        add_text(s, x + 0.22, 5.20, 3.35, 0.26, t, size=14, color=INK, bold=True)
        add_text(s, x + 0.22, 5.50, 3.36, 0.66, d, size=11, color=MUTED, line=1.2)

    notes(s, "Explain the loop in one breath: the plan is built from the exam date, topic difficulty and current weakness scores; learn is where generated notes and diagrams live; practise is question banks, mock exams and in-browser coding; improve turns attempts into weakness scores and schedules SM-2 reviews. The green arrow back to Plan is the whole idea - the same records are read again. Finish with the three motivation lines, not with technology.")


def slide_04(prs):
    s = base10(prs, "03 · Problem & objectives", "The gap is response, not content",
               "Students do not lack material. They lack a system that reacts to their week.",
               page=4)

    add_text(s, 0.75, 1.98, 6.0, 0.22, "WHAT IS BROKEN", size=10, color=ROSE, bold=True)
    problems = [
        ("01", "Fragmented tools", "Notes, deadlines and tests live in different apps."),
        ("02", "Static plans", "One plan for every topic, whatever its difficulty."),
        ("03", "Late feedback", "Mistakes surface at the exam, not during practice."),
    ]
    for i, (n, t, d) in enumerate(problems):
        x = 0.75 + i * 3.97
        rect(s, x, 2.26, 3.78, 1.50, fill=ROSE_SOFT, line=None, radius=0.06)
        add_text(s, x + 0.22, 2.40, 0.5, 0.22, n, size=10.5, color=ROSE, bold=True)
        add_text(s, x + 0.22, 2.64, 3.3, 0.28, t, size=16, color=INK, bold=True)
        add_text(s, x + 0.22, 2.98, 3.32, 0.66, d, size=12, color=BODY, line=1.2)

    arr(s, 6.62, 3.86, 6.62, 4.28, color=MUTED, width=1.6)

    add_text(s, 0.75, 4.28, 6.0, 0.22, "WHAT WE SET OUT TO DO", size=10, color=TEAL, bold=True)
    goals = [
        ("Adaptive plan", "Recomputed from the exam date, difficulty and weak scores."),
        ("Generated material", "Notes, diagrams and questions the student can edit."),
        ("Measured weakness", "A 0–100 score per topic, from the last seven days."),
    ]
    for i, (t, d) in enumerate(goals):
        x = 0.75 + i * 3.97
        rect(s, x, 4.56, 3.78, 1.50, fill=TEAL_SOFT, line=None, radius=0.06)
        circle(s, x + 0.22, 4.70, 0.30, fill=TEAL, text="✓", tcolor=WHITE, size=8)
        add_text(s, x + 0.64, 4.71, 2.9, 0.28, t, size=16, color=INK, bold=True)
        add_text(s, x + 0.22, 5.14, 3.34, 0.72, d, size=12, color=BODY, line=1.2)

    add_text(s, 0.75, 6.34, 11.8, 0.26,
             "Out of scope  ·  institutional timetabling  ·  proctored exams  ·  a native mobile app",
             size=11.5, color=MUTED)

    notes(s, "Frame the problem in student terms before any technology. Three failures: context is lost when tools are separate, a plan made once ignores difficulty and slipping dates, and feedback arrives after the exam. Then read the objectives as the direct response - one plan that recomputes, material that can be edited, and a weakness score per topic. The scope line matters: these are decisions, not missing pieces.")


def slide_05(prs):
    s = base10(prs, "04 · Literature survey", "Five approaches, one missing loop",
               "Each category solves part of the problem. None closes the loop for one student.",
               page=5)

    label_x, label_w = 0.75, 3.9
    col_w = 1.95
    xs = [label_x + label_w + i * col_w for i in range(4)]
    heads = ["Personalises", "Uses own data", "Works offline", "Closes loop"]
    for i, h in enumerate(heads):
        add_text(s, xs[i], 2.02, col_w, 0.3, h, size=11, color=MUTED, bold=True,
                 align=PP_ALIGN.CENTER)
    rect(s, 0.75, 2.42, 11.80, 0.012, fill=LINE)

    rows = [
        ("Adaptive platforms", ["yes", "yes", "no", "part"]),
        ("AI tutors", ["yes", "part", "no", "no"]),
        ("LMS analytics", ["no", "yes", "no", "no"]),
        ("Spaced repetition", ["yes", "yes", "yes", "no"]),
        ("Gamified apps", ["part", "part", "yes", "no"]),
    ]
    for r, (name, states) in enumerate(rows):
        y = 2.50 + r * 0.62
        if r % 2 == 0:
            rect(s, 0.75, y - 0.02, 11.80, 0.58, fill=MIST, line=None, radius=0.04)
        add_text(s, label_x, y + 0.13, label_w - 0.1, 0.3, name, size=14, color=INK, bold=True)
        for c, st in enumerate(states):
            state_dot(s, xs[c] + col_w / 2, y + 0.27, st)

    rect(s, 0.75, 5.64, 11.80, 0.68, fill=TEAL_SOFT, line=None, radius=0.06)
    add_text(s, 0.98, 5.74, 1.5, 0.2, "THE GAP", size=10, color=TEAL, bold=True)
    add_text(s, 2.02, 5.73, 10.3, 0.28,
             "No category combines planning, practice, measurement and offline study for one learner.",
             size=14, color=INK, bold=True)

    # legend
    state_dot(s, 0.86, 6.62, "yes")
    add_text(s, 1.02, 6.51, 0.8, 0.22, "built in", size=10, color=MUTED)
    state_dot(s, 1.94, 6.62, "part")
    add_text(s, 2.10, 6.51, 0.8, 0.22, "partial", size=10, color=MUTED)
    state_dot(s, 2.96, 6.62, "no")
    add_text(s, 3.12, 6.51, 0.8, 0.22, "absent", size=10, color=MUTED)
    add_text(s, 7.4, 6.51, 5.15, 0.22,
             "Design comparison, not a systematic review.", size=10, color=MUTED,
             italic=True, align=PP_ALIGN.RIGHT)

    notes(s, "Do not read the grid cell by cell; pick the contrast. Adaptive platforms sequence content well but rarely react to one student's week. AI tutors generate well but are usually cloud-only and disconnected from stored data. LMS analytics serve the institution. Spaced repetition is excellent but isolated from the syllabus. Gamified apps sustain habit but do not change what is studied. The gap line is the sentence to land. Say plainly that this is a design comparison, not a systematic literature review.")


def slide_06(prs):
    s = base10(prs, "05 · System architecture", "Four layers, two optional services",
               "Everything that matters runs in the browser. The network is optional.",
               page=6)

    bands = [
        ("INTERFACE", TEAL_SOFT, TEAL,
         [("React 19 SPA", 3.28), ("46 routed views", 3.28), ("Responsive light UI", 3.28)]),
        ("DOMAIN", BLUE_SOFT, BLUE,
         [("Adaptive planner", 2.42), ("SM-2 scheduler", 2.42), ("Weakness detector", 2.42),
          ("Gamification", 2.42)]),
        ("SERVICES", AMBER_SOFT, AMBER,
         [("AI service  ·  6-model fallback", 5.00), ("File parser  ·  PDF / DOCX / OCR", 5.00)]),
        ("DATA", GREEN_SOFT, GREEN,
         [("Dexie / IndexedDB  ·  40 tables", 5.40), ("Firebase Auth (optional)", 4.60)]),
    ]
    y = 1.96
    for name, tint, col, chips in bands:
        rect(s, 0.75, y, 1.42, 0.98, fill=tint, line=None, radius=0.06)
        add_text(s, 0.80, y + 0.34, 1.32, 0.3, name, size=9.5, color=col, bold=True,
                 align=PP_ALIGN.CENTER)
        cx = 2.34
        for text, w in chips:
            dashed = "optional" in text
            shp = chip(s, cx, y + 0.22, w, 0.54, text, fill=WHITE,
                       color=BODY, size=12.5, bold=True,
                       line=col if dashed else LINE,
                       radius=0.14)
            if dashed:
                shp.line.dash_style = MSO_LINE_DASH_STYLE.DASH
                shp.line.width = Pt(1.1)
            cx += w + 0.15
        y += 1.14

    add_text(s, 0.75, 6.55, 11.8, 0.26,
             "Solid boxes run locally  ·  the dashed box needs the network  ·  no server in the study loop.",
             size=11, color=MUTED)

    notes(s, "Walk the stack from the top. The interface is ordinary React. The domain band is the product: planner, SM-2 scheduler, weakness detector and gamification, all local logic. The services band can fail without stopping study - the AI service falls back across six models and repairs malformed JSON; the file parser handles PDF, DOCX and OCR. The data band is Dexie over IndexedDB with 40 tables. Firebase Auth is optional identity, drawn dashed because it needs the network. The point to land: no server is required for the study loop.")


def slide_07(prs):
    s = base10(prs, "06 · Methodology & algorithm", "From activity to next action",
               "Every study action is scored, and the score changes the plan.",
               page=7)

    steps = [
        ("01", "Log activity", "Attempts, pomodoros, notes and coding runs."),
        ("02", "Score each topic", "A 0–100 weakness score, computed locally."),
        ("03", "Flag the weak", "40 or above, over the last seven days."),
        ("04", "Re-plan", "Regenerate the plan from the latest scores."),
    ]
    for i, (n, t, d) in enumerate(steps):
        y = 2.00 + i * 1.02
        circle(s, 0.75, y, 0.54, fill=TEAL, text=n, tcolor=WHITE, size=10)
        if i < 3:
            rect(s, 1.01, y + 0.54, 0.014, 0.48, fill=LINE)
        add_text(s, 1.52, y + 0.02, 4.9, 0.30, t, size=16.5, color=INK, bold=True)
        add_text(s, 1.52, y + 0.34, 4.9, 0.42, d, size=12, color=MUTED, line=1.2)

    # algorithm panel
    rect(s, 6.75, 1.96, 5.85, 3.52, fill=MIST, line=None, radius=0.06)
    add_text(s, 7.00, 2.12, 5.3, 0.22, "WEAKNESS SCORE", size=10, color=TEAL, bold=True)
    add_text(s, 7.00, 2.36, 5.35, 0.30, "0–100 per topic, clamped", size=15, color=INK, bold=True)

    terms = [
        ("+30", "failed coding attempt", ROSE),
        ("+0.5 × (100 − accuracy)", "low accuracy, below 60", ROSE),
        ("+10", "completed pomodoro", AMBER),
        ("−20", "successful coding attempt", GREEN),
        ("−10", "notes generated", GREEN),
    ]
    for i, (w, label, col) in enumerate(terms):
        y = 2.82 + i * 0.40
        add_text(s, 7.00, y, 2.28, 0.26, w, size=12.5, color=col, bold=True)
        add_text(s, 9.36, y, 3.0, 0.26, label, size=11.5, color=BODY)
    add_text(s, 7.00, 4.92, 5.3, 0.24, "Flagged as a weakness at 40 or above.",
             size=11, color=MUTED, italic=True)

    rect(s, 6.75, 5.68, 5.85, 0.78, fill=BLUE_SOFT, line=None, radius=0.06)
    add_text(s, 7.00, 5.80, 1.0, 0.22, "SM-2", size=10, color=BLUE, bold=True)
    add_text(s, 7.66, 5.78, 4.8, 0.28, "interval  ←  interval × ease factor",
             size=13, color=INK, bold=True)

    add_text(s, 0.75, 6.10, 5.7, 0.5,
             "Fixed weights, inspectable rules — no training, no black box.",
             size=12.5, color=TEAL_DK, bold=True, line=1.2)

    notes(s, "This is the processing logic in one pass. Study actions are written locally; the weakness detector reads the last seven days and applies fixed weights: a failed coding attempt adds 30, low accuracy adds half of the shortfall below 100, a pomodoro adds 10, a successful coding attempt subtracts 20 and generating notes subtracts 10. The result is clamped to 0–100 and flagged at 40. Flashcards use SM-2, so the interval grows with the ease factor. Say that the weights are simple and inspectable on purpose — no black box.")


def slide_08(prs):
    s = base10(prs, "07 · Implementation", "A browser app, not a server stack",
               "Four groups of tools, chosen to keep the loop small and free to run.",
               page=8)

    groups = [
        ("UI", "Interface", TEAL, TEAL_SOFT,
         ["React 19", "Vite", "React Router"], "Fast feedback for a small team."),
        ("AI", "Intelligence", BLUE, BLUE_SOFT,
         ["OpenRouter", "Pyodide", "Mermaid · KaTeX"], "No model training or hosting."),
        ("DB", "Data", GREEN, GREEN_SOFT,
         ["Dexie", "40 tables", "Firebase Auth"], "Local data; sign-in is optional."),
        ("✓", "Quality", AMBER, AMBER_SOFT,
         ["Vitest · 47 tests", "Vite build", "Vercel deploy"], "Every claim is checked."),
    ]
    for i, (mono, name, col, tint, items, why) in enumerate(groups):
        x = 0.75 + i * 3.03
        circle(s, x, 1.96, 0.62, fill=tint, text=mono, tcolor=col, size=12)
        add_text(s, x, 2.72, 2.85, 0.3, name, size=16, color=INK, bold=True)
        for j, it in enumerate(items):
            add_text(s, x, 3.16 + j * 0.50, 2.85, 0.28, it, size=13.5, color=BODY)
        add_text(s, x, 4.70, 2.70, 0.50, why, size=11, color=MUTED, line=1.2, italic=True)
        if i < 3:
            rect(s, x + 2.90, 1.98, 0.008, 3.10, fill=LINE)

    rect(s, 0.75, 5.30, 11.85, 1.18, fill=MIST, line=None, radius=0.06)
    add_text(s, 1.00, 5.44, 2.4, 0.22, "HARDWARE & RUNTIME", size=10, color=TEAL, bold=True)
    add_text(s, 1.00, 5.68, 11.3, 0.34,
             "Any modern browser. No GPU, no server, no model hosting, no paid tier.",
             size=17, color=INK, bold=True)
    add_text(s, 1.00, 6.06, 11.3, 0.26,
             "The same build runs on a laptop and on the deployed demo.",
             size=11.5, color=MUTED)

    notes(s, "Explain choices by constraint, not by logo. React and Vite keep the feedback loop fast for a small team. OpenRouter avoids model hosting, Pyodide runs Python in the browser, Mermaid and KaTeX render diagrams and maths locally. Dexie is the product's memory; Firebase is only optional identity. Vitest and the production build are how claims are checked. The bottom line answers the hardware question: there is nothing to install or host - any modern browser is enough.")


def slide_09(prs):
    s = base10(prs, "08 · Results", "What is verified — and what is not",
               "Functional completeness and build health, measured. Learning gains are the next study.",
               page=9)

    stats = [
        ("47/47", "automated tests", GREEN),
        ("6.21 s", "production build", TEAL),
        ("40", "database tables", BLUE),
        ("46", "routed views", AMBER),
    ]
    for i, (num, label, col) in enumerate(stats):
        x = 0.75 + i * 3.03
        rect(s, x, 1.94, 2.85, 1.10, fill=WHITE, line=LINE, radius=0.06)
        add_text(s, x + 0.20, 2.04, 2.4, 0.46, num, size=28, color=col, bold=True)
        add_text(s, x + 0.20, 2.56, 2.5, 0.22, label, size=10.5, color=MUTED)

    # before / after comparison
    rect(s, 0.75, 3.28, 7.00, 2.80, fill=MIST, line=None, radius=0.06)
    add_text(s, 0.98, 3.42, 5.9, 0.22, "BEFORE  →  WITH STUDYMAPPER", size=10, color=TEAL, bold=True)
    pairs = [
        ("Four apps", "One workspace"),
        ("Plan made once", "Plan recomputed"),
        ("Feedback at the exam", "Feedback in practice"),
    ]
    for i, (a, b) in enumerate(pairs):
        y = 3.80 + i * 0.66
        add_text(s, 0.98, y, 2.35, 0.28, a, size=12, color=MUTED)
        arr(s, 3.28, y + 0.14, 3.66, y + 0.14, color=TEAL, width=1.3)
        add_text(s, 3.82, y, 3.7, 0.28, b, size=13.5, color=INK, bold=True)

    framed_shot(s, "assets/shot_dashboard10.png", 8.05, 3.28, 4.55, 2.84,
                caption="Dashboard — the seeded demo build", cap_size=9)

    add_text(s, 0.75, 6.35, 11.8, 0.5,
             "Not claimed: a measured learning-outcome study, institutional deployment, a teacher dashboard, a native app.",
             size=11.5, color=ROSE, bold=True)

    notes(s, "Be precise about what these numbers mean. 47 tests across 14 files pass, the production build takes 6.21 seconds, the database has 40 tables and the app exposes 46 routed views. The before/after panel is a workflow comparison, not an experiment. The screenshot is the seeded demo. The sentence to land is the rose line: this proves functional completeness and build health, not learning gains - a classroom study is future work.")


def slide_10(prs):
    s = base10(prs, "09 · Conclusion & future", "Three claims, one next step",
               "The loop is built and verified. Whether it improves learning is the experiment ahead.",
               page=10)

    pillars = [
        ("ADAPTIVE", TEAL, "Plans recompute from the exam date, topic difficulty and measured weakness.",
         "Regenerate on demand; panic mode compresses the rest."),
        ("EXPLAINABLE", BLUE, "Every score traces back to stored attempts; the rule set is documented.",
         "Flagged at 40+, over a seven-day window."),
        ("LOCAL-FIRST", GREEN, "Notes, plans and attempts live in IndexedDB; AI and sign-in are optional.",
         "No server is required for the core loop."),
    ]
    for i, (name, col, d, detail) in enumerate(pillars):
        x = 0.75 + i * 3.97
        rect(s, x, 1.94, 3.78, 1.62, fill=WHITE, line=LINE, radius=0.06)
        add_text(s, x + 0.22, 2.08, 3.3, 0.22, name, size=10, color=col, bold=True)
        add_text(s, x + 0.22, 2.34, 3.36, 0.72, d, size=13, color=INK, line=1.22)
        add_text(s, x + 0.22, 3.06, 3.30, 0.42, detail, size=11, color=MUTED, line=1.18, italic=True)

    add_text(s, 0.75, 3.78, 4.0, 0.22, "NEXT", size=10, color=MUTED, bold=True)
    nexts = [
        ("01", "Classroom pilot", "Pre/post quiz with a real cohort."),
        ("02", "Optional sync", "Account-based, conflict-safe sync."),
        ("03", "Accessibility pass", "Keyboard paths, contrast, screen readers."),
    ]
    for i, (n, t, d) in enumerate(nexts):
        x = 0.75 + i * 3.97
        add_text(s, x, 4.04, 0.5, 0.22, n, size=10.5, color=TEAL, bold=True)
        add_text(s, x + 0.44, 4.02, 3.3, 0.28, t, size=14, color=INK, bold=True)
        add_text(s, x + 0.44, 4.32, 3.25, 0.5, d, size=11, color=MUTED, line=1.18)

    # references band
    rect(s, 0.75, 5.12, 11.85, 1.72, fill=MIST, line=None, radius=0.06)
    add_text(s, 1.00, 5.24, 2.0, 0.22, "REFERENCES", size=10, color=TEAL, bold=True)
    refs_left = [
        "[1]  StudyMapper source repository, GitHub.",
        "[2]  StudyMapper project abstract, ALITS, 2026–27.",
        "[3]  React 19, Vite and Dexie documentation.",
    ]
    refs_right = [
        "[4]  OpenRouter API documentation.",
        "[5]  P. A. Woźniak, SuperMemo 2, 1987.",
        "[6]  Vitest and Pyodide documentation.",
    ]
    for i, t in enumerate(refs_left):
        add_text(s, 1.00, 5.50 + i * 0.40, 5.3, 0.24, t, size=10, color=BODY)
    for i, t in enumerate(refs_right):
        add_text(s, 6.80, 5.50 + i * 0.40, 5.5, 0.24, t, size=10, color=BODY)
    add_text(s, 1.00, 6.56, 11.3, 0.22,
             "Full reference list with access dates in the detailed deck.",
             size=9.5, color=MUTED, italic=True)

    notes(s, "Close on three claims and one next step. Adaptive: plans recompute from the exam date, difficulty and measured weakness. Explainable: a topic is flagged at 40 in the last seven days, and the weights are simple. Local-first: the core loop runs offline and identity is optional. Then the sequencing argument - the first thing next is a classroom pilot with a pre/post quiz, because that is the missing evidence, followed by sync and an accessibility pass. Do not add new claims in the conclusion.")


def build():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    for fn in (slide_01, slide_02, slide_03, slide_04, slide_05,
               slide_06, slide_07, slide_08, slide_09, slide_10):
        fn(prs)
    cp = prs.core_properties
    cp.title = "StudyMapper - ten-slide project presentation"
    cp.subject = "Academic project presentation"
    cp.author = "P. Venubhaskar, T. Vasanth, V. Adarsh Kumar, B. Sai Vikas, C. Narendra"
    cp.keywords = "adaptive learning, spaced repetition, AI, local-first, React"
    out = "StudyMapper_10Slide.pptx"
    prs.save(out)
    print("saved", out, "slides:", len(prs.slides))


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    build()
