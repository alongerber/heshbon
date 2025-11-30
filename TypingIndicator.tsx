import React from 'react';
import { AppMode } from './types';
import { Brain, Dumbbell, Trophy, Sparkles } from 'lucide-react';

interface TypingIndicatorProps {
  mode: AppMode;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ mode }) => {
  const getThemeConfig = () => {
    switch (mode) {
      case 'learning':
        return {
          gradient: 'bg-gradient-to-br from-sky-500 to-cyan-400',
          icon: <Brain size={18} />,
        };
      case 'practice':
        return {
          gradient: 'bg-gradient-to-br from-orange-500 to-amber-400',
          icon: <Dumbbell size={18} />,
        };
      case 'test':
        return {
          gradient: 'bg-gradient-to-br from-rose-500 to-pink-400',
          icon: <Trophy size={18} />,
        };
      default:
        return {
          gradient: 'bg-gradient-to-br from-indigo-500 to-purple-500',
          icon: <Sparkles size={18} />,
        };
    }
  };

  const theme = getThemeConfig();

  return (
    <div className="flex w-full mb-5 justify-start animate-fade-in">
      <div className="flex max-w-[88%] md:max-w-[75%] flex-row items-end gap-3">
        
        {/* Avatar */}
        <div 
          className={`
            avatar flex-shrink-0 
            ${theme.gradient}
            shadow-lg
            animate-pulse-soft
          `}
        >
          {theme.icon}
        </div>

        {/* Typing Bubble */}
        <div 
          className="
            bg-white 
            py-4 px-6 
            rounded-2xl rounded-bl-md 
            border border-slate-100 
            shadow-sm
          "
        >
          <div className="flex items-center gap-1.5">
            <div 
              className="typing-dot"
              style={{ animationDelay: '0ms' }}
            />
            <div 
              className="typing-dot"
              style={{ animationDelay: '150ms' }}
            />
            <div 
              className="typing-dot"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
