#!/usr/bin/env python3
"""Build the 13-slide app-coloured StudyMapper deck."""
import os
from pptx import Presentation
from pptx.util import Inches
import slides13_a as A
import slides13_b as B

os.chdir(os.path.dirname(os.path.abspath(__file__)))

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

for fn in (A.slide_01, A.slide_02, A.slide_03, A.slide_04, A.slide_05,
           A.slide_06, A.slide_07, B.slide_08, B.slide_09, B.slide_10,
           B.slide_11, B.slide_12, B.slide_13):
    fn(prs)

cp = prs.core_properties
cp.title = "StudyMapper — AI-Driven Personalized Learning and Academic Management System"
cp.subject = "Academic project presentation — 13 slides"
cp.author = "P. Venubhaskar, T. Vasanth, V. Adarsh Kumar, B. Sai Vikas, C. Narendra"
cp.keywords = "adaptive learning, spaced repetition, AI, local-first, React"

out = "StudyMapper_13Slide.pptx"
prs.save(out)
print("saved", out, "slides:", len(prs.slides))
