import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Focus input on mount
  useEffect(() => {
    if (textareaRef.current && !isLoading) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  return (
    <div className="p-4 pb-6 w-full">
      <form 
        onSubmit={handleSubmit} 
        className="
          max-w-4xl mx-auto relative flex items-end gap-3
          bg-white rounded-2xl p-2 
          border-2 border-slate-200
          focus-within:border-indigo-400 
          focus-within:shadow-lg focus-within:shadow-indigo-500/10
          transition-all duration-300
        "
      >
        {/* Icon */}
        <div className="pr-2 pb-3 text-slate-300">
          <MessageCircle size={22} />
        </div>
        
        {/* Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="כתוב הודעה..."
          aria-label="כתוב הודעה"
          className="
            w-full bg-transparent border-none 
            focus:ring-0 focus:outline-none
            resize-none max-h-[120px] py-3 
            text-slate-800 placeholder-slate-400 
            text-base leading-relaxed
          "
          rows={1}
          disabled={isLoading}
        />
        
        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="שלח הודעה"
          className={`
            p-3.5 rounded-xl flex-shrink-0 
            transition-all duration-300 ease-out
            ${input.trim() && !isLoading 
              ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-95' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
          `}
        >
          <Send size={20} className={input.trim() && !isLoading ? 'transform -rotate-45' : ''} />
        </button>
      </form>
      
      {/* Helper text */}
      <p className="text-center text-xs text-slate-400 mt-3">
        לחץ Enter לשליחה • Shift+Enter לשורה חדשה
      </p>
    </div>
  );
};

export default ChatInput;
