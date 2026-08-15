import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/ToastProvider/ToastProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateSubject from './pages/CreateSubject/CreateSubject';
import SubjectView from './pages/SubjectView/SubjectView';
import TopicStudy from './pages/TopicStudy/TopicStudy';
import FlashcardsStudy from './pages/TopicStudy/FlashcardsStudy';
import SearchPage from './pages/SearchPage/SearchPage';
import BookmarksPage from './pages/BookmarksPage/BookmarksPage';
import CreateQuestionBank from './pages/CreateQuestionBank/CreateQuestionBank';
import QuestionBankView from './pages/QuestionBankView/QuestionBankView';
import SkillRoadmap from './pages/SkillRoadmap/SkillRoadmap';
import Placement from './pages/Placement/Placement';
import AptitudePractice from './pages/Placement/AptitudePractice';
import TechnicalInterview from './pages/Placement/TechnicalInterview';
import HRInterview from './pages/Placement/HRInterview';
import CodingPractice from './pages/CodingPractice/CodingPractice';
import CodingWorkspace from './pages/CodingPractice/CodingWorkspace';
import LearningWorkspace from './pages/CodingPractice/LearningWorkspace';
import StudyPlanner from './pages/StudyPlanner/StudyPlanner';
import AIAssistant from './components/AIAssistant/AIAssistant';
import Sidebar from './components/Sidebar/Sidebar';
import RightSidebar from './components/Sidebar/RightSidebar';
import CommandPalette from './components/CommandPalette/CommandPalette';
import Login from './pages/Login/Login';
import Settings from './pages/Settings/Settings';

function AppContent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isDashboard = location.pathname === '/';

  return (
    <div className="app-layout">
      {!isLoginPage && <Sidebar />}
      <div className="content-container">
        <div className={`main-content-wrapper ${isLoginPage ? 'full-width' : ''} ${!isDashboard ? 'no-right-sidebar' : ''}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/create" element={<CreateSubject />} />
            <Route path="/subject/:subjectId" element={<SubjectView />} />
            <Route path="/topic/:topicId" element={<TopicStudy />} />
            <Route path="/topic/:topicId/flashcards" element={<FlashcardsStudy />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/subject/:subjectId/qb/create" element={<CreateQuestionBank />} />
            <Route path="/qb/create" element={<CreateQuestionBank />} />
            <Route path="/qb/:bankId" element={<QuestionBankView />} />
            {/* AI Career Features */}
            <Route path="/roadmap" element={<SkillRoadmap />} />
            <Route path="/roadmap/:roadmapId" element={<SkillRoadmap />} />
            <Route path="/placement" element={<Placement />} />
            <Route path="/placement/aptitude" element={<AptitudePractice />} />
            <Route path="/placement/technical" element={<TechnicalInterview />} />
            <Route path="/placement/hr" element={<HRInterview />} />
            <Route path="/coding" element={<CodingPractice />} />
            <Route path="/coding/workspace/:problemId" element={<CodingWorkspace />} />
            <Route path="/coding/learning/:lessonId" element={<LearningWorkspace />} />
            <Route path="/planner" element={<StudyPlanner />} />
          </Routes>
        </div>
        {isDashboard && <RightSidebar />}
      </div>
      {!isLoginPage && <AIAssistant />}
      <CommandPalette isOpen={isSearchOpen} onClose={setIsSearchOpen} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
