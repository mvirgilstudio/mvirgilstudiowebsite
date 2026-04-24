import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import LottieBackground from './LottieBackground';

interface Section06ExperienceProps {
    scrollProgress: number;
    modelId?: string;
    onModelChange?: (id: string) => void;
    onLottieLoaded?: () => void;
}

const Model = ({ url }: { url: string }) => {
    const { scene } = useGLTF(url);
    // Adjusted scale to 0.04 to reduce size by half
    return <primitive object={scene} scale={0.04} position={[0, -1.8, 0]} />;
};

const Section06Experience: React.FC<Section06ExperienceProps> = ({ scrollProgress, modelId = 'print01', onModelChange, onLottieLoaded }) => {

    return (
        <div
            className="absolute inset-0 flex items-center justify-center w-full h-full overflow-hidden"
            style={{ zIndex: 10, background: 'linear-gradient(135deg, #050505 0%, #151515 50%, #000000 100%)' }}
        >
            {/* 1. Lottie Background Animation */}
            <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${scrollProgress > 0.95 ? 'opacity-30' : 'opacity-100'}`}>
                <LottieBackground
                    url={`/assets/3d/s06/${modelId}.json`}
                    progress={scrollProgress}
                    onLoaded={onLottieLoaded}
                />
            </div>

            {/* 1b. Interactive GLTF Model */}
            <AnimatePresence>
                {scrollProgress > 0.95 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-0 z-40 pointer-events-auto"
                    >
                        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 10, 10]} intensity={1} />
                            <directionalLight position={[-10, -10, -10]} intensity={0.5} />
                            <Environment preset="city" />
                            <Suspense fallback={null}>
                                <Model url={`/assets/3d/s06/${modelId}.gltf`} />
                            </Suspense>
                            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
                        </Canvas>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. Scroll Interaction Captions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-3 z-[100] pointer-events-none w-[90%] md:w-auto"
            >
                <AnimatePresence mode="wait">
                    {scrollProgress > 0.95 ? (
                        <motion.div
                            key="inspect"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                            <span className="text-xs font-mono tracking-widest text-white uppercase font-bold bg-black/40 px-3 py-1 rounded backdrop-blur-sm border border-white/20">
                                Click & Drag to Inspect
                            </span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="fabricate"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="w-[2px] h-10 bg-[#b46464]/50 animate-bounce" />
                            <span className="text-xs font-mono tracking-widest text-[#b46464] font-bold uppercase bg-black/40 px-3 py-1 rounded backdrop-blur-sm border border-[#b46464]/20">
                                Scroll to Fabricate
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="text-xs font-tech text-white tracking-widest font-bold">
                    {Math.round(scrollProgress * 100)}% Complete
                </div>
            </motion.div>



            {/* 4. Sidebar Buttons - Relocated to right to avoid collision with Exit button */}
            <div className="absolute right-4 md:right-12 md:left-auto top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-4 md:gap-6 pointer-events-auto items-end">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-white/30 hidden md:block" />
                    <span className="text-[10px] font-mono tracking-widest text-white/80 uppercase font-bold hidden md:inline-block">Prototypes</span>
                </div>

                <div className="flex flex-col gap-3 md:gap-5">
                    {[
                        { id: 'print01', img: '/assets/images/vfx/vfx_07.png', label: 'OBJ-ALPHA' },
                        { id: 'print02', img: '/assets/images/vfx/vfx_08.png', label: 'OBJ-BETA' },
                        { id: 'print03', img: '/assets/images/vfx/vfx_09.png', label: 'OBJ-GAMMA' }
                    ].map((btn) => (
                        <div
                            key={btn.id}
                            onClick={() => onModelChange?.(btn.id)}
                            className="group relative cursor-pointer"
                        >
                            <div className={`w-12 h-12 md:w-20 md:h-20 p-[2px] rounded-xl transition-all duration-500 overflow-hidden backdrop-blur-sm bg-white/5 ${modelId === btn.id ? 'border-2 border-white shadow-[0_0_30px_rgba(255,255,255,0.4)] scale-110' : 'border border-white/10 grayscale hover:grayscale-0 hover:border-white/40 hover:scale-105'}`}>
                                <img src={btn.img} alt={btn.label} className="w-full h-full object-cover rounded-lg bg-black/40" />
                            </div>
                            {/* Hover label - now appearing to the left of the button */}
                            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/90 backdrop-blur-xl border border-white/20 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-x-2 group-hover:translate-x-0">
                                <span className="text-[10px] font-mono text-white tracking-widest uppercase font-bold">{btn.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};



export default Section06Experience;
