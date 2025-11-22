export interface ElementData {
  Z: number;
  symbol: string;
  name: string;
  atomic_mass: number;
  category: string;
  categoryShort?: string;
  group: number | null;
  period: number;
  block: string;
  phase_at_stp: string;
  electron_configuration: string;
  oxidation_states?: number[]; // Derived from string if needed, keeping simple for now
  uses?: string[];
  density_g_cm3?: number | null;
  melting_point_K?: number | null;
  boiling_point_K?: number | null;
  gridColumn: number;
  summary?: string;
  discovered_by?: string;
  year_discovered?: number | string;
}

export enum ElementCategory {
  AlkaliMetal = 'alkali metal',
  AlkalineEarthMetal = 'alkaline earth metal',
  TransitionMetal = 'transition metal',
  PostTransitionMetal = 'post-transition metal',
  Metalloid = 'metalloid',
  Nonmetal = 'nonmetal', // General nonmetal often split into others
  Halogen = 'halogen',
  NobleGas = 'noble gas',
  Lanthanide = 'lanthanide',
  Actinide = 'actinide',
  Unknown = 'unknown'
}