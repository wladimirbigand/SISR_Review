import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Sparkles, Target } from 'lucide-react';
import Breadcrumb from '../components/Layout/Breadcrumb';
import Stepper from '../components/Situation/Stepper';
import StepViewer from '../components/Situation/StepViewer';
import QuizQuestion from '../components/Quiz/QuizQuestion';
import QuizResult from '../components/Quiz/QuizResult';
import RecapCard from '../components/Recap/RecapCard';
import { situations } from '../data/situations';

const PHASES = {
  STEPS: 'steps',
  QUIZ_INTRO: 'quiz_intro',
  QUIZ: 'quiz',
  RESULT: 'result',
  RECAP: 'recap',
};

export default function SituationPage({ progress }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const situation = situations.find((s) => String(s.id) === String(id));

  if (!situation) return <Navigate to="/" replace />;

  const sProgress = progress.getSituationProgress(situation.id);
  const [stepIndex, setStepIndex] = useState(
    Math.min(sProgress.currentStep ?? 0, situation.steps.length - 1),
  );
  const [phase, setPhase] = useState(PHASES.STEPS);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  const readSet = useMemo(
    () => new Set(progress.getSituationProgress(situation.id).readSteps ?? []),
    [progress, situation.id],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stepIndex, phase, quizIndex]);

  const handleNext = () => {
    if (stepIndex < situation.steps.length - 1) {
      const next = stepIndex + 1;
      setStepIndex(next);
      progress.setCurrentStep(situation.id, next);
    } else {
      setPhase(PHASES.QUIZ_INTRO);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      const prev = stepIndex - 1;
      setStepIndex(prev);
      progress.setCurrentStep(situation.id, prev);
    }
  };

  const handleMarkRead = () => {
    progress.markStepRead(situation.id, stepIndex);
  };

  const handleQuizValidate = (right) => {
    if (right) setQuizScore((s) => s + 1);
  };

  const handleQuizNext = () => {
    if (quizIndex < situation.quiz.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      progress.setQuizResult(
        situation.id,
        quizScore,
        situation.quiz.length,
        situation.steps.length,
      );
      setPhase(PHASES.RESULT);
    }
  };

  const handleRetry = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setStepIndex(0);
    progress.setCurrentStep(situation.id, 0);
    setPhase(PHASES.STEPS);
  };

  const startQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setPhase(PHASES.QUIZ);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-12">
      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' },
          { label: `Situation ${situation.number}` },
        ]}
      />

      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs uppercase tracking-wider text-primary font-bold">
            Situation {String(situation.number).padStart(2, '0')}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink leading-tight">
          {situation.title}
        </h1>
        <div className="mt-3 inline-flex items-start gap-2 max-w-3xl rounded-xl bg-bg-card border border-border px-4 py-3">
          <Target size={16} className="text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-ink leading-relaxed">
            <span className="font-semibold">Objectif : </span>
            <span className="text-ink-soft">{situation.objective}</span>
          </p>
        </div>
      </header>

      {phase === PHASES.STEPS && (
        <>
          <div className="mb-5">
            <Stepper
              total={situation.steps.length}
              current={stepIndex}
              readSet={readSet}
              onJump={(i) => {
                setStepIndex(i);
                progress.setCurrentStep(situation.id, i);
              }}
            />
          </div>
          <StepViewer
            step={situation.steps[stepIndex]}
            stepIndex={stepIndex}
            totalSteps={situation.steps.length}
            onPrev={handlePrev}
            onNext={handleNext}
            onMarkRead={handleMarkRead}
          />
        </>
      )}

      {phase === PHASES.QUIZ_INTRO && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-card border border-border rounded-2xl shadow-card p-8 sm:p-12 text-center"
        >
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-5 bg-primary/10">
            <GraduationCap size={36} className="text-primary" strokeWidth={2} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink">
            C'est l'heure du Quiz&nbsp;!
          </h2>
          <p className="text-ink-soft mt-2 max-w-md mx-auto">
            5 questions pour vérifier que tu as bien retenu les commandes,
            directives et bonnes pratiques de cette situation.
          </p>
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => setPhase(PHASES.STEPS)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-ink hover:bg-bg-page transition-colors"
            >
              Revoir les étapes
            </button>
            <button
              onClick={startQuiz}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors shadow-sm"
            >
              Commencer le quiz
            </button>
          </div>
        </motion.div>
      )}

      {phase === PHASES.QUIZ && (
        <QuizQuestion
          key={quizIndex}
          question={situation.quiz[quizIndex]}
          index={quizIndex}
          total={situation.quiz.length}
          onValidate={handleQuizValidate}
          onNext={handleQuizNext}
        />
      )}

      {phase === PHASES.RESULT && (
        <QuizResult
          score={quizScore}
          total={situation.quiz.length}
          onRetry={handleRetry}
          onShowRecap={() => setPhase(PHASES.RECAP)}
          onGoHome={() => navigate('/')}
        />
      )}

      {phase === PHASES.RECAP && (
        <>
          <div className="mb-4 inline-flex items-center gap-2 text-sm text-ink-soft no-print">
            <Sparkles size={15} className="text-primary" />
            Fiche de rappel pour le jour J
          </div>
          <RecapCard situation={situation} />
        </>
      )}
    </main>
  );
}
