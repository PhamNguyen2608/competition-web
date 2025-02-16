import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

export function useExamNavigation() {
  const [showWarning, setShowWarning] = useState(false);
  const [attemptedPath, setAttemptedPath] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { answers, isSubmitted } = useAppSelector((state) => state.quiz);
  const answeredCount = Object.keys(answers).length;

  const handleNavigation = (to: string) => {
    if (!isSubmitted && location.pathname === '/exam/questions') {
      setAttemptedPath(to);
      setShowWarning(true);
      return false;
    }
    navigate(to);
    return true;
  };

  return {
    showWarning,
    answeredCount,
    handleNavigation,
    handleConfirm: () => {
      setShowWarning(false);
      if (attemptedPath) {
        navigate(attemptedPath);
      }
    },
    handleCancel: () => {
      setShowWarning(false);
      setAttemptedPath(null);
    }
  };
} 