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

export function SolarArrayFacility({ building, isSelected, onSelect }: BuildingProps) {
  const panelGimbalRef = useRef<THREE.Group>(null);

  // Animate panel orientation subtly toward the sun
  useFrame((state) => {
    if (panelGimbalRef.current && building.isActive) {
      panelGimbalRef.current.rotation.y =
        Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
    }
  });

  const isDusty = building.condition < 80;

  return (
    <group position={building.position} rotation={building.rotation}>
      {/* Invisible Interactive Hit Box with Hover Pointer */}
      <mesh
        position={[0, 2.5, 0]}
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
        <cylinderGeometry args={[4.2, 4.6, 5.5, 24]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Foundation Platform */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.6, 0.3, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Power Station Base: power_station_solar.glb */}
      <AssetModel
        url={ASSET_PATHS.POWER_STATION}
        position={[0, 0.3, -1.2]}
        scale={1.0}
        castShadow
        receiveShadow
      />

      {/* Standalone Sun-Tracking Solar Array: solar_array.glb */}
      <group ref={panelGimbalRef} position={[0, 0.3, 1.4]}>
        <AssetModel
          url={ASSET_PATHS.SOLAR_ARRAY}
          scale={1.25}
          castShadow
          receiveShadow
        />
      </group>

      {/* Status Inverter Light */}
      <mesh position={[0, 1.8, -1.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color={isDusty ? "#f59e0b" : "#10b981"} />
      </mesh>
    </group>
  );
}
