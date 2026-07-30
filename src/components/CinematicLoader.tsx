import React, { useEffect, useState } from 'react';

interface CinematicLoaderProps {
  onFinished?: () => void;
}

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({ onFinished }) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  const lines = [
    'Camera Ready ✓',
    'Microphone Ready ✓',
    'Journey Ready ✓',
    'Creating Memory...',
    'Loading Chapter One...'
  ];

  useEffect(() => {
    const currentLine = lines[lineIndex];

    if (charIndex < currentLine.length) {
      const timer = setTimeout(() => {
        setDisplayedText(currentLine.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 20);
      return () => clearTimeout(timer);
    }

    if (lineIndex < lines.length - 1) {
      const timer = setTimeout(() => {
        setLineIndex(lineIndex + 1);
        setCharIndex(0);
        setDisplayedText('');
      }, 150);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      if (onFinished) onFinished();
    }, 200);

    return () => clearTimeout(timer);
  }, [charIndex, lineIndex, onFinished]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="space-y-6 max-w-xs w-full">
        <div className="w-12 h-12 rounded-full border-2 border-warmGold/30 border-t-warmGold animate-spin mx-auto" />
        <div className="font-mono text-base md:text-lg font-semibold tracking-wider text-warmGold min-h-20 flex flex-col items-center justify-center">
          <p className="text-warmGold animate-pulse">{displayedText}</p>
        </div>
      </div>
    </div>
  );
};
