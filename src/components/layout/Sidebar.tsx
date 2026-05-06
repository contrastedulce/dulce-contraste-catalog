import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChefHat,
  Monitor
} from 'lucide-react';
import { NAV_ITEMS } from '../../constants/navigation';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  isCollapsed,
  setIsCollapsed
}) => {
  return (
    <motion.aside
      animate={{ width: isCollapsed ? "var(--width-sidebar-collapsed)" : "var(--width-sidebar)" }}
      className="bg-white border-r border-slate-100 flex flex-col h-full relative z-30 transition-all duration-300 shadow-xl shadow-slate-200/20"
    >
      <div className={cn(
        "p-6 flex items-center gap-3 overflow-hidden",
        isCollapsed && "justify-center p-4"
      )}>
        <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-600/20">
          <ChefHat className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="font-black text-xs tracking-tighter bg-linear-to-r from-rose-600 to-amber-500 bg-clip-text text-transparent">
              DULCE CONTRASTE
            </span>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest -mt-1">Premium OS</p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1.5 py-6 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
              isCollapsed && "justify-center px-0",
              activeTab === item.id 
                ? "bg-rose-50 text-rose-600 font-bold" 
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            )}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="activeTabGlow"
                className="absolute inset-0 bg-rose-50 rounded-2xl z-0"
              />
            )}
            <item.icon className={cn(
              "w-5 h-5 transition-all duration-300 relative z-10",
              activeTab === item.id ? "text-rose-600 scale-110" : "group-hover:scale-110"
            )} />
            {!isCollapsed && (
              <span className="text-sm relative z-10 whitespace-nowrap">{item.label}</span>
            )}
            
            {!isCollapsed && activeTab === item.id && (
              <motion.div 
                layoutId="activeTabIndicator"
                className="absolute left-0 w-1 h-6 bg-rose-600 rounded-r-full z-10"
              />
            )}

            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-50">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all border border-slate-100"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <div className={cn(
        "p-4 transition-all duration-300",
        isCollapsed ? "opacity-0" : "opacity-100"
      )}>
        <div className="bg-slate-900 text-white p-5 rounded-3xl relative overflow-hidden group shadow-2xl shadow-slate-900/20">
          <div className="relative z-10">
            <p className="text-[9px] font-black uppercase opacity-60 mb-1 tracking-widest text-rose-400">Estado</p>
            <p className="text-xs font-bold flex items-center gap-2">
              <Monitor className="w-3 h-3 text-rose-400" />
              100% Local Mode
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-rose-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </div>
      </div>
    </motion.aside>
  );
};
