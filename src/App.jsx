import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ToastProvider } from './components/ToastProvider/ToastProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { PlacementStateProvider } from './context/PlacementStateContext';
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
import MockExamSetup from './components/MockExamSimulator/MockExamSetup';
import MockExamSession from './components/MockExamSimulator/MockExamSession';
import MockExamResults from './components/MockExamSimulator/MockExamResults';
import SkillRoadmap from './pages/SkillRoadmap/SkillRoadmap';
import Placement from './pages/Placement/Placement';
import AptitudePractice from './pages/Placement/AptitudePractice';
import TechnicalInterview from './pages/Placement/TechnicalInterview';
import HRInterview from './pages/Placement/HRInterview';
import LearnMode from './pages/Placement/LearnMode';
import { TopicDetail } from './pages/Placement/TopicDetail';
import CodingPractice from './pages/CodingPractice/CodingPractice';
import CodingWorkspace from './pages/CodingPractice/CodingWorkspace';
import LearningWorkspace from './pages/CodingPractice/LearningWorkspace';
import StudyPlanner from './pages/StudyPlanner/StudyPlanner';
import AIAssistant from './components/AIAssistant/AIAssistant';

import Sidebar from './components/Sidebar/Sidebar';
import RightSidebar from './components/Sidebar/RightSidebar';
import CommandPalette from './components/CommandPalette/CommandPalette';
import Login from './pages/Login/Login';
import MobileHeader from './components/MobileHeader/MobileHeader';
import MobileNav from './components/MobileNav/MobileNav';

// New Imports
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { OfflineIndicator } from './components/OfflineIndicator/OfflineIndicator';
import { CookieConsentBanner } from './components/CookieConsent/CookieConsentBanner';
import { CookiePreferencesModal } from './components/CookieConsent/CookiePreferencesModal';
import { useCookieConsent } from './hooks/useCookieConsent';

import { PrivacyPolicy } from './pages/Legal/PrivacyPolicy';
import { TermsAndConditions } from './pages/Legal/TermsAndConditions';
import { CookiePolicy } from './pages/Legal/CookiePolicy';
import { Disclaimer } from './pages/Legal/Disclaimer';
import { SecurityPolicy } from './pages/Legal/SecurityPolicy';
import { CommunityGuidelines } from './pages/Legal/CommunityGuidelines';

import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { ResetPassword } from './pages/Auth/ResetPassword';

import { AccountSettings } from './pages/Settings/AccountSettings';
import { Support } from './pages/Support/Support';
import { HelpCenter } from './pages/Help/HelpCenter';
import { HelpArticle } from './pages/Help/HelpArticle';

import { NotFound } from './pages/Errors/NotFound';
import { Forbidden } from './pages/Errors/Forbidden';
import { InternalError } from './pages/Errors/InternalError';
import { Maintenance } from './pages/Errors/Maintenance';
import { Offline } from './pages/Errors/Offline';

function AppContent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/forgot-password' || location.pathname === '/reset-password';
  const isDashboard = location.pathname === '/';

  const { 
    consent, 
    isBannerVisible, 
    acceptAll, 
    rejectNonEssential, 
    updateConsent,
    dismissBanner 
  } = useCookieConsent();

  const [showCookiePrefs, setShowCookiePrefs] = useState(false);

  useEffect(() => {
    const handler = () => setShowCookiePrefs(true);
    window.addEventListener('openCookiePrefs', handler);
    return () => window.removeEventListener('openCookiePrefs', handler);
  }, []);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      localStorage.setItem('hasVisited', 'true');
      if (location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, [navigate, location.pathname]);

  return (
    <ErrorBoundary>
      <div className="app-layout">
        <OfflineIndicator />
        {!isLoginPage && <Sidebar />}
        {!isLoginPage && <MobileHeader onSearchClick={() => setIsSearchOpen(true)} />}
        <div className="content-container">
          <div className={`main-content-wrapper ${isLoginPage ? 'full-width' : ''} ${!isDashboard ? 'no-right-sidebar' : ''}`}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create" element={<CreateSubject />} />
              <Route path="/subject/:subjectId" element={<SubjectView />} />
              <Route path="/topic/:topicId" element={<TopicStudy />} />
              <Route path="/topic/:topicId/flashcards" element={<FlashcardsStudy />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/subject/:subjectId/qb/create" element={<CreateQuestionBank />} />
              <Route path="/qb/create" element={<CreateQuestionBank />} />
              <Route path="/qb/:bankId" element={<QuestionBankView />} />
              {/* Mock Exam */}
              <Route path="/mock-exam/setup/:bankId" element={<MockExamSetup />} />
              <Route path="/mock-exam/session/:bankId" element={<MockExamSession />} />
              <Route path="/mock-exam/results/:examId" element={<MockExamResults />} />
              {/* AI Career Features */}
              <Route path="/roadmap" element={<SkillRoadmap />} />
              <Route path="/roadmap/:roadmapId" element={<SkillRoadmap />} />
              <Route path="/placement" element={<Placement />} />
              <Route path="/placement/:categoryId/learn" element={<LearnMode />} />
              <Route path="/placement/:categoryId/learn/:topicId" element={<TopicDetail />} />
              <Route path="/placement/aptitude" element={<AptitudePractice />} />
              <Route path="/placement/aptitude/test" element={<AptitudePractice />} />
              <Route path="/placement/technical" element={<TechnicalInterview />} />
              <Route path="/placement/technical/test" element={<TechnicalInterview />} />
              <Route path="/placement/hr" element={<HRInterview />} />
              <Route path="/placement/hr/test" element={<HRInterview />} />
              <Route path="/coding" element={<CodingPractice />} />
              <Route path="/coding/workspace/:problemId" element={<CodingWorkspace />} />
              <Route path="/coding/learning/:lessonId" element={<LearningWorkspace />} />
              <Route path="/planner" element={<StudyPlanner />} />

              {/* Legal Routes */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/security" element={<SecurityPolicy />} />
              <Route path="/community-guidelines" element={<CommunityGuidelines />} />

              {/* Auth Routes */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Settings & Support */}
              <Route path="/settings/*" element={<AccountSettings />} />
              <Route path="/support" element={<Support />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/help/:articleId" element={<HelpArticle />} />

              {/* Error Routes */}
              <Route path="/403" element={<Forbidden />} />
              <Route path="/500" element={<InternalError />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/offline" element={<Offline />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          {isDashboard && <RightSidebar />}
        </div>
        {!isLoginPage && <MobileNav />}
        {!isLoginPage && <AIAssistant />}

        <CommandPalette isOpen={isSearchOpen} onClose={setIsSearchOpen} />

        <CookieConsentBanner
          isVisible={isBannerVisible}
          onAcceptAll={acceptAll}
          onRejectNonEssential={rejectNonEssential}
          onOpenPreferences={() => setShowCookiePrefs(true)}
          onDismiss={dismissBanner}
        />

        <CookiePreferencesModal
          isOpen={showCookiePrefs}
          onClose={() => setShowCookiePrefs(false)}
          currentConsent={consent}
          onSave={updateConsent}
        />
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <PlacementStateProvider>
              <AppContent />
            </PlacementStateProvider>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
