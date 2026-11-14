"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

interface AssetModelProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
  zUpToYUp?: boolean;
  onPointerOver?: (e: unknown) => void;
  onPointerOut?: (e: unknown) => void;
  onClick?: (e: unknown) => void;
}

export function AssetModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  castShadow = true,
  receiveShadow = true,
  zUpToYUp = true,
  onPointerOver,
  onPointerOut,
  onClick,
}: AssetModelProps) {
  const { scene } = useGLTF(url);

  // Clone scene for instance independence
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = castShadow;
        mesh.receiveShadow = receiveShadow;
        if (mesh.material) {
          // Clone material so instances don't share mutation state
          mesh.material = (mesh.material as THREE.Material).clone();
        }
      }
    });
    return clone;
  }, [scene, castShadow, receiveShadow]);

  const scaleArray: [number, number, number] =
    typeof scale === "number" ? [scale, scale, scale] : scale;

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scaleArray}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      {/* Convert authored Z-up to Three.js Y-up */}
      <group rotation={zUpToYUp ? [-Math.PI / 2, 0, 0] : [0, 0, 0]}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

// Preload all assets in the manifest for instant rendering
export const ASSET_PATHS = {
  // Buildings
  HABITAT: "/assets/models/buildings/habitat_module.glb",
  LIFE_SUPPORT: "/assets/models/buildings/life_support_station.glb",
  GREENHOUSE: "/assets/models/buildings/greenhouse_dome.glb",
  POWER_STATION: "/assets/models/buildings/power_station_solar.glb",
  SHELTER: "/assets/models/buildings/radiation_shelter.glb",
  RESEARCH_LAB: "/assets/models/buildings/research_lab.glb",

  // Characters
  ASTRONAUT: "/assets/models/characters/astronaut_stylized.glb",

  // Environment
  TERRAIN_TILE: "/assets/models/environment/lunar_terrain_tile.glb",
  LANDING_PAD: "/assets/models/environment/landing_pad.glb",
  ROCK_CLUSTER: "/assets/models/environment/rock_cluster_pack.glb",

  // Vehicles & Equipment
  ROVER: "/assets/models/vehicles/lunar_rover.glb",
  ANTENNA: "/assets/models/equipment/communication_antenna.glb",
  OXYGEN_RACK: "/assets/models/equipment/oxygen_tank_rack.glb",
  SOLAR_ARRAY: "/assets/models/equipment/solar_array.glb",

  // Textures
  TEX_REGOLITH: "/assets/textures/lunar_regolith.png",
  TEX_METAL: "/assets/textures/metal_panels.png",
  TEX_GLASS: "/assets/textures/greenhouse_glass.png",
};

// Register preloading for all GLB models
if (typeof window !== "undefined") {
  Object.values(ASSET_PATHS).forEach((path) => {
    if (path.endsWith(".glb")) {
      useGLTF.preload(path);
    }
  });
}
