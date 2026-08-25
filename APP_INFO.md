# StudyMapper: Comprehensive Application Documentation

StudyMapper is an offline-first, AI-powered learning workspace designed specifically for engineering and college students. It transforms static syllabuses and notes into an interactive, adaptive learning experience.

---

## 🏗️ Application Architecture

- **Frontend:** React 19 + Vite 8
- **Styling:** Vanilla CSS, Lucide React icons
- **State & Local Storage:** Dexie.js (IndexedDB wrapper) for offline persistence. Data is strictly stored on the user's local machine ensuring privacy and offline access.
- **Authentication:** Firebase Auth (Optional, handles Google, Email/Password, Phone OTP)
- **AI Integration:** OpenRouter API (Supports Gemini, Llama, Mistral models). The application uses a robust fallback mechanism—iterating through a predefined array of models if one fails or times out. It heavily utilizes **Streaming capabilities** (`callOpenRouterStream`) so users don't have to wait for large documents to generate completely before seeing text.
- **Content Rendering:** 
  - Markdown: `react-markdown` and `remark-gfm`
  - Math: `rehype-katex` and `remark-math`
  - Diagrams: `mermaid.js` embedded in markdown blocks.
- **Document Processing:** PDF (`pdfjs-dist`), DOCX (`mammoth`), OCR (`tesseract.js`)

---

## 🌟 Deep Dive: How the Core Features Work

### 1. Syllabus Parsing & Notes Generation (SubjectView / TopicStudy)
**How it works:**
1. A user creates a "Subject" and pastes a raw text syllabus or uploads a document.
2. The AI parses the syllabus into structured `Units` and `Topics`, which are stored in the `units` and `topics` tables in IndexedDB.
3. When a user opens a Topic in the `TopicStudy` view, they can click "Generate AI Notes".
4. The application constructs a massive, multi-part prompt forcing the AI to generate markdown in specific sections (Learning Objectives, Prerequisites, Core Concepts, Mermaid diagrams, Real-Life Analogies, and Summaries). 
5. The response is **streamed** directly to the UI, allowing the user to read while it generates. Once complete, it is stored in the `topic_contents` IndexedDB table.

### 2. Interactive Question Banks (QuestionBankView)
**How it works:**
1. Users create a Question Bank associated with a subject. They can manually add questions, or upload a past exam paper (PDF/Image) which is parsed via OCR/PDF.js into individual questions with assigned "Marks".
2. The questions are saved to the `questions` table without answers.
3. In the `QuestionBankView`, a user selects a question and clicks "Generate Answer".
4. The system takes the question text, the total marks (e.g., 2 marks vs. 10 marks), and the subject context to prompt the AI. 
5. The AI generates a mark-appropriate answer (short for 2 marks, highly detailed for 10 marks) which is streamed back to the UI and saved in the database.

### 3. Coding Practice Workspace (CodingPractice)
**How it works:**
1. Users select a programming language (e.g., Python, C++, Rust) and a topic (e.g., Arrays, Dynamic Programming) or follow a structured Curriculum.
2. The app asks the AI to generate a JSON payload representing a coding problem. The AI must return a `title`, `description`, `starterCode`, and `testCases`.
3. Because AI models sometimes return malformed JSON, StudyMapper includes a custom regex/cleanup utility (`tryParsePartialJson`) to salvage partial JSON structures.
4. The parsed problem is stored in `coding_problems`. The user enters a custom code editor UI to solve it, though execution logic relies heavily on the AI evaluating the user's code against the test cases, since the app is entirely client-side.

### 4. Placement Preparation (Aptitude, Technical, HR)
**How it works:**
1. Students input their target role (e.g., "Frontend Developer").
2. The app uses AI to generate mock interview sessions:
   - **Aptitude:** Generates logical reasoning and quant questions.
   - **Technical:** Generates role-specific trivia and system design questions.
   - **HR:** Generates behavioral questions (e.g., STAR method queries).
3. The user answers via text input, and the AI acts as an interviewer, scoring their answer, providing feedback, and logging the score in `placement_stats`.

