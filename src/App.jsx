import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/ToastProvider/ToastProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { PlacementStateProvider } from './context/PlacementStateContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard/Dashboard';
import { InlineLoading } from './components/Loading/InlineLoading';

import Sidebar from './components/Sidebar/Sidebar';
import RightSidebar from './components/Sidebar/RightSidebar';
import CommandPalette from './components/CommandPalette/CommandPalette';
import MobileHeader from './components/MobileHeader/MobileHeader';
import MobileNav from './components/MobileNav/MobileNav';

import Welcome from './pages/Auth/Welcome';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { OfflineIndicator } from './components/OfflineIndicator/OfflineIndicator';
import { CookieConsentBanner } from './components/CookieConsent/CookieConsentBanner';
import { CookiePreferencesModal } from './components/CookieConsent/CookiePreferencesModal';
import { useCookieConsent } from './hooks/useCookieConsent';

const lazyNamed = (loader, name) => lazy(() => loader().then((module) => ({ default: module[name] })));

const CreateSubject = lazy(() => import('./pages/CreateSubject/CreateSubject'));
const SubjectView = lazy(() => import('./pages/SubjectView/SubjectView'));
const TopicStudy = lazy(() => import('./pages/TopicStudy/TopicStudy'));
const FlashcardsStudy = lazy(() => import('./pages/TopicStudy/FlashcardsStudy'));
const SearchPage = lazy(() => import('./pages/SearchPage/SearchPage'));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage/BookmarksPage'));
const CreateQuestionBank = lazy(() => import('./pages/CreateQuestionBank/CreateQuestionBank'));
const QuestionBankView = lazy(() => import('./pages/QuestionBankView/QuestionBankView'));
const MockExamSetup = lazy(() => import('./components/MockExamSimulator/MockExamSetup'));
const MockExamSession = lazy(() => import('./components/MockExamSimulator/MockExamSession'));
const MockExamResults = lazy(() => import('./components/MockExamSimulator/MockExamResults'));
const SkillRoadmap = lazy(() => import('./pages/SkillRoadmap/SkillRoadmap'));
const Placement = lazy(() => import('./pages/Placement/Placement'));
const AptitudePractice = lazy(() => import('./pages/Placement/AptitudePractice'));
const TechnicalInterview = lazy(() => import('./pages/Placement/TechnicalInterview'));
const HRInterview = lazy(() => import('./pages/Placement/HRInterview'));
const LearnMode = lazy(() => import('./pages/Placement/LearnMode'));
const CodingPractice = lazy(() => import('./pages/CodingPractice/CodingPractice'));
const CodingWorkspace = lazy(() => import('./pages/CodingPractice/CodingWorkspace'));
const LearningWorkspace = lazy(() => import('./pages/CodingPractice/LearningWorkspace'));
const StudyPlanner = lazy(() => import('./pages/StudyPlanner/StudyPlanner'));
const AIAssistant = lazy(() => import('./components/AIAssistant/AIAssistant'));
const Login = lazy(() => import('./pages/Login/Login'));

const PrivacyPolicy = lazyNamed(() => import('./pages/Legal/PrivacyPolicy'), 'PrivacyPolicy');
const TermsAndConditions = lazyNamed(() => import('./pages/Legal/TermsAndConditions'), 'TermsAndConditions');
const CookiePolicy = lazyNamed(() => import('./pages/Legal/CookiePolicy'), 'CookiePolicy');
const Disclaimer = lazyNamed(() => import('./pages/Legal/Disclaimer'), 'Disclaimer');
const SecurityPolicy = lazyNamed(() => import('./pages/Legal/SecurityPolicy'), 'SecurityPolicy');
const CommunityGuidelines = lazyNamed(() => import('./pages/Legal/CommunityGuidelines'), 'CommunityGuidelines');

