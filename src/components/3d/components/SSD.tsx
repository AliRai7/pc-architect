'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial } from 'three';
import { useComponentHover } from '@/hooks/useComponentHover';
import { usePCStore } from '@/store/usePCStore';
import { PCComponent } from '@/types';
import * as THREE from 'three';

interface SSDComponentProps {
  data: PCComponent;
  explosionProgress: number;
  dimFactor: number;
  isSelected: boolean;
}

export function SSDComponent({ data, explosionProgress, dimFactor, isSelected }: SSDComponentProps) {
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
  }, [data.position, data.explosionDirection, explosionProgress]);

  const materials = useMemo(() => {
    const pcbMaterial = new MeshStandardMaterial({
      color: isSelected ? 0x3a1a7a : 0x0a2a0a,
      roughness: 0.5,
      metalness: 0.2,
      emissive: isSelected ? 0x7C3AED : 0x001a00,
      emissiveIntensity: isSelected ? 0.3 : 0.05,
    });

    const controllerMaterial = new MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.2,
      metalness: 0.8,
    });

    const nandMaterial = new MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.3,
      metalness: 0.5,
    });

    const heatsinkMaterial = new MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.2,
      metalness: 0.9,
    });

    const rgbMaterial = new MeshStandardMaterial({
      color: 0x7C3AED,
      roughness: 0.1,
      metalness: 0.5,
      emissive: 0x7C3AED,
      emissiveIntensity: 0.5,
    });

    return { pcbMaterial, controllerMaterial, nandMaterial, heatsinkMaterial, rgbMaterial };
  }, [isSelected]);

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        isSelected ? 0.3 : 0.05,
        0.1
      );
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
        {/* SSD PCB */}
        <boxGeometry args={[0.22, 0.08, 0.01]} />
        <primitive object={materials.pcbMaterial} />
      </mesh>
      
      {/* Controller */}
      <mesh position={[0.06, 0, 0.008]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.06, 0.008]} />
        <primitive object={materials.controllerMaterial} />
      </mesh>
      
      {/* NAND Chips */}
      <mesh position={[-0.05, 0, 0.008]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.05, 0.006]} />
        <primitive object={materials.nandMaterial} />
      </mesh>
      <mesh position={[-0.05, 0, 0.008]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.05, 0.006]} />
        <primitive object={materials.nandMaterial} />
      </mesh>
      
      {/* Heatsink */}
      <mesh position={[0, 0, 0.015]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.06, 0.008]} />
        <primitive object={materials.heatsinkMaterial} />
      </mesh>
      
      {/* RGB Strip */}
      <mesh position={[0, 0, 0.02]} castShadow>
        <boxGeometry args={[0.18, 0.01, 0.003]} />
        <primitive object={materials.rgbMaterial} />
      </mesh>
      
      {/* M.2 Connector */}
      <mesh position={[-0.1, 0, -0.005]} castShadow>
        <boxGeometry args={[0.02, 0.06, 0.008]} />
        <meshStandardMaterial color={0xffd700} roughness={0.2} metalness={1.0} />
      </mesh>
    </group>
  );
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
