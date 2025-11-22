import React from 'react';
import { ElementData } from '../types';

interface ElementCardProps {
  element: ElementData;
  onClick: () => void;
}

// Helper to map categories to Tailwind colors
const getCategoryColor = (category: string) => {
  if (category.includes('alkali metal')) return 'bg-red-500/20 border-red-500/40 text-red-200 hover:bg-red-500/30';
  if (category.includes('alkaline earth')) return 'bg-orange-500/20 border-orange-500/40 text-orange-200 hover:bg-orange-500/30';
  if (category.includes('lanthanide')) return 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-200 hover:bg-fuchsia-500/30';
  if (category.includes('actinide')) return 'bg-rose-500/20 border-rose-500/40 text-rose-200 hover:bg-rose-500/30';
  if (category.includes('transition')) return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-200 hover:bg-yellow-500/30';
  if (category.includes('post-transition')) return 'bg-lime-500/20 border-lime-500/40 text-lime-200 hover:bg-lime-500/30';
  if (category.includes('metalloid')) return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/30';
  if (category.includes('nonmetal')) return 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/30';
  if (category.includes('halogen')) return 'bg-blue-500/20 border-blue-500/40 text-blue-200 hover:bg-blue-500/30';
  if (category.includes('noble')) return 'bg-violet-500/20 border-violet-500/40 text-violet-200 hover:bg-violet-500/30';
  return 'bg-slate-700/20 border-slate-600 text-slate-300 hover:bg-slate-700/40';
};

export const ElementCard: React.FC<ElementCardProps> = ({ element, onClick }) => {
  const colorClass = getCategoryColor(element.category);

  return (
    <button
      onClick={onClick}
      className={`
        w-full aspect-[5/6] sm:aspect-square rounded-md border p-1 sm:p-2 flex flex-col justify-between 
        transition-all duration-200 transform hover:scale-105 hover:z-10 hover:shadow-lg
        ${colorClass}
      `}
      aria-label={`${element.name} atomic number ${element.Z}`}
    >
      <div className="flex justify-between items-start w-full">
        <span className="text-[10px] sm:text-xs font-medium opacity-80">{element.Z}</span>
        <span className="text-[8px] sm:text-[10px] font-bold opacity-60 hidden sm:block">
          {element.atomic_mass.toFixed(1)}
        </span>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-1">
        <span className="text-lg sm:text-xl md:text-2xl font-bold leading-none">{element.symbol}</span>
      </div>

      <div className="w-full text-center overflow-hidden">
        <span className="text-[9px] sm:text-[10px] font-medium truncate block w-full">
          {element.name}
        </span>
      </div>
    </button>
  );
};