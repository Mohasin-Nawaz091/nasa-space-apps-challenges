"use client";

import React from "react";
import { BuildingState } from "../../types/building";
import { AssetModel, ASSET_PATHS } from "../game/AssetModel";

interface BuildingProps {
  building: BuildingState;
  isSelected: boolean;
  onSelect: () => void;
}

export function GreenhouseFacility({ building, isSelected, onSelect }: BuildingProps) {
  const isOff = !building.isActive || building.operationalSetting === "eco";
  const isIntensive = building.operationalSetting === "intensive";

  const growLightColor = isOff ? "#475569" : isIntensive ? "#d946ef" : "#a855f7";
  const growLightIntensity = isOff ? 0.05 : isIntensive ? 1.8 : 1.0;

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
        <cylinderGeometry args={[4.4, 4.8, 4.5, 24]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Foundation Platform */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[4.2, 4.6, 0.3, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* Primary 3D Asset Model from Manifest: greenhouse_dome.glb */}
      <AssetModel
        url={ASSET_PATHS.GREENHOUSE}
        position={[0, 0.3, 0]}
        scale={1.2}
        castShadow
        receiveShadow
      />

      {/* Dynamic UV LED Photosynthetic Grow Light Glow */}
      <pointLight
        position={[0, 2.4, 0]}
        color={growLightColor}
        intensity={growLightIntensity * 2.2}
        distance={7}
      />
    </group>
  );
}
