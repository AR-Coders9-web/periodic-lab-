import React, { useState, useMemo, useEffect } from 'react';
import { ElementData } from '../types';
import { Play, CheckCircle2, XCircle, RefreshCw, Trophy, BrainCircuit, ArrowRight } from 'lucide-react';

interface QuizModeProps {
  elements: ElementData[];
}

enum QuizState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  SUMMARY = 'SUMMARY'
}

interface Question {
  type: 'SYMBOL_TO_NAME' | 'NAME_TO_SYMBOL' | 'ATOMIC_NUMBER';
  target: ElementData;
  options: ElementData[];
  correctAnswer: string; // The displayed text of the correct answer
}

export const QuizMode: React.FC<QuizModeProps> = ({ elements }) => {
  const [gameState, setGameState] = useState<QuizState>(QuizState.MENU);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Generate a set of 10 random questions
  const startQuiz = () => {
    const newQuestions: Question[] = [];
    const usedIndices = new Set<number>();

    for (let i = 0; i < 10; i++) {
      // 1. Select unique target element
      let targetIndex = Math.floor(Math.random() * elements.length);
      while (usedIndices.has(targetIndex)) {
        targetIndex = Math.floor(Math.random() * elements.length);
      }
      usedIndices.add(targetIndex);
      const target = elements[targetIndex];

      // 2. Determine Question Type randomly
      const types = ['SYMBOL_TO_NAME', 'NAME_TO_SYMBOL', 'ATOMIC_NUMBER'] as const;
      const type = types[Math.floor(Math.random() * types.length)];

      // 3. Generate Distractors
      const options: ElementData[] = [target];
      while (options.length < 4) {
        const randomEl = elements[Math.floor(Math.random() * elements.length)];
        if (!options.find(o => o.Z === randomEl.Z)) {
          options.push(randomEl);
        }
      }
      // Shuffle options
      options.sort(() => Math.random() - 0.5);

      // 4. Set Correct Answer String
      let correctAnswer = '';
      if (type === 'SYMBOL_TO_NAME') correctAnswer = target.name;
      if (type === 'NAME_TO_SYMBOL') correctAnswer = target.symbol;
      if (type === 'ATOMIC_NUMBER') correctAnswer = target.Z.toString();

      newQuestions.push({ type, target, options, correctAnswer });
    }

    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameState(QuizState.PLAYING);
    setIsAnswered(false);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(s => s + 1);
    }

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        setGameState(QuizState.SUMMARY);
      }
    }, 1500);
  };

  // --- RENDER: MENU ---
  if (gameState === QuizState.MENU) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-md w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
           {/* Background Accent */}
           <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
           <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl"></div>

           <div className="w-20 h-20 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg border border-slate-700">
             <BrainCircuit className="w-10 h-10 text-indigo-400" />
           </div>
           
           <h2 className="text-3xl font-bold text-white mb-2">Element Quiz</h2>
           <p className="text-slate-400 mb-8">
             Test your knowledge of the periodic table. Can you identify elements by symbol, name, and atomic number?
           </p>

           <button 
             onClick={startQuiz}
             className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
           >
             <Play fill="currentColor" size={20} /> Start Challenge
           </button>
           
           <div className="mt-6 text-xs text-slate-500">
             10 Questions • Multiple Choice
           </div>
        </div>
      </div>
    );
  }

  // --- RENDER: SUMMARY ---
  if (gameState === QuizState.SUMMARY) {
    const percentage = (score / questions.length) * 100;
    let feedback = "Good effort!";
    if (percentage >= 80) feedback = "Chemistry Genius!";
    else if (percentage >= 60) feedback = "Solid Performance!";
    else if (percentage < 40) feedback = "Keep Studying!";

    return (
      <div className="h-full flex flex-col items-center justify-center p-6 animate-in zoom-in duration-300">
        <div className="max-w-md w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>
          
          <div className="mb-6 inline-flex p-4 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <Trophy size={48} />
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">{feedback}</h2>
          <p className="text-slate-400 mb-8">You scored</p>

          <div className="text-6xl font-black text-white mb-8 tracking-tighter">
            {score}<span className="text-3xl text-slate-500 font-normal">/{questions.length}</span>
          </div>

          <button 
             onClick={startQuiz}
             className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
           >
             <RefreshCw size={20} /> Play Again
           </button>
        </div>
      </div>
    );
  }

  // --- RENDER: PLAYING ---
  const currentQ = questions[currentQuestionIndex];
  
  // Helper to display question text
  const getQuestionText = (q: Question) => {
    if (q.type === 'SYMBOL_TO_NAME') return `What is the name of the element with symbol ${q.target.symbol}?`;
    if (q.type === 'NAME_TO_SYMBOL') return `What is the symbol for ${q.target.name}?`;
    if (q.type === 'ATOMIC_NUMBER') return `What is the atomic number of ${q.target.name}?`;
    return '';
  };

  // Helper to display the "Main Card" content
  const getMainCardContent = (q: Question) => {
     if (q.type === 'SYMBOL_TO_NAME') return q.target.symbol;
     if (q.type === 'NAME_TO_SYMBOL') return q.target.name;
     if (q.type === 'ATOMIC_NUMBER') return q.target.name;
     return '';
  };

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center p-4 animate-in fade-in duration-300">
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">
           <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
           <span>Score: {score}</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center mb-6 shadow-xl relative">
        <div className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wide">
          {getQuestionText(currentQ)}
        </div>
        
        <div className="flex justify-center mb-4">
           <div className="w-32 h-32 bg-slate-800/50 rounded-2xl flex items-center justify-center border-2 border-slate-700">
             <span className={`font-bold text-white ${currentQ.type === 'NAME_TO_SYMBOL' || currentQ.type === 'ATOMIC_NUMBER' ? 'text-2xl' : 'text-5xl'}`}>
               {getMainCardContent(currentQ)}
             </span>
           </div>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentQ.options.map((opt) => {
          // Determine text to show on button
          let optionText = '';
          if (currentQ.type === 'SYMBOL_TO_NAME') optionText = opt.name;
          if (currentQ.type === 'NAME_TO_SYMBOL') optionText = opt.symbol;
          if (currentQ.type === 'ATOMIC_NUMBER') optionText = opt.Z.toString();

          // State styling
          let stateClass = "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200";
          if (isAnswered) {
            if (optionText === currentQ.correctAnswer) {
              stateClass = "bg-emerald-500/20 border-emerald-500 text-emerald-200";
            } else if (optionText === selectedAnswer) {
              stateClass = "bg-rose-500/20 border-rose-500 text-rose-200";
            } else {
              stateClass = "bg-slate-800/50 border-slate-800 text-slate-500 opacity-50";
            }
          }

          return (
            <button
              key={opt.Z}
              onClick={() => handleAnswer(optionText)}
              disabled={isAnswered}
              className={`
                relative p-4 rounded-xl border-2 text-lg font-bold transition-all duration-200
                ${stateClass}
              `}
            >
              {optionText}
              {isAnswered && optionText === currentQ.correctAnswer && (
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
              )}
              {isAnswered && optionText === selectedAnswer && optionText !== currentQ.correctAnswer && (
                <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500" size={20} />
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
};