
import React, { useState, useMemo } from 'react';
import { ElementData } from '../types';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  ReferenceLine,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Thermometer, 
  Layers, 
  Weight, 
  Info, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity 
} from 'lucide-react';

interface TrendsChartProps {
  elements: ElementData[];
}

type TrendKey = 'density_g_cm3' | 'melting_point_K' | 'boiling_point_K' | 'atomic_mass';

const TREND_CONFIG: Record<TrendKey, {
  label: string;
  unit: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}> = {
  density_g_cm3: {
    label: 'Density',
    unit: 'g/cm³',
    icon: <Layers size={18} />,
    description: 'Density typically increases as you move down a group and peaks in the center of the transition metals (Period 6). Elements like Osmium and Iridium are the densest known matter.',
    color: '#06b6d4' // cyan-500
  },
  melting_point_K: {
    label: 'Melting Point',
    unit: 'K',
    icon: <Thermometer size={18} />,
    description: 'Melting points reflect the strength of bonding. Carbon (diamond) and Tungsten possess extremely high melting points due to strong covalent and metallic bonds, while Noble Gases are very low.',
    color: '#f97316' // orange-500
  },
  boiling_point_K: {
    label: 'Boiling Point',
    unit: 'K',
    icon: <Activity size={18} />,
    description: 'Boiling points follow similar patterns to melting points but are generally higher. They indicate the energy required to overcome intermolecular forces to transition from liquid to gas.',
    color: '#ef4444' // red-500
  },
  atomic_mass: {
    label: 'Atomic Mass',
    unit: 'u',
    icon: <Weight size={18} />,
    description: 'Atomic mass increases almost linearly with atomic number (Z), as protons and neutrons are added to the nucleus. This is the most fundamental trend in the periodic table.',
    color: '#8b5cf6' // violet-500
  }
};

