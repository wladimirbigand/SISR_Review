import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import SituationPage from './pages/SituationPage';
import { useProgress } from './hooks/useProgress';

export default function App() {
  const progress = useProgress();

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Header onReset={progress.resetAll} />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home progress={progress} />} />
            <Route
              path="/situation/:id"
              element={<SituationPage progress={progress} />}
            />
            <Route path="*" element={<Home progress={progress} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </HashRouter>
  );
}
