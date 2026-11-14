/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/game3d/Buildings/BuildingMesh.tsx
 * Professional sci-fi colony architecture: multi-part modular composite geometry,
 * fully modeled interiors (greenhouse hydroponics, radiation shelter bunks), PBR materials,
 * and restrained, professional in-world waypoint indicators.
 */

import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { BuildingId } from '../../sim/types.ts';
import { BUILDING_COORDINATES } from '../../sim/rules/crew.ts';
import { useGameStore } from '../../store/store.ts';
import { eventBus } from '../../store/bus.ts';

interface BuildingProps {
  id: BuildingId;
  name: string;
  icon?: string;
}

const MODULE_CODES: Record<BuildingId, string> = {
  habitat: 'HAB-01',
  power_station: 'EPS-01',
  greenhouse: 'BIO-01',
  recycler: 'ECLSS-01',
  shelter: 'RAD-01',
  laboratory: 'LAB-01',
  comms: 'COM-01',
  rover_bay: 'BAY-01',
};

export const BuildingMesh: React.FC<BuildingProps> = ({ id, name }) => {
  const [hovered, setHovered] = useState(false);
  const selectedBuilding = useGameStore((s) => s.selectedBuilding);
  const setSelectedEntity = useGameStore((s) => s.setSelectedEntity);
  const activeModal = useGameStore((s) => s.activeModal);
  const selectedEntity = useGameStore((s) => s.selectedEntity);
  const labelsMode = useGameStore((s) => s.labelsMode);

  const state = useGameStore((s) => s.state);
  const coords = BUILDING_COORDINATES[id];
  const isSelected = selectedBuilding === id;

  const dishRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  // Dynamic animations
  useFrame((stateFrame) => {
    const t = stateFrame.clock.getElapsedTime();

    // Comms dish slow tracking oscillation
    if (id === 'comms' && dishRef.current) {
      dishRef.current.rotation.y = Math.sin(t * 0.25) * 0.5;
    }

    // Beacon strobe light
    if (beaconRef.current) {
      const flash = (Math.sin(t * 4) + 1) * 0.5 > 0.7 ? 1 : 0.2;
      (beaconRef.current.material as THREE.MeshBasicMaterial).opacity = flash;
    }
  });

  // System condition & status
  let condition = 100;
  let isFaulted = false;
  if (id === 'power_station') {
    condition = state.systems.solarArray.condition;
    isFaulted = state.systems.solarArray.isFaulted;
  } else if (id === 'habitat') {
    condition = state.systems.lifeSupport.condition;
    isFaulted = state.systems.lifeSupport.isFaulted;
  } else if (id === 'recycler') {
    condition = state.systems.recycler.condition;
    isFaulted = state.systems.recycler.isFaulted;
  } else if (id === 'greenhouse') {
    condition = state.systems.greenhouse.condition;
    isFaulted = state.systems.greenhouse.isFaulted;
  } else if (id === 'comms') {
    condition = state.systems.comms.condition;
    isFaulted = state.systems.comms.isFaulted;
  } else if (id === 'rover_bay') {
    condition = state.rover.condition;
    isFaulted = state.rover.isFaulted;
  }

  let statusColor = '#22c55e'; // Green
  let statusText = 'Operational';
  if (isFaulted || condition < 25) {
    statusColor = '#ef4444'; // Red
    statusText = 'Critical Fault';
  } else if (condition < 60) {
    statusColor = '#f59e0b'; // Amber
    statusText = 'Maintenance Required';
  }

  const isAdvisoryActive =
    id === 'shelter' && state.radiationAdvisory && !state.radiationAdvisory.resolved;

  const moduleCode = MODULE_CODES[id] || 'MOD';

  return (
    <group
      position={[coords.x, 0, coords.z]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedEntity({ type: 'building', id });
        eventBus.emit('sound:play', { name: 'click' });
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Selection Hologram Ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
          <ringGeometry args={[3.8, 4.3, 48]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Hover Reticle */}
      {hovered && !isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
          <ringGeometry args={[3.8, 4.1, 48]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* 1. HABITAT MODULE (Alpha Command Hab — Multi-deck titanium hull with MLI foil) */}
      {id === 'habitat' && (
        <group>
          {/* Main Cylindrical Lower Hull */}
          <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[3.4, 3.6, 2.0, 32]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.3} />
          </mesh>

          {/* Upper Dome Cap */}
          <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
            <sphereGeometry args={[3.4, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.35} roughness={0.25} />
          </mesh>

          {/* Golden Thermal Multi-Layer Insulation (MLI) Belt */}
          <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[3.43, 3.48, 0.8, 32, 1, true]} />
            <meshStandardMaterial color="#d97706" metalness={0.92} roughness={0.15} />
          </mesh>

          {/* 4 Structural Ground Anchor Footpads */}
          {[45, 135, 225, 315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const fx = Math.cos(rad) * 3.7;
            const fz = Math.sin(rad) * 3.7;
            return (
              <group key={i} position={[fx, 0, fz]}>
                <mesh position={[0, 0.2, 0]} castShadow>
                  <cylinderGeometry args={[0.4, 0.5, 0.4, 12]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.8} />
                </mesh>
                <mesh position={[0, 0.6, 0]} rotation={[0, 0, (Math.cos(rad) > 0 ? -1 : 1) * 0.3]} castShadow>
                  <cylinderGeometry args={[0.08, 0.08, 1.0, 8]} />
                  <meshStandardMaterial color="#475569" metalness={0.9} />
                </mesh>
              </group>
            );
          })}

          {/* Illuminated Command Viewports */}
          {[0, 90, 180, 270].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const vx = Math.cos(rad) * 3.25;
            const vz = Math.sin(rad) * 3.25;
            return (
              <mesh key={i} position={[vx, 2.6, vz]} rotation={[0, -rad + Math.PI / 2, 0]}>
                <circleGeometry args={[0.3, 16]} />
                <meshBasicMaterial color="#fed7aa" />
              </mesh>
            );
          })}

          {/* Pressurized Decompression Airlock */}
          <group position={[0, 0.8, 3.5]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.8, 1.6, 1.8]} />
              <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.35} />
            </mesh>
            {/* Outer Pressure Door */}
            <mesh position={[0, 0, 0.92]}>
              <boxGeometry args={[1.2, 1.3, 0.08]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
            {/* Illuminated Airlock Status Light */}
            <mesh position={[0, 0.75, 0.94]}>
              <boxGeometry args={[0.3, 0.08, 0.04]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>

          {/* Rooftop Cupola & Mast */}
          <mesh position={[0, 3.4, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.8, 0.4, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>
        </group>
      )}

      {/* 2. SOLAR POWER FIELD (High-Efficiency Photovoltaic Arrays on Articulated Trusses) */}
      {id === 'power_station' && (
        <group>
          {/* Central Power Inverter & Transformer Hub */}
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.8, 1.8, 2.4]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* High-Voltage Circuit Warning Panel */}
          <mesh position={[0, 0.9, 1.22]}>
            <planeGeometry args={[1.2, 0.6]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>

          {/* 8 Articulated Solar Panels in 2 Rows */}
          {[-3.2, 3.2].map((rowZ, rIdx) =>
            [-3, -1, 1, 3].map((colX, cIdx) => (
              <group key={`${rIdx}-${cIdx}`} position={[colX * 1.5, 0, rowZ]}>
                {/* Foundation Pylon */}
                <mesh position={[0, 0.6, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.1, 1.2, 12]} />
                  <meshStandardMaterial color="#64748b" metalness={0.8} />
                </mesh>
                {/* Dual-Axis Servo Pivot */}
                <mesh position={[0, 1.25, 0]} castShadow>
                  <sphereGeometry args={[0.12, 12, 12]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.9} />
                </mesh>
                {/* High-Efficiency Blue Photovoltaic Panel */}
                <group position={[0, 1.35, 0]} rotation={[0.42, 0.25, 0]}>
                  {/* Panel Frame */}
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[1.4, 0.05, 0.95]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} />
                  </mesh>
                  {/* Silicon Solar Cells Grid with Realistic Specular Sheen */}
                  <mesh position={[0, 0.03, 0]}>
                    <planeGeometry args={[1.32, 0.88]} />
                    <meshStandardMaterial
                      color="#0c2340"
                      emissive="#1d4ed8"
                      emissiveIntensity={state.powerBreakdown.sunlightFactor > 0.5 ? 0.45 : 0.12}
                      metalness={0.95}
                      roughness={0.08}
                    />
                  </mesh>
                </group>
              </group>
            ))
          )}
        </group>
      )}

      {/* 3. HYDROPONIC GREENHOUSE (Section 7: Fully Modeled Interior Plants, LED Grow Lights, Pipes) */}
      {id === 'greenhouse' && (
        <group>
          {/* Foundation Ring Base */}
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[3.3, 3.45, 0.7, 32]} />
            <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.3} />
          </mesh>

          {/* Double-Glazed Pressurized Geodesic Glass Dome */}
          <mesh position={[0, 2.0, 0]} castShadow>
            <sphereGeometry args={[3.2, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshPhysicalMaterial
              color="#a7f3d0"
              transparent
              opacity={0.55}
              roughness={0.08}
              transmission={0.8}
              thickness={1.6}
              ior={1.48}
            />
          </mesh>

          {/* Structural Geodesic Framing Ribs */}
          <mesh position={[0, 2.0, 0]}>
            <sphereGeometry args={[3.22, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="#1e293b" wireframe={true} />
          </mesh>

          {/* INTERIOR: Photobiological Grow-Lights (Magenta/Purple VEGGIE Glow) */}
          <pointLight position={[0, 2.4, 0]} intensity={2.2} distance={8} color="#d946ef" />

          {/* INTERIOR: Multi-Tier Hydroponic Vertical A-Frames & Racks */}
          {[-1.2, 1.2].map((xOffset, rIdx) => (
            <group key={rIdx} position={[xOffset, 0.5, 0]}>
              {/* Nutrient Solution Tank */}
              <mesh position={[0, 0.15, 0]} castShadow>
                <boxGeometry args={[1.1, 0.3, 2.6]} />
                <meshStandardMaterial color="#1e293b" metalness={0.7} />
              </mesh>

              {/* Hydroponic Grow Channels with Lush Green Crops */}
              {[0.4, 0.8, 1.2].map((yLevel, lvl) => (
                <group key={lvl} position={[0, yLevel, 0]}>
                  {/* Channel Trough */}
                  <mesh>
                    <boxGeometry args={[0.85 - lvl * 0.15, 0.12, 2.4]} />
                    <meshStandardMaterial color="#475569" metalness={0.5} />
                  </mesh>
                  {/* Dense Crop Foliage */}
                  <mesh position={[0, 0.12, 0]}>
                    <boxGeometry args={[0.75 - lvl * 0.15, 0.16, 2.3]} />
                    <meshStandardMaterial color="#22c55e" roughness={0.7} />
                  </mesh>
                </group>
              ))}

              {/* Blue Water & Nutrient Supply Pipe */}
              <mesh position={[0.45, 0.7, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 2.4, 8]} />
                <meshStandardMaterial color="#0284c7" metalness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 4. WATER RECOVERY SYSTEM & ECLSS (Industrial Vacuum Distillation Columns) */}
      {id === 'recycler' && (
        <group>
          {/* Reinforced Support Skid Base */}
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.6, 0.5, 2.8]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
          </mesh>

          {/* Primary Vacuum Distillation Tank (Polished Stainless Steel) */}
          <mesh position={[-1.0, 1.6, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.8, 0.8, 2.6, 24]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.18} />
          </mesh>

          {/* Secondary Multi-Stage Filter Column */}
          <mesh position={[1.0, 1.4, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.7, 0.7, 2.2, 24]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.2} />
          </mesh>

          {/* Copper Distillation Heat Pipes */}
          <mesh position={[0, 2.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 2.0, 12]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} />
          </mesh>

          {/* Fluid Buffer Level Sight Glass Tube */}
          <mesh position={[-1.0, 1.6, 0.82]}>
            <cylinderGeometry args={[0.06, 0.06, 2.0, 12]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>

          {/* Heat Exchanger Radiator Fins */}
          <mesh position={[0, 1.0, -1.0]} castShadow>
            <boxGeometry args={[2.8, 1.4, 0.3]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* 5. RADIATION SHELTER (Section 7: Heavy Regolith Bunker with Modeled Interior Bunks & Console) */}
      {id === 'shelter' && (
        <group>
          {/* Multi-layered Sintered Regolith Blast Berm */}
          <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
            <sphereGeometry args={[3.8, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.44]} />
            <meshStandardMaterial
              color={isAdvisoryActive ? '#b45309' : '#475569'}
              emissive={isAdvisoryActive ? '#78350f' : '#000000'}
              emissiveIntensity={isAdvisoryActive ? 0.7 : 0}
              roughness={0.95}
              metalness={0.08}
            />
          </mesh>

          {/* Reinforced Concrete Bunker Entrance Frame */}
          <group position={[0, 0.8, 3.4]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.2, 1.6, 1.4]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
            </mesh>

            {/* Heavy Hydraulic Blast Door with Hazard Chevrons */}
            <mesh position={[0, 0, 0.72]}>
              <boxGeometry args={[1.5, 1.4, 0.12]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.6, 0.79]}>
              <boxGeometry args={[1.4, 0.12, 0.02]} />
              <meshBasicMaterial color="#f59e0b" />
            </mesh>

            {/* INTERIOR: Emergency Console Glow & Survival Bunks (Visible inside) */}
            <pointLight position={[0, 0.5, -0.6]} intensity={1.2} distance={5} color="#38bdf8" />
            <mesh position={[-0.6, 0.2, -0.6]}>
              <boxGeometry args={[0.6, 0.35, 1.2]} />
              <meshStandardMaterial color="#1e3a8a" />
            </mesh>
            <mesh position={[0.6, 0.2, -0.6]}>
              <boxGeometry args={[0.6, 0.35, 1.2]} />
              <meshStandardMaterial color="#1e3a8a" />
            </mesh>
          </group>

          {/* Roof Radiation Dosimeter Antenna */}
          <mesh position={[0, 3.2, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.06, 1.5, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
        </group>
      )}

      {/* 6. RESEARCH LABORATORY (Sample Intake Hatch & Optical Spectrometer Dome) */}
      {id === 'laboratory' && (
        <group>
          {/* Main Cleanroom Habitat Hull */}
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.8, 2.6, 3.0]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.3} roughness={0.25} />
          </mesh>

          {/* Scientific Telemetry & Analysis Mast */}
          <mesh position={[1.4, 3.2, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 1.8, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} />
          </mesh>

          {/* Optical Analysis Sensor Dome */}
          <mesh position={[-0.8, 2.9, 0]} castShadow>
            <sphereGeometry args={[0.55, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.7} />
          </mesh>

          {/* Core Sample Loading Bay */}
          <mesh position={[0, 0.8, 1.55]} castShadow>
            <boxGeometry args={[1.6, 1.2, 0.3]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        </group>
      )}

      {/* 7. DEEP SPACE COMMUNICATIONS ARRAY (Lattice Tower with Parabolic Dish) */}
      {id === 'comms' && (
        <group>
          {/* Structural Steel Lattice Mast */}
          <mesh position={[0, 3.2, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.35, 6.4, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.3} />
          </mesh>

          {/* Motorized Azimuth/Elevation Gimbal & Dish */}
          <group ref={dishRef} position={[0, 6.4, 0]}>
            <mesh rotation={[0.4, 0, 0]} castShadow>
              <sphereGeometry args={[1.9, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.38]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.65} roughness={0.2} />
            </mesh>
            {/* Sub-Reflector Feed Horn & Tri-Struts */}
            <mesh position={[0, 0.65, 0.95]} castShadow>
              <coneGeometry args={[0.2, 0.4, 16]} />
              <meshStandardMaterial color="#0284c7" metalness={0.9} />
            </mesh>
          </group>

          {/* Aviation Hazard Strobe Beacon on Peak */}
          <mesh ref={beaconRef} position={[0, 7.6, 0]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshBasicMaterial color="#ef4444" transparent={true} />
          </mesh>
        </group>
      )}

      {/* 8. ROVER MAINTENANCE BAY (Heavy Service Platform with Charging Pylons) */}
      {id === 'rover_bay' && (
        <group>
          {/* Service Platform Skid */}
          <mesh position={[0, 0.15, 0]} receiveShadow>
            <boxGeometry args={[4.6, 0.3, 5.2]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.5} />
          </mesh>

          {/* Yellow Safety Bollards */}
          {[-2.0, 2.0].map((px, i) =>
            [-2.2, 2.2].map((pz, j) => (
              <mesh key={`${i}-${j}`} position={[px, 0.6, pz]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 1.0, 12]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.4} />
              </mesh>
            ))
          )}

          {/* Quick-Charge Umbilical Post */}
          <mesh position={[-1.8, 1.1, -1.8]} castShadow>
            <boxGeometry args={[0.4, 1.8, 0.4]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        </group>
      )}

      {/* RESTRAINED, PROFESSIONAL GAME WAYPOINT INDICATOR */}
      {labelsMode !== 'hidden' && activeModal === 'none' && !selectedEntity && (
        <Html
          position={[0, id === 'comms' ? 8.2 : 4.4, 0]}
          distanceFactor={26}
          center
          zIndexRange={[5, 0]}
          className="pointer-events-auto select-none font-mono"
        >
          <div className="flex flex-col items-center">
            {labelsMode === 'compact' && !hovered && !isSelected ? (
              /* Compact Sci-Fi Diamond Waypoint */
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEntity({ type: 'building', id });
                }}
                className="group flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700 hover:border-sky-400 shadow-xl backdrop-blur-md transition-all cursor-pointer hover:scale-105"
                title={`${name} (${condition}%)`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ backgroundColor: statusColor }}
                />
                <span className="text-[9px] font-bold tracking-wider text-slate-300 group-hover:text-white">
                  {moduleCode}
                </span>
              </button>
            ) : (
              /* Expanded Restrained Tactical Tag (On Hover or Selected) */
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEntity({ type: 'building', id });
                }}
                className={`flex items-center gap-2 px-2.5 py-1 rounded bg-slate-950/90 border shadow-2xl backdrop-blur-md transition-all cursor-pointer ${
                  isSelected
                    ? 'border-sky-400 ring-1 ring-sky-400 text-white'
                    : 'border-slate-700 hover:border-sky-400 text-slate-200'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: statusColor }}
                />
                <div className="text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white">
                    {name}
                  </div>
                  <div className="text-[8px] text-slate-400">
                    {moduleCode} · {condition}% {statusText}
                  </div>
                </div>
              </button>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};
