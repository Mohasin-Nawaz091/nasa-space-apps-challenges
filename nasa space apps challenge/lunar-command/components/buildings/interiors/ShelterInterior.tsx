"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../../store/gameStore";
import { AssetModel, ASSET_PATHS } from "../../game/AssetModel";

export function ShelterInterior() {
  const shelter = useGameStore((s) => s.buildings.shelter);
  const isLockdown = shelter.operationalSetting === "lockdown";
  const strobeRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (strobeRef.current && isLockdown) {
      strobeRef.current.intensity =
        1.8 + Math.sin(state.clock.elapsedTime * 6) * 1.0;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Warm, Safe Interior Lighting — Never Pitch Black! */}
      <ambientLight intensity={1.2} color={isLockdown ? "#fee2e2" : "#fef3c7"} />
      <directionalLight position={[0, 6, 2]} intensity={1.2} color="#ffffff" />
      <pointLight
        ref={strobeRef}
        position={[0, 3.8, 0]}
        color={isLockdown ? "#ef4444" : "#f59e0b"}
        intensity={isLockdown ? 2.2 : 1.6}
        distance={12}
      />
      <pointLight position={[-4, 2, 0]} color="#38bdf8" intensity={0.7} distance={6} />
      <pointLight position={[4, 2, 0]} color="#10b981" intensity={0.7} distance={6} />

      {/* 2. Reinforced Sintered Regolith Bunker Vault */}
      {/* Heavy Plated Flooring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[13.8, 13.8]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Clean White & Slate Bunker Vault Walls (Sintered Basalt Structure) */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[14, 5, 14]} />
        <meshStandardMaterial color="#475569" side={THREE.BackSide} roughness={0.7} />
      </mesh>

      {/* Structural Reinforced Yellow/Black Hazard Trim Arches */}
      {[-3.5, 3.5].map((z, idx) => (
        <group key={idx} position={[0, 2.5, z]}>
          <mesh>
            <boxGeometry args={[13.9, 0.25, 0.4]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* 3. Massive Blast Door with Heavy Hydraulic Locking Bolts (Back Wall) */}
      <group position={[0, 2.2, -6.8]}>
        {/* Outer Heavy Frame */}
        <mesh>
          <boxGeometry args={[4.2, 4.0, 0.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        {/* Inner Steel Door */}
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[3.4, 3.4, 0.2]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Yellow Hazard Stripes on Door */}
        {[-1.2, 0, 1.2].map((y, i) => (
          <mesh key={i} position={[0, y, 0.22]}>
            <boxGeometry args={[3.2, 0.15, 0.02]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        ))}
        {/* Heavy Locking Wheel */}
        <mesh position={[0, 0, 0.26]}>
          <torusGeometry args={[0.5, 0.08, 8, 24]} />
          <meshStandardMaterial color="#dc2626" metalness={0.6} />
        </mesh>
      </group>

      {/* 4. Three Astronaut Sleeping Bunks (Left Wall) */}
      {[-2.5, 0, 2.5].map((z, i) => (
        <group key={i} position={[-5.2, 0.1, z]}>
          {/* Lower Bunk Bed Frame */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[2.2, 0.35, 1.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Clean Blue Mattress & Quilt */}
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[2.0, 0.2, 1.6]} />
            <meshStandardMaterial color="#0284c7" roughness={0.6} />
          </mesh>
          {/* White Pillow */}
          <mesh position={[-0.7, 0.8, 0]}>
            <boxGeometry args={[0.5, 0.15, 0.9]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          {/* Upper Bunk */}
          <mesh position={[0, 1.8, 0]}>
            <boxGeometry args={[2.2, 0.2, 1.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 2.0, 0]}>
            <boxGeometry args={[2.0, 0.2, 1.6]} />
            <meshStandardMaterial color="#0284c7" roughness={0.6} />
          </mesh>
          <mesh position={[-0.7, 2.15, 0]}>
            <boxGeometry args={[0.5, 0.15, 0.9]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>
      ))}

      {/* 5. Radiation Monitoring & Communications Terminal Console (Right Wall) */}
      <group position={[5.2, 0.1, 0]}>
        {/* Terminal Desk */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[2.2, 1.2, 4.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.4} />
        </mesh>
        {/* Multi-screen Glowing Displays */}
        {[-1.3, 0, 1.3].map((z, idx) => (
          <group key={idx} position={[-0.2, 1.5, z]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh>
              <boxGeometry args={[1.1, 0.7, 0.08]} />
              <meshStandardMaterial
                color={isLockdown ? "#ef4444" : idx === 1 ? "#10b981" : "#0284c7"}
                emissive={isLockdown ? "#b91c1c" : idx === 1 ? "#047857" : "#0369a1"}
                emissiveIntensity={0.8}
              />
            </mesh>
            <pointLight
              position={[0, 0, 0.3]}
              color={isLockdown ? "#ef4444" : idx === 1 ? "#10b981" : "#0284c7"}
              intensity={0.6}
              distance={2.5}
            />
          </group>
        ))}
      </group>

      {/* 6. Emergency Supplies Stacks (Front-Left Wall) */}
      <group position={[-4.5, 0.1, 4.8]}>
        {/* Orange Food Rations Crate */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.2, 0.8, 1.0]} />
          <meshStandardMaterial color="#f97316" roughness={0.5} />
        </mesh>
        {/* Blue Water Reserve Tank */}
        <mesh position={[1.4, 0.6, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 1.2, 16]} />
          <meshStandardMaterial color="#0284c7" metalness={0.5} />
        </mesh>
        {/* Green First Aid Kit */}
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[0.7, 0.35, 0.6]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
      </group>

      {/* 7. Clearly Visible Astronauts inside the safety bunker! */}
      <group position={[0, 0.1, 0.5]} rotation={[0, -Math.PI / 4, 0]}>
        <AssetModel
          url={ASSET_PATHS.ASTRONAUT}
          scale={0.9}
          castShadow
          receiveShadow
        />
        <pointLight position={[0, 2.2, 0.5]} color="#ffffff" intensity={0.9} distance={3} />
      </group>
    </group>
  );
}
