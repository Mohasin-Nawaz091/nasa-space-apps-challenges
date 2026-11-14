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

export function ScienceLaboratory({ building, isSelected, onSelect }: BuildingProps) {
  const radarRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (radarRef.current && building.isActive) {
      radarRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  const isResearching = building.operationalSetting === "active";

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
        <boxGeometry args={[7.2, 4.8, 5.8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Foundation Platform */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[6.8, 0.3, 5.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Primary 3D Asset Model: research_lab.glb */}
      <AssetModel
        url={ASSET_PATHS.RESEARCH_LAB}
        position={[0, 0.3, 0]}
        scale={1.1}
        castShadow
        receiveShadow
      />

      {/* Rooftop Scientific Sensor Array & Spectrometer Dish */}
      <group position={[1.8, 3.4, -0.8]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.2, 0.8, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Rotating Spectral Sensor Dish */}
        <group ref={radarRef} position={[0, 0.6, 0]}>
          <mesh rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.1, 0.3, 16, 1, true]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.6}
              roughness={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      </group>

      {/* Ambient Blue Research Telemetry Light */}
      <pointLight
        position={[0, 2.0, 2.4]}
        color="#38bdf8"
        intensity={isResearching ? 0.8 : 0.1}
        distance={5}
      />
    </group>
  );
}
