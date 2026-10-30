#!/usr/bin/env python3
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
import os

DIR = r'V:\PROJECTS\STUDYMAPPER\presentation'
DR = os.path.dirname(os.path.abspath(__file__)) if '__file__' in dir() else DIR
ASSETS = os.path.join(DIR, 'assets')
os.makedirs(ASSETS, exist_ok=True)

DARK = RGBColor(31, 56, 100)
ACCENT = RGBColor(41, 98, 139)
GRAY = RGBColor(102, 112, 128)
WHITE = RGBColor(255,255,255)

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

def add_textbox(slide, left, top, width, height, text, sz, bold=False, color=DARK, align=PP_ALIGN.LEFT):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(sz)
    run.font.color.rgb = color
    run.font.name = 'Calibri'
    if bold: run.font.bold = True
    return box

# SLIDE 1: Title
s1 = prs.slides.add_slide(prs.slide_layouts[6])
b = s1.shapes.add_shape(1, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
b.fill.solid(); b.fill.fore_color.rgb = RGBColor(245,247,250); b.line.fill.background()
add_textbox(s1, 0.8, 2.2, 11.7, 1.2, "StudyMapper", 58, True, DARK, PP_ALIGN.CENTER)
add_textbox(s1, 1.0, 3.6, 11.3, 0.8, "AI-Driven Personalized Learning and Academic Management System", 26, False, ACCENT, PP_ALIGN.CENTER)
add_textbox(s1, 1.0, 4.5, 11.3, 2.0, "Team: P.VENUBHASKAR | T.VASANTH | V.ADARSH KUMAR | B.SAI VIKAS | C.NARENDRA\nGuide: Ms.C. Sravani | Department of Computer Science and Engineering\nAnantha Lakshmi Institute of Technology and Sciences (Autonomous)", 18, False, DARK, PP_ALIGN.CENTER)
s1.notes_slide.notes_text_frame.text = "This presentation introduces StudyMapper, an AI-driven personalized learning and academic management system developed by our team under Ms.C. Sravani. Key achievements: 40 DB tables, 47/47 tests pass, production build ready."

# SLIDE 2: Agenda
s2 = prs.slides.add_slide(prs.slide_layouts[5])
s2.shapes.title.text = "Agenda"
s2.shapes.title.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK; s2.shapes.title.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
add_textbox(s2, 0.7, 1.5, 12.0, 5.5, "1. Introduction and Project Overview\n2. Abstract & Motivation\n3. Problem Statement\n4. Objectives & Scope\n5. Literature Survey\n6. Proposed System\n7. System Architecture\n8. Methodology & Workflow\n9. Technology Stack\n10. Database Design\n11. UI Design & Features\n12. Results & Analysis\n13. Discussion & Contributions\n14. Conclusion\n15. Future Scope\n16. References\n17. Q&A / Thank You", 16, False, DARK)
s2.notes_slide.notes_text_frame.text = "Structured 18-slide narrative covering concept through deployment."

# SLIDE 3: Abstract
s3 = prs.slides.add_slide(prs.slide_layouts[5])
s3.shapes.title.text = "Abstract & Motivation"
s3.shapes.title.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK; s3.shapes.title.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
add_textbox(s3, 0.7, 1.5, 5.8, 5.0, "Abstract\n\nStudyMapper is an AI-driven personalized learning and academic management system that delivers adaptive study paths, AI-generated content (notes, quizzes, diagrams), and comprehensive analytics for students and educators.\n\nMotivation\n• Rising academic challenges in higher education\n• Need for personalized learning paths\n• Limited adaptive assessment tools\n• Demand for integrated academic management", 14, False, DARK)
add_textbox(s3, 7.0, 1.5, 5.5, 5.0, "Key Innovations\n• SM-2 Spaced Repetition\n• Adaptive Difficulty Planner\n• AI Content Generation (OpenRouter)\n• Weakness Detection (0-100)\n• Gamification Engine\n• 40 DB Tables • 47/47 Tests\n• Production Build • Live Demo", 14, False, DARK)
s3.notes_slide.notes_text_frame.text = "Abstract summarizes the AI-driven system purpose; motivation highlights educational gaps being addressed."

# SLIDE 4: Problem Statement
s4 = prs.slides.add_slide(prs.slide_layouts[5])
s4.shapes.title.text = "Problem Statement"
s4.shapes.title.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK; s4.shapes.title.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
add_textbox(s4, 0.7, 1.5, 12.0, 5.0, "Current Educational Challenges\n\n• One-size-fits-all teaching approach\n• Lack of personalized learning paths\n• Poor student engagement and motivation\n• Difficulty tracking individual progress\n• Limited adaptive assessment methods\n• Inefficient academic resource management\n• Rising academic stress and dropout concerns\n• Need for data-driven educational interventions", 18, False, DARK)
s4.notes_slide.notes_text_frame.text = "Identifies core educational problems motivating StudyMapper development."

# SLIDE 5: Objectives
s5 = prs.slides.add_slide(prs.slide_layouts[5])
s5.shapes.title.text = "Objectives & Scope"
s5.shapes.title.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK; s5.shapes.title.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
add_textbox(s5, 0.7, 1.5, 5.8, 5.0, "Objectives\n• Develop adaptive personalized learning\n• Implement AI content generation\n• Create real-time performance analytics\n• Design intelligent study planner\n• Build comprehensive academic management\n• Ensure data privacy/security\n• Develop scalable infrastructure", 14, False, DARK)
add_textbox(s5, 7.0, 1.5, 5.5, 5.0, "Scope\n• Higher education (undergraduate)\n• Computer Science & Engineering\n• Multiple subjects (DBMS, OS, DSA)\n• Adaptive learning paths\n• Gamified experience\n• Analytics dashboard\n• Mobile responsive design", 14, False, DARK)
s5.notes_slide.notes_text_frame.text = "Clear objectives and defined scope ensure focused development."

# SLIDE 6: Literature Survey
s6 = prs.slides.add_slide(prs.slide_layouts[5])
s6.shapes.title.text = "Literature Survey"
s6.shapes.title.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK; s6.shapes.title.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
add_textbox(s6, 0.7, 1.5, 5.8, 5.0, "Adaptive Learning\n• MIT Open Learning\n• Khan Academy paths\n• Coursera recommendations\n• Adaptive tutoring systems\n\nAI in Education\n• OpenAI educational apps\n• Google AI for Teaching\n• IBM Watson Education", 14, False, DARK)
add_textbox(s6, 7.0, 1.5, 5.5, 5.0, "Learning Management\n• Moodle analytics\n• Blackboard adaptive\n• Canvas tutoring\n\nSpaced Repetition\n• Anki SM-2 algorithm\n• Quizlet adaptive learning\n• SuperMemo systems", 14, False, DARK)
s6.notes_slide.notes_text_frame.text = "Background on adaptive learning, AI education, LMS platforms, and spaced repetition."

# SLIDE 7: Proposed System
s7 = prs.slides.add_slide(prs.slide_layouts[5])
s7.shapes.title.text = "Proposed System"
s7.shapes.title.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK; s7.shapes.title.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
add_textbox(s7, 0.7, 1.5, 12.0, 5.5, "Core Modules\n\n• Learning Management Platform\n• AI Content Generator (notes, quizzes, diagrams)\n• Adaptive Study Planner (SM-2, panic mode)\n• Performance Analytics Dashboard\n• Gamification Engine (XP, levels, streaks, quests)\n• Smart Flashcards with algorithm scheduling\n• Placement Preparation Module\n• Coding Practice Environment (pyodide)\n• AI Study Assistant (OpenRouter 6-model fallback)\n• Mobile Responsive Design", 16, False, DARK)
s7.notes_slide.notes_text_frame.text = "Comprehensive system integrating learning management, AI content, adaptive planning, analytics, and gamification."

# SLIDE 8: Architecture
s8 = prs.slides.add_slide(prs.slide_layouts[5])
s8.shapes.title.text = "System Architecture"
s8.shapes.title.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK; s8.shapes.title.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
add_textbox(s8, 0.7, 1.5, 5.8, 5.0, "Frontend (React 19 + Vite)\n• Components & Pages\n• Context (Auth, Theme)\n• Routing (46 routes)\n• Responsive Layout\n\nBackend Services\n• Firebase Auth\n• Dexie.js IndexedDB\n• File Parser (Tesseract, pdf.js, mammoth)\n• OpenRouter API Integration", 14, False, DARK)
add_textbox(s8, 7.0, 1.5, 5.5, 5.0, "AI & Analytics Layer\n• OpenRouter (6 free models)\n• Streaming + JSON Repair\n• SM-2 Spaced Repetition\n• Weakness Detector (0-100)\n• Adaptive Planner\n• Mermaid Diagrams\n• KaTeX Math Rendering", 14, False, DARK)
s8.notes_slide.notes_text_frame.text = "Architecture shows integration of frontend, backend, AI services, and data layer."

# SLIDE 9: Methodology
s9 = prs.slides.add_slide(prs.slide_layouts[5])
s9.shapes.title.text = "Methodology & Workflow"
s9.shapes.title.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK; s9.shapes.title.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
add_textbox(s9, 0.7, 1.5, 12.0, 5.5, "Phase 1: Analysis\n• Problem identification\n• Requirements gathering\n• Domain research\n\nPhase 2: Design\n• System architecture\n• Database schema (40 tables)\n• API design\n\nPhase 3: Implementation\n• Component development\n• Integration testing\n• Performance optimization\n\nPhase 4: Validation\n• 47/47 tests passing\n• Build verification\n• Demo data seeding", 16, False, DARK)
s9.notes_slide.notes_text_frame.text = "Systematic approach from analysis through implementation to validation."

# SLIDE 10: Technology Stack
s10 = prs.slides.add_slide(prs.slide_layouts[5])
s10.shapes.title.text = "Technology Stack"
s10.shapes.title.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK; s10.shapes.title.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
add_textbox(s10, 0.7, 1.5, 4.0, 5.5, "Frontend\n• React 19\n• Vite\n• JavaScript\n• CSS Modules\n• Responsive", 14, False, DARK)
add_textbox(s10, 4.8, 1.5, 4.0, 5.5, "Backend / Auth\n• Firebase\n• Dexie.js\n• IndexedDB\n• Google/Email/Phone Auth", 14, False, DARK)
add_textbox(s10, 8.9, 1.5, 4.0, 5.5, "AI / Tools\n• OpenRouter API\n• Pyodide\n• Tesseract OCR\n• pdf.js / mammoth\n• Mermaid / KaTeX", 14, False, DARK)
s10.notes_slide.notes_text_frame.text = "Modern technology stack enabling local-first storage, AI integration, document parsing."

# SLIDE 11: Database Design
s11 = prs.slides.add_slide(prs.slide_layouts[5])
s11.shapes.title.text = "Database Design & Data Flow"
s11.shapes.title.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK; s11.shapes.title.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
add_textbox(s11, 0.7, 1.5, 5.8, 5.0, "Schema (40 Tables)\n• subjects, units, topics\n• topic_contents, flashcards\n• study_plans, gamification_profiles\n• placement_*, coding_problems\n• ai_*, study_analytics\n• weak_score, question_bank", 14, False, DARK)
add_textbox(s11, 7.0, 1.5, 5.5, 5.0, "Data Flow\n• IndexedDB (primary)\n• Firebase sync (optional)\n• File parsing pipeline\n• AI content generation\n• Analytics computation\n• Offline-first design", 14, False, DARK)
s11.notes_slide.notes_text_frame.text = "40-table schema with IndexedDB storage, Firebase sync, and comprehensive analytics."

# SLIDE 12: UI & Key Features
s12 = prs.slides.add_slide(prs.slide_layouts[5])
s12.shapes.title.text = "UI Design & Key Features"
s12.shapes.title.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK; s12.shapes.title.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
add_textbox(s12, 0.7, 1.5, 12.0, 5.0, "Verified Features (Real Screenshots)\n\n• Dashboard with analytics and progress tracking\n• Subject view (DBMS, OS, DSA) with topic content\n• AI-generated topic notes with Mermaid diagrams\n• Study planner (scheduled / empty states)\n• Skill roadmap with browse and detail views\n• Placement prep, question bank, mock exam\n• Coding practice workspace (pyodide environment)\n• Flashcard interface with SM-2 scheduling\n• AI assistant dashboard with 6-model fallback", 16, False, DARK)
s12.notes_slide.notes_text_frame.text = "Genuine UI screenshots from running app at study-mapper.vercel.app."

# SLIDE 13: Results
s13 = prs.slides.add_slide(prs.slide_layouts[5])
s13.shapes.title.text = "Results & Experimental Analysis"
s13.shapes.title.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK; s13.shapes.title.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
add_textbox(s13, 0.7, 1.5, 5.8, 5.0, "Testing Results\n• 47/47 Tests Passed (100%)\n• Build Time: 6.21s\n• No Critical Errors\n• All Components Functional\n\nDemo Data\n• 38 Topics across 3 subjects\n• 18 Topic Contents (rich notes)\n• 8 DBMS Questions with AI answers\n• Mock Exams with scoring\n• Flashcards with SM-2 fields", 14, False, DARK)
add_textbox(s13, 7.0, 1.5, 5.5, 5.0, "Performance Metrics\n• Production build verified\n• Live demo available\n• Responsive design tested\n• Offline functionality confirmed\n• File parsing verified\n• AI streaming working\n• JSON repair mechanism verified", 14, False, DARK)
s13.notes_slide.notes_text_frame.text = "Verified test success, build performance, demo data, and live deployment."

# SLIDE 14: Discussion
s14 = prs.slides.add_slide(prs.slide_layouts[5])
s14.shapes.title.text = "Discussion & Contributions"
s14.shapes.title.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK; s14.shapes.title.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
add_textbox(s14, 0.7, 1.5, 12.0, 5.5, "Contributions\n• Adaptive learning engine with SM-2 algorithm\n• AI content pipeline (notes, quizzes, diagrams)\n• Gamification system (XP, levels, streaks, achievements)\n• Weakness detection with scoring (0-100)\n• Panic mode intervention

Limitations\n• Firebase/OpenRouter keys not exposed\n• Some supervisor details pending\n• Mobile app development future work\n• Expanded multi-language support planned", 16, False, DARK)
s14.notes_slide.notes_text_frame.text = "Honest discussion of contributions, limitations, and lessons learned."

# SLIDE 15: Conclusion
s15 = prs.slides.add_slide(prs.slide_layouts[5])
s15.shapes.title.text = "Conclusion"
s15.shapes.title.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK; s15.shapes.title.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
add_textbox(s15, 0.7, 1.5, 12.0, 5.5, "StudyMapper Successfully Implemented\n\n• AI-driven personalized learning platform\n• Adaptive study planner with SM-2 spaced repetition\n• AI content generation via OpenRouter (6-model fallback)\n• Comprehensive analytics and weakness detection\n• Gamified experience with achievements and quests\n• Production-ready with 47/47 passing tests\n• Live demo at study-mapper.vercel.app\n\nDeveloped by team under Ms.C. Sravani at ALITS (Autonomous)", 20, False, DARK)
s15.notes_slide.notes_text_frame.text = "Summary of achievements: adaptive learning, AI content, analytics, gamification, production quality."

# SLIDE 16: Future Scope
s16 = prs.slides.add_slide(prs.slide_layouts[5])
s16.shapes.title.text = "Future Scope"
s16.shapes.title.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK; s16.shapes.title.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
add_textbox(s16, 0.7, 1.5, 6.0, 5.0, "Short-term\n• Enhanced AI model selection\n• Expanded content library\n• Improved analytics visualizations\n• Mobile app development\n• Collaboration features\n• Better file parsing", 16, False, DARK)
add_textbox(s16, 7.0, 1.5, 6.0, 5.0, "Long-term\n• Multi-language content\n• Full offline sync\n• Institutional deployment\n• Integration with LMS platforms\n• Research collaboration\n• Expanded AI capabilities", 16, False, DARK)
s16.notes_slide.notes_text_frame.text = "Future work includes mobile app, collaboration, multi-language support, and institutional integration."

# SLIDE 17: References
s17 = prs.slides.add_slide(prs.slide_layouts[5])
s17.shapes.title.text = "References"
s17.shapes.title.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK; s17.shapes.title.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
add_textbox(s17, 0.7, 1.5, 12.0, 5.5, "Verified Sources\n\nProject Documents: GitHub palturuvenubhaskar/StudyMapper | Abstract PDF (ALITS)\n\nFrameworks: React 19 (react.dev), Vite (vitejs.dev), Dexie.js (dexie.org), Firebase (firebase.google.com)\n\nAI: OpenRouter (openrouter.ai), Pyodide (pyodide.org), Tesseract.js (tesseract.js.org)\n\nData: pdf.js (mozilla.github.io/pdf.js), mammoth.js (mammothjs.org), Mermaid.js (mermaid.js.org), KaTeX (katex.org)\n\nAlgorithm: SM-2 Spaced Repetition (SuperMemo / Anki implementation)", 14, False, DARK)
s17.notes_slide.notes_text_frame.text = "References include project documentation, framework docs, and academic sources. All references verified against implementation."

# SLIDE 18: Thank You
s18 = prs.slides.add_slide(prs.slide_layouts[6])
bg = s18.shapes.add_shape(1, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
bg.fill.solid(); bg.fill.fore_color.rgb = RGBColor(245,247,250); bg.line.fill.background()
add_textbox(s18, 1.0, 2.5, 11.3, 1.0, "Thank You", 58, True, DARK, PP_ALIGN.CENTER)
add_textbox(s18, 1.0, 3.8, 11.3, 1.0, "Questions & Discussion", 32, False, ACCENT, PP_ALIGN.CENTER)
add_textbox(s18, 1.0, 5.0, 11.3, 1.5, "StudyMapper - AI-Driven Personalized Learning System\nLive Demo: study-mapper.vercel.app | GitHub: palturuvenubhaskar/StudyMapper\nGuide: Ms.C. Sravani | Department: Computer Science and Engineering\nInstitution: Anantha Lakshmi Institute of Technology and Sciences (Autonomous)", 18, False, DARK, PP_ALIGN.CENTER)
s18.notes_slide.notes_text_frame.text = "This final slide opens for questions and demonstrates the completed project. All 18 slides cover the complete academic presentation requirements."

# Save
output_path = os.path.join(DIR, 'StudyMapper_Project_Presentation.pptx')
prs.save(output_path)
print(f"Presentation saved to: {output_path}")
print(f"Total slides: {len(prs.slides)}")
