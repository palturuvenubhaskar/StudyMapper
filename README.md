# StudyMapper

> An AI-powered, intelligent learning companion and study planner designed to supercharge your education.

StudyMapper transforms static notes into interactive, adaptive learning experiences. From automatically parsing syllabuses to generating technical interview prep, flashcards, and personalized study plans, StudyMapper is the ultimate all-in-one educational platform.

## Features

- **AI-Powered Notes Generation**: Automatically generate comprehensive, beginner-friendly notes for any engineering or academic topic.
- **Intelligent Study Planner**: Upload your timetable or exam schedule, and let AI build a structured daily and weekly study plan.
- **Interactive Question Banks**: Generate question banks with adaptive answers based on mark allocations.
- **Coding & Placement Prep**: Practice DSA problems with an AI mentor, and generate mock Technical and HR interview questions.
- **Visual Learning**: Automatically generated Mermaid.js diagrams, flowcharts, and architecture graphs for complex topics.
- **Smart Flashcards**: Auto-generate high-yield flashcards from your study material.
- **Skill Roadmaps**: Generate personalized learning curriculums for your specific career goals.
- **Offline-First Storage**: Blazing fast local storage using IndexedDB (via Dexie.js).

## Tech Stack

- **Frontend**: [React 18](https://react.dev/), [Vite](https://vitejs.dev/)
- **Local Storage**: [Dexie.js](https://dexie.org/) (IndexedDB wrapper)
- **Authentication**: Firebase Auth
- **AI Integration**: OpenRouter API (Gemini, Llama, Mistral)
- **Markdown & Diagrams**: `react-markdown`, `remark-gfm`, `mermaid.js`
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/studymapper.git
   cd studymapper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Rename the provided `.env.example` file to `.env.local` and fill in your API keys:
   ```bash
   cp .env.example .env.local
   ```
   *Note: You will need a Firebase project configuration and an OpenRouter API key.*

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Project Structure

```text
src/
├── components/      # Reusable UI components (Sidebar, MarkdownRenderer, etc.)
├── config/          # Firebase and third-party configurations
├── core/            # Core business logic (AI Service, AI prompts)
├── data/            # Local IndexedDB database setup and repository functions
├── pages/           # Main application views (StudyPlanner, CodingHub, etc.)
└── styles/          # Global CSS and theming
```

## Building for Production

To create a production-ready build:

```bash
npm run build
```
The optimized files will be generated in the `dist` folder. You can preview the build using:
```bash
npm run preview
```

## License

This project is open-source and available under the [MIT License](LICENSE).
