/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/ui/AstronautEyeOverlay.tsx
 * Immersive NASA Extravehicular Helmet Visor HUD: curved glass reflections, heading compass, suit telemetry, bio-monitors, and central reticle.
 */

import React from 'react';
import { useGameStore } from '../store/store.ts';
import { getCrewDisplayName } from '../sim/rules/crew.ts';

export const AstronautEyeOverlay: React.FC = () => {
  const cameraMode = useGameStore((s) => s.cameraMode);
  const toggleCameraMode = useGameStore((s) => s.toggleCameraMode);
  const activePlayerCrew = useGameStore((s) => s.activePlayerCrew);
  const state = useGameStore((s) => s.state);
  const nearbyBuilding = useGameStore((s) => s.nearbyBuilding);

  if (cameraMode !== 'eye') return null;

  const currentCrew = state.crew[activePlayerCrew];
  const crewInfo = getCrewDisplayName(currentCrew);
  const isWorking = !!currentCrew.currentTask;

  return (
    <div className="fixed inset-0 z-30 pointer-events-none select-none overflow-hidden animate-fadeIn font-mono">
      {/* 1. Curved Glass Helmet Vignette & Subtle Reflection Border */}
      <div className="absolute inset-0 border-[28px] md:border-[48px] border-slate-950/85 rounded-[80px] md:rounded-[120px] pointer-events-none shadow-[inset_0_0_140px_rgba(0,0,0,0.95)]" />

      {/* Gold Solar Visor Reflection Gradient at Top */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-500/15 via-amber-400/5 to-transparent pointer-events-none" />

      {/* Visor Scanline Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#000000]/25 to-[#000000]/70 pointer-events-none" />

      {/* 2. Top Heading Tape & Navigation Compass */}
      <div className="absolute top-12 md:top-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <div className="flex items-center gap-4 px-6 py-1.5 rounded-full bg-slate-950/80 border border-sky-400/60 text-xs text-sky-400 shadow-2xl backdrop-blur-md">
          <span className="text-[10px] text-slate-500">W</span>
          <span className="text-[10px] text-slate-500">··</span>
          <span className="text-[10px] text-slate-400">NW</span>
          <span className="text-[10px] text-slate-500">··</span>
          <span className="font-bold text-white bg-sky-500/20 px-2 py-0.5 rounded border border-sky-400/50">
            N 000°
          </span>
          <span className="text-[10px] text-slate-500">··</span>
          <span className="text-[10px] text-slate-400">NE</span>
          <span className="text-[10px] text-slate-500">··</span>
          <span className="text-[10px] text-slate-500">E</span>
        </div>
        <div className="text-[9px] text-slate-400 uppercase tracking-wider bg-slate-950/80 px-3 py-0.5 rounded-full border border-slate-800">
          HELMET POV · SOL {state.mission.day} / 10 · {String(state.mission.tick).padStart(2, '0')}:00 LT · [DRAG TO LOOK · WASD TO WALK]
        </div>
      </div>

      {/* 3. Center Precision Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full border border-sky-400/80" />
          <div className="absolute w-4 h-px bg-sky-400/60 -left-3" />
          <div className="absolute w-4 h-px bg-sky-400/60 -right-3" />
          <div className="absolute h-4 w-px bg-sky-400/60 -top-3" />
          <div className="absolute h-4 w-px bg-sky-400/60 -bottom-3" />
        </div>

        {/* Nearby Building Interaction Overlay inside Reticle */}
        {nearbyBuilding && (
          <div className="mt-3 px-3 py-1 rounded-lg bg-slate-950/90 border border-sky-400 text-xs text-white shadow-xl backdrop-blur-md flex items-center gap-2 animate-pulse">
            <span className="text-sky-400 font-black">[ E ]</span>
            <span className="capitalize font-bold">{nearbyBuilding.replace('_', ' ')}</span>
          </div>
        )}
      </div>

      {/* 4. Bottom-Left: NASA Extravehicular Suit Telemetry */}
      <div className="absolute bottom-10 md:bottom-14 left-10 md:left-16 flex flex-col gap-1 p-3 rounded-xl bg-slate-950/85 border border-slate-800 shadow-2xl backdrop-blur-md text-[10px] text-slate-300">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1 text-[9px] font-bold uppercase text-sky-400">
          <span>xEMU SUIT TELEMETRY</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">SUIT PRESSURE:</span>
          <strong className="text-white">4.3 PSI (NOMINAL)</strong>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">PRIMARY O2:</span>
          <strong className="text-emerald-400">{Math.round(state.resources.oxygen)}% (STABLE)</strong>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">SUIT BATTERY:</span>
          <strong className="text-amber-400">{Math.round(state.resources.battery)}%</strong>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">HEART RATE:</span>
          <strong className="text-rose-400">72 BPM</strong>
        </div>
      </div>

      {/* 5. Bottom-Right: Active Specialist Bio-Tag */}
      <div className="absolute bottom-10 md:bottom-14 right-10 md:right-16 flex flex-col gap-1 p-3 rounded-xl bg-slate-950/85 border border-slate-800 shadow-2xl backdrop-blur-md text-[10px] text-slate-300">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1 text-[9px] font-bold uppercase text-sky-400">
          <span>ASTRONAUT PROFILE</span>
          <span className="text-white font-bold">{currentCrew.health} HP</span>
        </div>
        <div className="text-xs font-black text-white">{crewInfo.shortName}</div>
        <div className="text-sky-400 text-[9px] font-medium">{crewInfo.role}</div>
        <div className="mt-1 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[9px]">
          <span className="text-slate-400">STAMINA: {currentCrew.stamina}/8h</span>
          <span className={isWorking ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
            {isWorking ? '⚡ ACTIVE TASK' : 'EXPLORING'}
          </span>
        </div>
      </div>

      {/* 6. Exit Eye View Top-Right Button */}
      <div className="absolute top-12 md:top-14 right-10 md:right-16 pointer-events-auto">
        <button
          onClick={toggleCameraMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/90 hover:bg-sky-500 text-sky-400 hover:text-slate-950 text-xs font-black border border-sky-400 shadow-2xl backdrop-blur-xl transition-all cursor-pointer hover:scale-105"
          title="Exit to Orbital Base Overview (Hotkey: V)"
        >
          <span>🛰️</span>
          <span>ORBIT VIEW [V]</span>
        </button>
      </div>
    </div>
  );
};
