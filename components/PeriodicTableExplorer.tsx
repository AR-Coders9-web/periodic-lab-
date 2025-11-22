import React, { useState, useMemo, useCallback } from 'react';
import { PeriodicTable } from './PeriodicTable';
import { TrendsChart } from './TrendsChart';
import { QuizMode } from './QuizMode';
import { ElementModal } from './ElementModal';
import { Search, BarChart2, Grid, BrainCircuit } from 'lucide-react';
import { elements } from '../data/elements';
import { ElementData } from '../types';
import { Logo } from './Logo';

enum ViewMode {
  TABLE = 'TABLE',
  TRENDS = 'TRENDS',
  QUIZ = 'QUIZ'
}

interface PeriodicTableExplorerProps {
  onBack: () => void;
}

export const PeriodicTableExplorer: React.FC<PeriodicTableExplorerProps> = ({ onBack }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.TABLE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

  const filteredElements = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return elements;
    return elements.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.symbol.toLowerCase().includes(q) ||
      String(e.Z) === q
    );
  }, [searchQuery]);

  const handleElementClick = useCallback((element: ElementData) => {
    setSelectedElement(element);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedElement(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={onBack}>
            <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800 group-hover:border-indigo-500/50 transition-colors">
              <Logo className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">PeriodicLab</h1>
              <p className="text-xs text-slate-400 group-hover:text-indigo-400 transition-colors">AI-Powered Periodic Table</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* View Toggle */}
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setViewMode(ViewMode.TABLE)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === ViewMode.TABLE 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode(ViewMode.TRENDS)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === ViewMode.TRENDS 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span className="hidden sm:inline">Trends</span>
              </button>
              <button
                onClick={() => setViewMode(ViewMode.QUIZ)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === ViewMode.QUIZ 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BrainCircuit className="w-4 h-4" />
                <span className="hidden sm:inline">Quiz</span>
              </button>
            </div>

            {/* Search - Hide when in Quiz Mode */}
            {viewMode !== ViewMode.QUIZ && (
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search elements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder:text-slate-600"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        {viewMode === ViewMode.TABLE && (
          <PeriodicTable 
            elements={elements} 
            filteredElements={filteredElements} 
            onElementClick={handleElementClick} 
          />
        )}
        {viewMode === ViewMode.TRENDS && (
          <TrendsChart elements={elements} />
        )}
        {viewMode === ViewMode.QUIZ && (
          <QuizMode elements={elements} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm bg-slate-950">
        <p>&copy; {new Date().getFullYear()} PeriodicLab. Powered by Google Gemini.</p>
      </footer>

      {/* Modal */}
      {selectedElement && (
        <ElementModal 
          element={selectedElement} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};
