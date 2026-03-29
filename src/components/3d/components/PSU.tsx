'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial } from 'three';
import { useComponentHover } from '@/hooks/useComponentHover';
import { usePCStore } from '@/store/usePCStore';
import { PCComponent } from '@/types';
import * as THREE from 'three';

interface PSUComponentProps {
  data: PCComponent;
  explosionProgress: number;
  dimFactor: number;
  isSelected: boolean;
}

export function PSUComponent({ data, explosionProgress, dimFactor, isSelected }: PSUComponentProps) {
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
    const chassisMaterial = new MeshStandardMaterial({
      color: isSelected ? 0x3a2a1a : 0x1a1a1a,
      roughness: 0.3,
      metalness: 0.8,
      emissive: isSelected ? 0x7C3AED : 0x000000,
      emissiveIntensity: isSelected ? 0.2 : 0,
    });

    const fanGrillMaterial = new MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.5,
      metalness: 0.5,
    });

    const labelMaterial = new MeshStandardMaterial({
      color: 0xc0c0c0,
      roughness: 0.4,
      metalness: 0.6,
    });

    const portMaterial = new MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.2,
      metalness: 0.3,
    });

    const goldMaterial = new MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.2,
      metalness: 1.0,
    });

    return { chassisMaterial, fanGrillMaterial, labelMaterial, portMaterial, goldMaterial };
  }, [isSelected]);

  useFrame(() => {
    if (meshRef.current) {
      const mat = meshRef.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        isSelected ? 0.2 : 0,
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
        {/* PSU Chassis */}
        <boxGeometry args={[0.5, 0.3, 0.15]} />
        <primitive object={materials.chassisMaterial} />
      </mesh>
      
      {/* Fan Grill */}
      <mesh position={[0, 0, 0.08]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.01, 32]} />
        <primitive object={materials.fanGrillMaterial} />
      </mesh>
      
      {/* Fan Blades (static) */}
      <mesh position={[0, 0, 0.075]} castShadow>
        <cylinderGeometry args={[0.18, 0.05, 0.005, 7]} />
        <meshStandardMaterial color={0x2a2a2a} roughness={0.3} metalness={0.5} />
      </mesh>
      
      {/* Side Label */}
      <mesh position={[0, 0, 0.08]} castShadow>
        <planeGeometry args={[0.3, 0.15]} />
        <primitive object={materials.labelMaterial} />
      </mesh>
      
      {/* Power Switch */}
      <mesh position={[0.22, 0.05, 0]} castShadow>
        <boxGeometry args={[0.02, 0.03, 0.02]} />
        <primitive object={materials.portMaterial} />
      </mesh>
      
      {/* Power Input */}
      <mesh position={[0.22, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
        <primitive object={materials.portMaterial} />
      </mesh>
      
      {/* Modular Connectors */}
      <mesh position={[-0.22, 0.08, 0]} castShadow>
        <boxGeometry args={[0.01, 0.04, 0.06]} />
        <primitive object={materials.goldMaterial} />
      </mesh>
      <mesh position={[-0.22, 0, 0]} castShadow>
        <boxGeometry args={[0.01, 0.04, 0.06]} />
        <primitive object={materials.goldMaterial} />
      </mesh>
      <mesh position={[-0.22, -0.08, 0]} castShadow>
        <boxGeometry args={[0.01, 0.04, 0.06]} />
        <primitive object={materials.goldMaterial} />
      </mesh>
      
      {/* 80 Plus Platinum Badge */}
      <mesh position={[0.15, 0.1, 0.08]} castShadow>
        <planeGeometry args={[0.08, 0.04]} />
        <meshStandardMaterial color={0xffffff} roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
