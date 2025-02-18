import { useState, useEffect } from 'react';
import { COMPETITION_END_TIME } from '../lib/constants';

export function useCompetitionStatus() {
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date().getTime();
      setIsEnded(now >= COMPETITION_END_TIME);
    };

    checkStatus();
    const timer = setInterval(checkStatus, 1000);

    return () => clearInterval(timer);
  }, []);

  return { isEnded };
}