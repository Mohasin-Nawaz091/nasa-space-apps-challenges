/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/ui/MissionBar.tsx
 * Professional game top status bar: LUNAR COMMAND branding, Artemis Base Alpha badge,
 * 10-Sol time telemetry, simulation playback, advance Sol, camera perspective switch (Orbit / Helmet POV),
 * tutorial, manual, save/load, settings & main menu.
 */

import React from 'react';
import { useGameStore } from '../store/store.ts';
import {
  Play,
  Pause,
  FastForward,
  Eye,
  GraduationCap,
  BookOpen,
  Save,
  Settings,
  Tag,
  Menu,
} from 'lucide-react';

export const MissionBar: React.FC = () => {
  const mission = useGameStore((s) => s.state.mission);
  const dispatch = useGameStore((s) => s.dispatch);
  const advanceSol = useGameStore((s) => s.advanceSol);
  const activeModal = useGameStore((s) => s.activeModal);
  const setModal = useGameStore((s) => s.setModal);
  const setTutorialStep = useGameStore((s) => s.setTutorialStep);
  const cameraMode = useGameStore((s) => s.cameraMode);
  const toggleCameraMode = useGameStore((s) => s.toggleCameraMode);
  const toggleMainMenu = useGameStore((s) => s.toggleMainMenu);
  const labelsMode = useGameStore((s) => s.labelsMode);
  const cycleLabelsMode = useGameStore((s) => s.cycleLabelsMode);

  // Exactly 10 Sols mission duration
  const progressPercent = Math.min(100, Math.round(((mission.day - 1 + mission.tick / 24) / 10) * 100));

  return (
    <header className="flex flex-nowrap items-center justify-between gap-1.5 sm:gap-2 bg-slate-950/95 border-b border-slate-800 px-2.5 sm:px-3 py-1 h-10 backdrop-blur-md shadow-2xl select-none z-30 whitespace-nowrap overflow-x-auto no-scrollbar w-full font-mono text-xs">
      {/* 1. LEFT: Game Branding & 10-Sol Telemetry */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Brand Badge */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-sky-500/20 border border-sky-400 flex items-center justify-center font-black text-sky-400 text-[10px]">
            LC
          </div>
          <span className="font-bold text-white tracking-wider text-xs">
            LUNAR COMMAND
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-800/80 font-bold hidden md:inline">
            ARTEMIS BASE ALPHA
          </span>
        </div>

        <div className="h-3.5 w-px bg-slate-800 hidden sm:block" />

        {/* Current Sol & Lunar Clock (10 Sols Total) */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
          <span className="text-sky-400 font-bold">SOL {mission.day}</span>
          <span className="text-slate-500">/ 10</span>
          <span className="text-slate-700">|</span>
          <span className="text-white font-bold">{String(mission.tick).padStart(2, '0')}:00 LT</span>
        </div>

        {/* Simulation Progress Bar */}
        <div className="hidden lg:flex items-center gap-1 text-[9px] text-slate-400">
          <div className="w-14 h-1 bg-slate-900 rounded-full border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span>{progressPercent}%</span>
        </div>
      </div>

      {/* 2. CENTER: Simulation Playback & Advance Sol */}
      <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800 shrink-0">
        <button
          onClick={() => dispatch(mission.isPaused ? { type: 'RESUME' } : { type: 'PAUSE' })}
          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
            mission.isPaused
              ? 'bg-amber-500 text-slate-950 font-black shadow animate-pulse'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
          title="Pause / Resume Clock (Spacebar)"
        >
          {mission.isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
          <span className="hidden sm:inline">{mission.isPaused ? 'RESUME' : 'PAUSE'}</span>
        </button>

        <button
          onClick={() => dispatch({ type: 'SET_SPEED', speed: 1 })}
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
            !mission.isPaused && mission.speed === 1
              ? 'bg-sky-500 text-slate-950 font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Normal Speed 1x (Hotkey: 1)"
        >
          1×
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_SPEED', speed: 2 })}
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
            !mission.isPaused && mission.speed === 2
              ? 'bg-sky-500 text-slate-950 font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Fast Speed 2x (Hotkey: 2)"
        >
          2×
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_SPEED', speed: 4 })}
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
            !mission.isPaused && mission.speed === 4
              ? 'bg-sky-500 text-slate-950 font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Ultra Speed 4x (Hotkey: 4)"
        >
          4×
        </button>

        {/* Advance to Next Sol Action */}
        <button
          onClick={advanceSol}
          className="ml-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-600/60 transition-all flex items-center gap-1 cursor-pointer"
          title="Complete remaining hours of current Sol and view Daily Report"
        >
          <FastForward className="w-3 h-3" />
          <span className="hidden md:inline">ADVANCE SOL</span>
        </button>
      </div>

      {/* 3. RIGHT: Camera View & System Actions in 1 Single Sleek Line */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Prominent Helmet Eye View Toggle Button */}
        <button
          onClick={toggleCameraMode}
          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
            cameraMode === 'eye'
              ? 'bg-sky-500 text-slate-950 border-sky-400 font-black shadow-lg shadow-sky-500/20'
              : 'bg-slate-900 border-slate-800 text-sky-400 hover:border-sky-400 hover:text-white'
          }`}
          title="Toggle First-Person Helmet Eye View vs Orbital Base Overview (Hotkey: V)"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{cameraMode === 'eye' ? 'ORBIT VIEW [V]' : 'HELMET POV [V]'}</span>
        </button>

        {/* 3D Waypoint Labels Mode */}
        <button
          onClick={cycleLabelsMode}
          className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-sky-400 text-slate-400 hover:text-white text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
          title={`Cycle 3D In-World Labels: ${labelsMode.toUpperCase()} (Hotkey: L)`}
        >
          <Tag className="w-3 h-3 text-slate-500" />
          <span className="hidden 2xl:inline uppercase">{labelsMode}</span>
        </button>

        {/* Mission Tutorial */}
        <button
          onClick={() => {
            setModal('none');
            setTutorialStep(0);
          }}
          className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-sky-400 text-slate-400 hover:text-sky-400 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
          title="Open Flight Orientation Training Tutorial"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">TUTORIAL</span>
        </button>

        {/* Mission Manual */}
        <button
          onClick={() => setModal(activeModal === 'manual' ? 'none' : 'manual')}
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
            activeModal === 'manual'
              ? 'bg-sky-500 text-slate-950 border-sky-400 font-black'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-sky-400'
          }`}
          title="Open Commander Field Operations Manual"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">MANUAL</span>
        </button>

        {/* Save / Load */}
        <button
          onClick={() => setModal(activeModal === 'save_load' ? 'none' : 'save_load')}
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
            activeModal === 'save_load'
              ? 'bg-sky-500 text-slate-950 border-sky-400 font-black'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-sky-400'
          }`}
          title="Save or Load Mission Progress"
        >
          <Save className="w-3.5 h-3.5" />
          <span className="hidden 2xl:inline">SAVE</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => setModal(activeModal === 'settings' ? 'none' : 'settings')}
          className={`p-1 rounded text-[10px] font-bold transition-all cursor-pointer border ${
            activeModal === 'settings'
              ? 'bg-sky-500 text-slate-950 border-sky-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-sky-400'
          }`}
          title="Graphics and Audio Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* Main Menu Title Screen */}
        <button
          onClick={toggleMainMenu}
          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-sky-400 text-sky-400 hover:text-white text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
          title="Open Main Menu Screen (Hotkey: ESC)"
        >
          <Menu className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">MENU</span>
        </button>
      </div>
    </header>
  );
};
