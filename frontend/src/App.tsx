import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AlgorithmPatternsPage from './pages/AlgorithmPatternsPage';
import SystemDesignPatternsPage from './pages/SystemDesignPatternsPage';
import ProblemsPage from './pages/ProblemsPage';
import CanvasPage from './pages/CanvasPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col bg-surface text-white">
        <Navbar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/algorithms" element={<AlgorithmPatternsPage />} />
            <Route path="/system-design" element={<SystemDesignPatternsPage />} />
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/canvas" element={<CanvasPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
