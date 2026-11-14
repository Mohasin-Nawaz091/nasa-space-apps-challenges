"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { AssetModel, ASSET_PATHS } from "../game/AssetModel";

export function ColonyInfrastructure() {
  const commsDishRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.PointLight>(null);

  // Subtle comms dish alignment tracking Earth
  useFrame((state) => {
    if (commsDishRef.current) {
      commsDishRef.current.rotation.y =
        Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
    if (beaconRef.current) {
      beaconRef.current.intensity =
        0.5 + Math.sin(state.clock.elapsedTime * 2.5) * 0.4;
    }
  });

  return (
    <group>
      {/* 1. ARTEMIS CARGO LANDER (Resting on Landing Pad at [18, 0.25, 16]) */}
      <group position={[18, 0.35, 16]}>
        {/* Descent Stage (Gold thermal foil multi-faceted base) */}
        <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.8, 3.4, 2.2, 8]} />
          <meshStandardMaterial
            color="#d4af37" // Kapton Gold Foil
            metalness={0.88}
            roughness={0.25}
          />
        </mesh>

        {/* Ascent Stage / Crew Capsule Upper Section */}
        <mesh position={[0, 3.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 2.6, 2.0, 12]} />
          <meshStandardMaterial
            color="#eeeeee"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Nose Cone / Docking Port */}
        <mesh position={[0, 4.8, 0]} castShadow>
          <coneGeometry args={[1.6, 1.2, 12]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* 4 Multi-Joint Landing Legs with footpads */}
        {[0, 1, 2, 3].map((idx) => {
          const angle = (idx * Math.PI) / 2 + Math.PI / 4;
          const legX = Math.cos(angle) * 3.8;
          const legZ = Math.sin(angle) * 3.8;
          return (
            <group key={idx}>
              <mesh
                position={[legX * 0.5, 0.9, legZ * 0.5]}
                rotation={[0, -angle, Math.PI / 4]}
                castShadow
              >
                <cylinderGeometry args={[0.08, 0.1, 2.6, 8]} />
                <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh position={[legX, 0.05, legZ]} receiveShadow>
                <cylinderGeometry args={[0.6, 0.65, 0.1, 16]} />
                <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 2. LUNAR ROVER ASSET (lunar_rover.glb) Parked at [10, 0, 8] */}
      <group position={[10, 0, 8]} rotation={[0, -Math.PI / 3, 0]}>
        <AssetModel
          url={ASSET_PATHS.ROVER}
          scale={1.15}
          castShadow
          receiveShadow
        />
        {/* Rover Headlights beam */}
        <spotLight
          position={[0, 1.2, 1.6]}
          target-position={[0, 0, 8]}
          color="#fffbe8"
          intensity={1.2}
          angle={0.6}
          penumbra={0.4}
          distance={15}
        />
      </group>

      {/* 3. COMMUNICATION ANTENNA ASSET (communication_antenna.glb) at [-4, 0, -14] */}
      <group position={[-4, 0, -14]} ref={commsDishRef}>
        <AssetModel
          url={ASSET_PATHS.ANTENNA}
          scale={1.3}
          castShadow
          receiveShadow
        />
        {/* Flashing Red Aviation Beacon on Antenna Mast */}
        <pointLight ref={beaconRef} position={[0, 4.2, 0]} color="#ef4444" distance={20} />
      </group>

      {/* 4. AUXILIARY OUTPOST STORAGE (oxygen_tank_rack.glb) near Logistics bay */}
      <AssetModel
        url={ASSET_PATHS.OXYGEN_RACK}
        position={[2.5, 0, 11]}
        rotation={[0, 0.4, 0]}
        scale={1.2}
        castShadow
        receiveShadow
      />

      {/* 5. SECONDARY PERIMETER SOLAR ARRAY (solar_array.glb) */}
      <AssetModel
        url={ASSET_PATHS.SOLAR_ARRAY}
        position={[-15, 0, -8]}
        rotation={[0, Math.PI / 6, 0]}
        scale={1.1}
        castShadow
        receiveShadow
      />

      {/* 6. GLOWING POWER CONDUITS & REGOLITH PATHWAYS */}
      {/* Path between Solar Array [-12, 0, 6] and Habitat [0, 0, 0] */}
      <mesh position={[-6, 0.05, 3]} rotation={[-Math.PI / 2, 0, -0.45]}>
        <planeGeometry args={[0.4, 14]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.6} />
      </mesh>

      {/* Path between Habitat [0, 0, 0] and Life Support [-8, 0, -4] */}
      <mesh position={[-4, 0.05, -2]} rotation={[-Math.PI / 2, 0, 0.45]}>
        <planeGeometry args={[0.3, 10]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
      </mesh>

      {/* Path between Habitat [0, 0, 0] and Greenhouse [7, 0, -5] */}
      <mesh position={[3.5, 0.05, -2.5]} rotation={[-Math.PI / 2, 0, -0.6]}>
        <planeGeometry args={[0.3, 9]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.5} />
      </mesh>

      {/* Path between Habitat [0, 0, 0] and Shelter [6, 0, 7] */}
      <mesh position={[3, 0.05, 3.5]} rotation={[-Math.PI / 2, 0, 0.85]}>
        <planeGeometry args={[0.3, 10]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
