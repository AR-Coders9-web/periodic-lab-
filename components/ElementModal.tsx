import React, { useEffect } from 'react';
import { X, Thermometer, Droplets, CircleDot, Layers, ArrowRight, Atom, History, User } from 'lucide-react';
import { ElementData } from '../types';
import { ChatInterface } from './ChatInterface';

interface ElementModalProps {
  element: ElementData;
  onClose: () => void;
}

export const ElementModal: React.FC<ElementModalProps> = ({ element, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!element) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with color accent based on category */}
        <div className="relative p-6 pb-4 border-b border-slate-800 flex justify-between items-start bg-slate-800/30">
          <div className="flex gap-5">
            <div className={`
              w-24 h-24 sm:w-32 sm:h-32 rounded-xl border-2 flex flex-col items-center justify-center shadow-inner
              ${element.category.includes('alkali') ? 'bg-red-500/10 border-red-500 text-red-400' :
                element.category.includes('noble') ? 'bg-violet-500/10 border-violet-500 text-violet-400' :
                'bg-slate-700/20 border-slate-500 text-slate-300'}
            `}>
              <span className="text-lg font-medium opacity-70">{element.Z}</span>
              <span className="text-4xl sm:text-5xl font-bold my-1">{element.symbol}</span>
              <span className="text-xs font-medium opacity-70 text-center px-1">{element.atomic_mass.toFixed(3)}</span>
            </div>
            
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-1">{element.name}</h2>
              <p className="text-lg text-slate-400 capitalize mb-2">{element.category}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300">
                   <Layers size={12} /> Group {element.group || '-'}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300">
                   <CircleDot size={12} /> Period {element.period}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300">
                   <Atom size={12} /> Block {element.block}
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Stats */}
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Physical Properties</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-2 text-slate-400 mb-1 text-xs">
                      <Droplets size={14} /> Phase (STP)
                    </div>
                    <div className="text-lg font-medium capitalize text-slate-200">{element.phase_at_stp}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-2 text-slate-400 mb-1 text-xs">
                      <Layers size={14} /> Density
                    </div>
                    <div className="text-lg font-medium text-slate-200">
                      {element.density_g_cm3 ? `${element.density_g_cm3} g/cm³` : 'N/A'}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-2 text-slate-400 mb-1 text-xs">
                      <Thermometer size={14} /> Melting Point
                    </div>
                    <div className="text-lg font-medium text-slate-200">
                      {element.melting_point_K ? `${element.melting_point_K} K` : 'N/A'}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-2 text-slate-400 mb-1 text-xs">
                      <Thermometer size={14} /> Boiling Point
                    </div>
                    <div className="text-lg font-medium text-slate-200">
                      {element.boiling_point_K ? `${element.boiling_point_K} K` : 'N/A'}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Atomic Details</h3>
                <div className="space-y-3">
                   <div className="flex justify-between py-2 border-b border-slate-800">
                     <span className="text-slate-400">Electron Configuration</span>
                     <span className="text-slate-200 font-mono text-sm">{element.electron_configuration}</span>
                   </div>
                   <div className="flex justify-between py-2 border-b border-slate-800">
                     <span className="text-slate-400">Oxidation States</span>
                     <span className="text-slate-200 text-sm">{element.oxidation_states?.join(', ') || 'N/A'}</span>
                   </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Discovery</h3>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-700/50 rounded-full mt-0.5">
                      <User size={16} className="text-slate-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Discovered By</div>
                      <div className="text-slate-200 font-medium leading-snug">{element.discovered_by || 'Unknown'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-700/50 rounded-full mt-0.5">
                      <History size={16} className="text-slate-400" />
                    </div>
                    <div>
                       <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Year</div>
                       <div className="text-slate-200 font-medium">{element.year_discovered || 'Unknown'}</div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Common Uses</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {element.uses?.map((use, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <ArrowRight size={12} className="text-indigo-500" /> {use}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Right Column: AI Chat */}
            <div className="flex flex-col h-[500px] lg:h-auto">
               <ChatInterface elementName={element.name} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};