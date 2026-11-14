"use client";

import React from "react";
import { useGameStore } from "../../store/gameStore";
import {
  Trophy,
  AlertTriangle,
  RotateCcw,
  Award,
  CheckCircle,
  Activity,
  Zap,
  Wind,
  Droplet,
  Utensils,
} from "lucide-react";

export function MissionReportModal() {
  const isMissionCompleted = useGameStore((s) => s.isMissionCompleted);
  const isMissionFailed = useGameStore((s) => s.isMissionFailed);
  const failureReason = useGameStore((s) => s.failureReason);
  const currentDay = useGameStore((s) => s.currentDay);
  const resources = useGameStore((s) => s.resources);
  const astronauts = useGameStore((s) => s.astronauts);
  const restartMission = useGameStore((s) => s.restartMission);

  if (!isMissionCompleted && !isMissionFailed) return null;

  const avgHealth = Math.round(
    astronauts.reduce((acc, a) => acc + a.health, 0) / astronauts.length
  );

  // Calculate final score
  const survivalScore = currentDay * 50;
  const healthScore = avgHealth * 2;
  const researchScore = Math.round(resources.researchPoints * 2.5);
  const resourceReserveScore = Math.min(
    150,
    Math.round(
      (resources.power / 500) * 40 +
        (resources.oxygen / 300) * 40 +
        (resources.water / 400) * 40 +
        (resources.food / 200) * 30
    )
  );

  const totalScore = isMissionFailed
    ? Math.round((survivalScore + healthScore) * 0.5)
    : Math.min(1000, survivalScore + healthScore + researchScore + resourceReserveScore);

  let rankTitle = "Certified Junior Astronaut";
  let rankBadge = "🥉 Bronze Artemis Laurel";
  let rankColor = "text-amber-400";

  if (totalScore >= 880) {
    rankTitle = "Master Lunar Outpost Commander";
    rankBadge = "🥇 Gold Artemis Laurel";
    rankColor = "text-yellow-300";
  } else if (totalScore >= 720) {
    rankTitle = "Senior Lunar Systems Engineer";
    rankBadge = "🥈 Silver Flight Wings";
    rankColor = "text-cyan-300";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl p-6 text-white text-center">
        {/* Header Icon */}
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-lg">
          {isMissionCompleted ? (
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 flex items-center justify-center text-slate-950 animate-bounce">
              <Trophy className="w-9 h-9" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-950 border border-red-500 flex items-center justify-center text-red-400 animate-pulse">
              <AlertTriangle className="w-9 h-9" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black tracking-wide text-white mb-1">
          {isMissionCompleted
            ? "10-DAY LUNAR EXPEDITION CERTIFIED!"
            : "MISSION ABORT & CREW EVACUATION"}
        </h2>
        <p className="text-xs text-slate-400 font-mono mb-4">
          SHACKLETON CRATER TELEMETRY DEBRIEF — SOL {currentDay} OF 10
        </p>

        {/* Failure reason explanation if failed */}
        {isMissionFailed && failureReason && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 text-left">
            <strong>Houston Flight Controller Report:</strong> {failureReason}
          </div>
        )}

        {/* Score & Badge Card */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 mb-5">
          <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">
            Overall Mission Score
          </div>
          <div className="text-4xl font-black text-cyan-400 font-mono tracking-tight mb-1">
            {totalScore} <span className="text-sm font-sans text-slate-500">/ 1000 PTS</span>
          </div>
          <div className={`text-sm font-bold ${rankColor} flex items-center justify-center gap-1.5`}>
            <Award className="w-4 h-4" />
            <span>{rankBadge}: {rankTitle}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5 text-left text-xs font-mono">
          <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400">SURVIVAL</span>
            <div className="text-sm font-bold text-white">{currentDay} / 10 Sols</div>
          </div>
          <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400">AVG HEALTH</span>
            <div className="text-sm font-bold text-emerald-400">{avgHealth}%</div>
          </div>
          <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400">RESEARCH</span>
            <div className="text-sm font-bold text-purple-400">{resources.researchPoints} Pts</div>
          </div>
          <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400">BATTERY</span>
            <div className="text-sm font-bold text-amber-400">{resources.power} kWh</div>
          </div>
        </div>

        {/* Key Engineering Lessons Learned */}
        <div className="text-left bg-cyan-950/30 p-3.5 rounded-xl border border-cyan-800/40 text-xs mb-5 space-y-1.5">
          <div className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>WHAT WE LEARNED FROM THIS EXPEDITION:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
            <li>Closed-loop life support (recycling water and scrubbed CO2) is vital when supplies are millions of miles from Earth.</li>
            <li>Solar arrays require dust mitigation to maintain power output against sticky electrostatic lunar regolith.</li>
            <li>Two meters of sintered regolith provide essential shielding against dangerous solar coronal mass ejections.</li>
          </ul>
        </div>

        {/* Replay Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => restartMission("ARTEMIS-" + Math.floor(Math.random() * 9000 + 1000))}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/60 transition active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN (NEW SEED)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
