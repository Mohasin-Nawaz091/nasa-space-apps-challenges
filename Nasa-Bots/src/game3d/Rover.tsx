/**
 * LUNAR FRONTIER: THE LAST 30 DAYS
 * src/game3d/Rover.tsx
 * Six-wheel lunar rover with articulated suspension, spinning radar, headlights casting real light, and sampling mission pathing.
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/store.ts';
import { eventBus } from '../store/bus.ts';

export const Rover3D: React.FC = () => {
  const rover = useGameStore((s) => s.state.rover);
  const totalTicks = useGameStore((s) => s.state.mission.totalTicks);
  const setSelectedEntity = useGameStore((s) => s.setSelectedEntity);
  const roverRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  const radarRef = useRef<THREE.Mesh>(null);

  // Home location: Rover Bay at (0, -16)
  // Sample Site: marked crater point at (26, -28)
  const homePos = new THREE.Vector3(0, 0.4, -16);
  const samplePos = new THREE.Vector3(26, 0.4, -28);

  useFrame((state) => {
    if (!roverRef.current) return;

    if (rover.isAway && rover.returnTick !== undefined) {
      // 6 ticks total duration
      const ticksLeft = Math.max(0, rover.returnTick - totalTicks);
      const progress = 1 - ticksLeft / 6; // 0 to 1

      let currentPos: THREE.Vector3;
      if (progress < 0.5) {
        currentPos = homePos.clone().lerp(samplePos, progress * 2);
        roverRef.current.lookAt(samplePos);
      } else {
        currentPos = samplePos.clone().lerp(homePos, (progress - 0.5) * 2);
        roverRef.current.lookAt(homePos);
      }

      // Suspension bobbing along lunar regolith
      const bob = Math.sin(state.clock.getElapsedTime() * 10) * 0.05;
      currentPos.y += Math.abs(bob);
      roverRef.current.position.copy(currentPos);

      // Rotate wheels
      const wheelSpin = state.clock.getElapsedTime() * 12;
      for (const w of wheelsRef.current) {
        if (w) w.rotation.x = wheelSpin;
      }
    } else {
      roverRef.current.position.copy(homePos);
      roverRef.current.rotation.set(0, 0, 0);
    }

    // Spin radar dish
    if (radarRef.current) {
      radarRef.current.rotation.y = state.clock.getElapsedTime() * 1.8;
    }
  });

  return (
    <group
      ref={roverRef}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedEntity({ type: 'building', id: 'rover_bay' });
        eventBus.emit('sound:play', { name: 'click' });
      }}
    >
      {/* Front Dual LED Headlights casting light onto terrain */}
      <group position={[0, 0.45, -1.2]}>
        <mesh position={[-0.45, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.45, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Forward illumination spot */}
        <spotLight
          position={[0, 0.2, 0]}
          target-position={[0, -0.5, -6]}
          angle={0.65}
          penumbra={0.5}
          intensity={1.2}
          distance={16}
          color="#ffffff"
        />
      </group>

      {/* Rotating High-Gain Comms Antenna */}
      <mesh ref={radarRef} position={[-0.4, 1.5, 0.2]}>
        <coneGeometry args={[0.26, 0.14, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Main Structural Chassis */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.65, 0.6, 2.4]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.35} />
      </mesh>

      {/* Solar Panel Charging Roof */}
      <mesh position={[0, 0.82, 0]} rotation={[-0.05, 0, 0]} castShadow>
        <boxGeometry args={[1.4, 0.04, 1.2]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Science Mast & Stereoscopic Camera Turret */}
      <group position={[0.4, 1.2, -0.6]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.0, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Polar Sample Containment Pod */}
      <mesh position={[0, 0.88, 0.65]} castShadow>
        <boxGeometry args={[1.15, 0.45, 0.8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.25} />
      </mesh>

      {/* Six Articulated Wire-Mesh Lunar Wheels */}
      {[-0.92, 0.92].map((xSide, i) =>
        [-0.8, 0, 0.8].map((zPos, j) => (
          <group key={`${i}-${j}`} position={[xSide, 0.3, zPos]}>
            {/* Wheel Rim & Tire */}
            <mesh
              ref={(el) => {
                if (el) wheelsRef.current[i * 3 + j] = el;
              }}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
            >
              <cylinderGeometry args={[0.32, 0.32, 0.22, 24]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.5} />
            </mesh>
            {/* Gold Hubcap Nut */}
            <mesh position={[xSide > 0 ? 0.12 : -0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
};
