import React from 'react';
import { Bot, Brain, Dumbbell, Trophy } from 'lucide-react';
import { AppMode } from '../types';

interface TypingIndicatorProps {
  mode: AppMode;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ mode }) => {
  const getThemeStyles = () => {
    switch (mode) {
      case 'learning':
        return {
          bg: 'bg-sky-600',
          dot: 'bg-sky-400',
          icon: <Brain size={18} />
        };
      case 'practice':
        return {
          bg: 'bg-orange-500',
          dot: 'bg-orange-400',
          icon: <Dumbbell size={18} />
        };
      case 'test':
        return {
          bg: 'bg-rose-600',
          dot: 'bg-rose-400',
          icon: <Trophy size={18} />
        };
      default:
        return {
          bg: 'bg-indigo-600',
          dot: 'bg-indigo-400',
          icon: <Bot size={18} />
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div className="flex w-full mb-6 justify-start">
      <div className="flex flex-row items-end gap-2">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center animate-pulse transition-colors duration-300 ${theme.bg}`}>
            {theme.icon}
        </div>
        <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm flex gap-1 items-center h-12">
          <span className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s] ${theme.dot}`}></span>
          <span className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s] ${theme.dot}`}></span>
          <span className={`w-2 h-2 rounded-full animate-bounce ${theme.dot}`}></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;