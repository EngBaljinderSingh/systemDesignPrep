import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AlgorithmPatternsPage from './pages/AlgorithmPatternsPage';
import SystemDesignPatternsPage from './pages/SystemDesignPatternsPage';
import DesignPatternsPage from './pages/DesignPatternsPage';
import LearningHubPage from './pages/LearningHubPage';
import ProblemsPage from './pages/ProblemsPage';
import CanvasPage from './pages/CanvasPage';
import CodeEditorPage from './pages/CodeEditorPage';
import InterviewQuestionsPage from './pages/InterviewQuestionsPage';
import HackerRankPage from './pages/HackerRankPage';
import MockInterviewPage from './pages/MockInterviewPage';
import { ThemeProvider, useTheme } from './ThemeContext';

function AppContent() {
  const { theme } = useTheme();
  return (
    <BrowserRouter>
      <div className={`h-screen flex flex-col bg-surface ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
        <Navbar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/algorithms" element={<AlgorithmPatternsPage />} />
            <Route path="/system-design" element={<SystemDesignPatternsPage />} />
            <Route path="/design-patterns" element={<DesignPatternsPage />} />
            <Route path="/learning" element={<LearningHubPage />} />
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/code" element={<CodeEditorPage />} />
            <Route path="/canvas" element={<CanvasPage />} />
            <Route path="/interview-questions" element={<InterviewQuestionsPage />} />
            <Route path="/mock-interview" element={<MockInterviewPage />} />
            <Route path="/hackerrank" element={<HackerRankPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
