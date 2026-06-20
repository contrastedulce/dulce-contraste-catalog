import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

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

const colorMap = {
  rose:    { icon: 'bg-gradient-to-br from-rose-400 to-rose-600',    glow: 'shadow-rose-200/50',    badge: 'bg-rose-50 text-rose-600',    bar: 'from-rose-300 to-rose-500' },
  blue:    { icon: 'bg-gradient-to-br from-blue-400 to-blue-600',    glow: 'shadow-blue-200/50',    badge: 'bg-blue-50 text-blue-600',    bar: 'from-blue-300 to-blue-500' },
  emerald: { icon: 'bg-gradient-to-br from-emerald-400 to-emerald-600', glow: 'shadow-emerald-200/50', badge: 'bg-emerald-50 text-emerald-600', bar: 'from-emerald-300 to-emerald-500' },
  amber:   { icon: 'bg-gradient-to-br from-amber-400 to-amber-500',  glow: 'shadow-amber-200/50',   badge: 'bg-amber-50 text-amber-600',   bar: 'from-amber-300 to-amber-500' },
  purple:  { icon: 'bg-gradient-to-br from-purple-400 to-purple-600', glow: 'shadow-purple-200/50',  badge: 'bg-purple-50 text-purple-600', bar: 'from-purple-300 to-purple-500' },
};

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
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay,
        duration: 0.4,
        type: 'spring',
        stiffness: 200,
        damping: 20
      }}
      onClick={onClick}
      className={cn(
        "relative bg-white rounded-3xl p-6 overflow-hidden cursor-pointer",
        "border border-rose-100/60",
        "shadow-lg shadow-rose-100/30",
        "card-hover group"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-5",
        "shadow-lg transition-transform duration-300 group-hover:scale-110",
        c.icon,
        c.glow
      )}>
        <Icon className="w-6 h-6" />
      </div>

      {/* Value & Title */}
      <div className="mb-4">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <motion.h4
          key={String(value)}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: delay + 0.1 }}
          className="text-2xl font-black text-slate-800 tracking-tight"
        >
          {value}
        </motion.h4>
      </div>

      {/* Badge */}
      {change && (
        <div className={cn(
          "flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-lg w-fit",
          trend === 'up'   ? "bg-emerald-50 text-emerald-600" :
          trend === 'down' ? "bg-rose-50 text-rose-600" :
          "bg-slate-50 text-slate-500"
        )}>
          {trend === 'up'   && <TrendingUp className="w-3 h-3" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      )}

      {/* Bottom color bar */}
      <div className={cn(
        "absolute bottom-0 left-0 h-1 w-full bg-linear-to-r opacity-40",
        c.bar
      )} />

      {/* Ghost icon background */}
      <div className="absolute -right-6 -bottom-6 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none">
        <Icon size={100} strokeWidth={1} />
      </div>
    </motion.div>
  );
};
