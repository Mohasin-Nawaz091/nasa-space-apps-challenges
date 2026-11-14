"use client";

import React, { useState } from "react";
import { useGameStore } from "../../store/gameStore";
import {
  Target,
  CheckCircle2,
  Circle,
  FlaskConical,
  Shield,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
} from "lucide-react";

export function LeftObjectivesPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentDay = useGameStore((s) => s.currentDay);
  const maxDays = useGameStore((s) => s.maxDays);
  const resources = useGameStore((s) => s.resources);
  const astronauts = useGameStore((s) => s.astronauts);
  const activeEvent = useGameStore((s) => s.activeEvent);

  const avgHealth = Math.round(
    astronauts.reduce((acc, a) => acc + a.health, 0) / astronauts.length
  );

  const scienceTarget = resources.targetResearchPoints || 60;
  const sciencePercent = Math.min(
    100,
    Math.round((resources.researchPoints / scienceTarget) * 100)
  );

  // Dynamic daily task for current Sol
  const dailyTasksBySol: { [day: number]: { task: string; done: boolean }[] } = {
    1: [
      { task: "Calibrate ECLSS pumps & solar tracking", done: activeEvent?.isResolved ?? true },
      { task: "Inspect Habitat & Life Support modules", done: true },
      { task: "Check battery power reserves (> 100 kWh)", done: resources.power > 100 },
    ],
    2: [
      { task: "Balance greenhouse photosynthetic grow lights", done: true },
      { task: "Monitor oxygen recycling efficiency", done: resources.oxygen > 50 },
      { task: "Perform routine maintenance on solar arrays", done: true },
    ],
    3: [
      { task: "Prepare Regolith Shelter for solar flare warning", done: true },
      { task: "Verify astronaut dosimeter radiation levels", done: true },
      { task: "Maintain life support water filtration", done: resources.water > 50 },
    ],
    4: [
      { task: "Run Science Lab spectrometry diagnostics", done: resources.researchPoints >= 15 },
      { task: "Conserve battery power during lunar night", done: resources.power > 80 },
      { task: "Audit food rations and nutrition balance", done: resources.food > 20 },
    ],
    5: [
      { task: "Examine regolith core samples in Science Lab", done: true },
      { task: "Repair any module degraded below 85% integrity", done: true },
      { task: "Ensure crew vitals remain above 70%", done: avgHealth >= 70 },
    ],
  };

  const currentTasks = dailyTasksBySol[currentDay] || [
    { task: "Maintain closed-loop ECLSS life support", done: resources.oxygen > 20 && resources.water > 20 },
    { task: "Accumulate NASA scientific research points", done: resources.researchPoints >= 30 },
    { task: "Protect astronauts from lunar space hazards", done: avgHealth >= 50 },
  ];

  if (isCollapsed) {
    return (
      <aside className="absolute left-4 top-20 z-20 pointer-events-auto">
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-xl text-xs font-bold transition active:scale-95"
          title="Open Objectives & Tasks"
        >
          <Target className="w-4 h-4 text-cyan-400" />
          <span>OBJECTIVES</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="absolute left-4 top-20 w-72 md:w-80 z-20 pointer-events-auto flex flex-col bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl text-white overflow-hidden animate-in fade-in slide-in-from-left-6 duration-300">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800/80">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-black tracking-wider uppercase text-cyan-200">
            MISSION DIRECTIVES
          </h2>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded text-slate-400 hover:text-white transition"
          title="Minimize Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3.5 space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto text-xs">
        {/* Core Mission Goal */}
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">SURVIVAL HORIZON</span>
            <span className="text-cyan-300 font-bold">SOL {currentDay} / {maxDays}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${(currentDay / maxDays) * 100}%` }}
            />
          </div>
        </div>

        {/* Science Research Target Progress */}
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-purple-300 font-bold">
              <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
              <span>NASA Research Goal</span>
            </span>
            <span className="font-mono text-purple-200 font-bold">
              {resources.researchPoints} / {scienceTarget} PTS
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full transition-all duration-300"
              style={{ width: `${sciencePercent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 italic">
            Keep Science Lab powered to gain +8 pts per Sol.
          </p>
        </div>

        {/* Crew Vitals Target */}
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Crew Health Target</span>
          </span>
          <span
            className={`font-mono font-bold ${
              avgHealth >= 70
                ? "text-emerald-400"
                : avgHealth >= 50
                ? "text-amber-400"
                : "text-red-400"
            }`}
          >
            {avgHealth}% &gt; 50%
          </span>
        </div>

        {/* Sol Tasks Checklist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Sol {currentDay} Daily Checklist</span>
            </span>
          </div>
          <div className="space-y-1.5">
            {currentTasks.map((t, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80"
              >
                {t.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                )}
                <span
                  className={`leading-tight text-[11px] ${
                    t.done ? "text-slate-300 line-through opacity-80" : "text-slate-200"
                  }`}
                >
                  {t.task}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
