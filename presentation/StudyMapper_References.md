# StudyMapper — References

Sources used to verify the implementation claims in **StudyMapper_Deck.pptx**. Primary sources come first; documentation is listed only where it was needed to confirm a technical behaviour.

## Primary sources

[1] P. Venubhaskar, T. Vasanth, V. Adarsh Kumar, B. Sai Vikas and C. Narendra, *StudyMapper: AI-Driven Personalized Learning and Academic Management System*. Department of Computer Science & Engineering, Anantha Lakshmi Institute of Technology & Sciences (Autonomous), 2026–27. Project abstract.

[2] StudyMapper source repository, GitHub. [Online]. Available: https://github.com/palturuvenubhaskar/StudyMapper. Accessed: 28 October 2026. Primary source for routes, schema, services, tests and build configuration.

[3] StudyMapper live application. [Online]. Available: https://study-mapper.vercel.app/. Accessed: 28 October 2026.

## Platform and library documentation

[4] Meta Open Source, *React 19 documentation*. [Online]. Available: https://react.dev. Accessed: 28 October 2026.

[5] Vite, *Vite documentation*. [Online]. Available: https://vite.dev. Accessed: 28 October 2026.

[6] Dexie.js, *Dexie.js documentation — IndexedDB wrapper*. [Online]. Available: https://dexie.org. Accessed: 28 October 2026.

[7] Google, *Firebase Authentication documentation*. [Online]. Available: https://firebase.google.com/docs/auth. Accessed: 28 October 2026.

[8] OpenRouter, *OpenRouter API documentation*. [Online]. Available: https://openrouter.ai/docs. Accessed: 28 October 2026.

[9] Pyodide, *Pyodide documentation — Python in the browser*. [Online]. Available: https://pyodide.org. Accessed: 28 October 2026.

[10] Tesseract.js, *Tesseract.js documentation — OCR in the browser*. [Online]. Available: https://tesseract.projectnaptha.com. Accessed: 28 October 2026.

[11] Mozilla, *pdf.js documentation*. [Online]. Available: https://mozilla.github.io/pdf.js. Accessed: 28 October 2026.

[12] Mammoth.js, *Mammoth documentation — DOCX to HTML*. [Online]. Available: https://mammothjs.org. Accessed: 28 October 2026.

[13] Mermaid, *Mermaid documentation — diagramming and charting*. [Online]. Available: https://mermaid.js.org. Accessed: 28 October 2026.

[14] KaTeX, *KaTeX documentation — mathematical typesetting*. [Online]. Available: https://katex.org. Accessed: 28 October 2026.

## Method references

[15] P. A. Woźniak, “SuperMemo 2: Algorithm and implementation,” *SuperMemo*, 1987. Basis of the SM-2 spaced-repetition scheduler implemented in `src/core/flashcards/srs.js`.

[16] Anki, *Anki manual — spaced repetition*. [Online]. Available: https://docs.ankiweb.net. Accessed: 28 October 2026. Reference implementation used to sanity-check SM-2 behaviour.

[17] Vitest, *Vitest documentation — unit testing for Vite*. [Online]. Available: https://vitest.dev. Accessed: 28 October 2026.

[18] Puppeteer, *Puppeteer documentation — browser automation*. [Online]. Available: https://pptr.dev. Accessed: 28 October 2026. Used for demo-data seeding and interface capture.

---

## Note on the literature comparison

Slide 6 compares five categories of existing work — adaptive learning platforms, AI tutors, LMS analytics, spaced repetition and gamified learning. It is a **design comparison**, not a systematic literature review. No specific commercial product is cited as an academic source, and no effectiveness claim is attributed to those categories. The sources above are the ones used to verify the StudyMapper implementation and its technical foundations.
