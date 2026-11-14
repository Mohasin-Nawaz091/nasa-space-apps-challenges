/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/game3d/Terrain.tsx
 * Realistic lunar regolith terrain: natural impact craters, distant mountain ridges,
 * scattered boulders/debris, a designated landing zone pad, and interconnecting module conduits.
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../store/store.ts';
import { eventBus } from '../store/bus.ts';

// Procedurally scattered surface boulders & rocks
const SCATTERED_ROCKS = [
  { x: -18, z: -12, scale: 0.85, rot: [0.3, 1.2, 0.4] },
  { x: -22, z: -8, scale: 1.2, rot: [0.8, 0.5, 1.1] },
  { x: -15, z: -25, scale: 1.6, rot: [0.1, 2.1, 0.7] },
  { x: 22, z: -14, scale: 1.1, rot: [1.2, 0.9, 0.3] },
  { x: 25, z: -22, scale: 1.8, rot: [0.4, 1.5, 0.8] },
  { x: 19, z: 18, scale: 0.9, rot: [0.7, 0.3, 1.4] },
  { x: -12, z: 22, scale: 1.3, rot: [1.1, 1.8, 0.2] },
  { x: -28, z: 14, scale: 2.1, rot: [0.5, 2.4, 0.6] },
  { x: 8, z: -26, scale: 0.75, rot: [0.2, 0.7, 1.3] },
  { x: -6, z: -24, scale: 1.05, rot: [0.9, 1.4, 0.5] },
  { x: 28, z: 8, scale: 1.4, rot: [0.6, 0.8, 1.0] },
  { x: 4, z: 26, scale: 0.95, rot: [1.3, 1.1, 0.4] },
  { x: -20, z: 28, scale: 1.5, rot: [0.3, 1.9, 0.7] },
  { x: 16, z: -32, scale: 2.3, rot: [0.8, 0.4, 1.2] },
];

// Pressurized Connecting Corridors linking base modules
const CONNECTING_CORRIDORS = [
  // Hab to Greenhouse
  { start: [0, 0.65, 0], end: [11.5, 0.65, -3.8], length: 12.1, angle: Math.atan2(-3.8, 11.5) },
  // Hab to Lab
  { start: [0, 0.65, 0], end: [13.5, 0.65, 7.8], length: 15.6, angle: Math.atan2(7.8, 13.5) },
  // Hab to Recycler
  { start: [0, 0.65, 0], end: [5.8, 0.65, 9.8], length: 11.4, angle: Math.atan2(9.8, 5.8) },
];

