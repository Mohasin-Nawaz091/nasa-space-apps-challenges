"use client";

import React from "react";
import { BuildingState } from "../../types/building";
import { AssetModel, ASSET_PATHS } from "../game/AssetModel";

interface BuildingProps {
  building: BuildingState;
  isSelected: boolean;
  onSelect: () => void;
}

export function HabitatModule({ building, isSelected, onSelect }: BuildingProps) {
  const isNormal = building.operationalSetting === "normal";

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
        <boxGeometry args={[7, 5.5, 7]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Foundation Base Berm */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[4.4, 4.8, 0.3, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* Primary 3D Asset Model: habitat_module.glb */}
      <AssetModel
        url={ASSET_PATHS.HABITAT}
        position={[0, 0.3, 0]}
        scale={1.05}
        castShadow
        receiveShadow
      />

      {/* Observation Cupola Top Glow */}
      <mesh position={[0, 4.6, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.25, 16]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
      </mesh>

      {/* Status LED near airlock hatch */}
      <mesh position={[0, 1.2, 2.5]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial color={isNormal ? "#22c55e" : "#eab308"} />
      </mesh>
      <pointLight
        position={[0, 1.4, 2.7]}
        color={isNormal ? "#22c55e" : "#eab308"}
        intensity={0.4}
        distance={3}
      />
    </group>
  );
}
