import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  delay = 0,
  hover = true,
  onClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      transition={{ 
        type: "spring", 
        damping: 25, 
        stiffness: 120,
        delay 
      }}
      className={cn(
        "glass-morphism rounded-3xl p-6 transition-all duration-500",
        hover && "hover:shadow-2xl hover:shadow-primary-600/10 hover:-translate-y-1",
        onClick && "cursor-pointer active:scale-95",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
