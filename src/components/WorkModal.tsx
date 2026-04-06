import React, { useEffect, useRef, useState, useMemo } from 'react';
import { WorkItem } from '../types';
import gsap from 'gsap';
import { TRANSLATIONS } from '../data/translations';
import { motion, AnimatePresence } from 'framer-motion';
import { SECTION_ACCENTS, WORK_COLORS } from '../data/constants';

interface WorkModalProps {
    work: WorkItem | null;
    onClose: () => void;
    lang: 'EN' | 'PT';
    activeSectionId: string | null;
}

const WorkModal: React.FC<WorkModalProps> = ({ work, onClose, lang, activeSectionId }) => {
    const t = TRANSLATIONS[lang];
    const overlayRef = useRef<HTMLDivElement>(null);
    const modalContainerRef = useRef<HTMLDivElement>(null);
    const mediaContainerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [activeWork, setActiveWork] = useState<WorkItem | null>(null);

    // Get a deterministic random color for this work based on its ID
    const workAccent = useMemo(() => {
        if (!activeWork) return null;
        const idNum = parseInt(activeWork.id.replace(/\D/g, '')) || 0;
        return WORK_COLORS[idNum % WORK_COLORS.length];
    }, [activeWork]);

    const accent = workAccent || { hex: '#ffffff', hoverHex: '#ffffff', rgb: '255,255,255' };

    useEffect(() => {
        if (work) {
            setActiveWork(work);
            document.body.style.overflow = 'hidden';
            document.documentElement.classList.add('modal-open');
        }
    }, [work]);

    // GSAP Entrance Animation
    useEffect(() => {
        if (activeWork && overlayRef.current && modalContainerRef.current) {
            const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } });
            gsap.set(overlayRef.current, { opacity: 0 });
            gsap.set(modalContainerRef.current, {
                opacity: 0, scale: 1.06,
                filter: 'blur(20px) brightness(2)', y: 40
            });
            gsap.set([mediaContainerRef.current, contentRef.current], { opacity: 0, y: 24 });

            tl.to(overlayRef.current, { opacity: 1, duration: 0.7, ease: "none" })
              .to(modalContainerRef.current, {
                  opacity: 1, scale: 1,
                  filter: 'blur(0px) brightness(1)', y: 0, duration: 1.2,
              }, "-=0.4")
              .to(mediaContainerRef.current, { opacity: 1, y: 0, duration: 0.9 }, "-=0.9")
              .to(contentRef.current, { opacity: 1, y: 0, duration: 0.9 }, "-=0.7");
        }
    }, [activeWork]);

    const handleClose = () => {
        if (!overlayRef.current || !modalContainerRef.current) { onClose(); return; }
        const tl = gsap.timeline({
            onComplete: () => {
                setActiveWork(null);
                onClose();
                document.body.style.overflow = 'unset';
                document.documentElement.classList.remove('modal-open');
            }
        });
        tl.to(contentRef.current, { opacity: 0, y: -16, duration: 0.3, ease: "power2.in" })
          .to(modalContainerRef.current, {
              opacity: 0, scale: 0.96,
              filter: 'blur(16px) brightness(0.5)', y: -24,
              duration: 0.5, ease: "expo.in"
          }, "-=0.15")
          .to(overlayRef.current, { opacity: 0, duration: 0.35, ease: "none" }, "-=0.25");
    };

    if (!activeWork) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-6 md:p-12 bg-black/60 backdrop-blur-sm overflow-hidden"
            onClick={handleClose}
        >
            <div
                ref={modalContainerRef}
                className="relative w-full max-w-4xl max-h-[80vh] bg-[#050505] border border-white/8 flex flex-col md:flex-row overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.8)] z-10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Close Button ── */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 md:top-8 md:right-8 z-[60] group flex items-center gap-3 text-white/40 transition-all duration-400"
                    onMouseEnter={(e) => {
                        const icon = e.currentTarget.querySelector('.close-icon') as HTMLElement;
                        if (icon) {
                            icon.style.borderColor = accent.hoverHex;
                            icon.style.color = accent.hoverHex;
                        }
                    }}
                    onMouseLeave={(e) => {
                        const icon = e.currentTarget.querySelector('.close-icon') as HTMLElement;
                        if (icon) {
                            icon.style.borderColor = 'rgba(255,255,255,0.15)';
                            icon.style.color = 'white';
                        }
                    }}
                >
                    <span className="text-[10px] font-mono tracking-[0.4em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block" style={{ color: accent.hoverHex }}>
                        {lang === 'EN' ? 'CLOSE' : 'FECHAR'}
                    </span>
                    <div className="close-icon w-9 h-9 flex items-center justify-center border border-white/15 transition-all duration-400 bg-black/40 backdrop-blur-md rotate-45">
                        <span className="text-lg font-thin leading-none -rotate-45 block">+</span>
                    </div>
                </button>

                {/* ── Left: Media ── */}
                <div
                    ref={mediaContainerRef}
                    className="w-full md:w-[58%] h-[45vh] md:h-full relative bg-black overflow-hidden shrink-0"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeWork.id + '-media'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                        >
                            {activeWork.mediaType === 'iframe' ? (
                                <iframe
                                    src={activeWork.mediaUrl}
                                    loading="lazy"
                                    style={{
                                        border: 0,
                                        position: 'absolute',
                                        top: '50%', left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 'max(100%, 177.78vh)',
                                        height: 'max(100%, 56.25vw)',
                                    }}
                                    allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                                    allowFullScreen
                                />
                            ) : activeWork.mediaType === 'video' ? (
                                <video
                                    src={activeWork.mediaUrl}
                                    autoPlay loop muted playsInline
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={activeWork.mediaUrl}
                                    alt={activeWork.title}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent z-10 hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />

                    {/* Bottom scan line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5 z-20" />
                </div>

                {/* ── Right: Content ── */}
                <div
                    ref={contentRef}
                    className="w-full md:w-[42%] flex flex-col bg-[#050505] relative border-l border-white/5 overflow-y-auto"
                    style={{ scrollbarWidth: 'none' }}
                >
                    <div className="flex-1 flex flex-col justify-center px-8 md:px-12 py-12">
                        {/* ID Badge */}
                        <div className="flex items-center gap-3 mb-10">
                            <div className="h-[1px] w-8 transition-colors duration-500" style={{ backgroundColor: `${accent.hex}40` }} />
                            <span className="text-[10px] font-mono tracking-[0.5em] uppercase font-bold transition-colors duration-500" style={{ color: accent.hoverHex }}>
                                ID::{activeWork.id.toUpperCase()}
                            </span>
                        </div>

                        {/* Title */}
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={activeWork.id + '-title'}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.4 }}
                                className="text-3xl md:text-4xl lg:text-5xl font-tech font-bold text-white uppercase tracking-tighter leading-[1.05] break-words mb-8"
                            >
                                {t.worksIndex[activeWork.id as keyof typeof t.worksIndex]?.title || activeWork.title}
                            </motion.h2>
                        </AnimatePresence>

                        <div className="w-12 h-[1px] bg-white/15 mb-8" />

                        {/* Description */}
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={activeWork.id + '-desc'}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, delay: 0.05 }}
                                className="text-sm text-concrete/70 leading-relaxed font-light mb-10 max-w-sm tracking-wide"
                            >
                                {t.worksIndex[activeWork.id as keyof typeof t.worksIndex]?.description || activeWork.description}
                            </motion.p>
                        </AnimatePresence>

                        {/* CTA */}
                        {activeWork.externalLink && (
                            <a
                                href={activeWork.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/btn relative inline-flex items-center gap-6 px-8 py-4 border border-white/20 transition-all duration-500 mb-12 self-start overflow-hidden bg-white/2 shadow-[0_0_40px_rgba(0,0,0,0.3)]"
                                style={{
                                    borderColor: `rgba(${accent.rgb}, 0.3)`
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = accent.hoverHex;
                                    e.currentTarget.style.boxShadow = `0 0 30px rgba(${accent.rgb}, 0.25)`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = `rgba(${accent.rgb}, 0.3)`;
                                    e.currentTarget.style.boxShadow = '0 0 40px rgba(0,0,0,0.3)';
                                }}
                            >
                                {/* Static background glow */}
                                <div className="absolute inset-0 opacity-[0.03] transition-opacity duration-500 group-hover/btn:opacity-10" 
                                     style={{ backgroundColor: accent.hex }} />
                                
                                <div className="relative z-10 flex flex-col items-start gap-1">
                                    <span className="text-[11px] font-tech font-bold tracking-[0.4em] transition-colors duration-400 uppercase"
                                          style={{ color: accent.hoverHex }}>
                                        {t.ui.visitProject}
                                    </span>
                                    <div className="h-[1px] w-0 group-hover/btn:w-full transition-all duration-500 bg-current" 
                                         style={{ color: accent.hoverHex }} />
                                </div>
                                
                                <div className="relative z-10 flex items-center justify-center w-8 h-8 border border-white/10 group-hover/btn:border-white/40 transition-all duration-500 rotate-45 overflow-hidden"
                                     style={{ borderColor: `rgba(${accent.rgb}, 0.4)` }}>
                                    <span className="group-hover/btn:text-white transition-all duration-500 -rotate-45 transform group-hover/btn:translate-x-1 font-mono text-sm"
                                          style={{ color: accent.hoverHex }}>→</span>
                                </div>

                                {/* Diagonal filling effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-45deg]" />
                                
                                {/* Pulse corner accent */}
                                <div className="absolute top-0 right-0 w-1 h-1 transition-colors duration-500" 
                                     style={{ backgroundColor: accent.hex }} />
                                <div className="absolute bottom-0 left-0 w-1 h-1 transition-colors duration-500" 
                                     style={{ backgroundColor: accent.hex }} />
                            </a>
                        )}

                        {/* Meta tags */}
                        <div className="flex flex-col gap-3 text-white/30 border-t border-white/5 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-1 rounded-full transition-colors duration-500" style={{ backgroundColor: accent.hex }} />
                                <span className="text-[10px] font-mono uppercase tracking-[0.25em]">{lang === 'EN' ? 'Interactive Integration' : 'Integração Interativa'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-1 rounded-full transition-colors duration-500" style={{ backgroundColor: accent.hex }} />
                                <span className="text-[10px] font-mono uppercase tracking-[0.25em]">{lang === 'EN' ? 'Real-time Systems' : 'Sistemas de Tempo Real'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkModal;
