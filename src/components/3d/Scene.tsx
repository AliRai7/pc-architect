'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  ContactShadows, 
  PerspectiveCamera,
  Float,
  Stars,
  Sparkles
} from '@react-three/drei';
import { usePCStore } from '@/store/usePCStore';
import { useSmoothMousePosition } from '@/hooks/useMousePosition';
import { PCModel } from './PCModel';
import { Vector3 } from 'three';

function CameraController() {
  const { camera } = useThree();
  const mousePosition = useSmoothMousePosition(0.05);
  const { explosionProgress } = usePCStore();

  useFrame(() => {
    // Base camera position
    const basePosition = new Vector3(0, 0, 5);
    
    // Mouse parallax effect (reduced during explosion)
    const parallaxStrength = 1 - explosionProgress * 0.5;
    const targetX = mousePosition.x * 0.5 * parallaxStrength;
    const targetY = mousePosition.y * 0.3 * parallaxStrength;
    
    // Smooth camera movement
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (basePosition.z - camera.position.z) * 0.02;
    
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Lighting() {
  const { explosionProgress, selectedComponent } = usePCStore();
  
  const ambientIntensity = useMemo(() => 
    selectedComponent ? 0.2 : 0.4
  , [selectedComponent]);

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={ambientIntensity} color="#ffffff" />
      
      {/* Key light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={selectedComponent ? 0.5 : 1}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light (violet accent) */}
      <pointLight
        position={[-5, 3, -5]}
        intensity={0.5 + explosionProgress * 0.3}
        color="#7C3AED"
        distance={10}
      />
      
      {/* Rim light */}
      <spotLight
        position={[0, 5, -5]}
        intensity={0.8}
        color="#00F0FF"
        angle={Math.PI / 4}
        penumbra={0.5}
      />
      
      {/* Glow light for explosion */}
      {explosionProgress > 0.3 && (
        <pointLight
          position={[0, 0, 2]}
          intensity={explosionProgress * 0.5}
          color="#7C3AED"
          distance={8}
        />
      )}
    </>
  );
}

function ParticleBackground() {
  const { explosionProgress } = usePCStore();
  
  return (
    <>
      {/* Stars in background */}
      <Stars
        radius={50}
        depth={50}
        count={500}
        factor={2}
        saturation={0.5}
        fade
        speed={0.5}
      />
      
      {/* Sparkles near PC */}
      <Sparkles
        count={50}
        scale={10}
        size={2}
        speed={0.4}
        color="#7C3AED"
        opacity={0.3 + explosionProgress * 0.3}
      />
    </>
  );
}

function SceneContent() {
  const { isLoading } = usePCStore();

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      <CameraController />
      <Lighting />
      <ParticleBackground />
      
      {!isLoading && (
        <Float
          speed={1}
          rotationIntensity={0.1}
          floatIntensity={0.2}
        >
          <PCModel />
        </Float>
      )}
      
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={10}
        blur={2.5}
        far={4}
      />
      
      <Environment preset="city" />
    </>
  );
}

export function Scene() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        style={{
          background: 'linear-gradient(135deg, #0A0A0F 0%, #12121A 100%)',
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
