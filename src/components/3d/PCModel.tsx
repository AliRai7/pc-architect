'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3, MathUtils } from 'three';
import { usePCStore } from '@/store/usePCStore';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { pcComponentsData } from '@/lib/data';
import { GPUComponent } from './components/GPU';
import { CPUComponent } from './components/CPU';
import { RAMComponent } from './components/RAM';
import { CoolingComponent } from './components/Cooling';
import { MotherboardComponent } from './components/Motherboard';
import { SSDComponent } from './components/SSD';
import { PSUComponent } from './components/PSU';

export function PCModel() {
  const groupRef = useRef<Group>(null);
  const { scrollProgress } = useScrollProgress();
  const { 
    setExplosionProgress, 
    selectedComponent,
    isExploded 
  } = usePCStore();

  // Map scroll progress to explosion progress (0-1)
  const explosionProgress = useMemo(() => {
    // Start explosion at 10% scroll, complete at 60%
    const startThreshold = 0.1;
    const endThreshold = 0.6;
    
    if (scrollProgress < startThreshold) return 0;
    if (scrollProgress > endThreshold) return 1;
    
    return (scrollProgress - startThreshold) / (endThreshold - startThreshold);
  }, [scrollProgress]);

  useEffect(() => {
    setExplosionProgress(explosionProgress);
  }, [explosionProgress, setExplosionProgress]);

  // Idle rotation
  useFrame((state) => {
    if (groupRef.current && !isExploded) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  // Dimming factor when a component is selected
  const dimFactor = selectedComponent ? 0.3 : 1;

  return (
    <group ref={groupRef}>
      {/* GPU */}
      <GPUComponent 
        data={pcComponentsData[0]} 
        explosionProgress={explosionProgress}
        dimFactor={dimFactor}
        isSelected={selectedComponent === 'gpu'}
      />
      
      {/* CPU */}
      <CPUComponent 
        data={pcComponentsData[1]} 
        explosionProgress={explosionProgress}
        dimFactor={dimFactor}
        isSelected={selectedComponent === 'cpu'}
      />
      
      {/* RAM Sticks */}
      {pcComponentsData.slice(2, 6).map((ram, index) => (
        <RAMComponent
          key={ram.id}
          data={ram}
          explosionProgress={explosionProgress}
          dimFactor={dimFactor}
          isSelected={selectedComponent === ram.id}
          index={index}
        />
      ))}
      
      {/* Cooling */}
      <CoolingComponent 
        data={pcComponentsData[6]} 
        explosionProgress={explosionProgress}
        dimFactor={dimFactor}
        isSelected={selectedComponent === 'cooling'}
      />
      
      {/* Motherboard */}
      <MotherboardComponent 
        data={pcComponentsData[7]} 
        explosionProgress={explosionProgress}
        dimFactor={dimFactor}
        isSelected={selectedComponent === 'motherboard'}
      />
      
      {/* SSD */}
      <SSDComponent 
        data={pcComponentsData[8]} 
        explosionProgress={explosionProgress}
        dimFactor={dimFactor}
        isSelected={selectedComponent === 'ssd'}
      />
      
      {/* PSU */}
      <PSUComponent 
        data={pcComponentsData[9]} 
        explosionProgress={explosionProgress}
        dimFactor={dimFactor}
        isSelected={selectedComponent === 'psu'}
      />
    </group>
  );
}
