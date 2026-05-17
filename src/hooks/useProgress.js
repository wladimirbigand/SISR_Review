import { useCallback, useEffect, useState } from 'react';
import { situations } from '../data/situations';

const STORAGE_KEY = 'sisr-review-progress-v1';

function buildInitialState() {
  const perSituation = {};
  for (const s of situations) {
    perSituation[s.id] = {
      currentStep: 0,
      readSteps: [],
      quizScore: null,
      quizDone: false,
      completed: false,
    };
  }
  return { situations: perSituation };
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildInitialState();
    const parsed = JSON.parse(raw);
    const base = buildInitialState();
    if (parsed && parsed.situations) {
      for (const id of Object.keys(base.situations)) {
        if (parsed.situations[id]) {
          base.situations[id] = { ...base.situations[id], ...parsed.situations[id] };
        }
      }
    }
    return base;
  } catch {
    return buildInitialState();
  }
}

export function useProgress() {
  const [state, setState] = useState(loadFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota errors */
    }
  }, [state]);

  const update = useCallback((situationId, patch) => {
    setState((prev) => {
      const current = prev.situations[situationId] ?? {};
      return {
        ...prev,
        situations: {
          ...prev.situations,
          [situationId]: { ...current, ...patch },
        },
      };
    });
  }, []);

  const markStepRead = useCallback(
    (situationId, stepIndex) => {
      setState((prev) => {
        const current = prev.situations[situationId] ?? {};
        const readSteps = current.readSteps ?? [];
        if (readSteps.includes(stepIndex)) return prev;
        return {
          ...prev,
          situations: {
            ...prev.situations,
            [situationId]: {
              ...current,
              readSteps: [...readSteps, stepIndex],
            },
          },
        };
      });
    },
    [],
  );

  const setCurrentStep = useCallback(
    (situationId, stepIndex) => {
      update(situationId, { currentStep: stepIndex });
    },
    [update],
  );

  const setQuizResult = useCallback(
    (situationId, score, totalQuestions, totalSteps) => {
      setState((prev) => {
        const current = prev.situations[situationId] ?? {};
        const allRead = (current.readSteps ?? []).length >= totalSteps;
        return {
          ...prev,
          situations: {
            ...prev.situations,
            [situationId]: {
              ...current,
              quizScore: score,
              quizDone: true,
              completed: allRead && score === totalQuestions,
            },
          },
        };
      });
    },
    [],
  );

  const resetAll = useCallback(() => {
    setState(buildInitialState());
  }, []);

  const getSituationProgress = useCallback(
    (situationId) => state.situations[situationId] ?? buildInitialState().situations[situationId],
    [state],
  );

  const globalProgressPercent = (() => {
    const total = situations.length;
    let done = 0;
    for (const s of situations) {
      const p = state.situations[s.id];
      if (p?.completed) done += 1;
    }
    return Math.round((done / total) * 100);
  })();

  return {
    state,
    update,
    markStepRead,
    setCurrentStep,
    setQuizResult,
    resetAll,
    getSituationProgress,
    globalProgressPercent,
  };
}
