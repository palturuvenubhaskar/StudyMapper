# Product

<!-- uizze:product-schema 1 -->

## Platform

web

## Users
Indian engineering and college students preparing for semester exams, competitive placements, and campus hiring. Primary context: studying on laptops and phones in hostels, libraries, and home desks, often with unreliable connectivity. They are juggling multiple subjects, deadlines, and career preparation simultaneously.

## Product Purpose
StudyMapper transforms a static syllabus into an organized, AI-powered learning workspace. Upload a syllabus or paste topics, and the AI generates structured notes, question banks with mark-adaptive answers, flashcards, Mermaid diagrams, coding practice, and mock interviews — all stored locally for offline use. Success means a student finishes their exam and placement preparation without leaving the app or switching between Notion, Anki, LeetCode, and random YouTube playlists.

## Positioning
The all-in-one integration: notes + question banks + coding practice + placement prep (aptitude, technical, HR) + study planner + skill roadmaps, unified under one AI engine that generates content from the syllabus structure itself. No other tool auto-generates all of these from a single syllabus upload.

## Operating Context
Students upload or paste university syllabuses. The app parses them into subjects → units → topics. For each topic, AI generates comprehensive notes, Q&A, diagrams, and flashcards. Separately, students upload past question papers as PDFs to get AI-solved answers. The coding practice module provides DSA problems with an AI mentor. The placement prep module runs mock aptitude, technical, and HR interviews. A study planner ingests exam schedules and builds daily plans. Data is stored offline-first in IndexedDB via Dexie.js; Firebase handles optional authentication and sync.

## Capabilities and Constraints
- AI content generation via OpenRouter API (Gemini, Llama, Mistral models)
- Offline-first: all subjects, notes, and question banks stored locally in IndexedDB
- Firebase Auth for login (Google, email/password, phone OTP)
- PDF parsing (pdfjs-dist), DOCX parsing (mammoth), OCR (tesseract.js) for question bank uploads
- Markdown rendering with math (KaTeX), diagrams (Mermaid), and GFM tables
- No backend server; the app is a purely client-side SPA
- React 19 + Vite 8, vanilla CSS design system, Lucide icons

## Brand Commitments
- Name: StudyMapper
- Logo exists: /public/STUDYMAPPER LOGO.png
- Fonts currently loaded: Geist (sans), DM Sans, JetBrains Mono (mono)
- The product name and logo must be preserved

## Evidence on Hand
- Working prototype with 14 route pages, sidebar navigation, AI chat assistant, command palette
- No user testimonials, press, or commercial pricing exists
- All demonstration data is AI-generated from syllabuses; no proprietary dataset

## Product Principles
1. **Zero-setup learning**: Paste a syllabus, get a complete study workspace — no manual organization required
2. **All-in-one preparation**: Notes, question banks, coding, placement prep, and planning in one place
3. **Offline resilience**: Every piece of generated content persists locally and works without internet
4. **AI as study partner**: The AI generates, explains, and drills — it does not just search or link
5. **Student-first affordability**: Free, open-source, no paywall gates on core features

## Accessibility & Inclusion
No specific accessibility requirements established beyond standard web accessibility. The app should remain usable on low-end Android devices via mobile web, since many Indian students access it on budget smartphones.
