/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/ui/Report.tsx
 * Stage 5 Daily Sol Report (Production/Consumption deltas, repairs, health changes)
 * AND Final Sol 10 Mission Certification Debriefing with Gold/Silver/Bronze ranks.
 */

import React from 'react';
import { useGameStore } from '../store/store.ts';
import { getCrewDisplayName } from '../sim/rules/crew.ts';
import {
  Zap,
  Wind,
  Droplets,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FlaskConical,
} from 'lucide-react';

export const ReportModal: React.FC = () => {
  const state = useGameStore((s) => s.state);
  const activeModal = useGameStore((s) => s.activeModal);
  const dismissDailyReport = useGameStore((s) => s.dismissDailyReport);
  const restartMission = useGameStore((s) => s.restartMission);
  const setModal = useGameStore((s) => s.setModal);

  const isMissionOver = state.mission.status !== 'in_progress';
  const dailyReport = state.dailyReport;

  // Only render if activeModal is 'report' or mission has ended
  if (activeModal !== 'report' && !isMissionOver) return null;

  // ==========================================
  // VIEW 1: DAILY SOL REPORT (Stage 5 of 5)
  // ==========================================
  if (!isMissionOver && dailyReport) {
    const nextSol = dailyReport.sol + 1;
    const netOxygen = dailyReport.oxygenProduced - dailyReport.oxygenConsumed;
    const netWater = dailyReport.waterRecycled - dailyReport.waterConsumed;
    const netFood = dailyReport.foodHarvested - dailyReport.foodConsumed;
    const netPower = dailyReport.powerProduced - dailyReport.powerConsumed;

    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 select-none font-mono animate-fadeIn">
        <div className="bg-slate-950 border-2 border-sky-500/80 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl text-slate-200 max-h-[92vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-400 font-black text-sm">
                LC
              </div>
              <div>
                <div className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span>ARTEMIS BASE ALPHA</span>
                  <span className="text-slate-600">·</span>
                  <span>STAGE 5: END OF DAY REPORT</span>
                </div>
                <h2 className="text-xl font-black text-white tracking-wide">
                  SOL {String(dailyReport.sol).padStart(2, '0')} / 10 — SUMMARY & TELEMETRY
                </h2>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400">
              24:00 LT
            </div>
          </div>

          {/* Daily Sol Summary */}
          <div className="my-3.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
              Mission Log Summary:
            </span>
            {dailyReport.eventSummary || 'Nominal 24-hour cycle completed across base sectors.'}
          </div>

          {/* 24-Hour Resource Deltas */}
          <div className="mb-3.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              24-Hour Production & Consumption Net Deltas:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {/* Oxygen */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-sky-400" />
                    <span>Oxygen</span>
                  </span>
                  <span className="font-bold text-white">{Math.round(state.resources.oxygen)}%</span>
                </div>
                <div className={`text-xs font-bold ${netOxygen >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {netOxygen >= 0 ? '+' : ''}{netOxygen.toFixed(1)} O₂
                </div>
              </div>

              {/* Water */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                    <span>Water</span>
                  </span>
                  <span className="font-bold text-white">{Math.round(state.resources.water)}L</span>
                </div>
                <div className={`text-xs font-bold ${netWater >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {netWater >= 0 ? '+' : ''}{netWater.toFixed(1)} L
                </div>
              </div>

              {/* Food */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span className="flex items-center gap-1">
                    <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Food</span>
                  </span>
                  <span className="font-bold text-white">{Math.round(state.resources.food)}%</span>
                </div>
                <div className={`text-xs font-bold ${netFood >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {netFood >= 0 ? '+' : ''}{netFood.toFixed(1)} kg
                </div>
              </div>

              {/* Power / Battery */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Battery</span>
                  </span>
                  <span className="font-bold text-white">{Math.round(state.resources.battery)}%</span>
                </div>
                <div className={`text-xs font-bold ${netPower >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {netPower >= 0 ? '+' : ''}{netPower.toFixed(1)} kWh
                </div>
              </div>
            </div>
          </div>

          {/* Research & Accomplishments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-sky-400" />
                <span>Science Points Gained</span>
              </span>
              <div className="text-lg font-black text-white">
                +{dailyReport.researchGained} <span className="text-xs text-sky-400 font-bold">PTS</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Total Mission Research: <strong className="text-white">{state.resources.science} / 60 pts</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Completed Tasks & Repairs</span>
              </span>
              {dailyReport.completedTasks && dailyReport.completedTasks.length > 0 ? (
                <ul className="text-[11px] text-slate-300 space-y-0.5">
                  {dailyReport.completedTasks.map((t: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-1">
                      <span className="text-emerald-400">✔</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-[10px] text-slate-500 italic">No major overhaul tasks completed today.</div>
              )}
            </div>
          </div>

          {/* Warnings (if any) */}
          {dailyReport.warnings && dailyReport.warnings.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/60 text-xs text-amber-200 mb-3.5">
              <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1 mb-1 text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Operational Alerts for Tomorrow:</span>
              </span>
              <ul className="space-y-0.5 text-[11px]">
                {dailyReport.warnings.map((w: string, idx: number) => (
                  <li key={idx}>• {w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Crew Biometrics Status */}
          <div className="mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Crew Physical Conditioning & Stamina Status:
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['alex', 'sara', 'daniel'] as const).map((cid) => {
                const member = state.crew[cid];
                if (!member) return null;
                const info = getCrewDisplayName(member);
                return (
                  <div key={cid} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-[11px]">{info.shortName}</div>
                      <div className="text-[9px] text-slate-400">{info.shortRole}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-[11px] ${member.health < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {member.health} HP
                      </div>
                      <div className="text-[9px] text-slate-400">8h Rested</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="text-[11px] text-slate-400">
              Next Phase: <strong className="text-sky-300">Sol {nextSol} Morning Briefing</strong>
            </div>

            <button
              onClick={dismissDailyReport}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black shadow-xl transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <span>ADVANCE TO SOL {nextSol} BRIEFING</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: FINAL SOL 10 MISSION CERTIFICATION
  // ==========================================
  const score = state.mission.score;
  const status = state.mission.status;

  const isAccomplished = status === 'mission_accomplished';
  const allCrewAlive = Object.values(state.crew).every((c) => c.health > 0);
  const healthAbove50 = Object.values(state.crew).every((c) => c.health >= 50);
  const lifeSupportOperational = state.systems.lifeSupport.condition > 0 && !state.systems.lifeSupport.isFaulted;
  const scienceObjectiveMet = state.resources.science >= 60;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 select-none font-mono animate-fadeIn">
      <div className="bg-slate-950 border-2 border-sky-500 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl text-slate-200 max-h-[92vh] overflow-y-auto">
        {/* Certification Title Header */}
        <div className="text-center pb-4 border-b border-slate-800">
          <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-950 text-sky-300 border border-sky-600 mb-2">
            LUNAR COMMAND · NASA ARTEMIS EXPEDITION CERTIFICATION
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">
            {isAccomplished ? '🏆 MISSION ACCOMPLISHED!' : '⚠️ MISSION DEBRIEFING'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {state.mission.endingReason ?? '10-Sol Artemis Base Alpha expedition concluded.'}
          </p>
        </div>

        {/* Score & Evaluation Rank Badge */}
        {score && (
          <div className="my-4 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Final Mission Evaluation Score
              </span>
              <div className="text-3xl font-black text-white mt-0.5">
                {score.total} <span className="text-base text-slate-500 font-normal">/ 1000 pts</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Certification Rank
              </span>
              <div
                className={`text-lg font-black px-3 py-1 rounded-lg mt-1 inline-block ${
                  score.band === 'Gold Commander'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500'
                    : score.band === 'Silver'
                    ? 'bg-slate-300/20 text-slate-200 border border-slate-400'
                    : score.band === 'Bronze'
                    ? 'bg-amber-700/20 text-amber-500 border border-amber-700'
                    : 'bg-slate-700/20 text-slate-400 border border-slate-600'
                }`}
              >
                {score.band}
              </div>
            </div>
          </div>
        )}

        {/* Victory Criteria Verification Checklist */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 mb-4 text-xs">
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-2">
            Sol 10 Victory Mandate Verification:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className={allCrewAlive ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {allCrewAlive ? '✔' : '✖'}
              </span>
              <span>All 3 astronauts alive & fit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={healthAbove50 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {healthAbove50 ? '✔' : '✖'}
              </span>
              <span>Crew health maintained above 50%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={lifeSupportOperational ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {lifeSupportOperational ? '✔' : '✖'}
              </span>
              <span>ECLSS life support operational</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={scienceObjectiveMet ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {scienceObjectiveMet ? '✔' : '✖'}
              </span>
              <span>Research: {state.resources.science} / 60 points</span>
            </div>
          </div>
        </div>

        {/* 6 Simulation Categories Breakdown */}
        {score && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 flex items-center justify-between text-[10px]">
                <span>Crew Safety</span>
                <span className="font-bold text-white">{score.crewSafety} / 300</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${(score.crewSafety / 300) * 100}%` }} />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 flex items-center justify-between text-[10px]">
                <span>Life Support</span>
                <span className="font-bold text-white">{score.lifeSupport} / 200</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: `${(score.lifeSupport / 200) * 100}%` }} />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 flex items-center justify-between text-[10px]">
                <span>Power Systems</span>
                <span className="font-bold text-white">{score.power} / 150</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${(score.power / 150) * 100}%` }} />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 flex items-center justify-between text-[10px]">
                <span>Radiation Defense</span>
                <span className="font-bold text-white">{score.radiationPreparedness} / 150</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${(score.radiationPreparedness / 150) * 100}%` }} />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 flex items-center justify-between text-[10px]">
                <span>Food & Water</span>
                <span className="font-bold text-white">{score.foodAndWater} / 100</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-cyan-500" style={{ width: `${(score.foodAndWater / 100) * 100}%` }} />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 flex items-center justify-between text-[10px]">
                <span>Science Research</span>
                <span className="font-bold text-white">{score.science} / 100</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-violet-500" style={{ width: `${(score.science / 100) * 100}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Replay Controls */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              restartMission(state.mission.seed);
              setModal('none');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            🔄 Replay Seed ({state.mission.seed})
          </button>
          <button
            onClick={() => {
              restartMission();
              setModal('none');
            }}
            className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            🚀 Launch New 10-Sol Expedition
          </button>
        </div>
      </div>
    </div>
  );
};
