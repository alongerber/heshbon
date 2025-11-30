import React from 'react';
import { Message, Sender, AppMode } from './types';
import { Bot, User, Brain, Dumbbell, Trophy, Sparkles } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
  mode: AppMode;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, mode }) => {
  const isBot = message.sender === Sender.Bot;

  const getThemeConfig = () => {
    switch (mode) {
      case 'learning':
        return {
          gradient: 'bg-gradient-to-br from-sky-500 to-cyan-400',
          icon: <Brain size={18} />,
          userGradient: 'bg-gradient-to-br from-sky-400 to-cyan-300',
        };
      case 'practice':
        return {
          gradient: 'bg-gradient-to-br from-orange-500 to-amber-400',
          icon: <Dumbbell size={18} />,
          userGradient: 'bg-gradient-to-br from-orange-400 to-amber-300',
        };
      case 'test':
        return {
          gradient: 'bg-gradient-to-br from-rose-500 to-pink-400',
          icon: <Trophy size={18} />,
          userGradient: 'bg-gradient-to-br from-rose-400 to-pink-300',
        };
      default:
        return {
          gradient: 'bg-gradient-to-br from-indigo-500 to-purple-500',
          icon: <Sparkles size={18} />,
          userGradient: 'bg-gradient-to-br from-emerald-500 to-teal-400',
        };
    }
  };

  const theme = getThemeConfig();

  const renderContent = (text: string) => {
    const parts = text.split(/(\[\[SVG\]\][\s\S]*?\[\[\/SVG\]\])/g);

    return parts.map((part, index) => {
      if (part.startsWith('[[SVG]]')) {
        let svgContent = part.replace('[[SVG]]', '').replace('[[/SVG]]', '');
        svgContent = svgContent.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '');
        
        return (
          <div 
            key={index} 
            className="svg-container my-4"
            dangerouslySetInnerHTML={{ __html: svgContent }} 
          />
        );
      }

      // Handle fractions: [[FRAC]]numerator/denominator[[/FRAC]]
      const fracRegex = /\[\[FRAC\]\](\d+)\/(\d+)\[\[\/FRAC\]\]/g;
      const textWithFractions = part.split(fracRegex);
      
      if (textWithFractions.length > 1) {
        const elements: React.ReactNode[] = [];
        for (let i = 0; i < textWithFractions.length; i += 3) {
          if (textWithFractions[i]) {
            elements.push(<span key={`text-${i}`}>{textWithFractions[i]}</span>);
          }
          if (textWithFractions[i + 1] && textWithFractions[i + 2]) {
            elements.push(
              <span key={`frac-${i}`} className="fraction">
                <span className="numerator">{textWithFractions[i + 1]}</span>
                <span className="denominator">{textWithFractions[i + 2]}</span>
              </span>
            );
          }
        }
        return <span key={index}>{elements}</span>;
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div 
      className={`flex w-full mb-5 ${isBot ? 'justify-start' : 'justify-end'}`}
      style={{ 
        animation: `${isBot ? 'slideInLeft' : 'slideInRight'} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards` 
      }}
    >
      <div className={`flex max-w-[88%] md:max-w-[75%] ${isBot ? 'flex-row' : 'flex-row-reverse'} items-end gap-3`}>
        
        {/* Avatar */}
        <div 
          className={`
            avatar flex-shrink-0 
            ${isBot ? theme.gradient : theme.userGradient}
            shadow-lg
          `}
        >
          {isBot ? theme.icon : <User size={18} />}
        </div>

        {/* Bubble */}
        <div 
          className={`
            relative py-4 px-5 text-[15px] md:text-base leading-relaxed whitespace-pre-wrap
            transition-all duration-200
            ${isBot 
              ? 'bg-white text-slate-800 rounded-2xl rounded-br-2xl rounded-bl-md border border-slate-100 shadow-sm' 
              : `${theme.userGradient} text-white rounded-2xl rounded-bl-2xl rounded-br-md shadow-md`
            }
          `}
        >
          {/* Subtle gradient overlay for bot messages */}
          {isBot && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent rounded-2xl rounded-bl-md pointer-events-none" />
          )}
          
          <div className="relative">
            {renderContent(message.text)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
