import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

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

  return (
    <div className="p-4 pb-6 w-full">
      <form 
        onSubmit={handleSubmit} 
        className="max-w-4xl mx-auto relative flex items-end gap-2 bg-slate-100 rounded-2xl p-2 border border-slate-200 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 transition-all"
      >
        <div className="pl-3 pb-3 text-slate-400">
            <Sparkles size={20} />
        </div>
        
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="כתוב הודעה..."
          className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-[120px] py-3 text-slate-800 placeholder-slate-400 text-base"
          rows={1}
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`
            p-3 rounded-xl flex-shrink-0 transition-all duration-200
            ${input.trim() && !isLoading 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
          `}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;