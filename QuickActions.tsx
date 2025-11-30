
import React from 'react';
import { Lightbulb, HelpCircle, Check, ArrowRight, User, GraduationCap, Play, PieChart, Shapes, Calculator, Binary, Menu, SkipForward } from 'lucide-react';
import { AppMode } from '../types';

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
            <ActionButton onClick={() => onAction("אני בן 👦")} color="blue" icon={<User size={16}/>}>אני בן 👦</ActionButton>
            <ActionButton onClick={() => onAction("אני בת 👧")} color="pink" icon={<User size={16}/>}>אני בת 👧</ActionButton>
          </>
        );
      case 'menu':
        return (
          <>
            <ActionButton onClick={() => onAction("בוא נלמד נושא חדש")} color="sky" icon={<GraduationCap size={16}/>}>🧠 רוצה ללמוד</ActionButton>
            <ActionButton onClick={() => onAction("אני רוצה לתרגל")} color="orange" icon={<Play size={16}/>}>💪 יאללה לתרגל</ActionButton>
            <ActionButton onClick={() => onAction("תבחן אותי!")} color="rose" icon={<Check size={16}/>}>🏆 סימולציית מבחן</ActionButton>
          </>
        );
      case 'topics':
        return (
          <>
            <ActionButton onClick={() => onAction("נושא: שברים")} color="purple" icon={<PieChart size={16}/>}>🍕 שברים</ActionButton>
            <ActionButton onClick={() => onAction("נושא: גיאומטריה")} color="emerald" icon={<Shapes size={16}/>}>📐 גיאומטריה</ActionButton>
            <ActionButton onClick={() => onAction("נושא: מספרים גדולים")} color="blue" icon={<Binary size={16}/>}>💯 מספרים גדולים</ActionButton>
            <ActionButton onClick={() => onAction("נושא: חיבור וחיסור")} color="yellow" icon={<Calculator size={16}/>}>➕ חיבור וחיסור</ActionButton>
          </>
        );
      case 'chat':
        // Context sensitive buttons based on mode
        if (mode === 'learning') {
          return (
             <>
              <ActionButton onClick={() => onAction("לא הבנתי, תסביר שוב")} color="slate" icon={<HelpCircle size={16}/>}>לא הבנתי</ActionButton>
              <ActionButton onClick={() => onAction("תן לי דוגמה")} color="indigo" icon={<Lightbulb size={16}/>}>תן דוגמה</ActionButton>
              <ActionButton onClick={() => onAction("הבנתי, בוא נמשיך")} color="emerald" icon={<ArrowRight size={16}/>}>הבנתי, בוא נמשיך</ActionButton>
              <div className="w-full md:w-auto border-l md:border-l-0 border-slate-300 mx-1"></div>
              <ActionButton onClick={onChangeTopic} color="slate" icon={<Menu size={16}/>}>החלף נושא</ActionButton>
            </>
          );
        }
        if (mode === 'practice') {
            return (
               <>
                <ActionButton onClick={() => onAction("תן לי רמז קטן")} color="yellow" icon={<Lightbulb size={16}/>}>תן רמז</ActionButton>
                <ActionButton onClick={() => onAction("אני לא יודע, תגלה לי")} color="slate" icon={<HelpCircle size={16}/>}>לא יודע</ActionButton>
                <div className="w-full md:w-auto border-l md:border-l-0 border-slate-300 mx-1"></div>
                <ActionButton onClick={onChangeTopic} color="slate" icon={<Menu size={16}/>}>החלף נושא</ActionButton>
              </>
            );
        }
        if (mode === 'test') {
             return (
               <>
                <ActionButton onClick={() => onAction("אני לא יודע, תעבור הלאה")} color="slate" icon={<SkipForward size={16}/>}>דלג על שאלה</ActionButton>
                <div className="w-full md:w-auto border-l md:border-l-0 border-slate-300 mx-1"></div>
                <ActionButton onClick={onChangeTopic} color="slate" icon={<Menu size={16}/>}>צא מהמבחן</ActionButton>
              </>
            );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-2 animate-fade-in-up">
      {renderButtons()}
    </div>
  );
};

const ActionButton: React.FC<{ onClick: () => void, children: React.ReactNode, color: string, icon?: React.ReactNode }> = ({ onClick, children, color, icon }) => {
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200',
        pink: 'bg-pink-100 text-pink-700 hover:bg-pink-200 border-pink-200',
        sky: 'bg-sky-100 text-sky-700 hover:bg-sky-200 border-sky-200',
        orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200',
        rose: 'bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200',
        emerald: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200',
        yellow: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200',
        indigo: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200',
        purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200',
        slate: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200',
    };

    return (
        <button 
            onClick={onClick}
            className={`
                flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all transform hover:scale-105 active:scale-95 border shadow-sm
                ${colorClasses[color] || colorClasses.slate}
            `}
        >
            {icon}
            {children}
        </button>
    );
};

export default QuickActions;