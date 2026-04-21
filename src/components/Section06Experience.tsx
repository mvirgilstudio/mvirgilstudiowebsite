import React, { Suspense, useMemo, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, PerspectiveCamera, Center, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

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
    // Start appearing at 5% scroll, full size at 100%
    const easedProgress = Math.max(0, (progress - 0.05) / 0.95);
    const scale = easedProgress * 0.034;

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
}

const Section06Experience: React.FC<Section06ExperienceProps> = ({ scrollProgress, modelId = 'print01', onModelChange }) => {
    const [mouseRotation, setMouseRotation] = useState(new THREE.Euler(0, 0, 0));
    const isDragging = useRef(false);
    const lastMouse = useRef({ x: 0, y: 0 });

    // Reset rotation when scrolling back
    useEffect(() => {
        if (scrollProgress < 0.95) {
            setMouseRotation(new THREE.Euler(0, 0, 0));
        }
    }, [scrollProgress]);

    // Handle mouse rotation when progress is 100%
    useEffect(() => {
        if (scrollProgress < 0.95) return;

        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 0) {
                isDragging.current = true;
                lastMouse.current = { x: e.clientX, y: e.clientY };
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            const deltaX = e.clientX - lastMouse.current.x;
            const deltaY = e.clientY - lastMouse.current.y;

            setMouseRotation(prev => new THREE.Euler(
                prev.x + deltaY * 0.01,
                prev.y + deltaX * 0.01,
                0
            ));
            lastMouse.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseUp = () => {
            isDragging.current = false;
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [scrollProgress]);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <div className="absolute inset-0 z-[10] pointer-events-none flex items-center justify-center">
            {/* 3D Scene Layer — transparent background so LottieBackground (z-[45]) in Section.tsx shows through */}
            <div 
                className="absolute inset-0 w-full h-full"
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
                        {/* NO <color> background — canvas stays transparent */}
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
                    </Suspense>
                </Canvas>
            </div>
            {/* Lottie animation is rendered by LottieBackground in Section.tsx at z-[45] behind this transparent canvas */}
            {/* Model Select Buttons Layer */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute left-10 md:left-20 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-6 pointer-events-auto"
            >
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-[1px] bg-white/30" />
                    <span className="text-[9px] font-mono tracking-widest text-white/60 uppercase font-bold">Select Prototype</span>
                </div>

                <div className="flex flex-col gap-5">
                    {[
                        { id: 'print01', img: '/assets/images/print_01_bttn.png', label: 'PRT-ALPHA' },
                        { id: 'print02', img: '/assets/images/print_02_bttn.png', label: 'PRT-BETA' },
                        { id: 'print03', img: '/assets/images/print_03_bttn.png', label: 'PRT-GAMMA' }
                    ].map((btn) => (
                        <div
                            key={btn.id}
                            onClick={() => onModelChange?.(btn.id)}
                            className="group relative cursor-pointer"
                        >
                            <div className={`w-14 h-14 md:w-20 md:h-20 p-0.5 rounded-lg border transition-all duration-500 overflow-hidden ${modelId === btn.id ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] bg-white/5' : 'border-white/10 grayscale hover:grayscale-0 bg-white/5'}`}>
                                <img src={btn.img} alt={btn.label} className="w-full h-full object-cover rounded-md" />
                            </div>
                            <div className={`absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}>
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
            </motion.div>
        </div>
    );
};

useGLTF.preload('/assets/3d/s06/print01.gltf');
useGLTF.preload('/assets/3d/s06/print02.gltf');
useGLTF.preload('/assets/3d/s06/print03.gltf');

export default Section06Experience;
