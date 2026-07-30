import React from 'react';

interface ProgressRingProps {
  currentChapter: number;
  totalChapters?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  currentChapter,
  totalChapters = 18
}) => {
  const percentage = Math.round((currentChapter / totalChapters) * 100);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4 glass-card p-3 px-4 border border-white/10 my-2">
      {/* SVG Ring */}
      <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#E6C280"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute font-serif text-xs font-bold text-warmGold">
          {percentage}%
        </span>
      </div>

      {/* Progress Label & Glowing Dots */}
      <div className="flex-1 space-y-1 text-left">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
          Journey Progress
        </div>
        <div className="text-sm font-serif font-bold text-white">
          Chapter {currentChapter} / {totalChapters}
        </div>

        {/* 18 Glowing Dots Indicator */}
        <div className="flex items-center gap-1 pt-1 flex-wrap max-w-[190px]">
          {Array.from({ length: totalChapters }, (_, idx) => {
            const isCompleted = idx + 1 < currentChapter;
            const isCurrent = idx + 1 === currentChapter;
            return (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  isCompleted
                    ? 'bg-warmGold shadow-goldGlow'
                    : isCurrent
                    ? 'bg-softPink animate-pulse scale-125'
                    : 'bg-white/15'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
