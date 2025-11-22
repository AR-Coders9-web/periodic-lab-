import React, { useEffect, useRef } from 'react';
import { FlaskConical, User, Brain, ArrowRight, Grid } from 'lucide-react';
import { Logo } from './Logo';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Molecular Animation Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    const connectionDistance = 150;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        
        const colors = ['rgba(6, 182, 212, ', 'rgba(59, 130, 246, ', 'rgba(139, 92, 246, ']; // Cyan, Blue, Violet
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + '0.6)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            const opacity = 1 - dist / connectionDistance;
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.15})`; // Blue-ish connections
            ctx.lineWidth = 1;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden font-sans">
      {/* Animated Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at center, #1e293b 0%, #020617 100%)' }} 
      />

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 text-xl font-bold">
          <Logo className="w-10 h-10" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            PeriodicLab
          </span>
        </div>
        <button 
          onClick={onStart}
          className="hidden sm:block px-6 py-2 rounded-full border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
        >
          Launch App
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in-up">
          <FlaskConical size={16} />
          <span>The Ultimate Chemistry Companion</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight animate-fade-in-up delay-100">
          Master the <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500">
            Periodic Table
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          Explore all 118 elements with detailed properties, real-time trends visualization, and AI-powered insights built for the modern scientist.
        </p>
        
        <button 
          onClick={onStart}
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-white font-bold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300 animate-fade-in-up delay-300 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Study Periodic Table <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full text-left animate-fade-in-up delay-500">
          <FeatureCard 
            icon={<Grid className="w-6 h-6 text-cyan-400" />}
            title="Interactive Table"
            description="Filter by groups, periods, and categories with a fluid, responsive interface."
            color="cyan"
          />
          <FeatureCard 
            icon={<User className="w-6 h-6 text-violet-400" />}
            title="Scientist History"
            description="Discover the brilliant minds and historical context behind every element."
            color="violet"
          />
          <FeatureCard 
            icon={<Brain className="w-6 h-6 text-emerald-400" />}
            title="AI Insights"
            description="Chat with our Gemini-powered assistant to learn complex chemical concepts."
            color="emerald"
          />
        </div>
      </main>

      <footer className="relative z-10 text-center py-8 text-slate-600 text-sm border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        <p>&copy; {new Date().getFullYear()} PeriodicLab Chemistry. Built for Science.</p>
      </footer>
    </div>
  );
};

// Helper Component for Features
const FeatureCard = ({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) => {
  const colorClasses = {
    cyan: 'group-hover:border-cyan-500/50 group-hover:bg-cyan-500/5',
    violet: 'group-hover:border-violet-500/50 group-hover:bg-violet-500/5',
    emerald: 'group-hover:border-emerald-500/50 group-hover:bg-emerald-500/5',
  };

  return (
    <div className={`group p-6 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-slate-700">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
};
