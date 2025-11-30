import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Sender, AppMode } from './types';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import QuickActions from './QuickActions';
import { sendMessageToGemini, initializeChat, resetChat } from './geminiService';
import { Calculator, RotateCcw, Brain, Dumbbell, Trophy, Sparkles } from 'lucide-react';

type FlowStep = 'name' | 'gender' | 'menu' | 'topics' | 'chat';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AppMode>('neutral');
  const [step, setStep] = useState<FlowStep>('name');
  const [userName, setUserName] = useState<string>('');
  const [userGender, setUserGender] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startApp = async () => {
      setMessages([
        {
          id: uuidv4(),
          text: "היי! 👋\nאני גאון החשבון - המורה הפרטי שלך!\n\nאני כאן לעזור לך להתכונן למבחן.\nאיך קוראים לך?",
          sender: Sender.Bot,
          timestamp: new Date()
        }
      ]);
    };
    startApp();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, step]);

  const detectMode = (text: string): AppMode | null => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('לימוד') || lowerText.includes('ללמוד') || lowerText.includes('חדש')) return 'learning';
    if (lowerText.includes('תרגול') || lowerText.includes('לתרגל')) return 'practice';
    if (lowerText.includes('מבחן') || lowerText.includes('סימולציה') || lowerText.includes('תבחן')) return 'test';
    return null;
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: uuidv4(),
      text,
      sender: Sender.User,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 1. NAME STEP
      if (step === 'name') {
        const name = text.trim();
        setUserName(name);
        setStep('gender');
        
        setTimeout(() => {
          const botMsg: Message = {
            id: uuidv4(),
            text: `נעים מאוד ${name}! 😊\n\nכדי שאדע איך לדבר איתך...\nאתה בן או את בת?`,
            sender: Sender.Bot,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMsg]);
          setIsLoading(false);
        }, 600);
        return;
      }

      // 2. GENDER STEP
      if (step === 'gender') {
        let gender = 'neutral';
        if (text.includes('בן') || text.includes('זכר')) gender = 'בן';
        if (text.includes('בת') || text.includes('נקבה')) gender = 'בת';
        
        setUserGender(gender);
        setStep('menu');

        await initializeChat(userName, gender);

        setTimeout(() => {
          const botMsg: Message = {
            id: uuidv4(),
            text: `מעולה ${userName}! הכל מוכן 🚀\n\nאז מה בא לך לעשות היום?`,
            sender: Sender.Bot,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMsg]);
          setIsLoading(false);
        }, 600);
        return;
      }

      // 3. MENU STEP
      if (step === 'menu') {
        const newMode = detectMode(text);
        if (newMode) setMode(newMode);
        
        if (newMode === 'test') {
          setStep('chat');
        } else {
          setStep('topics');
          setTimeout(() => {
            const botMsg: Message = {
              id: uuidv4(),
              text: `בחירה מצוינת! 🎯\n\nבאיזה נושא נתמקד?`,
              sender: Sender.Bot,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            setIsLoading(false);
          }, 600);
          return;
        }
      }

      // 4. TOPICS STEP
      if (step === 'topics') {
        setStep('chat');
      }

      // NORMAL CHAT
      const responseText = await sendMessageToGemini(text);
      
      const botMsg: Message = {
        id: uuidv4(),
        text: responseText,
        sender: Sender.Bot,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, {
        id: uuidv4(),
        text: "אופס, הייתה לי תקלה קטנה 😅\nבוא ננסה שוב!",
        sender: Sender.Bot,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setMode('neutral');
    setStep('name');
    setUserName('');
    setUserGender('');
    setIsLoading(false);
    resetChat();
    setTimeout(() => {
      setMessages([
        {
          id: uuidv4(),
          text: "היי! 👋\nאני גאון החשבון - המורה הפרטי שלך!\n\nאני כאן לעזור לך להתכונן למבחן.\nאיך קוראים לך?",
          sender: Sender.Bot,
          timestamp: new Date()
        }
      ]);
    }, 500);
  };

  const handleChangeTopic = () => {
    setStep('topics');
    setMode('neutral');
    const botMsg: Message = {
      id: uuidv4(),
      text: "אין בעיה! 🔄\n\nבאיזה נושא תרצה להתמקד עכשיו?",
      sender: Sender.Bot,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMsg]);
  };

  const getModeConfig = () => {
    switch (mode) {
      case 'learning':
        return {
          bg: 'bg-gradient-to-b from-sky-50 to-cyan-50',
          header: 'bg-gradient-to-r from-sky-500 to-cyan-400',
          headerText: 'מצב לימוד',
          icon: <Brain size={22} />,
          shadow: 'shadow-sky-500/20',
        };
      case 'practice':
        return {
          bg: 'bg-gradient-to-b from-orange-50 to-amber-50',
          header: 'bg-gradient-to-r from-orange-500 to-amber-400',
          headerText: 'מצב תרגול',
          icon: <Dumbbell size={22} />,
          shadow: 'shadow-orange-500/20',
        };
      case 'test':
        return {
          bg: 'bg-gradient-to-b from-rose-50 to-pink-50',
          header: 'bg-gradient-to-r from-rose-500 to-pink-400',
          headerText: 'סימולציית מבחן',
          icon: <Trophy size={22} />,
          shadow: 'shadow-rose-500/20',
        };
      default:
        return {
          bg: 'bg-gradient-to-b from-slate-50 to-indigo-50',
          header: 'bg-gradient-to-r from-indigo-500 to-purple-500',
          headerText: 'גאון החשבון',
          icon: <Sparkles size={22} />,
          shadow: 'shadow-indigo-500/20',
        };
    }
  };

  const config = getModeConfig();

  return (
    <div className={`flex flex-col h-full transition-all duration-500 ${config.bg}`}>
      {/* Header */}
      <header 
        className={`
          ${config.header} 
          px-5 py-4 
          flex items-center justify-between 
          shadow-lg ${config.shadow}
          transition-all duration-500
        `}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
            {config.icon}
          </div>
          <div className="text-white">
            <h1 className="text-lg font-bold tracking-tight">
              {config.headerText}
            </h1>
            <p className="text-xs text-white/80 font-medium">
              {userName ? `שלום ${userName}!` : 'המורה הפרטי שלך'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleReset}
          className="
            p-2.5 rounded-xl
            text-white/70 hover:text-white 
            hover:bg-white/20 
            transition-all duration-200
            active:scale-95
          "
          title="התחל מחדש"
          aria-label="התחל מחדש"
        >
          <RotateCcw size={20} />
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} mode={mode} />
          ))}
          
          {isLoading && <TypingIndicator mode={mode} />}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="glass-effect border-t border-white/50 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="pt-3 px-4">
            <QuickActions 
              mode={mode} 
              step={step} 
              onAction={handleSendMessage}
              onChangeTopic={handleChangeTopic}
              isLoading={isLoading} 
            />
          </div>
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;
