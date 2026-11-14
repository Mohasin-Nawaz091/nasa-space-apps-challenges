/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/ui/Briefing.tsx
 * Stage 1 Morning Briefing: Daily operational situation, environmental challenge,
 * recommended objective, suggested specialist assignment, and colony status telemetry.
 */

import React from 'react';
import { useGameStore } from '../store/store.ts';
import { getDailyBriefingForSol } from '../sim/events.ts';
import {
  Zap,
  Wind,
  Droplets,
  Sprout,
  Compass,
  ArrowRight,
  Sun,
} from 'lucide-react';

export const BriefingModal: React.FC = () => {
  const activeModal = useGameStore((s) => s.activeModal);
  const dismissBriefing = useGameStore((s) => s.dismissBriefing);
  const state = useGameStore((s) => s.state);
  const setActivePlayerCrew = useGameStore((s) => s.setActivePlayerCrew);

  if (activeModal !== 'briefing') return null;

  const sol = state.mission.day;
  const briefing = getDailyBriefingForSol(sol);
  const { resources } = state;

  const specialistNames: Record<string, { name: string; role: string; color: string }> = {
    alex: { name: 'ALEX', role: 'Systems Engineer', color: 'text-sky-400 bg-sky-950/60 border-sky-600/60' },
    sara: { name: 'MIA', role: 'Research Scientist', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-600/60' },
    daniel: { name: 'LEO', role: 'Botanist & Geologist', color: 'text-amber-400 bg-amber-950/60 border-amber-600/60' },
  };

  const spec = specialistNames[briefing.suggestedSpecialist] || specialistNames['alex'];

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 select-none font-mono animate-fadeIn">
      <div className="bg-slate-950 border-2 border-sky-500/80 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl text-slate-200 max-h-[92vh] overflow-y-auto">
        {/* 1. Header Banner */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-400 font-black text-sm">
              LC
            </div>
            <div>
              <div className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                <span>ARTEMIS BASE ALPHA</span>
                <span className="text-slate-600">·</span>
                <span>STAGE 1: MORNING BRIEFING</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-wide">
                SOL {String(sol).padStart(2, '0')} / 10 — {briefing.title}
              </h2>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-bold text-sky-400">
            06:00 LT
          </div>
        </div>

        {/* 2. Operational Situation Narrative */}
        <div className="my-3.5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs leading-relaxed text-slate-300">
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
            Overnight Telemetry & Base Situation:
          </span>
          {briefing.situation}
        </div>

        {/* 3. Challenge & Space Weather Advisory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Today's Main Challenge</span>
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {briefing.challenge}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Sun className="w-3.5 h-3.5 text-sky-400" />
              <span>Environmental & Weather</span>
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {briefing.weatherAdvisory}
            </p>
          </div>
        </div>

        {/* 4. Recommended Objective & Suggested Specialist */}
        <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/40 mb-3.5 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider">
              Recommended Tactical Objective
            </span>
            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${spec.color}`}>
              Suggested Specialist: {spec.name} ({spec.role})
            </span>
          </div>
          <div className="text-white font-bold text-xs mb-1">
            {briefing.recommendedObjective}
          </div>
          <div className="text-[11px] text-sky-300 flex items-center gap-1">
            <span>👉</span>
            <span>{briefing.suggestedAction}</span>
          </div>
        </div>

        {/* 5. Colony Status Snapshot (Power, O2, Water, Food, Crew Health) */}
        <div className="mb-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Colony Resource & Crew Readiness:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[9px] text-slate-400 block">BATTERY</span>
                <span className="font-bold text-white">{Math.round(resources.battery)}%</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Wind className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-[9px] text-slate-400 block">OXYGEN</span>
                <span className="font-bold text-white">{Math.round(resources.oxygen)}%</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-[9px] text-slate-400 block">WATER</span>
                <span className="font-bold text-white">{Math.round(resources.water)}L</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[9px] text-slate-400 block">FOOD</span>
                <span className="font-bold text-white">{Math.round(resources.food)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Footer: Action Confirmation Button */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="text-[11px] text-slate-400">
            Mission Goal: <strong className="text-white">Survive 10 Sols & Reach 60 Research Pts</strong>
          </div>

          <button
            onClick={() => {
              // Pre-select suggested specialist if idle
              if (briefing.suggestedSpecialist) {
                setActivePlayerCrew(briefing.suggestedSpecialist as any);
              }
              dismissBriefing();
            }}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black shadow-xl transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <span>BEGIN SOL {sol} ORDERS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
