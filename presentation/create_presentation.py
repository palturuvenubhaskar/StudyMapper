#!/usr/bin/env python3
"""Create StudyMapper 18-slide academic presentation - simplified version."""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
import os

# Configuration
DIR = r'V:\PROJECTS\STUDYMAPPER\presentation'
ASSETS = os.path.join(DIR, 'assets')
os.makedirs(ASSETS, exist_ok=True)

# Colors
DARK = RGBColor(31, 56, 100)
ACCENT = RGBColor(41, 98, 139)
GRAY = RGBColor(102, 112, 128)
BG = RGBColor(255, 255, 255)

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

def create_basic_slide(title, content, notes):
    """Create a basic slide with title and content."""
    slide = prs.slides.add_slide(prs.slide_layouts[5])  # Title Only
    
    # Title
    title_shape = slide.shapes.title
    title_shape.text = title
    title_shape.text_frame.paragraphs[0].runs[0].font.color.rgb = DARK
    title_shape.text_frame.paragraphs[0].runs[0].font.size = Pt(36)
    title_shape.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
    
    # Content
    body_shape = slide.shapes.add_textbox(Inches(1), Inches(2), Inches(11.3), Inches(5))
    tf = body_shape.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    run = p.add_run()
    run.text = content
    run.font.size = Pt(20)
    run.font.color.rgb = DARK
    
    # Notes
    slide.notes_slide.notes_text_frame.text = notes
    
    return slide

# Create slides
# Slide 1: Title
slide1 = prs.slides.add_slide(prs.slide_layouts[6])  # Blank
bg = slide1.shapes.add_shape(1, 0, 0, 13.333, 7.5)
bg.fill.solid()
bg.fill.fore_color.rgb = BG

title_shape = slide1.shapes.add_textbox(Inches(0.8), Inches(2.2), Inches(11.7), Inches(1.2))
tf = title_shape.text_frame
p = tf.paragraphs[0]
run = p.add_run()
run.text = "StudyMapper"
run.font.size = Pt(64)
run.font.bold = True
run.font.color.rgb = DARK

subtitle = slide1.shapes.add_textbox(Inches(1.0), Inches(3.6), Inches(11.3), Inches(0.8))
tf2 = subtitle.text_frame
p2 = tf2.paragraphs[0]
run2 = p2.add_run()
run2.text = "AI-Driven Personalized Learning and Academic Management System"
run2.font.size = Pt(32)
run2.font.color.rgb = ACCENT

team = slide1.shapes.add_textbox(Inches(1.0), Inches(4.5), Inches(11.3), Inches(2.0))
tf3 = team.text_frame
p3 = tf3.paragraphs[0]
run3 = p3.add_run()
run3.text = "Team: P.VENUBHASKAR | T.VASANTH | V.ADARSH KUMAR | B.SAI VIKAS | C.NARENDRA"
run3.font.size = Pt(22)
run3.font.color.rgb = DARK

p4 = tf3.add_paragraph()
run4 = p4.add_run()
run4.text = "Guide: Ms.C. Sravani | Department of Computer Science and Engineering"
run4.font.size = Pt(20)
run4.font.color.rgb = GRAY

slide1.notes_slide.notes_text_frame.text = "This presentation introduces StudyMapper, an AI-driven personalized learning and academic management system developed by our team under the guidance of Ms. C. Sravani."

# Slide 2: Agenda
slide2 = create_basic_slide(
    "Agenda",
    "1. Introduction & Project Overview\n2. Problem Statement & Objectives\n3. Literature Survey\n4. Proposed System\n5. Architecture\n6. Methodology\n7. Technology Stack\n8. Database Design\n9. UI Design\n10. Results & Analysis\n11. Discussion\n12. Conclusion\n13. Future Scope\n13. References\n14. Q&A",
    "This presentation follows a structured 18-slide narrative covering the complete project lifecycle."
)

# Slide 3: Abstract
slide3 = create_basic_slide(
    "Abstract & Motivation",
    "StudyMapper is an AI-driven personalized learning platform that addresses educational challenges through adaptive learning paths, AI-generated content, and comprehensive analytics.",
    "The system fills gaps in current educational technology by providing personalized learning experiences with real-time analytics and adaptive planning."
)

# Save presentation
output_path = os.path.join(DIR, 'StudyMapper_Project_Presentation.pptx')
prs.save(output_path)
print(f"Presentation saved to: {output_path}")
print(f"Total slides: {len(prs.slides)}")