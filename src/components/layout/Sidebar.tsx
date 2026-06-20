import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChefHat,
  Wifi
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
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="sidebar-espresso flex flex-col h-full relative z-30"
    >
      {/* Logo */}
      <div className={cn(
        "p-5 flex items-center gap-3 overflow-hidden border-b border-white/5",
        isCollapsed && "justify-center p-4"
      )}>
        <div className="w-10 h-10 bg-linear-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-900/40">
          <ChefHat className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col overflow-hidden"
          >
            <span className="font-black text-xs tracking-widest text-white/90 uppercase">
              Dulce Contraste
            </span>
            <p className="text-[9px] font-bold text-amber-400/70 uppercase tracking-[0.2em] -mt-0.5">
              Premium OS
            </p>
          </motion.div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1 py-5 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item, index) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative btn-press",
                isCollapsed && "justify-center px-0",
                isActive
                  ? "text-white"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              )}
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveTab"
                  className="absolute inset-0 bg-white/10 rounded-xl z-0 border border-white/10"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}

              {/* Amber left indicator */}
              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="sidebarIndicator"
                  className="absolute left-0 w-0.5 h-5 bg-amber-400 rounded-r-full z-10"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}

              <item.icon className={cn(
                "w-4 h-4 relative z-10 transition-all duration-200",
                isActive ? "text-amber-400 scale-110" : "group-hover:scale-105"
              )} />

              {!isCollapsed && (
                <span className={cn(
                  "text-xs relative z-10 whitespace-nowrap font-medium",
                  isActive && "font-bold text-white"
                )}>
                  {item.label}
                </span>
              )}

              {/* Collapsed tooltip */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-espresso border border-white/10 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl font-medium">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="px-3 pb-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full h-9 flex items-center justify-center rounded-xl bg-white/5 text-white/30 hover:text-white/60 hover:bg-white/10 transition-all border border-white/5 btn-press"
        >
          {isCollapsed 
            ? <ChevronRight className="w-4 h-4" /> 
            : <ChevronLeft className="w-4 h-4" />
          }
        </button>
      </div>

      {/* Status Card */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-3 mb-4 p-4 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden"
        >
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-soft shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <div>
              <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Estado</p>
              <p className="text-[11px] font-bold text-white/70 flex items-center gap-1.5 mt-0.5">
                <Wifi className="w-3 h-3 text-emerald-400" />
                100% Local Mode
              </p>
            </div>
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-amber-500/10 rounded-full blur-xl" />
        </motion.div>
      )}
    </motion.aside>
  );
};
