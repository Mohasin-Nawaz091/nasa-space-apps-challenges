"use client";

import React from "react";
import { useGameStore } from "../../store/gameStore";
import {
  Rocket,
  Shield,
  Home,
  Wind,
  Sprout,
  Sun,
  ShieldAlert,
  FlaskConical,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { sounds } from "../../utils/audio";

export function MissionBriefingModal() {
  const isBriefingOpen = useGameStore((s) => s.isBriefingOpen);
  const setBriefingOpen = useGameStore((s) => s.setBriefingOpen);
  const setTutorialActive = useGameStore((s) => s.setTutorialActive);
  const astronauts = useGameStore((s) => s.astronauts);

  if (!isBriefingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-cyan-500/50 rounded-3xl shadow-2xl p-6 md:p-8 text-white space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-xl font-black tracking-wide text-cyan-200">
                FLIGHT DIRECTIVE: SHACKLETON OUTPOST ALPHA
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                10-SOL SURVIVAL EXPEDITION AT THE LUNAR SOUTH POLE
              </p>
            </div>
          </div>
        </div>

        {/* Story Intro */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs md:text-sm text-slate-300 leading-relaxed">
          Welcome to the high frontier, Commander! You are stationed at the rim of Shackleton Crater. Your mission is to maintain colony life support, protect your crew from lethal solar flares, and accumulate scientific research across 10 simulated Sols.
        </div>

        {/* 3 Astronauts Cards */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Your Artemis Crew Roster</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {astronauts.map((a) => (
              <div
                key={a.id}
                className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{a.avatar}</span>
                  <div>
                    <strong className="block text-cyan-300 text-xs">{a.name}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">{a.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6 Facilities Summary */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Home className="w-4 h-4 text-emerald-400" />
            <span>Six Core Colony Modules</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Habitat (Living & Rest)</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>ECLSS (O2 & Water Loop)</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Greenhouse (Crops)</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Solar Array (Power)</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>Storm Shelter (Radiation)</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Science Lab (Research)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => {
              sounds.playClick();
              setBriefingOpen(false);
              setTutorialActive(true, 1);
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border border-cyan-800 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>PLAY TUTORIAL FIRST (RECOMMENDED)</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setBriefingOpen(false);
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-cyan-950/70 transition"
          >
            <span>START EXPEDITION</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
