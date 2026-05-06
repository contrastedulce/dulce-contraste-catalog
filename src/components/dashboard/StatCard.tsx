import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { GlassCard } from '../shared/GlassCard';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color: 'rose' | 'blue' | 'emerald' | 'amber' | 'purple';
  onClick?: () => void;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  trend = 'neutral',
  icon: Icon, 
  color,
  onClick,
  delay = 0
}) => {
  const colors = {
    rose: "text-rose-600 bg-rose-50 border-rose-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
  };

  const iconColors = {
    rose: "bg-rose-500",
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    purple: "bg-purple-500",
  };

  return (
    <GlassCard 
      delay={delay}
      className="relative overflow-hidden group border-none shadow-sm"
      onClick={onClick}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-500",
            iconColors[color]
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
            <h4 className="text-2xl font-black text-slate-800 tracking-tight mt-1">{value}</h4>
          </div>
          
          {change && (
            <div className={cn(
              "flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-lg w-fit",
              trend === 'up' ? "bg-emerald-50 text-emerald-600" : 
              trend === 'down' ? "bg-rose-50 text-rose-600" : 
              "bg-slate-50 text-slate-500"
            )}>
              {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
               trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
              {change}
            </div>
          )}
        </div>

        <div className="absolute -right-8 -top-8 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none">
          <Icon size={120} strokeWidth={1} />
        </div>
      </div>
      
      <div className={cn(
        "absolute bottom-0 left-0 h-1 bg-linear-to-r from-transparent via-current to-transparent opacity-20 w-full transition-all duration-500",
        trend === 'up' ? "text-emerald-500" : trend === 'down' ? "text-rose-500" : "text-slate-300"
      )} />
    </GlassCard>
  );
};
