"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../store/gameStore";

export function DestinationMarker() {
  const destinationMarker = useGameStore((s) => s.destinationMarker);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.5;
    }
    if (innerRingRef.current) {
      const scale = 0.5 + Math.sin(t * 5.0) * 0.3;
      innerRingRef.current.scale.set(scale, scale, scale);
    }
    if (beaconRef.current) {
      const opacity = 0.4 + Math.sin(t * 4.0) * 0.2;
      (beaconRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  if (!destinationMarker) return null;

  const [x, y, z] = destinationMarker.position;

  return (
    <group position={[x, y + 0.05, z]}>
      {/* Outer Rotating Segmented Reticle */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.9, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner Pulsing Radar Ring */}
      <mesh ref={innerRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.45, 24]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Vertical Holographic Guidance Beacon */}
      <mesh ref={beaconRef} position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.04, 0.08, 2.4, 8]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>

      {/* Ground Glow Light */}
      <pointLight color="#38bdf8" intensity={0.8} distance={3} />
    </group>
  );
}
