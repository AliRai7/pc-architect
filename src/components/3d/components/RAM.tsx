'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial } from 'three';
import { useComponentHover } from '@/hooks/useComponentHover';
import { usePCStore } from '@/store/usePCStore';
import { PCComponent } from '@/types';
import * as THREE from 'three';

interface RAMComponentProps {
  data: PCComponent;
  explosionProgress: number;
  dimFactor: number;
  isSelected: boolean;
  index: number;
}

export function RAMComponent({ data, explosionProgress, dimFactor, isSelected, index }: RAMComponentProps) {
  const meshRef = useRef<Mesh>(null);
  const { meshRef: hoverRef, onPointerOver, onPointerOut } = useComponentHover(data.id);
  const { selectComponent } = usePCStore();

  const setRefs = (element: Mesh | null) => {
    (meshRef as any).current = element;
    (hoverRef as any).current = element;
  };

  // Stagger the explosion based on index
  const staggeredProgress = useMemo(() => {
    const staggerDelay = index * 0.05;
    const adjustedProgress = Math.max(0, explosionProgress - staggerDelay);
    return Math.min(1, adjustedProgress / (1 - staggerDelay * 4));
  }, [explosionProgress, index]);

  const position = useMemo(() => {
    const basePos = data.position.clone();
    const easedProgress = easeOutCubic(staggeredProgress);
    return basePos.add(data.explosionDirection.clone().multiplyScalar(easedProgress));
  }, [data.position, data.explosionDirection, staggeredProgress]);

  const materials = useMemo(() => {
    const pcbMaterial = new MeshStandardMaterial({
      color: isSelected ? 0x3a1a7a : 0x0d3b0d,
      roughness: 0.5,
      metalness: 0.2,
      emissive: isSelected ? 0x7C3AED : 0x001100,
      emissiveIntensity: isSelected ? 0.3 : 0.05,
    });

    const heatSpreaderMaterial = new MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.2,
      metalness: 0.9,
    });

    const rgbMaterial = new MeshStandardMaterial({
      color: 0x7C3AED,
      roughness: 0.1,
      metalness: 0.5,
      emissive: 0x7C3AED,
      emissiveIntensity: 0.6 + Math.sin(Date.now() * 0.003 + index) * 0.2,
    });

    const goldMaterial = new MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.2,
      metalness: 1.0,
    });

    return { pcbMaterial, heatSpreaderMaterial, rgbMaterial, goldMaterial };
  }, [isSelected, index]);

  // Animate RGB
  useFrame((state) => {
    if (meshRef.current) {
      const rgbMesh = meshRef.current.children[2] as Mesh;
      if (rgbMesh && rgbMesh.material) {
        const mat = rgbMesh.material as MeshStandardMaterial;
        mat.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.3;
      }
    }
  });

  const handleClick = (event: any) => {
    event.stopPropagation();
    selectComponent(data.id);
  };

  return (
    <group 
      position={position}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={handleClick}
    >
      <mesh ref={setRefs} castShadow receiveShadow>
        {/* PCB */}
        <boxGeometry args={[0.12, 1.0, 0.02]} />
        <primitive object={materials.pcbMaterial} />
      </mesh>
      
      {/* Heat Spreader */}
      <mesh position={[0, 0, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 0.8, 0.03]} />
        <primitive object={materials.heatSpreaderMaterial} />
      </mesh>
      
      {/* RGB Strip */}
      <mesh position={[0, 0, 0.04]} castShadow>
        <boxGeometry args={[0.1, 0.75, 0.005]} />
        <primitive object={materials.rgbMaterial} />
      </mesh>
      
      {/* Gold Contacts */}
      <mesh position={[0, -0.48, 0]} castShadow>
        <boxGeometry args={[0.1, 0.08, 0.015]} />
        <primitive object={materials.goldMaterial} />
      </mesh>
    </group>
  );
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
