import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="PeriodicLab Logo"
    >
      {/* Outer Ring - Dark Blue/Navy */}
      <circle 
        cx="100" 
        cy="100" 
        r="90" 
        stroke="#0f172a" 
        strokeWidth="12" 
        className="stroke-slate-900"
      />
      
      {/* Flask Body - Cyan/Blue Gradient feel via Fill/Stroke */}
      <path 
        d="M100 35 L100 80 L145 150 C150 158 145 170 135 170 L65 170 C55 170 50 158 55 150 L100 80 L100 35" 
        fill="#0ea5e9"
        stroke="#0284c7"
        strokeWidth="8"
        strokeLinejoin="round"
        className="fill-cyan-500 stroke-cyan-600"
      />
      
      {/* Flask Top Rim */}
      <rect x="85" y="25" width="30" height="10" rx="2" fill="#0284c7" className="fill-cyan-600" />

      {/* Molecule Inside - White/Light */}
      <g transform="translate(100 125)">
        {/* Central Atom */}
        <circle cx="0" cy="0" r="12" fill="#f8fafc" />
        
        {/* Bonds */}
        <line x1="0" y1="0" x2="20" y2="-15" stroke="#f8fafc" strokeWidth="4" />
        <line x1="0" y1="0" x2="-20" y2="-15" stroke="#f8fafc" strokeWidth="4" />
        <line x1="0" y1="0" x2="0" y2="25" stroke="#f8fafc" strokeWidth="4" />

        {/* Outer Atoms */}
        <circle cx="20" cy="-15" r="8" fill="#f8fafc" />
        <circle cx="-20" cy="-15" r="8" fill="#f8fafc" />
        <circle cx="0" cy="25" r="8" fill="#f8fafc" />
      </g>
    </svg>
  );
};
