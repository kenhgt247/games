
import React, { useEffect, useState } from 'react';

export const Celebration: React.FC<{ onComplete: () => void; message: string }> = ({ onComplete, message }) => {
  const [stars, setStars] = useState<{ id: number; left: string; top: string; size: string; delay: string }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      top: `${Math.random() * 60 + 10}%`,
      size: `${Math.random() * 20 + 20}px`,
      delay: `${Math.random() * 0.5}s`,
    }));
    setStars(newStars);

    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm pointer-events-none">
      <div className="text-4xl md:text-6xl font-bold text-pink-500 animate-bounce text-center px-4">
        {message}
      </div>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute star-pop text-yellow-400 opacity-80"
          style={{
            left: star.left,
            top: star.top,
            fontSize: star.size,
            animationDelay: star.delay,
          }}
        >
          ⭐
        </div>
      ))}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Simple CSS Fireworks imitation */}
        <div className="firework-container"></div>
      </div>
    </div>
  );
};
