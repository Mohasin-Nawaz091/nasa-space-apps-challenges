"use client";

import React from "react";
import { useGameStore } from "../../store/gameStore";
import {
  FastForward,
  Radio,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { sounds } from "../../utils/audio";

interface KidBottomBarProps {
  onOpenCrewDrawer: () => void;
  onOpenLogsDrawer: () => void;
}

export function KidBottomBar({ onOpenCrewDrawer, onOpenLogsDrawer }: KidBottomBarProps) {
  const currentDay = useGameStore((s) => s.currentDay);
  const maxDays = useGameStore((s) => s.maxDays);
  const advanceDay = useGameStore((s) => s.advanceDay);
  const isAdvancingDay = useGameStore((s) => s.isAdvancingDay);
  const astronauts = useGameStore((s) => s.astronauts);
  const missionLogs = useGameStore((s) => s.missionLogs);
  const isMissionCompleted = useGameStore((s) => s.isMissionCompleted);
  const isMissionFailed = useGameStore((s) => s.isMissionFailed);
  const activeEvent = useGameStore((s) => s.activeEvent);

  const latestLog = missionLogs[0] || {
    title: "All Systems Nominal",
    message: "Outpost life support running smoothly.",
  };

  const handleAdvance = () => {
    if (isAdvancingDay || isMissionCompleted || isMissionFailed) return;
    sounds.playClick();
    advanceDay();
  };

  return (
    <footer className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none p-4 flex flex-col gap-2 select-none">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Recent Colony Messages Ticker */}
        <div
          onClick={() => {
            sounds.playClick();
            onOpenLogsDrawer();
          }}
          className="flex-1 max-w-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl shadow-xl hover:border-cyan-400 transition cursor-pointer flex items-center gap-3 group"
          title="Click to view all Base Logs"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 text-xl group-hover:scale-105 transition">
            📡
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider block">
              BASE RADIO CHATTER (SOL {latestLog.day || currentDay})
            </span>
            <p className="text-xs text-slate-800 dark:text-slate-200 truncate font-bold">
              {latestLog.title}: <span className="font-normal text-slate-600 dark:text-slate-400">{latestLog.message}</span>
            </p>
          </div>
        </div>

        {/* Center: Crew Health Indicators */}
        <div
          onClick={() => {
            sounds.playClick();
            onOpenCrewDrawer();
          }}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 rounded-2xl shadow-xl hover:border-cyan-400 transition cursor-pointer flex items-center gap-3 shrink-0"
          title="Click to view Astronaut Details"
        >
          <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">
            CREW:
          </span>
          <div className="flex items-center gap-2">
            {astronauts.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px]"
              >
                <span>{a.avatar}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {a.name.split(" ")[0]}
                </span>
                <span
                  className={`text-[9px] font-mono font-black ${
                    a.isSheltered
                      ? "text-red-500"
                      : a.health < 70
                      ? "text-amber-500"
                      : "text-emerald-500"
                  }`}
                >
                  {a.isSheltered ? "SHELTER" : `${a.health}%`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Unmistakable Big Advance Sol Button */}
        <div className="shrink-0">
          <button
            disabled={isAdvancingDay || isMissionCompleted || isMissionFailed}
            onClick={handleAdvance}
            className={`w-full sm:w-auto py-3.5 px-7 rounded-2xl font-black text-sm tracking-wider uppercase flex items-center justify-center gap-3 shadow-2xl transition active:scale-95 ${
              isAdvancingDay
                ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                : isMissionCompleted || isMissionFailed
                ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-emerald-500/40 cursor-pointer animate-pulse"
            }`}
          >
            {isAdvancingDay ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>CALCULATING SOL RECAP...</span>
              </>
            ) : (
              <>
                <span>FINISH TASKS & ADVANCE TO SOL {Math.min(maxDays, currentDay + 1)}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}
