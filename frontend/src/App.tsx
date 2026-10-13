import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Navbar from './components/Navbar';
import { ThemeProvider, useTheme } from './ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Dynamic route-based lazy loading — each route is an ultra-lightweight chunk (<50 kB)
const HomePage = lazy(() => import('./pages/HomePage'));
const HLDCaseStudiesPage = lazy(() => import('./pages/HLDCaseStudiesPage'));
const SystemDesignPatternsPage = lazy(() => import('./pages/SystemDesignPatternsPage'));
const AlgorithmPatternsPage = lazy(() => import('./pages/AlgorithmPatternsPage'));
const DesignPatternsPage = lazy(() => import('./pages/DesignPatternsPage'));
const LearningHubPage = lazy(() => import('./pages/LearningHubPage'));
const ProblemsPage = lazy(() => import('./pages/ProblemsPage'));
const InterviewQuestionsPage = lazy(() => import('./pages/InterviewQuestionsPage'));
const CanvasPage = lazy(() => import('./pages/CanvasPage'));
const CodeEditorPage = lazy(() => import('./pages/CodeEditorPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));
const HackerRankPage = lazy(() => import('./pages/HackerRankPage'));
const MockInterviewPage = lazy(() => import('./pages/MockInterviewPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const OpenRouterChat = lazy(() => import('./components/OpenRouterChat'));

// Production-grade skeleton loader shown inside the content container during tab transitions
function PageSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto animate-pulse">
      {/* Top glowing progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-indigo-400 to-amber-400 animate-pulse z-50"></div>

      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-28 bg-white/10 rounded-md"></div>
        <div className="h-9 w-80 max-w-full bg-white/15 rounded-xl"></div>
        <div className="h-4 w-96 max-w-full bg-white/10 rounded-md"></div>
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-gray-800/80 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 shrink-0"></div>
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-3/4 bg-white/15 rounded"></div>
                <div className="h-3 w-1/2 bg-white/10 rounded"></div>
              </div>
            </div>
            <div className="h-16 w-full bg-white/5 rounded-xl"></div>
            <div className="flex gap-2 pt-1">
              <div className="h-5 w-16 bg-white/10 rounded-md"></div>
              <div className="h-5 w-20 bg-white/10 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Prefetch remaining pages when the browser is idle
function useIdlePrefetch() {
  useEffect(() => {
    const idlePrefetch = () => {
      import('./pages/HLDCaseStudiesPage');
      import('./pages/SystemDesignPatternsPage');
      import('./pages/AlgorithmPatternsPage');
      import('./pages/ProblemsPage');
    };

    if ('requestIdleCallback' in window) {
      // @ts-ignore
      window.requestIdleCallback(idlePrefetch, { timeout: 2500 });
    } else {
      setTimeout(idlePrefetch, 1500);
    }
  }, []);
}

function MainRoutes() {
  const location = useLocation();

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hld-case-studies" element={<HLDCaseStudiesPage />} />
        <Route path="/system-design" element={<SystemDesignPatternsPage />} />
        <Route path="/algorithms" element={<AlgorithmPatternsPage />} />
        <Route path="/design-patterns" element={<DesignPatternsPage />} />
        <Route path="/learning" element={<LearningHubPage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/interview-questions" element={<InterviewQuestionsPage />} />
        <Route path="/canvas" element={<CanvasPage />} />
        <Route path="/code" element={<CodeEditorPage />} />
        <Route path="/hackerrank" element={<HackerRankPage />} />
        <Route path="/mock-interview" element={<MockInterviewPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/profile" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Suspense>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : true));
  useIdlePrefetch();

  return (
    <BrowserRouter>
      <div className={`h-screen flex bg-surface ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
        <Navbar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

        {/* Responsive container: no margin-left on mobile so content isn't shifted offscreen */}
        <div
          className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-200 ${
            sidebarOpen ? 'md:ml-56 ml-0' : 'md:ml-14 ml-0'
          }`}
        >
          {/* Mobile Top Bar */}
          <div
            className={`md:hidden flex items-center justify-between px-3 py-2.5 border-b shrink-0 z-20 ${
              theme === 'light' ? 'border-gray-200 bg-white' : 'border-gray-800 bg-surface'
            }`}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  theme === 'light' ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-white/10 text-gray-300'
                }`}
                aria-label="Open navigation menu"
                title="Open navigation menu"
              >
                <Menu size={19} />
              </button>
              <span className={`font-black text-sm tracking-tight ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                SDP<span className="text-primary-400">.prep</span>
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wide">
              100% Free
            </span>
          </div>

          <main className="flex-1 min-w-0 overflow-auto relative">
            <Suspense fallback={null}>
              <OpenRouterChat />
            </Suspense>
            <MainRoutes />
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
