"""Slides 1-7 of the 13-slide StudyMapper deck."""
import os
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.dml import MSO_LINE_DASH_STYLE
from app_lib import *
from deck_lib import notes


# ---------------------------------------------------------------- 01 title
def slide_01(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    bg(s)

    grad(s, MX, 0.45, 0.22, 0.22, SKY, INDIGO, angle=35, radius=0.25)
    txt(s, MX + 0.31, 0.43, 2.4, 0.24, "StudyMapper", size=10.5, color=INK, bold=True)
    txt(s, 7.0, 0.44, 5.63, 0.22, "ACADEMIC PROJECT  ·  2026–27", size=9.5,
        color=INDIGO, bold=True, align=PP_ALIGN.RIGHT)

    pill(s, 0.80, 0.98, 3.30, 0.34, "AI-DRIVEN LEARNING WORKSPACE",
         fill=INDIGO_SOFT, color=INDIGO, size=8.6)

    txt(s, 0.75, 1.42, 7.4, 0.95, "StudyMapper", size=58, color=INK,
        bold=True, line=0.95)
    txt(s, 0.78, 2.38, 6.95, 0.95,
        "AI-Driven Personalized Learning\n& Academic Management System",
        size=23, color=BODY, line=1.12)

    grad(s, 0.80, 3.48, 1.35, 0.055, SKY, INDIGO, angle=0)

    lab(s, 0.80, 3.68, 4.0, "Project overview", color=INDIGO, size=9)
    txt(s, 0.80, 3.92, 6.95, 1.0,
        "A local-first study workspace that turns a syllabus into an adaptive plan, "
        "generates notes and practice, and scores weakness from activity.",
        size=15.2, color=INK, line=1.28)
    txt(s, 0.80, 5.02, 6.9, 0.24,
        "React 19  ·  Dexie / IndexedDB  ·  OpenRouter", size=10.5, color=MUTED)

    # the loop, as four words rather than a diagram
    words = [("Plan", SKY, SKY_SOFT), ("Learn", INDIGO, INDIGO_SOFT),
             ("Practise", AMBER, AMBER_SOFT), ("Improve", MINT, MINT_SOFT)]
    for i, (word, col, tint) in enumerate(words):
        x = 0.80 + i * 1.52
        pill(s, x, 5.50, 1.34, 0.38, word, fill=tint, color=col, size=10.5)
        if i < 3:
            arr(s, x + 1.37, 5.69, x + 1.50, 5.69, color=FAINT, width=1.2)
    txt(s, 0.80, 6.04, 5.6, 0.22, "the same records show what to revisit",
        size=9, color=MUTED, italic=True)

    txt(s, 0.80, 6.50, 6.9, 0.26, "Live demo  ·  study-mapper.vercel.app",
        size=11.5, color=INDIGO, bold=True)

    # team card
    card(s, 8.28, 0.98, 4.36, 3.48, fill=WHITE, line=EDGE, radius=0.05)
    lab(s, 8.52, 1.14, 2.0, "Team", color=INDIGO, size=9)
    txt(s, 10.9, 1.14, 1.5, 0.2, "5 MEMBERS", size=8, color=MUTED,
        bold=True, align=PP_ALIGN.RIGHT)
    txt(s, 8.52, 1.47, 2.3, 0.18, "NAME", size=7.5, color=MUTED, bold=True)
    txt(s, 10.75, 1.47, 1.62, 0.18, "ROLL NO", size=7.5, color=MUTED,
        bold=True, align=PP_ALIGN.RIGHT)
    rect(s, 8.52, 1.70, 3.86, 0.008, fill=EDGE)

    people = [
        ("P. Venubhaskar", "252G5A0520"),
        ("T. Vasanth", "252G5A0528"),
        ("V. Adarsh Kumar", "252G5A0532"),
        ("B. Sai Vikas", "252G5A0501"),
        ("C. Narendra", "252G5A0502"),
    ]
    for i, (name, roll) in enumerate(people):
        y = 1.82 + i * 0.48
        txt(s, 8.52, y, 2.4, 0.24, name, size=12.2, color=INK, bold=True)
        txt(s, 10.55, y + 0.02, 1.82, 0.22, roll, size=9.8, color=BODY,
            align=PP_ALIGN.RIGHT)
        if i < 4:
            rect(s, 8.52, y + 0.38, 3.86, 0.006, fill=EDGE)
    txt(s, 8.52, 4.16, 3.86, 0.18, "Batch 4  ·  Department of CSE", size=8,
        color=MUTED)

    # guide
    card(s, 8.28, 4.62, 4.36, 0.90, fill=WHITE, line=EDGE, radius=0.05)
    lab(s, 8.52, 4.74, 2.0, "Guide", color=INDIGO, size=8.5)
    txt(s, 8.52, 4.95, 3.9, 0.28, "Ms. C. Sravani", size=14, color=INK, bold=True)

    # department + institution
    card(s, 8.28, 5.68, 4.36, 1.22, fill=WHITE, line=EDGE, radius=0.05)
    lab(s, 8.52, 5.79, 3.6, "Department & institution", color=INDIGO, size=8.2)
    txt(s, 8.52, 5.99, 3.86, 0.24, "Computer Science & Engineering",
        size=10.8, color=INK, bold=True)
    txt(s, 8.52, 6.26, 3.86, 0.50,
        "Anantha Lakshmi Institute of Technology & Sciences (Autonomous)",
        size=8.8, color=MUTED, line=1.18)

    notes(s, "Open with the product, not the stack. StudyMapper turns a syllabus into a plan, then measures what the student gets wrong so the next session can focus there. The four words at the bottom are the whole system: plan, learn, practise, improve, and the records show what to revisit. The team and roll numbers are on screen for the record, so do not read them aloud. Set the evidence standard now: every claim in the next twelve slides is checked against the repository or the running app.")


# ---------------------------------------------------------------- 02 agenda
def slide_02(prs):
    s = base(prs, 2, "01 · Agenda", "Thirteen sections, four moves",
             "Frame the problem, design the system, prove it, then close.", 33)

    cols = [
        ("SET THE STAGE", "01–04", SKY, SKY_SOFT, [
            ("01", "Title", "project, team, guide"),
            ("02", "Agenda", "the route through 13"),
            ("03", "Abstract & Motivation", "why it exists"),
            ("04", "Problem Statement", "what is broken"),
        ], "Why does it exist?"),
        ("AIM & DESIGN", "05–07", INDIGO, INDIGO_SOFT, [
            ("05", "Project Objectives", "what it must do"),
            ("06", "Literature Survey", "what others miss"),
            ("07", "System Architecture", "how the parts connect"),
        ], "What should it do?"),
        ("BUILD & PROVE", "08–10", AMBER, AMBER_SOFT, [
            ("08", "Methodology & Algorithm", "how it decides"),
            ("09", "Implementation Details", "what it runs on"),
            ("10", "Results & Analysis", "what is verified"),
        ], "How is it built and checked?"),
        ("CLOSE", "11–13", MINT, MINT_SOFT, [
            ("11", "Conclusion", "what it contributes"),
            ("12", "Future Scope", "what comes next"),
            ("13", "References", "what it rests on"),
        ], "What does it mean?"),
    ]
    for i, (name, rng, col, tint, items, question) in enumerate(cols):
        x = MX + i * 3.04
        card(s, x, 1.90, 2.86, 4.66, fill=WHITE, line=EDGE, radius=0.05)
        rect(s, x, 1.90, 2.86, 0.07, fill=col, radius=0.05)
        lab(s, x + 0.20, 2.08, 1.8, name, color=col, size=8.8)
        txt(s, x + 1.9, 2.08, 0.76, 0.18, rng, size=7.5, color=MUTED,
            bold=True, align=PP_ALIGN.RIGHT)
        step = 3.55 / len(items)
        for j, (num, title, sub) in enumerate(items):
            y = 2.50 + j * step
            num_badge(s, x + 0.20, y + 0.02, 0.32, num, color=col, fill=tint, size=8.2)
            txt(s, x + 0.60, y - 0.02, 2.14, 0.44, title, size=11.9, color=INK,
                bold=True, line=1.0)
            txt(s, x + 0.60, y + 0.38, 2.14, 0.20, sub, size=8.4, color=MUTED)
        txt(s, x + 0.20, 6.12, 2.45, 0.22, question, size=8.8, color=col,
            italic=True, bold=True)

    txt(s, MX, 6.76, 11.9, 0.22,
        "About twelve minutes, then questions. Every slide has one job.",
        size=10.5, color=MUTED)

    notes(s, "Use this as a map, not a list. The four columns are the four moves: frame the problem, decide what the system should do, build and prove it, then close. Point out that the agenda is deliberately uneven in length because the design and evidence sections carry the argument. Do not read the thirteen titles aloud. Say the deck is short enough to leave time for questions.")


# ---------------------------------------------------------------- 03 abstract
def slide_03(prs):
    s = base(prs, 3, "02 · Abstract & Motivation", "From syllabus to next action",
             "Four screens from the running build — the same records feed every one of them.", 33)

    txt(s, 8.6, 1.70, 4.03, 0.18, "RUNNING BUILD  ·  1440 × 900", size=7.5,
        color=MUTED, bold=True, align=PP_ALIGN.RIGHT)

    shots = [
        ("assets/shot_dashboard10.png", "Dashboard", "subjects + question banks", INDIGO),
        ("assets/roadmap-light.png", "Skill roadmap", "91 roadmaps, progress saved", SKY),
        ("assets/coding-light.png", "Coding practice", "Python runs in the browser", MINT),
        ("assets/placement-light.png", "Placement prep", "aptitude, technical, HR", AMBER),
    ]
    for i, (path, title, sub, col) in enumerate(shots):
        shot_card(s, path, MX + i * 3.01, 1.94, 2.90, 1.74, title, sub, accent=col)

    card(s, MX, 4.50, 11.93, 0.80, fill=WHITE, line=EDGE, radius=0.05)
    rect(s, MX, 4.50, 0.07, 0.80, fill=INDIGO, radius=0.05)
    txt(s, 0.95, 4.60, 2.2, 0.20, "THE QUESTION", size=8, color=INDIGO, bold=True)
    txt(s, 0.95, 4.79, 11.2, 0.40,
        "Can a student's own activity produce the next study plan?",
        size=21, color=INK, bold=True)

    motives = [
        ("One workspace", "Notes, deadlines, tests and progress stop living in different apps.", SKY, SKY_SOFT),
        ("Evidence, not guesswork", "Study activity updates a weakness score that shows what to revisit next.", INDIGO, INDIGO_SOFT),
        ("Works offline", "The core loop runs in the browser; AI and sign-in are optional.", MINT, MINT_SOFT),
    ]
    for i, (title, desc, col, tint) in enumerate(motives):
        x = MX + i * 4.04
        card(s, x, 5.55, 3.85, 1.20, fill=WHITE, line=EDGE, radius=0.05)
        rect(s, x + 0.18, 5.70, 0.10, 0.10, fill=col, radius=0.5)
        txt(s, x + 0.36, 5.63, 3.3, 0.24, title, size=12.4, color=INK, bold=True)
        txt(s, x + 0.36, 5.90, 3.30, 0.72, desc, size=9.4, color=MUTED, line=1.18)

    notes(s, "This is the product in one slide. The dashboard is the home base: subjects, question banks, progress, focus timer. The roadmap is a separate library of 91 roadmaps. Coding practice generates Python problems and runs them in the browser through Pyodide. Placement prep splits aptitude, technical and HR. The point is not the feature count; it is that all four screens read and write the same local record. End on the question: can the student's own activity shape the next plan? The honest answer is partial — activity produces a weakness score, and the plan can be regenerated on demand.")


# ---------------------------------------------------------------- 04 problem
def slide_04(prs):
    s = base(prs, 4, "03 · Problem Statement", "The gap is response, not content",
             "Students do not lack material. They lack a system that reacts to their week.", 33)

    problems = [
        ("01", "Fragmented tools", "Notes, deadlines, tests and progress live in different apps, so context is rebuilt every day.", "4 apps", ROSE, ROSE_SOFT),
        ("02", "Static plans", "One plan is made once and survives every missed week, whatever the topic's difficulty.", "1 plan", AMBER, AMBER_SOFT),
        ("03", "Late feedback", "Mistakes surface at the exam, not during practice, so the next study session cannot respond.", "exam day", ROSE, ROSE_SOFT),
    ]
    for i, (num, title, desc, tag, col, tint) in enumerate(problems):
        y = 1.92 + i * 1.36
        card(s, MX, y, 7.30, 1.20, fill=WHITE, line=EDGE, radius=0.05)
        num_badge(s, 0.92, y + 0.18, 0.38, num, color=col, fill=tint, size=9)
        txt(s, 1.44, y + 0.12, 5.0, 0.26, title, size=15.5, color=INK, bold=True)
        txt(s, 1.44, y + 0.43, 5.45, 0.66, desc, size=10.6, color=MUTED, line=1.18)
        pill(s, 6.32, y + 0.16, 1.48, 0.30, tag, fill=tint, color=col, size=8.2)

    # fragmented-week diagram
    card(s, 8.30, 1.92, 4.33, 3.92, fill=WHITE, line=EDGE, radius=0.05)
    lab(s, 8.54, 2.08, 3.2, "Today's study week", color=ROSE, size=8.8)
    txt(s, 8.54, 2.30, 3.8, 0.20, "four tools, no shared record", size=8.8, color=MUTED)

    tools = [("Notes", 8.54, 2.62), ("Calendar", 10.42, 2.62),
             ("Tests", 8.54, 3.60), ("Videos", 10.42, 3.60)]
    for name, x, y in tools:
        rect(s, x, y, 1.66, 0.78, fill=WASH, line=EDGE_2, radius=0.10)
        txt(s, x, y + 0.28, 1.66, 0.22, name, size=10, color=BODY, bold=True,
            align=PP_ALIGN.CENTER)
    cx, cy = 10.26, 3.50
    circle(s, cx - 0.25, cy - 0.25, 0.50, fill=ROSE_SOFT, text="?", tcolor=ROSE, size=14)
    for x1, y1, x2, y2 in ((10.20, 3.05, 10.02, 3.40),
                           (10.42, 3.05, 10.50, 3.40),
                           (10.20, 3.95, 10.02, 3.60),
                           (10.42, 3.95, 10.50, 3.60)):
        arr(s, x1, y1, x2, y2, color=ROSE, width=1.0,
              dash=MSO_LINE_DASH_STYLE.DASH)

    txt(s, 8.54, 4.55, 3.86, 0.44,
        "No shared record — context is lost at every switch.",
        size=10, color=ROSE_DK, bold=True, line=1.18)
    rect(s, 8.54, 5.04, 3.86, 0.62, fill=ROSE_SOFT, line=None, radius=0.08)
    txt(s, 8.70, 5.11, 3.60, 0.26, "4 tools  ·  0 shared records", size=13.2,
        color=ROSE_DK, bold=True)
    txt(s, 8.70, 5.37, 3.55, 0.18, "the week cannot compound", size=7.6,
        color=ROSE)

    card(s, MX, 6.02, 11.93, 0.68, fill=WHITE, line=EDGE, radius=0.05)
    rect(s, MX, 6.02, 0.07, 0.68, fill=ROSE, radius=0.05)
    txt(s, 0.96, 6.12, 4.0, 0.20, "THE CONSEQUENCE", size=7.8, color=ROSE, bold=True)
    txt(s, 0.96, 6.31, 11.0, 0.30,
        "The same hours are spent on every topic, and the plan never learns from the week.",
        size=13.2, color=INK, bold=True)

    notes(s, "Frame the problem in student terms before any technology. Three failures: context is lost when tools are separate, a plan made once ignores difficulty and slipping dates, and feedback arrives after the exam. The diagram on the right is deliberately simple: four tools with no shared record. The consequence line is the one to land: the plan never learns from the week. Do not mention the solution yet; slide 5 is the response.")


# ---------------------------------------------------------------- 05 objectives
def slide_05(prs):
    s = base(prs, 5, "04 · Project Objectives", "Make the whole week one system",
             "Four goals, one test: a student can run a full study week inside one app.", 33)

    goals = [
        ("01", "A plan that recomputes", "Build the schedule from the exam date, topic difficulty and available days — then compress it in panic mode.", "exam date + difficulty + panic mode", INDIGO, INDIGO_SOFT),
        ("02", "Material on demand", "Generate notes, diagrams, question banks and model answers that the student can edit, not opaque output.", "editable, source-linked", SKY, SKY_SOFT),
        ("03", "Practice that measures", "Turn stored study events into a 0–100 weakness score rather than a single mark at the end.", "events → weakness", AMBER, AMBER_SOFT),
        ("04", "One local record", "Keep the study loop in the browser: no server required, AI optional, identity optional.", "Dexie · offline", MINT, MINT_SOFT),
    ]
    for i, (num, title, desc, how, col, tint) in enumerate(goals):
        x = MX + i * 3.04
        card(s, x, 1.92, 2.86, 2.24, fill=WHITE, line=EDGE, radius=0.05)
        num_badge(s, x + 0.20, 2.08, 0.38, num, color=col, fill=tint, size=9)
        txt(s, x + 0.20, 2.60, 2.45, 0.54, title, size=14.2, color=INK, bold=True, line=1.02)
        txt(s, x + 0.20, 3.14, 2.46, 0.72, desc, size=9.4, color=MUTED, line=1.18)
        txt(s, x + 0.20, 3.88, 2.46, 0.20, how, size=7.8, color=col, bold=True, italic=True)

    # scope
    card(s, MX, 4.42, 7.40, 2.10, fill=WHITE, line=EDGE, radius=0.05)
    lab(s, 0.92, 4.56, 2.6, "In scope", color=MINT_DK, size=8.8)
    txt(s, 0.92, 4.76, 6.8, 0.20, "what this build actually does", size=8.4, color=MUTED)
    in_scope = ["Adaptive planner", "Generated notes & questions", "Mock exams",
                "Coding practice", "Weakness analytics", "Offline study"]
    for i, item in enumerate(in_scope):
        x = 0.92 + (i % 3) * 2.38
        y = 5.08 + (i // 3) * 0.52
        pill(s, x, y, 2.24, 0.36, item, fill=MINT_SOFT, color=MINT_DK, size=8.4)
    txt(s, 0.92, 6.16, 6.7, 0.22, "One test: a full study week without leaving the app.",
        size=9.4, color=MINT_DK, bold=True, italic=True)

    card(s, 8.30, 4.42, 4.33, 2.10, fill=WASH, line=EDGE, radius=0.05)
    lab(s, 8.52, 4.56, 3.4, "Out of scope", color=MUTED, size=8.8)
    txt(s, 8.52, 4.76, 3.8, 0.20, "scope decisions, not missing pieces", size=8.4, color=MUTED)
    out_scope = ["Institutional timetabling", "Proctored exams", "Teacher dashboard",
                 "Native mobile app", "Cross-device sync"]
    for i, item in enumerate(out_scope):
        y = 5.06 + i * 0.28
        txt(s, 8.52, y, 3.8, 0.20, "·  " + item, size=9.2, color=BODY)

    notes(s, "Read the objectives as the direct response to the three failures. One: the plan is generated from the exam date, topic difficulty and available days, and compressed in panic mode — not made once. Two: generated material is editable, so the student stays in charge. Three: practice is where measurement happens — stored study events feed the weakness score, while flashcards follow SM-2. Four: all of it lives in one local record, so the app survives a bad connection. The scope panels matter: timetabling, proctoring, a teacher dashboard, a native app and sync are decisions, not gaps.")


# ---------------------------------------------------------------- 06 literature
def slide_06(prs):
    s = base(prs, 6, "05 · Literature Survey", "Five approaches, one missing loop",
             "Each category solves part of the problem. None closes the loop for one student.", 33)

    approaches = [
        ("01", "Adaptive platforms", "Sequence content by mastery and difficulty.", "Rarely react to one student's week.", INDIGO, INDIGO_SOFT),
        ("02", "AI tutors", "Generate explanations and practice on demand.", "Cloud-only, disconnected from stored work.", SKY, SKY_SOFT),
        ("03", "LMS analytics", "Track cohort performance and completion.", "Serve the institution, not the individual plan.", AMBER, AMBER_SOFT),
        ("04", "Spaced repetition", "Schedule review at the edge of recall.", "Isolated from syllabus, notes and practice.", MINT, MINT_SOFT),
        ("05", "Gamified apps", "Sustain daily habit with streaks and rewards.", "Reward activity, not understanding.", VIOLET, VIOLET_SOFT),
    ]
    for i, (num, name, well, miss, col, tint) in enumerate(approaches):
        x = MX + (i % 3) * 4.05
        y = 1.90 + (i // 3) * 2.14
        card(s, x, y, 3.85, 1.98, fill=WHITE, line=EDGE, radius=0.05)
        num_badge(s, x + 0.20, y + 0.18, 0.34, num, color=col, fill=tint, size=8.4)
        txt(s, x + 0.64, y + 0.16, 3.0, 0.26, name, size=13.6, color=INK, bold=True)
        txt(s, x + 0.20, y + 0.62, 3.4, 0.18, "DOES WELL", size=7.2, color=MINT_DK, bold=True)
        txt(s, x + 0.20, y + 0.80, 3.45, 0.40, well, size=9.8, color=BODY, line=1.16)
        txt(s, x + 0.20, y + 1.26, 3.4, 0.18, "MISSES", size=7.2, color=ROSE, bold=True)
        txt(s, x + 0.20, y + 1.44, 3.45, 0.40, miss, size=9.8, color=ROSE_DK, line=1.16)

    # gap card
    x, y = MX + 2 * 4.05, 1.90 + 2.14
    grad(s, x, y, 3.85, 1.98, INDIGO, VIOLET, angle=35, radius=0.05)
    txt(s, x + 0.22, y + 0.20, 3.3, 0.20, "THE GAP", size=8.2, color=WHITE, bold=True)
    txt(s, x + 0.22, y + 0.46, 3.42, 1.10,
        "No category combines planning, generation, measurement and offline study for one learner.",
        size=13.2, color=WHITE, bold=True, line=1.16)
    txt(s, x + 0.22, y + 1.62, 3.4, 0.20, "that is the space StudyMapper fills",
        size=8.2, color=WHITE, italic=True)

    txt(s, MX, 6.28, 11.9, 0.22,
        "Design comparison, not a systematic review. No effectiveness claim is attributed to any category.",
        size=9.2, color=MUTED, italic=True)

    notes(s, "Do not read the grid cell by cell; pick the contrast. Adaptive platforms sequence content well but rarely react to one student's week. AI tutors generate well but are usually cloud-only and disconnected from stored data. LMS analytics serve the institution. Spaced repetition is excellent but isolated from the syllabus and practice. Gamified apps sustain habit but reward activity, not understanding. The gradient card is the sentence to land: the missing combination is planning, generation, measurement and offline study for one learner. Say plainly that this is a design comparison, not a systematic literature review.")


# ---------------------------------------------------------------- 07 architecture
def slide_07(prs):
    s = base(prs, 7, "06 · System Architecture", "Every screen, one local core",
             "The interface, the rules and the record — with AI and identity as optional edges.", 33)

    card(s, 0.60, 1.86, 12.15, 4.30, fill=CANVAS, line=EDGE, radius=0.04)

    # column 1: interface
    lab(s, 0.85, 2.00, 3.0, "1 · Interface", color=SKY_DEEP, size=9)
    txt(s, 0.85, 2.19, 3.2, 0.18, "React 19 SPA  ·  46 routes", size=8, color=MUTED)
    screens = ["Dashboard", "Study Planner", "Subjects & Topics", "Question Banks",
               "Mock Exams", "Flashcards", "Coding Practice", "Skill Roadmap",
               "Placement Prep", "Analytics"]
    for i, name in enumerate(screens):
        x = 0.85 + (i % 2) * 1.95
        y = 2.45 + (i // 2) * 0.51
        chip(s, x, y, 1.82, 0.42, name, fill=WHITE, color=INK, size=8.6,
             line=EDGE_2, radius=0.14)

    # column 2: domain
    lab(s, 5.25, 2.00, 3.2, "2 · Domain logic", color=INDIGO, size=9)
    txt(s, 5.25, 2.19, 3.2, 0.18, "local rules  ·  no server", size=8, color=MUTED)
    engines = [
        ("Adaptive Planner", "exam date · difficulty · panic mode", INDIGO),
        ("Weakness Detector", "0–100 · last 7 days", ROSE),
        ("SM-2 Scheduler", "interval × ease factor", SKY),
        ("Gamification", "XP · levels · streaks", AMBER),
        ("AI Orchestrator", "6-model fallback · JSON repair", VIOLET),
        ("File Parser", "PDF · DOCX · OCR", MINT),
    ]
    for i, (name, sub, col) in enumerate(engines):
        y = 2.45 + i * 0.47
        rect(s, 5.35, y, 3.15, 0.40, fill=WHITE, line=EDGE_2, radius=0.10)
        rect(s, 5.35, y + 0.06, 0.045, 0.27, fill=col)
        txt(s, 5.48, y + 0.025, 2.0, 0.18, name, size=8.4, color=INK, bold=True)
        txt(s, 5.48, y + 0.19, 2.9, 0.16, sub, size=6.7, color=MUTED)

    # column 3: data
    lab(s, 9.10, 2.00, 3.2, "3 · Local data", color=MINT_DK, size=9)
    txt(s, 9.10, 2.19, 3.3, 0.18, "Dexie / IndexedDB  ·  offline", size=8, color=MUTED)
    rect(s, 9.15, 2.45, 3.25, 0.98, fill=WHITE, line=EDGE_2, radius=0.08)
    txt(s, 9.33, 2.50, 1.1, 0.52, "40", size=27, color=MINT_DK, bold=True)
    txt(s, 10.10, 2.57, 2.1, 0.22, "tables", size=12, color=INK, bold=True)
    txt(s, 10.10, 2.82, 2.15, 0.20, "one local database", size=7.8, color=MUTED)
    txt(s, 9.33, 3.05, 2.9, 0.20, "no server in the study loop", size=7.6, color=MINT_DK, italic=True)
    clusters = ["Curriculum", "Practice", "Planning", "Progress"]
    for i, name in enumerate(clusters):
        x = 9.15 + (i % 2) * 1.65
        y = 3.62 + (i // 2) * 0.50
        chip(s, x, y, 1.52, 0.38, name, fill=MINT_SOFT, color=MINT_DK, size=8.2,
             line=None, radius=0.14)
    txt(s, 9.15, 4.70, 3.2, 0.36, "Every module reads and writes the same store.",
        size=8.6, color=MUTED, line=1.15)

    # interaction arrows
    arr(s, 4.67, 2.92, 5.28, 2.92, color=INDIGO, width=1.4)
    txt(s, 4.63, 2.72, 0.75, 0.16, "actions", size=6.8, color=INDIGO, bold=True)
    arr(s, 5.28, 4.14, 4.67, 4.14, color=MINT_DK, width=1.4)
    txt(s, 4.58, 4.18, 0.95, 0.16, "next action", size=6.8, color=MINT_DK, bold=True)
    arr(s, 8.52, 2.92, 9.12, 2.92, color=INDIGO, width=1.4)
    txt(s, 8.50, 2.72, 0.55, 0.16, "write", size=6.8, color=INDIGO, bold=True)
    arr(s, 9.12, 4.14, 8.52, 4.14, color=MINT_DK, width=1.4)
    txt(s, 8.58, 4.18, 0.55, 0.16, "read", size=6.8, color=MINT_DK, bold=True)

    # core loop strip
    rect(s, 0.85, 5.40, 11.65, 0.60, fill=WASH, line=EDGE, radius=0.08)
    lab(s, 1.00, 5.53, 0.9, "Core loop", color=INDIGO, size=7.2)
    loop = ["Plan", "Study", "Attempt", "Score", "Re-plan"]
    for i, name in enumerate(loop):
        x = 1.78 + i * 1.94
        pill(s, x, 5.52, 1.55, 0.34, name, fill=WHITE, color=INK, size=9.2,
             line=EDGE_2)
        if i < 4:
            arr(s, x + 1.58, 5.69, x + 1.90, 5.69, color=INDIGO, width=1.2)
    txt(s, 11.55, 5.52, 0.75, 0.34, "↺", size=17, color=INDIGO, bold=True)
    txt(s, 11.25, 5.78, 1.05, 0.16, "repeats", size=6.8, color=MUTED,
        align=PP_ALIGN.RIGHT)

    # external strip
    txt(s, 0.62, 6.44, 1.75, 0.20, "OPTIONAL / EXTERNAL", size=7.2, color=AMBER_DK, bold=True)
    ext = [("OpenRouter · 6-model fallback", 2.28, 2.55, True),
           ("Firebase Auth · optional", 4.93, 2.30, True),
           ("Pyodide · Python in browser", 7.33, 2.45, False),
           ("Mermaid + KaTeX", 9.88, 1.85, False)]
    for text, x, w, dashed in ext:
        shp = chip(s, x, 6.37, w, 0.32, text, fill=WHITE, color=BODY, size=7.6,
                   line=AMBER if dashed else EDGE_2, radius=0.5)
        if dashed:
            shp.line.dash_style = MSO_LINE_DASH_STYLE.DASH
    txt(s, 11.85, 6.44, 0.9, 0.18, "dashed = network", size=6.2, color=MUTED,
        align=PP_ALIGN.RIGHT)

    notes(s, "Walk the diagram left to right. The interface is ordinary React with 46 routed views. The domain column is the product: the planner, the weakness detector, the SM-2 scheduler, gamification, the AI orchestrator and the file parser. Every one of those rules runs locally. The planner reads the exam date, topic difficulty and panic mode; the weakness detector reads the last seven days of analytics; SM-2 schedules flashcards. They share the store but stay separate. The data column is the foundation: 40 Dexie tables over IndexedDB, grouped into curriculum, practice, planning and progress. The arrows matter: actions go right, next actions come back, and every module reads and writes the same store. The core loop is plan, study, attempt, score, re-plan. AI and identity sit outside the canvas because they are optional; the app still studies without them.")


if __name__ == "__main__":
    print("slides 1-7 module")
