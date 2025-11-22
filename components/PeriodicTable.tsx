import React from 'react';
import { ElementData } from '../types';
import { ElementCard } from './ElementCard';

interface PeriodicTableProps {
  elements: ElementData[];
  filteredElements: ElementData[];
  onElementClick: (element: ElementData) => void;
}

export const PeriodicTable: React.FC<PeriodicTableProps> = ({ elements, filteredElements, onElementClick }) => {
  // Separate Main Body (Groups 1-18) and F-Block (Lanthanides/Actinides)
  const mainBodyElements = filteredElements.filter(e => e.group !== null);
  const fBlockElements = filteredElements.filter(e => e.group === null);

  // Sort F-Block by atomic number to ensure correct order
  const sortedFBlock = [...fBlockElements].sort((a, b) => a.Z - b.Z);
  const lanthanides = sortedFBlock.filter(e => e.period === 6);
  const actinides = sortedFBlock.filter(e => e.period === 7);

  // Helper to check if an element is currently in the filtered list
  // If filtered list is smaller than total, we only show matches
  const isFiltered = filteredElements.length < elements.length;

  // If filtering is active, we might break the grid structure.
  // If highly filtered, show a flex grid instead of the strict periodic layout.
  if (isFiltered && filteredElements.length < 110) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {filteredElements.map(el => (
          <ElementCard key={el.Z} element={el} onClick={() => onElementClick(el)} />
        ))}
        {filteredElements.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            No elements found matching your search.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto pb-12">
      {/* Main Grid */}
      <div 
        className="grid gap-1 sm:gap-2 min-w-[1000px]"
        style={{ 
          gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(7, minmax(0, 1fr))' 
        }}
      >
        {mainBodyElements.map(el => (
          <div
            key={el.Z}
            style={{ 
              gridColumn: el.group!, 
              gridRow: el.period 
            }}
          >
            <ElementCard element={el} onClick={() => onElementClick(el)} />
          </div>
        ))}
        
        {/* Placeholders for Lanthanides/Actinides in the main grid */}
        <div 
          className="flex items-center justify-center border-2 border-dashed border-slate-700/50 rounded-md text-slate-600 text-xs font-medium"
          style={{ gridColumn: 3, gridRow: 6 }}
        >
          57-71
        </div>
        <div 
          className="flex items-center justify-center border-2 border-dashed border-slate-700/50 rounded-md text-slate-600 text-xs font-medium"
          style={{ gridColumn: 3, gridRow: 7 }}
        >
          89-103
        </div>
      </div>

      {/* F-Block Grid (Below) */}
      <div className="mt-8 sm:mt-12 min-w-[1000px]">
        <div className="grid gap-1 sm:gap-2" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
           {/* Offset by 3 empty columns (usually F block sits under group 3) - actually mostly represented as start col 3 or 4 depending on layout convention. 
               Standard convention: La-Lu is 15 elements.
               If we align La under the placeholder (Col 3), we consume 15 slots. 3 + 15 = 18. Fits perfectly.
           */}
           
           {lanthanides.map((el, idx) => (
             <div key={el.Z} style={{ gridColumn: idx + 3, gridRow: 1 }}>
               <ElementCard element={el} onClick={() => onElementClick(el)} />
             </div>
           ))}

           {actinides.map((el, idx) => (
             <div key={el.Z} style={{ gridColumn: idx + 3, gridRow: 2 }}>
               <ElementCard element={el} onClick={() => onElementClick(el)} />
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};