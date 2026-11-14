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

export function RadiationShelter({ building, isSelected, onSelect }: BuildingProps) {
  const strobeRef = useRef<THREE.PointLight>(null);
  const isLockdown = building.operationalSetting === "lockdown";

  useFrame((state) => {
    if (strobeRef.current && isLockdown) {
      strobeRef.current.intensity =
        1.5 + Math.sin(state.clock.elapsedTime * 6) * 1.2;
    }
  });

  return (
    <group position={building.position} rotation={building.rotation}>
      {/* Invisible Interactive Hit Box with Hover Pointer */}
      <mesh
        position={[0, 2.0, 0]}
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
        <boxGeometry args={[6.6, 4.4, 6.2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Low Sintered Foundation Pad */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[6.2, 0.3, 5.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Primary 3D Asset Model: radiation_shelter.glb */}
      <AssetModel
        url={ASSET_PATHS.SHELTER}
        position={[0, 0.3, 0]}
        scale={1.25}
        castShadow
        receiveShadow
      />

      {/* Emergency Radiation Lockdown Strobe Beacon */}
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshBasicMaterial color={isLockdown ? "#ef4444" : "#10b981"} />
      </mesh>

      <pointLight
        ref={strobeRef}
        position={[0, 2.7, 0]}
        color={isLockdown ? "#ef4444" : "#10b981"}
        intensity={isLockdown ? 1.8 : 0.5}
        distance={8}
      />
    </group>
  );
}