const ForgotPassword = lazyNamed(() => import('./pages/Auth/ForgotPassword'), 'ForgotPassword');
const ResetPassword = lazyNamed(() => import('./pages/Auth/ResetPassword'), 'ResetPassword');

const AccountSettings = lazyNamed(() => import('./pages/Settings/AccountSettings'), 'AccountSettings');
const Support = lazyNamed(() => import('./pages/Support/Support'), 'Support');
const HelpCenter = lazyNamed(() => import('./pages/Help/HelpCenter'), 'HelpCenter');
const HelpArticle = lazyNamed(() => import('./pages/Help/HelpArticle'), 'HelpArticle');

const NotFound = lazyNamed(() => import('./pages/Errors/NotFound'), 'NotFound');
const Forbidden = lazyNamed(() => import('./pages/Errors/Forbidden'), 'Forbidden');
const InternalError = lazyNamed(() => import('./pages/Errors/InternalError'), 'InternalError');
const Maintenance = lazyNamed(() => import('./pages/Errors/Maintenance'), 'Maintenance');
const Offline = lazyNamed(() => import('./pages/Errors/Offline'), 'Offline');

function AppContent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
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

  const { user, loading: authLoading } = useAuth();
  const [showCookiePrefs, setShowCookiePrefs] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => {
    return localStorage.getItem('hasSeenWelcome') === 'true';
  });
  const [currentActivity, setCurrentActivity] = useState('general');
  const [currentTopic, setCurrentTopic] = useState(null);

  useEffect(() => {
    const handler = () => setShowCookiePrefs(true);
    window.addEventListener('openCookiePrefs', handler);
    return () => window.removeEventListener('openCookiePrefs', handler);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCloseWelcome = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setHasSeenWelcome(true);
  };

  const showWelcome = !authLoading && !user && !hasSeenWelcome && isDashboard && !isLoginPage;

  // Detect current activity and topic based on URL
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/' || path === '/dashboard') {
      setCurrentActivity('general');
      setCurrentTopic(null);
    } else if (path.startsWith('/coding')) {
      setCurrentActivity('coding');
      setCurrentTopic(null);
    } else if (path.startsWith('/placement')) {
      setCurrentActivity('placement');
      setCurrentTopic(null);
    } else if (path === '/planner') {
      setCurrentActivity('planning');
      setCurrentTopic(null);
    } else if (path.startsWith('/topic/')) {
      setCurrentActivity('topic');
      // Extract topic ID and try to get topic title
      const topicId = path.replace('/topic/', '');
      // Could fetch topic title from store if needed
      setCurrentTopic(topicId);
    } else if (path.startsWith('/flashcards')) {
      setCurrentActivity('flashcards');
      setCurrentTopic(null);
    } else if (path.startsWith('/subject/')) {
      setCurrentActivity('subject');
      setCurrentTopic(null);
    } else {
      setCurrentActivity('general');
      setCurrentTopic(null);
    }
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      {showWelcome && <Welcome onClose={handleCloseWelcome} />}
      <div className="app-layout">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <OfflineIndicator />
        {!isLoginPage && <Sidebar />}
        {!isLoginPage && <MobileHeader onSearchClick={() => setIsSearchOpen(true)} />}
        <div className="content-container">
          <main
            id="main-content"
            tabIndex={-1}
            className={`main-content-wrapper ${isLoginPage ? 'full-width' : ''} ${!isDashboard ? 'no-right-sidebar' : ''}`}
          >
            <Suspense fallback={<div className="route-loading"><InlineLoading text="Loading…" size="md" /></div>}>
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
              <Route path="/placement/:categoryId/learn/:topicId" element={<LearnMode />} />
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
            </Suspense>
          </main>
          {isDashboard && <RightSidebar />}
        </div>
        {!isLoginPage && <MobileNav />}
        {!isLoginPage && (
          <Suspense fallback={null}>
            <AIAssistant currentActivity={currentActivity} currentTopic={currentTopic} />
          </Suspense>
        )}

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