export const Terrain: React.FC = () => {
  const cameraMode = useGameStore((s) => s.cameraMode);
  const activePlayerCrew = useGameStore((s) => s.activePlayerCrew);
  const setCrewTarget = useGameStore((s) => s.setCrewTarget);
  const setDestinationMarker = useGameStore((s) => s.setDestinationMarker);
  const destinationMarker = useGameStore((s) => s.destinationMarker);

  // 1. Procedural High-Resolution Regolith Geometry with Mountain Ridges & Smooth Base
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(130, 130, 140, 140);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const craters = [
      { x: -28, z: -24, r: 14, depth: 3.2 },
      { x: 32, z: -18, r: 15, depth: 3.5 },
      { x: -14, z: 36, r: 13, depth: 3.0 },
      { x: 30, z: 26, r: 11, depth: 2.5 },
      { x: -36, z: 18, r: 16, depth: 3.8 },
      { x: 14, z: -20, r: 6.5, depth: 1.2 },
      { x: -20, z: 12, r: 7.0, depth: 1.4 },
    ];

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Low frequency rolling lunar mare waves
      let y = Math.sin(x * 0.04) * Math.cos(z * 0.04) * 1.4;
      y += Math.sin(x * 0.09 + 1.2) * Math.cos(z * 0.065) * 0.6;

      // Distant perimeter mountain ridges (peaks rising up to 10m on the horizon)
      const distFromCenter = Math.hypot(x, z);
      if (distFromCenter > 42) {
        const mountainFactor = Math.pow((distFromCenter - 42) / 24, 2);
        const ridgeNoise = Math.sin(x * 0.15) * Math.cos(z * 0.15) * 2.5 + 4.0;
        y += mountainFactor * ridgeNoise;
      }

      // Smooth, leveled colony plateau near center (r < 24)
      if (distFromCenter < 24) {
        y *= Math.pow(distFromCenter / 24, 2.5);
      }

      // Sculpt natural craters with ejecta rims
      for (const c of craters) {
        const d = Math.hypot(x - c.x, z - c.z);
        if (d < c.r * 1.35) {
          if (d < c.r) {
            const craterFactor = Math.cos((d / c.r) * Math.PI * 0.5);
            y -= c.depth * craterFactor;
          } else {
            const rimFactor = Math.sin(((d - c.r) / (c.r * 0.35)) * Math.PI);
            y += (c.depth * 0.22) * rimFactor;
          }
        }
      }

      pos.setY(i, y);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  // 2. High-Density Lunar Regolith Bump Texture
  const bumpTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);

    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 40;
      const v = Math.min(255, Math.max(0, 128 + n));
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    // Micro-impact craterlets
    for (let j = 0; j < 90; j++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      const rad = Math.random() * 5 + 1.5;
      const grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, rad);
      grad.addColorStop(0, '#353535');
      grad.addColorStop(0.7, '#656565');
      grad.addColorStop(1, '#959595');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(rx, ry, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(16, 16);
    return tex;
  }, []);

  return (
    <group>
      {/* Main Lunar Regolith Terrain */}
      <mesh
        geometry={geometry}
        receiveShadow
        onClick={(e) => {
          if (cameraMode === 'orbit') {
            e.stopPropagation();
            const pt = e.point;
            setDestinationMarker({ x: pt.x, z: pt.z });
            setCrewTarget(activePlayerCrew, { x: pt.x, z: pt.z });
            eventBus.emit('sound:play', { name: 'click' });
          }
        }}
      >
        <meshStandardMaterial
          color="#6c7380"
          roughness={0.92}
          metalness={0.05}
          bumpMap={bumpTexture ?? undefined}
          bumpScale={0.06}
          flatShading={false}
        />
      </mesh>

      {/* 3. Clearly Visible Lunar Landing Pad */}
      <group position={[0, 0.08, -16]}>
        {/* Hexagonal Sintered Regolith Foundation */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[6.2, 32]} />
          <meshStandardMaterial color="#3a424e" roughness={0.7} metalness={0.2} />
        </mesh>

        {/* Hazard Border Blast Ring */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[5.6, 6.0, 32]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.4} roughness={0.4} />
        </mesh>

        {/* Inner Artemis Landing Target */}
        <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 2.1, 32]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.5, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* 8 Perimeter Runway LED Beacon Posts */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => {
          const rad = (deg * Math.PI) / 180;
          const px = Math.cos(rad) * 6.0;
          const pz = Math.sin(rad) * 6.0;
          return (
            <group key={idx} position={[px, 0, pz]}>
              <mesh position={[0, 0.3, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.08, 0.6, 8]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} />
              </mesh>
              <mesh position={[0, 0.62, 0]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial color={idx % 2 === 0 ? '#38bdf8' : '#f59e0b'} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 4. Natural 3D Lunar Boulders & Debris */}
      {SCATTERED_ROCKS.map((rock, idx) => (
        <mesh
          key={idx}
          position={[rock.x, rock.scale * 0.45, rock.z]}
          rotation={rock.rot as [number, number, number]}
          scale={[rock.scale, rock.scale * 0.8, rock.scale * 1.1]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#585e6a"
            roughness={0.96}
            metalness={0.04}
            flatShading={true}
          />
        </mesh>
      ))}

      {/* 5. Interconnecting Pressurized Personnel Conduits */}
      {CONNECTING_CORRIDORS.map((corridor, idx) => {
        const midX = (corridor.start[0] + corridor.end[0]) / 2;
        const midZ = (corridor.start[2] + corridor.end[2]) / 2;
        return (
          <group key={idx} position={[midX, 0.45, midZ]} rotation={[0, -corridor.angle, 0]}>
            {/* Main Corrugated Pressure Tube */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
              <cylinderGeometry args={[0.55, 0.55, corridor.length - 2.5, 16]} />
              <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.35} />
            </mesh>

            {/* Structural Reinforcing Rings */}
            {[-0.3, 0, 0.3].map((posOffset, rIdx) => (
              <mesh key={rIdx} position={[(corridor.length - 4) * posOffset, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.62, 0.62, 0.25, 16]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} />
              </mesh>
            ))}

            {/* Top Utility Cable Tray */}
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[corridor.length - 2.8, 0.08, 0.2]} />
              <meshStandardMaterial color="#0284c7" metalness={0.8} />
            </mesh>
          </group>
        );
      })}

      {/* 6. Holographic Ground Waypoint Destination Marker */}
      {destinationMarker && (
        <group position={[destinationMarker.x, 0.08, destinationMarker.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.55, 0.72, 32]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.5, 32]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
          </mesh>
        </group>
      )}
    </group>
  );
};
