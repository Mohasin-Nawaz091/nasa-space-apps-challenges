"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../../store/gameStore";
import { AssetModel, ASSET_PATHS } from "../../game/AssetModel";

export function GreenhouseInterior() {
  const greenhouse = useGameStore((s) => s.buildings.greenhouse);
  const isOff = !greenhouse.isActive || greenhouse.operationalSetting === "eco";
  const isIntensive = greenhouse.operationalSetting === "intensive";

  // Grow light tone: warm magenta/violet for intensive, balanced rose for normal, soft white for eco
  const lightColor = isOff ? "#cbd5e1" : isIntensive ? "#ec4899" : "#a855f7";
  const lightIntensity = isOff ? 0.8 : isIntensive ? 2.8 : 2.0;

  const mistRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (mistRef.current) {
      const pos = mistRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) - delta * 0.4;
        if (y < 0.2) y = 2.4;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Warm, Inviting Interior Lighting — No Pitch Black Voids! */}
      <ambientLight intensity={1.1} color="#f8fafc" />
      <directionalLight
        position={[6, 9, 4]}
        intensity={1.4}
        color="#fffbeb"
        castShadow
      />
      <pointLight
        position={[0, 4.4, 0]}
        color={lightColor}
        intensity={lightIntensity}
        distance={14}
      />
      <pointLight position={[-4, 2, -2]} color="#38bdf8" intensity={0.8} distance={6} />
      <pointLight position={[4, 2, 2]} color="#10b981" intensity={0.8} distance={6} />

      {/* 2. Geodesic Glass Dome Framework with View of Lunar Sky */}
      {/* Cleanroom Floor Tiles */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[7.2, 7.2, 0.1, 32]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Outer Curved Glass Wall with Translucent Sky Window */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[6.8, 7.2, 6.2, 24, 1, true]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.1}
          metalness={0.1}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* White Dome Rib Arches */}
      {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((rot, i) => (
        <group key={i} rotation={[0, rot, 0]}>
          <mesh position={[0, 3.5, 0]}>
            <torusGeometry args={[6.6, 0.14, 12, 24, Math.PI]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* 3. Central Overhead LED Grow Light Chandelier */}
      <mesh position={[0, 5.0, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.25, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.4} />
      </mesh>
      <mesh position={[0, 4.85, 0]}>
        <cylinderGeometry args={[1.6, 1.6, 0.08, 16]} />
        <meshBasicMaterial color={lightColor} />
      </mesh>

      {/* 4. Lush Hydroponic Crop Trays & Plant Rows */}
      {[-2.8, 2.8].map((x) =>
        [-2.5, 0, 2.5].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0.1, z]}>
            {/* Hydroponic Tray Container */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.8, 0.7, 2.0]} />
              <meshStandardMaterial color="#334155" roughness={0.4} />
            </mesh>
            {/* Rich Bio-Soil / Rockwool */}
            <mesh position={[0, 0.82, 0]}>
              <boxGeometry args={[1.65, 0.05, 1.85]} />
              <meshStandardMaterial color="#451a03" roughness={0.9} />
            </mesh>

            {/* Lush Green Crop Stems & Leaves */}
            {[-0.5, 0, 0.5].map((dx) =>
              [-0.6, 0, 0.6].map((dz) => (
                <group key={`${dx}-${dz}`} position={[dx, 0.85, dz]}>
                  {/* Stem */}
                  <mesh position={[0, 0.25, 0]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
                    <meshStandardMaterial color="#15803d" />
                  </mesh>
                  {/* Leaf Canopy */}
                  <mesh position={[0, 0.5, 0]}>
                    <sphereGeometry args={[0.26, 8, 8]} />
                    <meshStandardMaterial
                      color="#22c55e"
                      roughness={0.6}
                      emissive="#16a34a"
                      emissiveIntensity={0.2}
                    />
                  </mesh>
                  {/* Ripe Strawberries / Tomatoes */}
                  <mesh position={[0.1, 0.35, 0.1]}>
                    <sphereGeometry args={[0.08, 6, 6]} />
                    <meshStandardMaterial color="#ef4444" roughness={0.3} />
                  </mesh>
                </group>
              ))
            )}

            {/* Blue Water / Nutrient Irrigation Pipe */}
            <mesh position={[0, 0.1, 1.1]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 1.8, 12]} />
              <meshStandardMaterial color="#0284c7" metalness={0.4} />
            </mesh>
          </group>
        ))
      )}

      {/* 5. Aeroponic Vertical Towers Along the Back Wall */}
      {[-1.2, 0, 1.2].map((x) => (
        <group key={x} position={[x, 0.1, -4.5]}>
          {/* White PVC Column */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 3.4, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          {/* Base Reservoir */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.65, 0.7, 0.4, 16]} />
            <meshStandardMaterial color="#0f766e" />
          </mesh>
          {/* Tower Plant Pods */}
          {[0.8, 1.4, 2.0, 2.6, 3.1].map((y, idx) => (
            <mesh key={idx} position={[0, y, 0.2]}>
              <sphereGeometry args={[0.34, 8, 8]} />
              <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.25} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 6. Transparent Water & Algae Nutrient Tanks (Left Wall) */}
      <group position={[-5.2, 0.1, -1.5]}>
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 2.6, 16]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            transmission={0.85}
            roughness={0.1}
            transparent
            opacity={0.6}
          />
        </mesh>
        <pointLight position={[0, 1.4, 0]} color="#06b6d4" intensity={0.9} distance={3} />
        {/* Metal Base and Cap */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.8, 0.85, 0.3, 16]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 2.75, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.2, 16]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>

      {/* 7. Botanist Working Terminal Console (Right Wall) */}
      <group position={[4.6, 0.1, -1.5]}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.8, 1.1, 1.0]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Glow Screen with Crop Health Status */}
        <mesh position={[-0.1, 1.25, 0]} rotation={[0, -Math.PI / 4, 0]}>
          <boxGeometry args={[1.2, 0.7, 0.08]} />
          <meshStandardMaterial color="#10b981" emissive="#047857" emissiveIntensity={0.9} />
        </mesh>
        <pointLight position={[-0.2, 1.3, 0]} color="#10b981" intensity={0.6} distance={2.5} />
      </group>

      {/* 8. Clearly Visible Astronaut inside tending crops! */}
      <group position={[0.2, 0.1, 0.6]} rotation={[0, Math.PI / 6, 0]}>
        <AssetModel
          url={ASSET_PATHS.ASTRONAUT}
          scale={0.9}
          castShadow
          receiveShadow
        />
        {/* Soft spotlight highlighting the astronaut */}
        <pointLight position={[0, 2.2, 0.5]} color="#ffffff" intensity={0.8} distance={3} />
      </group>
    </group>
  );
}