### 5. Smart Flashcards (FlashcardsStudy)
**How it works:**
1. While studying a topic's notes, the user can click a button to generate flashcards.
2. The app sends the generated topic notes (or raw text) to the AI, instructing it to extract the highest-yield information (key terms, definitions) and return an array of `front` and `back` card objects.
3. These are saved in `flashcard_decks` and `flashcards`. 
4. The UI presents them in a standard spaced-repetition or sequential flipping interface.

### 6. Study Planner
**How it works:**
1. The user inputs their upcoming exam dates and selects the subjects they need to study.
2. The planner queries IndexedDB for the number of units and topics in each subject.
3. It distributes the topics across the available days before the exam, creating a day-by-day checklist.

### 7. Pomodoro Focus Timer
**How it works:**
1. Integrated into the Right Sidebar, the timer helps students maintain focus using the 25-minute Pomodoro technique.
2. When the timer hits 0, it creates a unique ID (UUID) and logs a session entry in the `study_sessions` IndexedDB table, associating it with the currently active topic (if any).

---

## 🗄️ Database Schema Details (Dexie.js / IndexedDB)

All data is local to the browser. The database (`StudyMapperDB`) currently operates on Version 8.

- **Subjects & Content**
  - `subjects`: `id, title, created_at`
  - `units`: `id, subject_id, title, order_index`
  - `topics`: `id, unit_id, title, order_index, has_content`
  - `topic_contents`: `id, topic_id, is_latest` (Stores the raw AI generated markdown)
  - `bookmarks`: `id, topic_id, section_id, created_at`
  - `notes`: `id, topic_id, updated_at` (User's personal typed notes)
  
- **Question Banks**
  - `question_banks`: `id, subject_id, title, created_at`
  - `questions`: `id, bank_id, text, marks, answer, order_index`

- **Career & Placement**
  - `student_profiles`: `id, branch, career_goal, created_at`
  - `roadmaps` & `roadmap_skills`: AI-generated skill trees.
  - `placement_sessions` & `placement_questions`: Tracks mock interviews and correct/incorrect answers.

- **Coding**
  - `coding_problems`: `id, profile_id, language, topic, difficulty, status, created_at`
  - `learning_tracks` & `learning_lessons`: Structured programming curriculum state.

- **Miscellaneous**
  - `study_sessions`: `id, topic_id, duration_minutes, created_at` (Pomodoro tracking)
  - `flashcard_decks` & `flashcards`: Spaced repetition data.
  - `ai_sessions` & `ai_messages`: Global assistant chat history.

---

## 🧪 Testing Strategy

Because StudyMapper relies heavily on complex client-side logic (IndexedDB + API Fallbacks), automated testing is crucial.
- **Framework:** Vitest with React Testing Library and JSDOM.
- **Mocks:** `fake-indexeddb` is used to mock browser storage so that `Dexie.js` queries can be tested natively in Node.js environments.
- **Coverage Focus:**
  1. **Data Integrity:** Ensuring cascading deletes (e.g. deleting a Subject correctly deletes all child units, topics, and notes).
  2. **AI Reliability:** Testing that `aiService.js` correctly falls back to alternative models when primary API calls fail (e.g. rate limits or 500 errors).

---

## 📁 Directory Structure

```text
src/
├── components/      # Reusable UI components
│   ├── MarkdownRenderer/ # Handles GFM, KaTeX, and Mermaid diagrams
│   ├── PomodoroTimer/    # Sidebar focus timer
│   └── Sidebar/          # Main app navigation and right-side context menu
├── config/          # Environment variables and Firebase setup
├── context/         # React Contexts (AuthContext, ThemeProvider)
├── core/            # Core business logic
│   └── api/         # aiService.js (OpenRouter streaming and fallback logic)
├── data/            # Local IndexedDB database
│   ├── db.js             # Dexie schema definitions
│   └── repository.js     # CRUD functions for IndexedDB operations
├── pages/           # Main application views (SubjectView, TopicStudy, CodingPractice, etc.)
├── utils/           # Helper functions
├── App.jsx          # Main routing logic (React Router)
├── main.jsx         # Application entry point
└── setupTests.js    # Vitest and JSDOM testing configuration (fake-indexeddb)
```
