'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, BoxGeometry, MeshStandardMaterial } from 'three';
import { useComponentHover } from '@/hooks/useComponentHover';
import { usePCStore } from '@/store/usePCStore';
import { PCComponent } from '@/types';
import * as THREE from 'three';

interface GPUComponentProps {
  data: PCComponent;
  explosionProgress: number;
  dimFactor: number;
  isSelected: boolean;
}

export function GPUComponent({ data, explosionProgress, dimFactor, isSelected }: GPUComponentProps) {
  const meshRef = useRef<Mesh>(null);
  const { meshRef: hoverRef, onPointerOver, onPointerOut } = useComponentHover(data.id);
  const { selectComponent } = usePCStore();

  // Merge refs
  const setRefs = (element: Mesh | null) => {
    (meshRef as any).current = element;
    (hoverRef as any).current = element;
  };

  // Calculate position based on explosion progress
  const position = useMemo(() => {
    const basePos = data.position.clone();
    const explodePos = data.explosionDirection.clone().multiplyScalar(explosionProgress);
    
    // Add easing
    const easedProgress = easeOutCubic(explosionProgress);
    return basePos.add(data.explosionDirection.clone().multiplyScalar(easedProgress));
  }, [data.position, data.explosionDirection, explosionProgress]);

  // Materials
  const materials = useMemo(() => {
    const bodyMaterial = new MeshStandardMaterial({
      color: isSelected ? 0x3a1a7a : 0x1a1a1a,
      roughness: 0.2,
      metalness: 0.8,
      emissive: isSelected ? 0x7C3AED : 0x000000,
      emissiveIntensity: isSelected ? 0.3 : 0,
    });

    const accentMaterial = new MeshStandardMaterial({
      color: 0x7C3AED,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x7C3AED,
      emissiveIntensity: 0.5,
    });

    const connectorMaterial = new MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.3,
      metalness: 1.0,
    });

    return { bodyMaterial, accentMaterial, connectorMaterial };
  }, [isSelected]);

  // Update emissive on hover/selection
  useFrame(() => {
    if (meshRef.current) {
      const bodyMesh = meshRef.current.children[0] as Mesh;
      if (bodyMesh && bodyMesh.material) {
        const mat = bodyMesh.material as MeshStandardMaterial;
        mat.emissiveIntensity = THREE.MathUtils.lerp(
          mat.emissiveIntensity,
          isSelected ? 0.3 : 0,
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
        {/* GPU Body */}
        <boxGeometry args={[1.2, 0.4, 0.15]} />
        <primitive object={materials.bodyMaterial} />
      </mesh>
      
      {/* GPU Fans */}
      <mesh position={[0.3, 0, 0.08]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
        <primitive object={materials.accentMaterial} />
      </mesh>
      <mesh position={[-0.3, 0, 0.08]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
        <primitive object={materials.accentMaterial} />
      </mesh>
      <mesh position={[0, 0, 0.08]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
        <primitive object={materials.accentMaterial} />
      </mesh>
      
      {/* PCIe Connector */}
      <mesh position={[0, -0.25, 0]} castShadow>
        <boxGeometry args={[1.0, 0.05, 0.02]} />
        <primitive object={materials.connectorMaterial} />
      </mesh>
      
      {/* RGB Strip */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[1.1, 0.02, 0.16]} />
        <primitive object={materials.accentMaterial} />
      </mesh>
    </group>
  );
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
