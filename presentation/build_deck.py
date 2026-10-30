#!/usr/bin/env python3
"""Build the redesigned StudyMapper deck."""
import os
from pptx import Presentation
from pptx.util import Inches
import slides_a, slides_b, slides_c

os.chdir(os.path.dirname(os.path.abspath(__file__)))

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

for fn in (slides_a.slide_01, slides_a.slide_02, slides_a.slide_03, slides_a.slide_04,
           slides_a.slide_05, slides_a.slide_06,
           slides_b.slide_07, slides_b.slide_08, slides_b.slide_09, slides_b.slide_10,
           slides_b.slide_11, slides_b.slide_12,
           slides_c.slide_13, slides_c.slide_14, slides_c.slide_15, slides_c.slide_16,
           slides_c.slide_17, slides_c.slide_18):
    fn(prs)

cp = prs.core_properties
cp.title = "StudyMapper — AI-Driven Personalized Learning and Academic Management System"
cp.subject = "Academic project presentation"
cp.author = "P. Venubhaskar, T. Vasanth, V. Adarsh Kumar, B. Sai Vikas, C. Narendra"
cp.keywords = "adaptive learning, spaced repetition, AI, local-first, React"

out = "StudyMapper_Deck.pptx"
prs.save(out)
print("saved", out, "slides:", len(prs.slides))
