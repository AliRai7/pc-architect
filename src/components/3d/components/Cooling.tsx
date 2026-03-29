'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial, Group } from 'three';
import { useComponentHover } from '@/hooks/useComponentHover';
import { usePCStore } from '@/store/usePCStore';
import { PCComponent } from '@/types';
import * as THREE from 'three';

interface CoolingComponentProps {
  data: PCComponent;
  explosionProgress: number;
  dimFactor: number;
  isSelected: boolean;
}

export function CoolingComponent({ data, explosionProgress, dimFactor, isSelected }: CoolingComponentProps) {
  const groupRef = useRef<Group>(null);
  const fan1Ref = useRef<Mesh>(null);
  const fan2Ref = useRef<Mesh>(null);
  const fan3Ref = useRef<Mesh>(null);
  const { meshRef: hoverRef, onPointerOver, onPointerOut } = useComponentHover(data.id);
  const { selectComponent } = usePCStore();

  const setRefs = (element: Group | null) => {
    (groupRef as any).current = element;
    (hoverRef as any).current = element;
  };

  const position = useMemo(() => {
    const basePos = data.position.clone();
    const easedProgress = easeOutCubic(explosionProgress);
    return basePos.add(data.explosionDirection.clone().multiplyScalar(easedProgress));
  }, [data.position, data.explosionDirection, explosionProgress]);

  const rotation = useMemo(() => {
    if (data.explosionRotation && explosionProgress > 0) {
      return data.explosionRotation.clone().multiplyScalar(explosionProgress);
    }
    return undefined;
  }, [data.explosionRotation, explosionProgress]);

  const materials = useMemo(() => {
    const radiatorMaterial = new MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.3,
      metalness: 0.8,
    });

    const fanFrameMaterial = new MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.5,
      metalness: 0.3,
    });

    const fanBladeMaterial = new MeshStandardMaterial({
      color: isSelected ? 0x3a1a7a : 0x2a2a2a,
      roughness: 0.2,
      metalness: 0.7,
      emissive: isSelected ? 0x7C3AED : 0x000000,
      emissiveIntensity: isSelected ? 0.2 : 0,
    });

    const rgbMaterial = new MeshStandardMaterial({
      color: 0x7C3AED,
      roughness: 0.1,
      metalness: 0.5,
      emissive: 0x7C3AED,
      emissiveIntensity: 0.5,
    });

    return { radiatorMaterial, fanFrameMaterial, fanBladeMaterial, rgbMaterial };
  }, [isSelected]);

  // Rotate fans
  useFrame((state) => {
    const rotationSpeed = 10 * (1 + explosionProgress * 2);
    
    if (fan1Ref.current) {
      fan1Ref.current.rotation.z -= rotationSpeed * 0.016;
    }
    if (fan2Ref.current) {
      fan2Ref.current.rotation.z -= rotationSpeed * 0.016;
    }
    if (fan3Ref.current) {
      fan3Ref.current.rotation.z -= rotationSpeed * 0.016;
    }
  });

  const handleClick = (event: any) => {
    event.stopPropagation();
    selectComponent(data.id);
  };

  return (
    <group 
      ref={setRefs}
      position={position}
      rotation={rotation}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={handleClick}
    >
      {/* Radiator */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.15, 0.3]} />
        <primitive object={materials.radiatorMaterial} />
      </mesh>
      
      {/* Fan 1 */}
      <group position={[-0.4, 0.1, 0]}>
        {/* Fan Frame */}
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 32]} />
          <primitive object={materials.fanFrameMaterial} />
        </mesh>
        {/* Fan Blades */}
        <mesh ref={fan1Ref} position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.05, 0.01, 7]} />
          <primitive object={materials.fanBladeMaterial} />
        </mesh>
        {/* RGB Ring */}
        <mesh position={[0, 0.03, 0]} castShadow>
          <torusGeometry args={[0.17, 0.005, 8, 32]} />
          <primitive object={materials.rgbMaterial} />
        </mesh>
      </group>
      
      {/* Fan 2 */}
      <group position={[0, 0.1, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 32]} />
          <primitive object={materials.fanFrameMaterial} />
        </mesh>
        <mesh ref={fan2Ref} position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.05, 0.01, 7]} />
          <primitive object={materials.fanBladeMaterial} />
        </mesh>
        <mesh position={[0, 0.03, 0]} castShadow>
          <torusGeometry args={[0.17, 0.005, 8, 32]} />
          <primitive object={materials.rgbMaterial} />
        </mesh>
      </group>
      
      {/* Fan 3 */}
      <group position={[0.4, 0.1, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 32]} />
          <primitive object={materials.fanFrameMaterial} />
        </mesh>
        <mesh ref={fan3Ref} position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.05, 0.01, 7]} />
          <primitive object={materials.fanBladeMaterial} />
        </mesh>
        <mesh position={[0, 0.03, 0]} castShadow>
          <torusGeometry args={[0.17, 0.005, 8, 32]} />
          <primitive object={materials.rgbMaterial} />
        </mesh>
      </group>
      
      {/* Pump Block */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
        <primitive object={materials.fanFrameMaterial} />
      </mesh>
      
      {/* Pump RGB */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.005, 32]} />
        <primitive object={materials.rgbMaterial} />
      </mesh>
      
      {/* Tubes (simplified) */}
      <mesh position={[-0.2, -0.1, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
        <meshStandardMaterial color={0x1a1a1a} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0.2, -0.1, 0]} rotation={[0, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
        <meshStandardMaterial color={0x1a1a1a} roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  );
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