// Helper to get color based on element category for the chart dots
const getCategoryColor = (category: string) => {
  if (category.includes('alkali metal')) return '#ef4444'; // red
  if (category.includes('alkaline earth')) return '#f97316'; // orange
  if (category.includes('transition')) return '#eab308'; // yellow
  if (category.includes('post-transition')) return '#84cc16'; // lime
  if (category.includes('metalloid')) return '#10b981'; // emerald
  if (category.includes('nonmetal')) return '#06b6d4'; // cyan
  if (category.includes('halogen')) return '#3b82f6'; // blue
  if (category.includes('noble')) return '#8b5cf6'; // violet
  if (category.includes('lanthanide')) return '#d946ef'; // fuchsia
  if (category.includes('actinide')) return '#f43f5e'; // rose
  return '#94a3b8'; // slate
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const color = getCategoryColor(data.category);
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl min-w-[200px]">
        <div className="flex items-center justify-between mb-2">
           <span className="text-xl font-bold text-white">{data.symbol}</span>
           <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
             #{data.Z}
           </span>
        </div>
        <p className="text-sm font-medium text-slate-200 mb-1">{data.name}</p>
        <p className="text-xs text-slate-400 mb-3 capitalize flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: color }}></span>
          {data.category}
        </p>
        <div className="pt-3 border-t border-slate-800">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Value</p>
          <p className="text-lg font-bold text-indigo-400">
            {payload[0].value} {payload[0].unit}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const TrendsChart: React.FC<TrendsChartProps> = ({ elements }) => {
  const [activeTrend, setActiveTrend] = useState<TrendKey>('density_g_cm3');

  const data = useMemo(() => {
    return elements
      .filter(e => e[activeTrend] !== null && e[activeTrend] !== undefined)
      .map(e => ({
        Z: e.Z,
        value: e[activeTrend],
        name: e.name,
        symbol: e.symbol,
        category: e.category,
        unit: TREND_CONFIG[activeTrend].unit
      }));
  }, [elements, activeTrend]);

  const stats = useMemo(() => {
    if (!data.length) return null;
    const sorted = [...data].sort((a, b) => (a.value as number) - (b.value as number));
    const sum = sorted.reduce((acc, curr) => acc + (curr.value as number), 0);
    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / sorted.length
    };
  }, [data]);

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Controls & Title */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="text-indigo-400" /> 
            Periodic Trends
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Visualize how elemental properties change across the periodic table. 
            Select a property to analyze relationships between atomic structure and physical attributes.
          </p>
        </div>

        {/* Property Selector Tabs */}
        <div className="bg-slate-900/50 p-1 rounded-xl border border-slate-800 flex flex-wrap gap-1">
          {(Object.keys(TREND_CONFIG) as TrendKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTrend(key)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTrend === key 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
              `}
            >
              {TREND_CONFIG[key].icon}
              <span className="hidden sm:inline">{TREND_CONFIG[key].label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
        
        {/* Main Chart Area */}
        <div className="lg:col-span-3 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 flex flex-col shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-50"></div>
          
          <div className="flex justify-between items-center mb-6">
             <div>
               <h3 className="text-lg font-semibold text-slate-200">{TREND_CONFIG[activeTrend].label} vs Atomic Number</h3>
               <p className="text-xs text-slate-500">X-Axis: Atomic Number (Z) • Y-Axis: {TREND_CONFIG[activeTrend].label} ({TREND_CONFIG[activeTrend].unit})</p>
             </div>
          </div>

          <div className="flex-1 w-full min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  type="number" 
                  dataKey="Z" 
                  name="Atomic Number" 
                  stroke="#64748b" 
                  tick={{fill: '#64748b', fontSize: 12}}
                  tickLine={{stroke: '#334155'}}
                  axisLine={{stroke: '#334155'}}
                >
                  <Label value="Atomic Number (Z)" offset={-10} position="insideBottom" fill="#475569" fontSize={12} />
                </XAxis>
                <YAxis 
                  type="number" 
                  dataKey="value" 
                  name={TREND_CONFIG[activeTrend].label} 
                  stroke="#64748b" 
                  tick={{fill: '#64748b', fontSize: 12}}
                  tickLine={{stroke: '#334155'}}
                  axisLine={{stroke: '#334155'}}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#475569' }} />
                <Scatter 
                  name={TREND_CONFIG[activeTrend].label} 
                  data={data} 
                  fill={TREND_CONFIG[activeTrend].color}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3 justify-center text-[10px] sm:text-xs text-slate-400 border-t border-slate-800/50 pt-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>Alkali</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span>Alkaline Earth</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>Transition</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500"></span>Nonmetal</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500"></span>Noble Gas</span>
          </div>
        </div>

        {/* Sidebar: Stats & Insights */}
        <div className="flex flex-col gap-6">
          
          {/* Description Card */}
          <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-indigo-400 mb-3">
              <Info size={18} />
              <h4 className="font-semibold">About this Trend</h4>
            </div>
            <p className="text-sm text-indigo-200/80 leading-relaxed">
              {TREND_CONFIG[activeTrend].description}
            </p>
          </div>

          {/* Quick Stats */}
          {stats && (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 flex-1">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Quick Stats</h4>
              
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                  <div className="absolute right-0 top-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ArrowUpRight size={48} className="text-emerald-500" />
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                    <ArrowUpRight size={12} className="text-emerald-500" /> Highest
                  </span>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stats.max.value} <span className="text-sm font-normal text-slate-500">{TREND_CONFIG[activeTrend].unit}</span>
                  </div>
                  <div className="text-sm text-emerald-400 font-medium">
                    {stats.max.name} ({stats.max.symbol})
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
                  <div className="absolute right-0 top-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ArrowDownRight size={48} className="text-rose-500" />
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                    <ArrowDownRight size={12} className="text-rose-500" /> Lowest
                  </span>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stats.min.value} <span className="text-sm font-normal text-slate-500">{TREND_CONFIG[activeTrend].unit}</span>
                  </div>
                  <div className="text-sm text-rose-400 font-medium">
                    {stats.min.name} ({stats.min.symbol})
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <span className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                    <Activity size={12} className="text-blue-500" /> Average
                  </span>
                  <div className="text-xl font-bold text-white">
                    {stats.avg.toFixed(2)} <span className="text-sm font-normal text-slate-500">{TREND_CONFIG[activeTrend].unit}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
