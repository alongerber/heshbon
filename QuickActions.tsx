import React from 'react';
import { 
  Lightbulb, 
  HelpCircle, 
  ArrowRight, 
  User, 
  GraduationCap, 
  Play, 
  PieChart, 
  Shapes, 
  Calculator, 
  Binary, 
  Shuffle,
  SkipForward,
  Sparkles
} from 'lucide-react';
import { AppMode } from './types';

interface QuickActionsProps {
  mode: AppMode;
  step: 'name' | 'gender' | 'menu' | 'topics' | 'chat';
  onAction: (text: string) => void;
  onChangeTopic: () => void;
  isLoading: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ mode, step, onAction, onChangeTopic, isLoading }) => {
  if (isLoading) return null;

  const renderButtons = () => {
    switch (step) {
      case 'gender':
        return (
          <>
            <ActionButton 
              onClick={() => onAction("אני בן 👦")} 
              variant="blue"
              icon={<User size={18} />}
            >
              אני בן 👦
            </ActionButton>
            <ActionButton 
              onClick={() => onAction("אני בת 👧")} 
              variant="pink"
              icon={<User size={18} />}
            >
              אני בת 👧
            </ActionButton>
          </>
        );

      case 'menu':
        return (
          <>
            <ActionButton 
              onClick={() => onAction("בוא נלמד נושא חדש")} 
              variant="sky"
              icon={<GraduationCap size={18} />}
              size="large"
            >
              🧠 רוצה ללמוד
            </ActionButton>
            <ActionButton 
              onClick={() => onAction("אני רוצה לתרגל")} 
              variant="orange"
              icon={<Play size={18} />}
              size="large"
            >
              💪 יאללה לתרגל
            </ActionButton>
            <ActionButton 
              onClick={() => onAction("תבחן אותי!")} 
              variant="rose"
              icon={<Sparkles size={18} />}
              size="large"
            >
              🏆 סימולציית מבחן
            </ActionButton>
          </>
        );

      case 'topics':
        return (
          <>
            <ActionButton 
              onClick={() => onAction("נושא: שברים")} 
              variant="purple"
              icon={<PieChart size={18} />}
            >
              🍕 שברים
            </ActionButton>
            <ActionButton 
              onClick={() => onAction("נושא: גיאומטריה")} 
              variant="emerald"
              icon={<Shapes size={18} />}
            >
              📐 גיאומטריה
            </ActionButton>
            <ActionButton 
              onClick={() => onAction("נושא: מספרים גדולים")} 
              variant="blue"
              icon={<Binary size={18} />}
            >
              💯 מספרים גדולים
            </ActionButton>
            <ActionButton 
              onClick={() => onAction("נושא: חיבור וחיסור")} 
              variant="amber"
              icon={<Calculator size={18} />}
            >
              ➕ חיבור וחיסור
            </ActionButton>
          </>
        );

      case 'chat':
        if (mode === 'learning') {
          return (
            <>
              <ActionButton 
                onClick={() => onAction("לא הבנתי, תסביר שוב")} 
                variant="slate"
                icon={<HelpCircle size={18} />}
              >
                לא הבנתי
              </ActionButton>
              <ActionButton 
                onClick={() => onAction("תן לי דוגמה")} 
                variant="indigo"
                icon={<Lightbulb size={18} />}
              >
                תן דוגמה
              </ActionButton>
              <ActionButton 
                onClick={() => onAction("הבנתי, בוא נמשיך")} 
                variant="emerald"
                icon={<ArrowRight size={18} />}
              >
                הבנתי ✓
              </ActionButton>
              <Divider />
              <ActionButton 
                onClick={onChangeTopic} 
                variant="ghost"
                icon={<Shuffle size={18} />}
              >
                החלף נושא
              </ActionButton>
            </>
          );
        }

        if (mode === 'practice') {
          return (
            <>
              <ActionButton 
                onClick={() => onAction("תן לי רמז קטן")} 
                variant="amber"
                icon={<Lightbulb size={18} />}
              >
                💡 תן רמז
              </ActionButton>
              <ActionButton 
                onClick={() => onAction("אני לא יודע, תגלה לי")} 
                variant="slate"
                icon={<HelpCircle size={18} />}
              >
                לא יודע
              </ActionButton>
              <Divider />
              <ActionButton 
                onClick={onChangeTopic} 
                variant="ghost"
                icon={<Shuffle size={18} />}
              >
                החלף נושא
              </ActionButton>
            </>
          );
        }

        if (mode === 'test') {
          return (
            <>
              <ActionButton 
                onClick={() => onAction("אני לא יודע, תעבור הלאה")} 
                variant="slate"
                icon={<SkipForward size={18} />}
              >
                דלג על שאלה
              </ActionButton>
              <Divider />
              <ActionButton 
                onClick={onChangeTopic} 
                variant="ghost"
                icon={<Shuffle size={18} />}
              >
                צא מהמבחן
              </ActionButton>
            </>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-2 animate-fade-in">
      {renderButtons()}
    </div>
  );
};

// Divider Component
const Divider: React.FC = () => (
  <div className="hidden md:block w-px h-8 bg-slate-200 mx-1 self-center" />
);

// Button variants configuration
const variants: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300',
  pink: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 hover:border-pink-300',
  sky: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 hover:border-sky-300',
  orange: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 hover:border-orange-300',
  rose: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300',
  amber: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300',
  purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:border-purple-300',
  slate: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300',
  ghost: 'bg-transparent text-slate-500 border-transparent hover:bg-slate-100 hover:text-slate-700',
};

// Action Button Component
interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant: keyof typeof variants;
  icon?: React.ReactNode;
  size?: 'normal' | 'large';
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  onClick, 
  children, 
  variant, 
  icon,
  size = 'normal'
}) => {
  return (
    <button 
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 
        ${size === 'large' ? 'px-5 py-3 text-[15px]' : 'px-4 py-2.5 text-sm'}
        font-medium rounded-xl
        border-2 
        transition-all duration-200 ease-out
        hover:scale-[1.03] hover:shadow-md
        active:scale-[0.98]
        ${variants[variant] || variants.slate}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default QuickActions;
