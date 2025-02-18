import { Navigate } from 'react-router-dom';
import { useCompetitionStatus } from '../../hooks/useCompetitionStatus';
export function ExamGuard({ children }: { children: React.ReactNode }) {
  const { isEnded } = useCompetitionStatus();

  if (isEnded) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}