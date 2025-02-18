import { useState, useEffect } from 'react';
import { COMPETITION_END_TIME, TIMER_UNITS } from '../lib/constants';

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = COMPETITION_END_TIME - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        // Nếu đã hết thời gian
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center gap-4 my-4">
      {Object.entries(timeLeft).map(([unit, value], index) => (
        <div key={unit} className="text-center">
          <div className="bg-primary text-white rounded-lg p-3 min-w-[60px]">
            <span className="text-2xl font-bold">{value.toString().padStart(2, '0')}</span>
          </div>
          <div className="text-sm mt-1 text-gray-600">{TIMER_UNITS[index]}</div>
        </div>
      ))}
    </div>
  );
}