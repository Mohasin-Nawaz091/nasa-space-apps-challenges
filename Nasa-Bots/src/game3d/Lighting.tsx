/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/game3d/Lighting.tsx
 * Physically based lunar environmental lighting: realistic directional solar light,
 * balanced earthfill & regolith scatter, contact shadows, and base operational illuminators.
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/store.ts';

export const Lighting: React.FC = () => {
  const sunlightFactor = useGameStore((s) => s.state.powerBreakdown.sunlightFactor);
  const radiationAdvisory = useGameStore((s) => s.state.radiationAdvisory);
  const quality = useGameStore((s) => s.qualitySetting);

  const sunRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);

  useFrame((stateFrame) => {
    if (!sunRef.current) return;

    // Normal solar light intensity follows site sunlight factor
    let baseIntensity = 2.4 * Math.max(0.4, sunlightFactor);
    let sunColor = new THREE.Color('#fff9ed');

    // Space-weather visuals: amber proton flux warming
    if (radiationAdvisory && !radiationAdvisory.resolved) {
      const pulse = Math.sin(stateFrame.clock.getElapsedTime() * 2) * 0.15;
      baseIntensity = (2.2 + pulse) * Math.max(0.4, sunlightFactor);
      sunColor = new THREE.Color('#ffb042');
    }

    sunRef.current.intensity = baseIntensity;
    sunRef.current.color = sunColor;
  });

  const enableShadows = quality !== 'low';
  const shadowMapSize = quality === 'high' ? 2048 : 1024;

  return (
    <>
      {/* 1. Balanced Space Ambient Illumination (Eliminates pitch-black unlit voids) */}
      <ambientLight
        ref={ambientRef}
        intensity={radiationAdvisory && !radiationAdvisory.resolved ? 0.65 : 0.6}
        color={radiationAdvisory && !radiationAdvisory.resolved ? '#ffb366' : '#889eb8'}
      />

      {/* 2. Primary Solar Directional Light (Crisp South Pole Sun) */}
      <directionalLight
        ref={sunRef}
        position={[-30, 24, -28]}
        intensity={2.4}
        castShadow={enableShadows}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-bias={-0.00015}
        shadow-camera-near={8}
        shadow-camera-far={120}
        shadow-camera-left={-38}
        shadow-camera-right={38}
        shadow-camera-top={38}
        shadow-camera-bottom={-38}
      />

      {/* 3. Earthfill Light (Soft blue fill from distant Earth in sky) */}
      <directionalLight position={[28, 38, -50]} intensity={0.4} color="#689eed" />

      {/* 4. Regolith Ground Bounce Scatter (Soft upward fill from lunar dust albedo) */}
      <directionalLight position={[0, -20, 0]} intensity={0.25} color="#525d6e" />

      {/* 5. Colony Operational Perimeter Lights */}
      {/* Habitat Entrance Airlock Lamp */}
      <pointLight position={[0, 2.4, 4.2]} intensity={1.5} distance={10} color="#38bdf8" />

      {/* Landing Zone Beacon */}
      <pointLight position={[0, 1.2, -16]} intensity={1.2} distance={12} color="#f59e0b" />

      {/* Research Lab Guidance Light */}
      <pointLight position={[14, 2.2, 8]} intensity={1.0} distance={8} color="#38bdf8" />
    </>
  );
};
