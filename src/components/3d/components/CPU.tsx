'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, MeshStandardMaterial } from 'three';
import { useComponentHover } from '@/hooks/useComponentHover';
import { usePCStore } from '@/store/usePCStore';
import { PCComponent } from '@/types';
import * as THREE from 'three';

interface CPUComponentProps {
  data: PCComponent;
  explosionProgress: number;
  dimFactor: number;
  isSelected: boolean;
}

export function CPUComponent({ data, explosionProgress, dimFactor, isSelected }: CPUComponentProps) {
  const meshRef = useRef<Mesh>(null);
  const { meshRef: hoverRef, onPointerOver, onPointerOut } = useComponentHover(data.id);
  const { selectComponent } = usePCStore();

  const setRefs = (element: Mesh | null) => {
    (meshRef as any).current = element;
    (hoverRef as any).current = element;
  };

  const position = useMemo(() => {
    const basePos = data.position.clone();
    const easedProgress = easeOutCubic(explosionProgress);
    return basePos.add(data.explosionDirection.clone().multiplyScalar(easedProgress));
  }, [data.position, data.exosionDirection, explosionProgress]);

  const materials = useMemo(() => {
    const ihsMaterial = new MeshStandardMaterial({
      color: 0xc0c0c0,
      roughness: 0.1,
      metalness: 1.0,
    });

    const pcbMaterial = new MeshStandardMaterial({
      color: isSelected ? 0x3a1a7a : 0x0d3b0d,
      roughness: 0.6,
      metalness: 0.1,
      emissive: isSelected ? 0x7C3AED : 0x001100,
      emissiveIntensity: isSelected ? 0.3 : 0.1,
    });

    const pinMaterial = new MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.3,
      metalness: 1.0,
    });

    return { ihsMaterial, pcbMaterial, pinMaterial };
  }, [isSelected]);

  useFrame(() => {
    if (meshRef.current) {
      const pcbMesh = meshRef.current.children[1] as Mesh;
      if (pcbMesh && pcbMesh.material) {
        const mat = pcbMesh.material as MeshStandardMaterial;
        mat.emissiveIntensity = THREE.MathUtils.lerp(
          mat.emissiveIntensity,
          isSelected ? 0.3 : 0.1,
          0.1
        );
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
        {/* CPU IHS (Integrated Heat Spreader) */}
        <boxGeometry args={[0.35, 0.35, 0.03]} />
        <primitive object={materials.ihsMaterial} />
      </mesh>
      
      {/* CPU PCB */}
      <mesh position={[0, 0, -0.03]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.4, 0.02]} />
        <primitive object={materials.pcbMaterial} />
      </mesh>
      
      {/* Pins (simplified as a grid) */}
      <mesh position={[0, 0, -0.05]} castShadow>
        <boxGeometry args={[0.38, 0.38, 0.01]} />
        <primitive object={materials.pinMaterial} />
      </mesh>
      
      {/* Branding text area */}
      <mesh position={[0, 0, 0.016]} castShadow>
        <planeGeometry args={[0.25, 0.25]} />
        <meshStandardMaterial
          color={0x333333}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
