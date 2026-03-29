'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial } from 'three';
import { useComponentHover } from '@/hooks/useComponentHover';
import { usePCStore } from '@/store/usePCStore';
import { PCComponent } from '@/types';
import * as THREE from 'three';

interface MotherboardComponentProps {
  data: PCComponent;
  explosionProgress: number;
  dimFactor: number;
  isSelected: boolean;
}

export function MotherboardComponent({ data, explosionProgress, dimFactor, isSelected }: MotherboardComponentProps) {
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
      color: isSelected ? 0x2a1a4a : 0x0d3b0d,
      roughness: 0.6,
      metalness: 0.1,
      emissive: isSelected ? 0x7C3AED : 0x001100,
      emissiveIntensity: isSelected ? 0.2 : 0.05,
    });

    const traceMaterial = new MeshStandardMaterial({
      color: 0x7C3AED,
      roughness: 0.4,
      metalness: 0.3,
      emissive: 0x7C3AED,
      emissiveIntensity: 0.3 + explosionProgress * 0.4,
    });

    const slotMaterial = new MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.3,
      metalness: 0.8,
    });

    const connectorMaterial = new MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.2,
      metalness: 1.0,
    });

    const vrmMaterial = new MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.4,
      metalness: 0.7,
    });

    return { pcbMaterial, traceMaterial, slotMaterial, connectorMaterial, vrmMaterial };
  }, [isSelected, explosionProgress]);

  useFrame(() => {
    if (meshRef.current) {
      const mat = meshRef.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        isSelected ? 0.2 : 0.05 + explosionProgress * 0.1,
        0.05
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
        {/* Main PCB */}
        <boxGeometry args={[1.0, 1.2, 0.02]} />
        <primitive object={materials.pcbMaterial} />
      </mesh>
      
      {/* CPU Socket */}
      <mesh position={[0, 0.3, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.25, 0.01]} />
        <primitive object={materials.slotMaterial} />
      </mesh>
      
      {/* RAM Slots */}
      <mesh position={[-0.2, 0, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 0.6, 0.005]} />
        <primitive object={materials.slotMaterial} />
      </mesh>
      <mesh position={[-0.1, 0, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 0.6, 0.005]} />
        <primitive object={materials.slotMaterial} />
      </mesh>
      <mesh position={[0, 0, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 0.6, 0.005]} />
        <primitive object={materials.slotMaterial} />
      </mesh>
      <mesh position={[0.1, 0, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 0.6, 0.005]} />
        <primitive object={materials.slotMaterial} />
      </mesh>
      
      {/* PCIe Slot */}
      <mesh position={[0.35, -0.1, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.03, 0.8, 0.005]} />
        <primitive object={materials.slotMaterial} />
      </mesh>
      
      {/* VRM Heatsink */}
      <mesh position={[0.3, 0.4, 0.03]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.3, 0.04]} />
        <primitive object={materials.vrmMaterial} />
      </mesh>
      
      {/* Chipset Heatsink */}
      <mesh position={[0.2, -0.3, 0.03]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.2, 0.03]} />
        <primitive object={materials.vrmMaterial} />
      </mesh>
      
      {/* 24-pin Power Connector */}
      <mesh position={[-0.4, -0.4, 0.02]} castShadow>
        <boxGeometry args={[0.08, 0.15, 0.02]} />
        <primitive object={materials.connectorMaterial} />
      </mesh>
      
      {/* 8-pin CPU Power */}
      <mesh position={[0.4, 0.45, 0.02]} castShadow>
        <boxGeometry args={[0.06, 0.08, 0.02]} />
        <primitive object={materials.connectorMaterial} />
      </mesh>
      
      {/* M.2 Slots */}
      <mesh position={[-0.1, -0.45, 0.015]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.04, 0.003]} />
        <primitive object={materials.slotMaterial} />
      </mesh>
      <mesh position={[0.15, -0.45, 0.015]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.04, 0.003]} />
        <primitive object={materials.slotMaterial} />
      </mesh>
      
      {/* Circuit Traces (glowing lines) */}
      <mesh position={[0, 0, 0.011]} castShadow>
        <planeGeometry args={[0.9, 1.1]} />
        <primitive object={materials.traceMaterial} transparent opacity={0.3 + explosionProgress * 0.3} />
      </mesh>
    </group>
  );
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
