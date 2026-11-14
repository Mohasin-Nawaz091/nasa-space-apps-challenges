/**
 * LUNAR COMMAND — COMPLETE VISUAL REDESIGN
 * src/ui/MainMenu.tsx
 * Cinematic Space Game Main Menu inspired by Reference 1 (Space Nomads).
 * High-contrast deep space aesthetic, realistic Earth & Moon vistas,
 * and professional PC game title navigation.
 */

import React, { useState } from 'react';
import { useGameStore } from '../store/store.ts';
import { eventBus } from '../store/bus.ts';
import {
  Play,
  RotateCcw,
  Sliders,
  BookOpen,
  Settings as SettingsIcon,
  Database,
  Shield,
  Compass,
  Zap,
  X,
} from 'lucide-react';

export const MainMenu: React.FC = () => {
  const mainMenuOpen = useGameStore((s) => s.mainMenuOpen);
  const setMainMenuOpen = useGameStore((s) => s.setMainMenuOpen);
  const hasSavedGame = useGameStore((s) => s.hasSavedGame());
  const loadGame = useGameStore((s) => s.loadGame);
  const restartMission = useGameStore((s) => s.restartMission);
  const setModal = useGameStore((s) => s.setModal);
  const mission = useGameStore((s) => s.state.mission);

  const [scenarioMode, setScenarioMode] = useState(false);

  if (!mainMenuOpen) return null;

  const playHoverSound = () => {
    eventBus.emit('sound:play', { name: 'click' });
  };

  const handleNewMission = (difficulty: 'cadet' | 'explorer' | 'commander' = 'commander') => {
    eventBus.emit('sound:play', { name: 'alert' });
    restartMission(undefined, difficulty);
    setMainMenuOpen(false);
  };

  const handleContinue = () => {
    eventBus.emit('sound:play', { name: 'click' });
    if (hasSavedGame) {
      loadGame();
    }
    setMainMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-between p-8 md:p-16 select-none overflow-hidden bg-slate-950/95 backdrop-blur-2xl text-slate-100 font-mono animate-fadeIn">
      {/* Cinematic Starfield & Earth Atmosphere Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Space Background Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-slate-950 to-black" />

        {/* Cinematic Distant Earth with Atmospheric Glow */}
        <div className="absolute -top-32 -right-32 w-[540px] h-[540px] rounded-full bg-gradient-to-br from-sky-400/20 via-blue-700/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-12 right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-slate-950 via-blue-950 to-sky-500/30 border border-sky-400/20 shadow-[0_0_80px_rgba(56,189,248,0.25)] hidden lg:block overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(56,189,248,0.4),_transparent_70%)]" />
          <div className="absolute bottom-2 left-4 text-[9px] text-sky-300/40 tracking-widest font-sans uppercase">
            Earth · 384,400 KM
          </div>
        </div>

        {/* Tactical Grid / Compass Accent Lines */}
        <div className="absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        <div className="absolute inset-x-0 bottom-24 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
      </div>

      {/* Header: Title & Subtitle */}
      <header className="relative z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="px-2.5 py-0.5 rounded bg-sky-500/20 border border-sky-400 text-sky-400 text-xs font-bold tracking-widest uppercase">
              Tactical Colony Survival
            </div>
            <div className="text-slate-500 text-xs">VER 2.4.0 · ARTEMIS SPEC</div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-wider text-white drop-shadow-md">
            LUNAR COMMAND
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-sans tracking-wide mt-1">
            ARTEMIS BASE ALPHA — 30-SOL SOUTH POLE EXPEDITION
          </p>
        </div>

        {/* Close / Return Button */}
        <button
          onClick={() => setMainMenuOpen(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-sky-400 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-xs cursor-pointer"
          title="Return to Colony View (ESC)"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">RETURN [ESC]</span>
        </button>
      </header>

      {/* Center Navigation Menu Stack */}
      <main className="relative z-10 max-w-lg my-auto py-8">
        {!scenarioMode ? (
          <div className="space-y-3">
            {/* 1. CONTINUE MISSION */}
            <button
              onMouseEnter={playHoverSound}
              onClick={handleContinue}
              className="group w-full flex items-center justify-between px-6 py-4 rounded-xl border border-slate-700/80 hover:border-sky-400 bg-slate-900/80 hover:bg-slate-850 hover:shadow-[0_0_25px_rgba(56,189,248,0.2)] transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-400/60 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    CONTINUE MISSION
                  </div>
                  <div className="text-xs text-slate-400 font-sans">
                    Resume expedition at Sol {mission.day} · {String(mission.tick).padStart(2, '0')}:00 LT
                  </div>
                </div>
              </div>
              <span className="text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                ➔
              </span>
            </button>

            {/* 2. NEW MISSION */}
            <button
              onMouseEnter={playHoverSound}
              onClick={() => handleNewMission('commander')}
              className="group w-full flex items-center justify-between px-6 py-4 rounded-xl border border-slate-800 hover:border-amber-400 bg-slate-900/50 hover:bg-slate-850 transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    NEW MISSION
                  </div>
                  <div className="text-xs text-slate-400 font-sans">
                    Launch fresh 30-day expedition at Shackleton Crater
                  </div>
                </div>
              </div>
              <span className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                ➔
              </span>
            </button>

            {/* 3. MISSION SELECTION & SCENARIOS */}
            <button
              onMouseEnter={playHoverSound}
              onClick={() => setScenarioMode(true)}
              className="group w-full flex items-center justify-between px-6 py-4 rounded-xl border border-slate-800 hover:border-emerald-400 bg-slate-900/50 hover:bg-slate-850 transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    MISSION SELECTION
                  </div>
                  <div className="text-xs text-slate-400 font-sans">
                    Select difficulty tier: Cadet, Explorer, or Commander
                  </div>
                </div>
              </div>
              <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                ➔
              </span>
            </button>

            {/* 4. OPERATIONS MANUAL */}
            <button
              onMouseEnter={playHoverSound}
              onClick={() => {
                setModal('manual');
                setMainMenuOpen(false);
              }}
              className="group w-full flex items-center justify-between px-6 py-3.5 rounded-xl border border-slate-800 hover:border-slate-600 bg-slate-900/40 hover:bg-slate-850 transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                    OPERATIONS MANUAL
                  </div>
                  <div className="text-xs text-slate-400 font-sans">
                    NASA flight rules, ECLSS management, and survival guide
                  </div>
                </div>
              </div>
            </button>

            {/* 5. SETTINGS & NASA DATA IN ROW */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onMouseEnter={playHoverSound}
                onClick={() => {
                  setModal('settings');
                  setMainMenuOpen(false);
                }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-slate-800 hover:border-slate-600 bg-slate-900/30 hover:bg-slate-850 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <SettingsIcon className="w-4 h-4 text-sky-400" />
                <span>SETTINGS</span>
              </button>

              <button
                onMouseEnter={playHoverSound}
                onClick={() => {
                  setModal('datasources');
                  setMainMenuOpen(false);
                }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-slate-800 hover:border-slate-600 bg-slate-900/30 hover:bg-slate-850 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>NASA CREDITS</span>
              </button>
            </div>
          </div>
        ) : (
          /* Difficulty & Scenario Selector Sub-Menu */
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                SELECT MISSION DIFFICULTY
              </span>
              <button
                onClick={() => setScenarioMode(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ← Back
              </button>
            </div>

            {/* Cadet */}
            <button
              onClick={() => handleNewMission('cadet')}
              className="w-full p-4 rounded-xl border border-slate-800 hover:border-emerald-400 bg-slate-900/60 hover:bg-slate-850 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white group-hover:text-emerald-300 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" /> CADET EXPEDITION
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  RELAXED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Generous power generation, resilient crop yields, and mild space weather. Ideal for learning base survival mechanics.
              </p>
            </button>

            {/* Explorer */}
            <button
              onClick={() => handleNewMission('explorer')}
              className="w-full p-4 rounded-xl border border-slate-800 hover:border-sky-400 bg-slate-900/60 hover:bg-slate-850 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white group-hover:text-sky-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-sky-400" /> EXPLORER MISSION
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/40">
                  BALANCED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Standard NASA mission parameters. Normal battery degradation, realistic solar angles, and periodic solar proton events.
              </p>
            </button>

            {/* Commander */}
            <button
              onClick={() => handleNewMission('commander')}
              className="w-full p-4 rounded-xl border border-slate-800 hover:border-amber-400 bg-slate-900/60 hover:bg-slate-850 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" /> COMMANDER SURVIVAL
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  HARDCORE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Strict NASA life-support tolerances. 14-day lunar night conservation, micrometeorite strikes, and intense solar flares.
              </p>
            </button>
          </div>
        )}
      </main>

      {/* Footer: Telemetry & Attribution */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-sans border-t border-slate-900 pt-4">
        <div>
          Powered by real NASA Open Science Data (OSDR), Apollo missions & Artemis telemetry.
        </div>
        <div className="font-mono text-[10px] text-slate-600">
          COORDINATES: 89.9°S, 0.0°E (SHACKLETON CRATER RIM)
        </div>
      </footer>
    </div>
  );
};
