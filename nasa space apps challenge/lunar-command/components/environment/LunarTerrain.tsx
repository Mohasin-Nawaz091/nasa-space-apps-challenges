"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { AssetModel, ASSET_PATHS } from "../game/AssetModel";
import { useGameStore } from "../../store/gameStore";
import { sounds } from "../../utils/audio";

export function LunarTerrain() {
  // Load texture map from assets pack: lunar_regolith.png
  const regolithTexture = useTexture(ASSET_PATHS.TEX_REGOLITH);
  useMemo(() => {
    regolithTexture.wrapS = THREE.RepeatWrapping;
    regolithTexture.wrapT = THREE.RepeatWrapping;
    regolithTexture.repeat.set(16, 16);
  }, [regolithTexture]);

  // Generate wide rolling terrain with craters
  const geometry = useMemo(() => {
    const size = 160;
    const segments = 120;
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    geom.rotateX(-Math.PI / 2);

    const pos = geom.attributes.position;
    const landingPadCenter = new THREE.Vector2(18, 16);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      const distToPad = Math.hypot(x - landingPadCenter.x, z - landingPadCenter.y);
      const distToHub = Math.hypot(x, z);

      let y =
        Math.sin(x * 0.04) * Math.cos(z * 0.04) * 2.2 +
        Math.sin(x * 0.09 + 1.2) * Math.cos(z * 0.08) * 0.9;

      // Crater 1: South-West Crater
      const dC1 = Math.hypot(x - -28, z - 24);
      if (dC1 < 18) {
        const rim = Math.sin((dC1 / 18) * Math.PI) * 1.6;
        const bowl = Math.cos((dC1 / 18) * Math.PI) * -3.2;
        y += bowl + rim;
      }

      // Crater 2: North-East Crater
      const dC2 = Math.hypot(x - 32, z - -30);
      if (dC2 < 14) {
        y -= Math.cos((dC2 / 14) * (Math.PI / 2)) * 3.5;
      }

      // Mountain ridge at map edge
      const distFromCenter = Math.hypot(x, z);
      if (distFromCenter > 50) {
        const ridgeFactor = (distFromCenter - 50) / 30;
        y += Math.pow(ridgeFactor, 1.8) * 8.5 * (1 + Math.sin(x * 0.15) * 0.3);
      }

      // Flatten landing pad and colony center
      if (distToPad < 14) {
        const blend = Math.max(0, (distToPad - 11) / 3);
        y = y * blend - 0.05 * (1 - blend);
      } else if (distToHub < 16) {
        const blend = Math.max(0, (distToHub - 10) / 6);
        y = y * blend;
      }

      pos.setY(i, y);
    }

    geom.computeVertexNormals();
    return geom;
  }, []);

  const selectedAstronautId = useGameStore((s) => s.selectedAstronautId);
  const moveAstronaut = useGameStore((s) => s.moveAstronaut);
  const selectBuilding = useGameStore((s) => s.selectBuilding);
  const selectAstronaut = useGameStore((s) => s.selectAstronaut);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!pointerDownPos.current) return;
    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    pointerDownPos.current = null;

    // Reject camera dragging/orbiting (threshold 7px)
    if (Math.hypot(dx, dy) > 7) return;

    if (selectedAstronautId) {
      e.stopPropagation();
      sounds.playClick();
      moveAstronaut(selectedAstronautId, [e.point.x, 0, e.point.z]);
    } else {
      // Clicking empty terrain deselects building
      selectBuilding(null);
    }
  };

  return (
    <group>
      {/* Main Lunar Surface Mesh with Texture Map */}
      <mesh
        geometry={geometry}
        receiveShadow
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <meshStandardMaterial
          map={regolithTexture}
          roughness={0.94}
          metalness={0.06}
        />
      </mesh>

      {/* Primary 3D Terrain Tile Asset: lunar_terrain_tile.glb (centered at colony core) */}
      <AssetModel
        url={ASSET_PATHS.TERRAIN_TILE}
        position={[0, -0.05, 0]}
        scale={1.0}
        receiveShadow
      />

      {/* Sintered Landing Pad Asset: landing_pad.glb (placed at [18, 0.05, 16]) */}
      <AssetModel
        url={ASSET_PATHS.LANDING_PAD}
        position={[18, 0.05, 16]}
        scale={1.25}
        receiveShadow
        castShadow
      />

      {/* Hazard Perimeter Lighting Beacons on Pad */}
      {[-7, 7].map((x) =>
        [-7, 7].map((z) => (
          <group key={`${x}-${z}`} position={[18 + x, 0.25, 16 + z]}>
            <mesh>
              <cylinderGeometry args={[0.15, 0.2, 0.5, 8]} />
              <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshBasicMaterial color="#ffaa00" />
            </mesh>
            <pointLight color="#ffaa00" intensity={0.6} distance={6} />
          </group>
        ))
      )}

      {/* Rock Cluster Pack Assets: rock_cluster_pack.glb scattered around craters */}
      <AssetModel
        url={ASSET_PATHS.ROCK_CLUSTER}
        position={[-18, 0.1, 14]}
        rotation={[0, 0.8, 0]}
        scale={1.3}
        castShadow
        receiveShadow
      />
      <AssetModel
        url={ASSET_PATHS.ROCK_CLUSTER}
        position={[15, 0.1, -18]}
        rotation={[0, -1.2, 0]}
        scale={1.1}
        castShadow
        receiveShadow
      />
      <AssetModel
        url={ASSET_PATHS.ROCK_CLUSTER}
        position={[-22, 0.1, -12]}
        rotation={[0, 2.1, 0]}
        scale={1.4}
        castShadow
        receiveShadow
      />
      <AssetModel
        url={ASSET_PATHS.ROCK_CLUSTER}
        position={[8, 0.1, 24]}
        rotation={[0, -0.4, 0]}
        scale={1.2}
        castShadow
        receiveShadow
      />
    </group>
  );
}
