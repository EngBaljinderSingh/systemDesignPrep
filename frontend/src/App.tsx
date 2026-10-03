import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ThemeProvider, useTheme } from './ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Core study & interview pages — bundled directly for INSTANT 0ms tab switching
import HomePage from './pages/HomePage';
import HLDCaseStudiesPage from './pages/HLDCaseStudiesPage';
import SystemDesignPatternsPage from './pages/SystemDesignPatternsPage';
import AlgorithmPatternsPage from './pages/AlgorithmPatternsPage';
import DesignPatternsPage from './pages/DesignPatternsPage';
import LearningHubPage from './pages/LearningHubPage';
import ProblemsPage from './pages/ProblemsPage';
import InterviewQuestionsPage from './pages/InterviewQuestionsPage';
import ProfilePage from './pages/ProfilePage';

// Heavy secondary tools — isolated into lazy chunks to keep initial bundle light
const OpenRouterChat = lazy(() => import('./components/OpenRouterChat'));
const CanvasPage = lazy(() => import('./pages/CanvasPage'));
const CodeEditorPage = lazy(() => import('./pages/CodeEditorPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));
const HackerRankPage = lazy(() => import('./pages/HackerRankPage'));
const MockInterviewPage = lazy(() => import('./pages/MockInterviewPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Silently prefetch heavy pages after initial paint so they are instant when clicked
function useBackgroundPrefetch() {
  useEffect(() => {
    const prefetch = () => {
      import('./pages/CanvasPage');
      import('./pages/CodeEditorPage');
      import('./pages/ResumePage');
      import('./components/OpenRouterChat');
    };
    if ('requestIdleCallback' in window) {
      // @ts-ignore
      window.requestIdleCallback(prefetch, { timeout: 3000 });
    } else {
      setTimeout(prefetch, 2000);
    }
  }, []);
}

function RouteLoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-gray-400 font-mono">Loading tool...</span>
      </div>
    </div>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useBackgroundPrefetch();

  return (
    <BrowserRouter>
      <div className={`h-screen flex bg-surface ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
        <Navbar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
        {/* Offset for the fixed sidebar */}
        <div
          className="flex-1 flex flex-col overflow-hidden transition-all duration-200"
          style={{ marginLeft: sidebarOpen ? '224px' : '56px' }}
        >
          <main className="flex-1 overflow-auto">
            <Suspense fallback={null}>
              <OpenRouterChat />
            </Suspense>
            <Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/algorithms" element={<AlgorithmPatternsPage />} />
                <Route path="/system-design" element={<SystemDesignPatternsPage />} />
                <Route path="/hld-case-studies" element={<HLDCaseStudiesPage />} />
                <Route path="/design-patterns" element={<DesignPatternsPage />} />
                <Route path="/learning" element={<LearningHubPage />} />
                <Route path="/problems" element={<ProblemsPage />} />
                <Route path="/code" element={<CodeEditorPage />} />
                <Route path="/canvas" element={<CanvasPage />} />
                <Route path="/interview-questions" element={<InterviewQuestionsPage />} />
                <Route path="/mock-interview" element={<MockInterviewPage />} />
                <Route path="/hackerrank" element={<HackerRankPage />} />
                <Route path="/resume" element={<ResumePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
