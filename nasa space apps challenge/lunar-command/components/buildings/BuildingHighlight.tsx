"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

interface BuildingHighlightProps {
  position: [number, number, number];
  radius?: number;
  name: string;
}

export function BuildingHighlight({ position, radius = 4.0, name }: BuildingHighlightProps) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.8;
    }
  });

  return (
    <group position={[position[0], 0.15, position[2]]}>
      {/* Outer Rotating Selection Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.9, radius * 1.05, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating Holographic Nameplate */}
      <group position={[0, radius + 2.5, 0]}>
        <Text
          fontSize={0.8}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.06}
          outlineColor="#09182a"
        >
          {name.toUpperCase()}
        </Text>
      </group>
    </group>
  );
}
