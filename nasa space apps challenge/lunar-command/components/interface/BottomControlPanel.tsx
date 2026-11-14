"use client";

import React from "react";
import { useGameStore } from "../../store/gameStore";
import {
  FastForward,
  Radio,
  Users,
  Shield,
  HelpCircle,
  Sparkles,
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { sounds } from "../../utils/audio";

interface BottomControlPanelProps {
  onOpenHowToPlay: () => void;
  onOpenCrewDrawer: () => void;
  onOpenLogsDrawer: () => void;
}

export function BottomControlPanel({
  onOpenHowToPlay,
  onOpenCrewDrawer,
  onOpenLogsDrawer,
}: BottomControlPanelProps) {
  const currentDay = useGameStore((s) => s.currentDay);
  const maxDays = useGameStore((s) => s.maxDays);
  const isPaused = useGameStore((s) => s.isPaused);
  const togglePause = useGameStore((s) => s.togglePause);
  const advanceDay = useGameStore((s) => s.advanceDay);
  const isAdvancingDay = useGameStore((s) => s.isAdvancingDay);
  const astronauts = useGameStore((s) => s.astronauts);
  const missionLogs = useGameStore((s) => s.missionLogs);
  const activeEvent = useGameStore((s) => s.activeEvent);
  const isMissionCompleted = useGameStore((s) => s.isMissionCompleted);
  const isMissionFailed = useGameStore((s) => s.isMissionFailed);
  const setTutorialActive = useGameStore((s) => s.setTutorialActive);

  const latestLog = missionLogs[0] || {
    title: "All Systems Nominal",
    message: "Outpost life support running normal routine.",
  };

  const handleAdvance = () => {
    if (isAdvancingDay || isMissionCompleted || isMissionFailed) return;
    sounds.playClick();
    advanceDay();
  };

  return (
    <footer className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none p-3 flex flex-col gap-2">
      {/* Main Bottom Strip */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 pointer-events-auto">
        {/* Left: Latest Event Log / Telemetry Ticker */}
        <div
          onClick={onOpenLogsDrawer}
          className="flex-1 max-w-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 hover:border-cyan-500/50 p-2.5 rounded-xl shadow-lg cursor-pointer transition flex items-center gap-3 group"
          title="Click to open Full Mission Logs"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                LATEST TELEMETRY
              </span>
              <span className="text-[10px] text-slate-400">
                Sol {latestLog.day || currentDay}
              </span>
            </div>
            <p className="text-xs text-slate-200 truncate font-medium">
              <strong className="text-cyan-200">{latestLog.title}:</strong>{" "}
              {latestLog.message}
            </p>
          </div>
        </div>

        {/* Center: Crew Activity Notifications */}
        <div
          onClick={onOpenCrewDrawer}
          className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 hover:border-cyan-500/50 px-3 py-2 rounded-xl shadow-lg cursor-pointer transition flex items-center gap-3 shrink-0"
          title="Click to view detailed Crew Status"
        >
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">CREW:</span>
          </div>
          <div className="flex items-center gap-2">
            {astronauts.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px]"
              >
                <span>{a.avatar}</span>
                <div className="flex flex-col">
                  <span className="text-slate-200 font-bold leading-tight">
                    {a.name.split(" ")[1] || a.name}
                  </span>
                  <span
                    className={`text-[9px] font-mono leading-none ${
                      a.isSheltered
                        ? "text-red-400 font-bold"
                        : a.health < 70
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {a.isSheltered ? "SHELTER" : `${a.health}% HP`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Advance Sol Action Button & Pause */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Pause / Resume Button */}
          <button
            onClick={() => {
              sounds.playClick();
              togglePause();
            }}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
            title={isPaused ? "Resume Simulation [Space]" : "Pause Simulation [Space]"}
          >
            {isPaused ? (
              <Play className="w-5 h-5 text-emerald-400" />
            ) : (
              <Pause className="w-5 h-5 text-amber-400" />
            )}
          </button>

          {/* Big Advance to Next Sol Button */}
          <button
            disabled={isAdvancingDay || isMissionCompleted || isMissionFailed}
            onClick={handleAdvance}
            className={`flex-1 sm:flex-initial py-2.5 px-5 rounded-xl font-black text-xs md:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-xl transition active:scale-95 ${
              isAdvancingDay
                ? "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
                : isMissionCompleted || isMissionFailed
                ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-950/80 cursor-pointer animate-pulse"
            }`}
          >
            {isAdvancingDay ? (
              <>
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>PROCESSING SIMULATION...</span>
              </>
            ) : (
              <>
                <FastForward className="w-5 h-5 text-cyan-200" />
                <span>ADVANCE TO SOL {Math.min(maxDays, currentDay + 1)}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-strip: Quick Controls Bar & Tutorial Shortcuts */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] md:text-[11px] text-slate-400 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 pointer-events-auto">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-cyan-400 font-bold uppercase">CONTROLS:</span>
          <span>
            <strong className="text-slate-200">[WASD / Drag]</strong> Pan / Orbit
          </span>
          <span className="hidden sm:inline">•</span>
          <span>
            <strong className="text-slate-200">[1-6]</strong> Select Module
          </span>
          <span className="hidden sm:inline">•</span>
          <span>
            <strong className="text-slate-200">[F]</strong> Interior
          </span>
          <span className="hidden sm:inline">•</span>
          <span>
            <strong className="text-slate-200">[Esc]</strong> Colony View
          </span>
          <span className="hidden sm:inline">•</span>
          <span>
            <strong className="text-slate-200">[Space]</strong> Pause
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              setTutorialActive(true, 1);
            }}
            className="flex items-center gap-1 text-cyan-300 hover:text-white transition font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Flight Tutorial</span>
          </button>

          <span>•</span>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenHowToPlay();
            }}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition font-semibold"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Manual & Guide</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
