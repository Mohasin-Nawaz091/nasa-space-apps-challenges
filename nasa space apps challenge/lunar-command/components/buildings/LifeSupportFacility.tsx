"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { BuildingState } from "../../types/building";
import { AssetModel, ASSET_PATHS } from "../game/AssetModel";

interface BuildingProps {
  building: BuildingState;
  isSelected: boolean;
  onSelect: () => void;
}

export function LifeSupportFacility({ building, isSelected, onSelect }: BuildingProps) {
  const fanRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (fanRef.current && building.isActive) {
      fanRef.current.rotation.z += delta * 4 * (building.operationalIntensity || 1.0);
    }
  });

  const isWarning = building.condition < 80;

  return (
    <group position={building.position} rotation={building.rotation}>
      {/* Invisible Interactive Hit Box with Hover Pointer */}
      <mesh
        position={[0, 2.2, 0]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[7.2, 4.8, 6.2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Foundation Platform */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[6.8, 0.3, 5.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.85} />
      </mesh>

      {/* Primary 3D Asset Model: life_support_station.glb */}
      <AssetModel
        url={ASSET_PATHS.LIFE_SUPPORT}
        position={[-0.8, 0.3, 0]}
        scale={1.1}
        castShadow
        receiveShadow
      />

      {/* Auxiliary Cryogenic Oxygen Tank Rack Asset: oxygen_tank_rack.glb */}
      <AssetModel
        url={ASSET_PATHS.OXYGEN_RACK}
        position={[2.0, 0.3, 0]}
        rotation={[0, Math.PI / 2, 0]}
        scale={1.2}
        castShadow
        receiveShadow
      />

      {/* Scrubber Vent with Rotating Fan */}
      <group position={[-2.8, 1.8, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <ringGeometry args={[0.6, 0.85, 24]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <group ref={fanRef}>
          {[0, 1, 2, 3].map((bIdx) => (
            <mesh key={bIdx} rotation={[0, 0, (bIdx * Math.PI) / 2]}>
              <planeGeometry args={[0.18, 1.0]} />
              <meshStandardMaterial color="#64748b" side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Status LED Beacon */}
      <group position={[-0.8, 3.2, 1.8]}>
        <mesh>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshBasicMaterial
            color={
              !building.isActive
                ? "#64748b"
                : isWarning
                ? "#ef4444"
                : "#10b981"
            }
          />
        </mesh>
        <pointLight
          color={isWarning ? "#ef4444" : "#10b981"}
          intensity={building.isActive ? 0.6 : 0.05}
          distance={4}
        />
      </group>
    </group>
  );
}
