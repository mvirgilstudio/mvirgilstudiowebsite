import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'EN' | 'PT';
  badge?: string;
  description?: string;
}

const SoonModal: React.FC<SoonModalProps> = ({
  isOpen,
  onClose,
  lang,
  badge = 'EXPERIENCES',
  description,
}) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isPt = lang === 'PT';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl pointer-events-auto"
          onClick={onClose}
        >
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="w-full max-w-lg bg-[#0d0d0d] border border-white/15 rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center text-center group"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-[#5282be]/20 blur-[90px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-[#825ab4]/20 blur-[90px] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/15 hover:border-white/25 transition-all text-concrete hover:text-white group active:scale-95"
              aria-label="Close"
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 font-mono text-[11px] uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
              {badge}
            </div>

            {/* Main Animated Title */}
            <h2 className="text-5xl sm:text-6xl font-display font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40 mb-4">
              {isPt ? 'EM BREVE!' : 'SOON!'}
            </h2>

            {/* Subtitle / Description */}
            <p className="font-sans text-sm sm:text-base text-concrete/80 leading-relaxed max-w-sm mb-8">
              {description ||
                (isPt
                  ? 'Novos projetos e experiências estão atualmente em desenvolvimento.'
                  : 'New projects and experiences are currently in development.')}
            </p>

            {/* Action button */}
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-white text-black font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#e0e0e0] hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {isPt ? 'Fechar' : 'Got it'}
            </button>

            {/* Bottom mini footer */}
            <div className="mt-8 pt-4 border-t border-white/5 w-full flex justify-between items-center text-[9px] font-mono text-concrete/40 uppercase tracking-wider">
              <span>mvirgilstudio</span>
              <span>stay tuned</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SoonModal;
