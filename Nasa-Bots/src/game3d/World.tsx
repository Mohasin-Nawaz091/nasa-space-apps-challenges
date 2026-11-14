/**
 * LUNAR FRONTIER: THE LAST 30 DAYS
 * src/game3d/World.tsx
 * Three.js + React Three Fiber 3D world canvas, ACES filmic tone-mapping, native high DPR, and fixed-timestep accumulator loop.
 */

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Terrain } from './Terrain.tsx';
import { Lighting } from './Lighting.tsx';
import { CameraRig } from './CameraRig.tsx';
import { BuildingMesh } from './Buildings/BuildingMesh.tsx';
import { CrewRoster3D } from './Crew.tsx';
import { Rover3D } from './Rover.tsx';
import { PlayerController } from './Characters/PlayerController.tsx';
import { useGameStore } from '../store/store.ts';

// Fixed-timestep simulation accumulator component inside R3F Canvas
const SimAccumulator: React.FC = () => {
  const advanceTick = useGameStore((s) => s.advanceTick);
  const speed = useGameStore((s) => s.state.mission.speed);
  const isPaused = useGameStore((s) => s.state.mission.isPaused);

  const accumulator = useRef(0);
  const SECONDS_PER_TICK = 1.25; // 24 ticks = 30s per day at 1x speed

  useFrame((_, delta) => {
    if (isPaused || speed === 0) return;

    // Advance simulation accumulator by delta * speed
    accumulator.current += delta * speed;

    while (accumulator.current >= SECONDS_PER_TICK) {
      accumulator.current -= SECONDS_PER_TICK;
      advanceTick();
    }
  });

  return null;
};

// High-Resolution Earth in the Lunar Sky with Rotating Atmosphere
const EarthInSky: React.FC = () => {
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group position={[38, 48, -78]}>
      {/* Atmosphere Glow Halo */}
      <mesh>
        <sphereGeometry args={[4.7, 32, 32]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Earth Terrestrial Sphere (Oceans & Continents) */}
      <mesh>
        <sphereGeometry args={[4.4, 64, 48]} />
        <meshStandardMaterial
          color="#1d4ed8"
          roughness={0.5}
          metalness={0.15}
          emissive="#1e3a8a"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Cloud & Atmosphere Swirl Layer */}
      <mesh ref={cloudsRef} position={[0, 0, 0.05]}>
        <sphereGeometry args={[4.46, 64, 32]} />
        <meshStandardMaterial
          color="#f8fafc"
          transparent
          opacity={0.4}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
};

export const World: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0 bg-black">
      <Canvas
        shadows="soft"
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 24, 28], fov: 45 }}
      >
        <color attach="background" args={['#040711']} />
        <fog attach="fog" args={['#040711', 35, 120]} />

        {/* Deep space starfield */}
        <Stars radius={110} depth={55} count={4000} factor={4.5} saturation={0} fade speed={0.4} />

        {/* Electrostatic Lunar Dust Levitation (Apollo & NASA LADEE phenomena) */}
        <Sparkles
          count={75}
          scale={[50, 8, 50]}
          position={[0, 3, 0]}
          size={2.5}
          speed={0.3}
          opacity={0.3}
          color="#93c5fd"
        />

        <EarthInSky />
        <Lighting />
        <Terrain />
        <CameraRig />
        <PlayerController />
        <SimAccumulator />

        {/* 8 Outpost Buildings */}
        <BuildingMesh id="habitat" name="Habitat Base" icon="🏠" />
        <BuildingMesh id="power_station" name="Solar Power Array" icon="⚡" />
        <BuildingMesh id="greenhouse" name="Hydroponic Greenhouse" icon="🌱" />
        <BuildingMesh id="recycler" name="Water Recycler" icon="💧" />
        <BuildingMesh id="shelter" name="Radiation Shelter" icon="☢️" />
        <BuildingMesh id="laboratory" name="Research Laboratory" icon="🔬" />
        <BuildingMesh id="comms" name="Comms Dish" icon="📡" />
        <BuildingMesh id="rover_bay" name="Rover Bay" icon="🚜" />

        {/* Dynamic Crew Figures & Rover */}
        <CrewRoster3D />
        <Rover3D />
      </Canvas>
    </div>
  );
};
