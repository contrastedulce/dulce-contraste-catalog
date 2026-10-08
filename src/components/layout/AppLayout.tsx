import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { cn } from '../../lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  onNewOrder: () => void;
}

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
    <div className="flex h-screen text-slate-900 font-sans overflow-hidden" style={{ backgroundColor: '#FFF8F2' }}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Subtle warm background blobs */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-15%] right-[-5%] w-[35%] h-[35%] bg-rose-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[10%] w-[30%] h-[30%] bg-amber-200/15 rounded-full blur-3xl" />
        </div>

        <Navbar 
          globalSearch={globalSearch} 
          setGlobalSearch={setGlobalSearch}
          onNewOrder={onNewOrder}
        />

        <div className={cn(
          "flex-1 overflow-y-auto custom-scrollbar relative z-10 no-scrollbar",
          activeTab === 'recipes' ? "p-3 sm:p-4 md:p-6" : "p-6 md:p-8"
        )}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={cn(
                "w-full h-full",
                activeTab === 'recipes' ? "max-w-none px-0" : "max-w-[1600px] mx-auto"
              )}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
