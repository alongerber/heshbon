
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Sender, AppMode } from './types';
import ChatBubble from './components/ChatBubble';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import QuickActions from './components/QuickActions';
import { sendMessageToGemini, initializeChat, resetChat } from './services/geminiService';
import { Calculator, RotateCcw, Brain, Dumbbell, Trophy } from 'lucide-react';

// Flow steps: name -> gender -> menu -> topics -> chat
type FlowStep = 'name' | 'gender' | 'menu' | 'topics' | 'chat';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AppMode>('neutral');
  const [step, setStep] = useState<FlowStep>('name');
  
  // User Data
  const [userName, setUserName] = useState<string>('');
  const [userGender, setUserGender] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start with a simple greeting asking for name
    const startApp = async () => {
        setMessages([
            {
                id: uuidv4(),
                text: "היי! ברוכים הבאים ל-גאון החשבון! 🤖\nאני אעזור לכם להתכונן למבחן מחר.\n\nאיך קוראים לך?",
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
    // Add user message
    const userMsg: Message = {
      id: uuidv4(),
      text,
      sender: Sender.User,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
        // --- LOGIC FLOW HANDLER ---
        
        // 1. NAME STEP
        if (step === 'name') {
            const name = text.trim();
            setUserName(name);
            setStep('gender');
            
            setTimeout(() => {
                const botMsg: Message = {
                    id: uuidv4(),
                    text: `נעים מאוד ${name}! 😍\nכדי שאדע איך לדבר איתך...\nאתה בן 👦 או את בת 👧?`,
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

            // Initialize AI
            await initializeChat(userName, gender);

            setTimeout(() => {
                const botMsg: Message = {
                    id: uuidv4(),
                    text: `מעולה! הכל מוכן.\nאז מה בא לך לעשות היום?\n\n🧠 **לימוד** - נבין הכל לעומק\n💪 **תרגול** - נחזק את השריר\n🏆 **מבחן** - סימולציה למבחן`,
                    sender: Sender.Bot,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMsg]);
                setIsLoading(false);
            }, 600);
            return;
        }

        // 3. MENU STEP -> GO TO TOPICS (OR CHAT IF TEST)
        if (step === 'menu') {
             const newMode = detectMode(text);
             if (newMode) setMode(newMode);
             
             if (newMode === 'test') {
                 // Test is mixed topics, go straight to chat
                 setStep('chat');
             } else {
                 // Learning/Practice needs a topic
                 setStep('topics');
                 setTimeout(() => {
                    const botMsg: Message = {
                        id: uuidv4(),
                        text: `בחירה מצוינת! באיזה נושא נתמקד? 🧐`,
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
            // The text (e.g., "Fractions") will be sent to AI below to start the session
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
          text: "אופס, הייתה לי תקלה קטנה. נסה שוב.",
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
                text: "היי! ברוכים הבאים ל-גאון החשבון! 🤖\nאני אעזור לכם להתכונן למבחן מחר.\n\nאיך קוראים לך?",
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
            text: "אין בעיה! בוא נחליף נושא. מה בא לך עכשיו?",
            sender: Sender.Bot,
            timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
  };

  // Helper to get dynamic classes based on mode
  const getModeStyles = () => {
    switch (mode) {
        case 'learning':
            return {
                bg: 'bg-sky-50',
                header: 'bg-sky-600',
                headerText: 'מצב לימוד',
                icon: <Brain size={24} />,
            };
        case 'practice':
            return {
                bg: 'bg-orange-50',
                header: 'bg-orange-500',
                headerText: 'מצב תרגול',
                icon: <Dumbbell size={24} />,
            };
        case 'test':
            return {
                bg: 'bg-rose-50',
                header: 'bg-rose-600',
                headerText: 'סימולציית מבחן',
                icon: <Trophy size={24} />,
            };
        default:
            return {
                bg: 'bg-slate-50',
                header: 'bg-indigo-600',
                headerText: 'גאון החשבון',
                icon: <Calculator size={24} />,
            };
    }
  };

  const styles = getModeStyles();

  return (
    <div className={`flex flex-col h-full transition-colors duration-500 ${styles.bg} relative`}>
      {/* Header */}
      <header className={`border-b border-transparent px-6 py-4 flex items-center justify-between shadow-md z-10 text-white transition-colors duration-500 ${styles.header}`}>
        <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl text-white backdrop-blur-sm">
                {styles.icon}
            </div>
            <div>
                <h1 className="text-xl font-black tracking-wide">{styles.headerText}</h1>
                <p className="text-xs opacity-90 font-medium">המורה הפרטי שלך</p>
            </div>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleReset}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all"
                title="התחל מחדש"
            >
                <RotateCcw size={20} />
            </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
        <div className="max-w-4xl mx-auto">
            {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} mode={mode} />
            ))}
            
            {isLoading && <TypingIndicator mode={mode} />}
            
            <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="glass-effect border-t border-slate-200 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
         <div className="max-w-4xl mx-auto">
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