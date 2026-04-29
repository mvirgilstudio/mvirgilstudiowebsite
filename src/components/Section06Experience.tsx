import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, PerspectiveCamera, Center, Float, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ modelId, progress, mouseRotation }: { modelId: string, progress: number, mouseRotation: THREE.Euler }) => {
    const { scene } = useGLTF(`/assets/3d/s06/${modelId}.gltf`);

    // Ensure shadows and materials
    useMemo(() => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                    child.material.roughness = 0.5;
                    child.material.metalness = 0.4;
                }
            }
        });
    }, [scene]);

    // Scale: show minimal geometry at start, full size at end
    const easedProgress = Math.max(0, (progress - 0.02) / 0.98);
    const scale = (0.1 + easedProgress * 0.9) * 0.034;

    const isComplete = progress > 0.98;

    return (
        <primitive
            object={scene}
            scale={scale}
            rotation={[
                isComplete ? mouseRotation.x : 0,
                isComplete ? mouseRotation.y : Math.PI * progress * 0.5,
                isComplete ? mouseRotation.z : 0
            ]}
        />
    );
};

interface Section06ExperienceProps {
    scrollProgress: number;
    modelId?: string;
    onModelChange?: (id: string) => void;
    onLottieLoaded?: () => void;
}

const Section06Experience: React.FC<Section06ExperienceProps> = ({ scrollProgress, modelId = 'print01', onModelChange }) => {
    const [mouseRotation, setMouseRotation] = useState(new THREE.Euler(0, 0, 0));
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        const handleMouseMove = (e: MouseEvent) => {
            if (scrollProgress > 0.98) {
                const x = (e.clientY / window.innerHeight - 0.5) * 0.5;
                const y = (e.clientX / window.innerWidth - 0.5) * 0.5;
                setMouseRotation(new THREE.Euler(x, y, 0));
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [scrollProgress]);

    return (
        <div className="absolute inset-0 z-[10] flex items-center justify-center">
            {/* 3D Scene Layer — transparent background */}
            <div 
                className="absolute inset-0 w-full h-full z-[20]"
                style={{ pointerEvents: 'auto', background: 'transparent' }}
            >
                <Canvas
                    shadows={!isMobile}
                    gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                    dpr={isMobile ? [1, 1] : [1, 1.5]}
                    camera={{ position: [0, 0, 25], fov: 30 }}
                >
                    <Suspense fallback={
                        <Html center>
                            <div className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-mono whitespace-nowrap">
                                Fabricating Model...
                            </div>
                        </Html>
                    }>
                        <PerspectiveCamera makeDefault position={[0, 0, 25]} fov={30} />

                        <ambientLight intensity={0.6} />
                        <spotLight position={[15, 20, 15]} angle={0.3} penumbra={1} intensity={2.5} castShadow />
                        <pointLight position={[-10, 10, -10]} intensity={1.5} color="#A855F7" />

                        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                            <Center position={[-4, -1.5, 8]}>
                                <Model modelId={modelId} progress={scrollProgress} mouseRotation={mouseRotation} />
                            </Center>
                        </Float>

                        <Environment files="/assets/images/monochrome_studio_04_1k.hdr" />
                        <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
                    </Suspense>
                </Canvas>
            </div>

            {/* Scroll Interaction Captions */}
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

            {/* Sidebar Buttons */}
            <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-4 md:gap-6 pointer-events-auto items-end">
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
                            <div className={`w-14 h-14 md:w-24 md:h-24 p-0.5 rounded-xl border transition-all duration-500 overflow-hidden ${modelId === btn.id ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] bg-white/5 scale-110' : 'border-white/10 grayscale hover:grayscale-0 bg-white/5 hover:border-white/30'}`}>
                                <img src={btn.img} alt={btn.label} className="w-full h-full object-cover rounded-lg" />
                            </div>
                            <div className={`absolute -left-4 top-1/2 -translate-y-1/2 translate-x-full px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}>
                                <span className="text-[8px] font-mono text-white tracking-widest uppercase">{btn.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <motion.a
                    href="/projects/vasemotion/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 group flex items-center gap-3 py-3 px-5 border border-white/5 bg-white/2 backdrop-blur-md hover:border-white/40 transition-all duration-500 w-fit rounded-lg"
                    whileHover={{ x: 10 }}
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-[9px] font-mono tracking-[0.2em] text-white/60 group-hover:text-white transition-colors uppercase">
                        Lab Archives
                    </span>
                    <span className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all text-xs">→</span>
                </motion.a>

                <motion.a
                    href="/projects/rolls_royce/code.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 group flex items-center gap-3 py-3 px-5 border border-purple-500/10 bg-purple-500/5 backdrop-blur-md hover:border-purple-500/40 transition-all duration-500 w-fit rounded-lg"
                    whileHover={{ x: 10 }}
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-[9px] font-mono tracking-[0.2em] text-purple-400 group-hover:text-purple-300 transition-colors uppercase">
                        Ghost Configurator
                    </span>
                    <span className="text-purple-400/60 group-hover:text-purple-300 group-hover:translate-x-1 transition-all text-xs">→</span>
                </motion.a>
            </div>
        </div>
    );
};

export default Section06Experience;
