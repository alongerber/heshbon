
import React from 'react';
import { Message, Sender, AppMode } from '../types';
import { Bot, User, Brain, Dumbbell, Trophy } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
  mode: AppMode;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, mode }) => {
  const isBot = message.sender === Sender.Bot;

  // Theme configuration based on mode
  const getThemeStyles = () => {
    switch (mode) {
      case 'learning':
        return {
          botBg: 'bg-sky-600',
          botIcon: <Brain size={18} />,
          userBg: 'bg-sky-500',
        };
      case 'practice':
        return {
          botBg: 'bg-orange-500',
          botIcon: <Dumbbell size={18} />,
          userBg: 'bg-orange-400',
        };
      case 'test':
        return {
          botBg: 'bg-rose-600',
          botIcon: <Trophy size={18} />,
          userBg: 'bg-rose-500',
        };
      default:
        return {
          botBg: 'bg-indigo-600',
          botIcon: <Bot size={18} />,
          userBg: 'bg-indigo-500',
        };
    }
  };

  const theme = getThemeStyles();
  const userBgColor = mode === 'neutral' ? 'bg-emerald-500' : theme.userBg;

  // Function to render text and SVG mixed content
  const renderContent = (text: string) => {
    // Regex to split by [[SVG]]...[[/SVG]]
    const parts = text.split(/(\[\[SVG\]\][\s\S]*?\[\[\/SVG\]\])/g);

    return parts.map((part, index) => {
      if (part.startsWith('[[SVG]]')) {
        // Extract raw SVG and clean it up
        let svgContent = part.replace('[[SVG]]', '').replace('[[/SVG]]', '');
        
        // Remove markdown code blocks if the AI added them (```xml ... ```)
        svgContent = svgContent.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '');
        
        return (
          <div 
            key={index} 
            className="my-3 p-4 bg-white/90 rounded-xl overflow-hidden flex justify-center border-2 border-slate-100 shadow-sm"
            dangerouslySetInnerHTML={{ __html: svgContent }} 
          />
        );
      }
      // Render standard text
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'} animate-message`}>
      <div className={`flex max-w-[90%] md:max-w-[75%] ${isBot ? 'flex-row' : 'flex-row-reverse'} items-end gap-2`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isBot ? `${theme.botBg} text-white` : `${userBgColor} text-white`}`}>
            {isBot ? theme.botIcon : <User size={18} />}
        </div>

        {/* Bubble */}
        <div 
            className={`
                p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans transition-colors duration-300
                ${isBot 
                    ? 'bg-white text-slate-800 rounded-bl-none border border-slate-100' 
                    : `${userBgColor} text-white rounded-br-none`
                }
            `}
        >
            {renderContent(message.text)}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
