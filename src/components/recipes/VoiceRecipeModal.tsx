import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Modal } from '../shared/Modal';

interface VoiceRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcess: (text: string) => void;
  isProcessing: boolean;
}

export const VoiceRecipeModal: React.FC<VoiceRecipeModalProps> = ({
  isOpen,
  onClose,
  onProcess,
  isProcessing
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        setTranscript(finalTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
          setError('Micrófono bloqueado. Por favor, permite el acceso en la barra del navegador.');
        } else {
          setError('Error al activar el micrófono. Intenta de nuevo.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setError('Tu navegador no soporta el dictado por voz. Te recomiendo usar Chrome o Edge.');
    }
  }, []);

  const toggleListening = () => {
    setError(null);
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        setTranscript('');
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        setError('No se pudo iniciar el dictado. Revisa los permisos.');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Asistente de Voz"
      description="Dicta tu receta y deja que la IA la organice por ti."
      maxWidth="max-w-md"
    >
      <div className="space-y-8 py-4">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.3 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-rose-500 rounded-full"
                />
              )}
            </AnimatePresence>
            <button
              onClick={toggleListening}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl ${
                isListening ? 'bg-rose-500 text-white scale-110' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {isListening ? <Mic size={40} className="animate-pulse" /> : <MicOff size={40} />}
            </button>
          </div>

          <div className="text-center">
            {error ? (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl border border-rose-100 flex flex-col items-center gap-2">
                <p className="text-xs font-black uppercase tracking-tighter">¡Atención!</p>
                <p className="text-sm font-medium">{error}</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-black text-slate-800">
                  {isListening ? 'Te estoy escuchando...' : 'Pulsa el micro para dictar'}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {isListening ? 'Prueba decir: "Receta de Brownies con 200g de mantequilla..."' : 'Asegúrate de estar en un lugar tranquilo'}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="bg-slate-50 rounded-3xl p-6 min-h-[150px] border border-slate-100 relative group">
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button onClick={() => setTranscript('')} className="p-2 text-slate-300 hover:text-slate-500 bg-white rounded-lg shadow-sm border border-slate-100 transition-all">
                <RotateCcw size={14} />
             </button>
          </div>
          <p className={`text-sm font-medium leading-relaxed ${transcript ? 'text-slate-700' : 'text-slate-300 italic'}`}>
            {transcript || 'Aquí aparecerá lo que digas...'}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button
            disabled={!transcript || isListening || isProcessing}
            onClick={() => onProcess(transcript)}
            className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${
              !transcript || isListening || isProcessing
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200'
            }`}
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            Procesar Receta
          </button>
        </div>
      </div>
    </Modal>
  );
};
