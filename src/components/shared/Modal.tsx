import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { X, GripHorizontal, Minimize2, Maximize2, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

// Global counter for z-index management across all modals
let globalModalZIndex = 1000;
let openModalsCount = 0;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  viewId?: string; // ID for pop-out identification
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  description,
  children,
  maxWidth = "max-w-2xl",
  viewId
}) => {
  const [zIndex, setZIndex] = useState(globalModalZIndex);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dimensions, setDimensions] = useState<{ width?: number | string; height?: number | string }>({});
  const [isResizing, setIsResizing] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  useEffect(() => {
    if (isOpen) {
      openModalsCount++;
      globalModalZIndex += 10;
      setZIndex(globalModalZIndex);
      
      if (openModalsCount === 1) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (openModalsCount > 0) openModalsCount--;
      if (openModalsCount === 0) {
        document.body.style.overflow = 'unset';
      }
    }
    
    return () => {
      if (isOpen && openModalsCount > 0) {
        openModalsCount--;
        if (openModalsCount === 0) {
          document.body.style.overflow = 'unset';
        }
      }
    };
  }, [isOpen]);

  const bringToFront = () => {
    if (zIndex < globalModalZIndex) {
      globalModalZIndex += 10;
      setZIndex(globalModalZIndex);
    }
  };

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = containerRef.current?.offsetWidth || 0;
    const startHeight = containerRef.current?.offsetHeight || 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      const newHeight = startHeight + (moveEvent.clientY - startY);
      setDimensions({
        width: Math.max(320, newWidth),
        height: Math.max(200, newHeight)
      });
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handlePopout = () => {
    if (!viewId) return;
    const width = 800;
    const height = 900;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    window.open(
      `/popout?view=${viewId}`,
      `popout_${viewId}`,
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
    );
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 pointer-events-none flex items-center justify-center p-4"
          style={{ zIndex }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] pointer-events-none"
          />
          
          <motion.div
            ref={containerRef}
            drag={!isResizing}
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            onPointerDownCapture={bringToFront}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: isMinimized ? 400 : 0, // Mock minimized position
              height: isMinimized ? 'auto' : (dimensions.height || 'auto'),
              width: dimensions.width || undefined
            }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            style={{ 
              pointerEvents: 'auto',
              width: dimensions.width || undefined,
            }}
            className={cn(
              "relative w-full glass-morphism rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300",
              !dimensions.width && maxWidth,
              isMinimized ? "max-h-16" : "max-h-[95vh]"
            )}
          >
            {/* Header (Drag area) */}
            <div 
              className="flex items-center justify-between p-4 border-b border-slate-100 bg-white/80 cursor-grab active:cursor-grabbing group select-none relative z-10"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="flex items-start gap-4 flex-1">
                <GripHorizontal className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors mt-1 shrink-0" />
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-800 line-clamp-1">{title}</h2>
                  {!isMinimized && description && <p className="text-sm text-slate-500 mt-1 line-clamp-1">{description}</p>}
                </div>
              </div>
              
              <div className="flex items-center gap-1 shrink-0 ml-4">
                {viewId && (
                  <button
                    onClick={handlePopout}
                    className="p-2 hover:bg-slate-100 text-slate-400 hover:text-primary rounded-xl transition-all"
                    title="Abrir en ventana independiente"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-slate-100 text-slate-400 rounded-xl transition-all"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className={cn(
              "flex-1 overflow-y-auto p-6 custom-scrollbar bg-white/60 transition-opacity",
              isMinimized ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
              {children}
            </div>

            {/* Resize Handle */}
            {!isMinimized && (
              <div 
                className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize group flex items-end justify-end p-1 z-20"
                onMouseDown={startResizing}
              >
                <div className="w-3 h-3 border-r-2 border-b-2 border-slate-300 group-hover:border-primary transition-colors mb-1 mr-1" />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
