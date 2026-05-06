import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { cn } from '../../lib/utils';
import { Cake, Cookie, Candy, IceCream, Cherry } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  onNewOrder: () => void;
}

const FloatingSweets = React.memo(() => {
  const sweets = [
    { Icon: Cake, color: 'text-rose-100/40' },
    { Icon: Cookie, color: 'text-amber-100/40' },
    { Icon: Candy, color: 'text-purple-100/40' },
    { Icon: IceCream, color: 'text-blue-100/40' },
    { Icon: Cherry, color: 'text-red-100/40' },
  ];

  const memoizedSweets = React.useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      Sweet: sweets[i % sweets.length],
      x: Math.random() * 100 + '%',
      y: Math.random() * 100 + '%',
      scale: 0.8 + Math.random(),
      duration: 15 + Math.random() * 10,
      delay: -Math.random() * 10
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-50">
      {memoizedSweets.map(({ id, Sweet, x, y, scale, duration, delay }) => (
        <div
          key={id}
          className={cn("absolute", Sweet.color)}
          style={{ left: x, top: y, transform: `scale(${scale})` }}
        >
          <div 
            className="animate-float" 
            style={{ 
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s` 
            }}
          >
            <Sweet.Icon size={32 + Math.random() * 32} strokeWidth={1} />
          </div>
        </div>
      ))}
      {/* Heavy blur backgrounds: Removed animate-pulse-soft to save GPU fill-rate */}
      <div className="fixed inset-0 pointer-events-none -z-10 blur-3xl opacity-20 overflow-hidden" style={{ willChange: 'opacity' }}>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-400/30 rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-400/30 rounded-full" />
      </div>
    </div>
  );
});

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab,
  globalSearch,
  setGlobalSearch,
  onNewOrder
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen bg-[#FDFCFB] text-slate-900 font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative bg-linear-to-br from-white to-slate-50/50">
        <FloatingSweets />
        
        <Navbar 
          globalSearch={globalSearch} 
          setGlobalSearch={setGlobalSearch}
          onNewOrder={onNewOrder}
        />

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10 no-scrollbar">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ 
                duration: 0.12,
                ease: "easeOut"
              }}
              className="max-w-7xl mx-auto w-full h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
