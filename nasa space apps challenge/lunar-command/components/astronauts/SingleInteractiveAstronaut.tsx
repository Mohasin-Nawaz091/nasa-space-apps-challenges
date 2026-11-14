"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useGameStore } from "../../store/gameStore";
import { AstronautState } from "../../types/astronaut";
import { AssetModel, ASSET_PATHS } from "../game/AssetModel";
import { sounds } from "../../utils/audio";

interface Props {
  astronaut: AstronautState;
  isSelected: boolean;
  onSelect: () => void;
}

export function SingleInteractiveAstronaut({ astronaut, isSelected, onSelect }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const selectionRingRef = useRef<THREE.Mesh>(null);
  const sparksRef = useRef<THREE.PointLight>(null);
  const scanBeamRef = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3(...astronaut.currentPosition));

  const updateAstronautPosition = useGameStore((s) => s.updateAstronautPosition);
  const progressCrewTask = useGameStore((s) => s.progressCrewTask);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // 1. Emergency Sheltered Positioning
    if (astronaut.isSheltered) {
      const offset = astronaut.id === "alex" ? -1.0 : astronaut.id === "mia" ? 0 : 1.0;
      groupRef.current.position.set(6 + offset, 0.1, 7.5);
      groupRef.current.rotation.y = Math.PI;
      return;
    }

    // 2. Point-and-Click Movement along ground plane
    const target = new THREE.Vector3(
      astronaut.targetPosition[0],
      0,
      astronaut.targetPosition[2]
    );
    const dist = currentPos.current.distanceTo(target);

    if (dist > 0.18) {
      // Walking locomotion
      const walkSpeed = 2.4; // lunar sprint pace
      const step = Math.min(dist, delta * walkSpeed);
      const dir = target.clone().sub(currentPos.current).normalize();
      currentPos.current.add(dir.multiplyScalar(step));
      groupRef.current.position.copy(currentPos.current);

      // Smooth orientation to facing direction
      const angle = Math.atan2(dir.x, dir.z);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        angle,
        0.18
      );

      // Procedural walking stride bounce & roll sway
      const bounce = Math.abs(Math.sin(t * 9.0)) * 0.12;
      groupRef.current.position.y = bounce;
      groupRef.current.rotation.z = Math.sin(t * 9.0) * 0.05;
    } else {
      // Stationed / Arrived at destination
      groupRef.current.rotation.z = 0;

      // Idle subtle breathing
      const breath = Math.sin(t * 2.2) * 0.02;
      groupRef.current.position.y = breath;

      // Update position coordinate in store if moved
      if (
        Math.abs(astronaut.currentPosition[0] - currentPos.current.x) > 0.1 ||
        Math.abs(astronaut.currentPosition[2] - currentPos.current.z) > 0.1
      ) {
        updateAstronautPosition(astronaut.id, [
          currentPos.current.x,
          0,
          currentPos.current.z,
        ]);
      }

      // 3. Task Progress & Work Animation
      if (astronaut.currentTask) {
        progressCrewTask(astronaut.id, delta);
      }
    }

    // 4. Animate Selected Reticle
    if (selectionRingRef.current) {
      selectionRingRef.current.rotation.z = t * 1.8;
      const ringScale = 1.0 + Math.sin(t * 4) * 0.06;
      selectionRingRef.current.scale.set(ringScale, ringScale, ringScale);
    }

    // 5. Procedural Working Visual Effects
    const isWorking = astronaut.status === "Working";
    if (sparksRef.current) {
      sparksRef.current.intensity = isWorking ? (Math.random() > 0.4 ? 2.5 : 0.3) : 0;
    }
    if (scanBeamRef.current) {
      scanBeamRef.current.visible = isWorking && astronaut.role === "Scientist";
      if (scanBeamRef.current.visible) {
        scanBeamRef.current.rotation.y = t * 3.0;
      }
    }
  });

  const accentHex = astronaut.accentColor || "#38bdf8";
  const roleEmoji = astronaut.avatar || "👨‍🚀";

  return (
    <group
      ref={groupRef}
      position={astronaut.currentPosition}
      onClick={(e) => {
        e.stopPropagation();
        sounds.playClick();
        onSelect();
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* 3D Stylized Astronaut Asset Model */}
      <AssetModel
        url={ASSET_PATHS.ASTRONAUT}
        scale={0.7}
        castShadow
        receiveShadow
      />

      {/* Role Accent Foot Ring (Permanent subtle ring) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.45, 0.55, 24]} />
        <meshBasicMaterial
          color={accentHex}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* High-Visibility Selection Reticle (When Selected) */}
      {isSelected && (
        <group position={[0, 0.04, 0]}>
          {/* Rotating Outer Segmented Reticle */}
          <mesh ref={selectionRingRef} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.9, 1.15, 32]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Inner Pulsing Solid Disc */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.85, 24]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Overhead Spotlight */}
          <spotLight
            position={[0, 4.0, 0]}
            target-position={[0, 0, 0]}
            color="#38bdf8"
            intensity={1.2}
            angle={0.4}
            penumbra={0.5}
            distance={6}
          />
        </group>
      )}

      {/* Role-Specific Work Visual Effects */}
      {/* Alex: Welding Sparks */}
      {astronaut.role === "Engineer" && (
        <group position={[0.4, 0.9, 0.4]}>
          <pointLight
            ref={sparksRef}
            color="#fbbf24"
            intensity={0}
            distance={3.5}
          />
        </group>
      )}

      {/* Mia: Scientific Scanner Beam */}
      {astronaut.role === "Scientist" && (
        <group ref={scanBeamRef} position={[0, 1.1, 0.4]} visible={false}>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <coneGeometry args={[0.6, 1.6, 16, 1, true]} />
            <meshBasicMaterial
              color="#c084fc"
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
              wireframe
            />
          </mesh>
          <pointLight color="#a855f7" intensity={1.5} distance={3} />
        </group>
      )}

      {/* Leo: Botanical Agro-Mist Glow */}
      {astronaut.role === "Botanist" && (
        <group position={[0, 0.6, 0.4]}>
          <pointLight
            ref={sparksRef}
            color="#34d399"
            intensity={0}
            distance={2.5}
          />
        </group>
      )}

      {/* Overhead 3D Floating Name & Status Badge */}
      <Html
        position={[0, 2.5, 0]}
        center
        distanceFactor={18}
        zIndexRange={[15, 0]}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            sounds.playClick();
            onSelect();
          }}
          className={`cursor-pointer px-2.5 py-1 rounded-xl text-xs font-black flex flex-col items-center shadow-2xl border transition-all duration-200 select-none hover:scale-110 active:scale-95 ${
            isSelected
              ? "bg-cyan-500 text-white border-white ring-4 ring-cyan-400/60 scale-105"
              : "bg-slate-900/90 text-slate-100 border-slate-700 hover:border-cyan-400"
          }`}
        >
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-sm">{roleEmoji}</span>
            <span className="font-extrabold">{astronaut.name}</span>
            <span
              className="text-[9px] px-1 py-0.2 rounded text-white font-mono"
              style={{ backgroundColor: accentHex }}
            >
              {astronaut.role}
            </span>
          </div>

          {/* Mini Status Tag or Task Progress Bar */}
          {astronaut.currentTask ? (
            <div className="w-24 mt-1 bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700">
              <div
                className="bg-amber-400 h-full transition-all duration-200"
                style={{
                  width: `${Math.min(
                    100,
                    (astronaut.currentTask.elapsed / astronaut.currentTask.duration) * 100
                  )}%`,
                }}
              />
            </div>
          ) : (
            <span
              className={`text-[9px] font-mono mt-0.5 ${
                astronaut.status === "Walking"
                  ? "text-cyan-300"
                  : astronaut.status === "Needs Attention"
                  ? "text-red-400 animate-pulse font-bold"
                  : "text-slate-400"
              }`}
            >
              {astronaut.status === "Walking"
                ? "🚶 Walking"
                : astronaut.status === "Needs Attention"
                ? "⚠️ Exhausted"
                : "⚡ Ready"}
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}
