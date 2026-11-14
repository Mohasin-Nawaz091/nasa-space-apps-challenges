"use client";

import React from "react";
import { useGameStore } from "../../store/gameStore";
import { Zap, Heart, User, CheckCircle, Navigation, Wrench } from "lucide-react";
import { sounds } from "../../utils/audio";

export function CrewSelectorWidget() {
  const astronauts = useGameStore((s) => s.astronauts);
  const selectedAstronautId = useGameStore((s) => s.selectedAstronautId);
  const selectAstronaut = useGameStore((s) => s.selectAstronaut);
  const cameraMode = useGameStore((s) => s.cameraMode);

  if (cameraMode === "interior") return null;

  return (
    <div className="fixed bottom-20 left-4 z-30 flex flex-col gap-2 max-w-xs select-none">
      <div className="text-[11px] font-black uppercase tracking-wider text-cyan-300 drop-shadow flex items-center gap-1.5 px-1">
        <User className="w-3.5 h-3.5 text-cyan-400" />
        <span>Artemis Crew Command</span>
      </div>

      <div className="flex gap-2">
        {astronauts.map((a) => {
          const isSelected = selectedAstronautId === a.id;
          return (
            <button
              key={a.id}
              onClick={() => {
                sounds.playClick();
                if (isSelected) {
                  selectAstronaut(null);
                } else {
                  selectAstronaut(a.id);
                }
              }}
              className={`group relative p-2 rounded-2xl flex flex-col items-center gap-1.5 transition-all duration-200 border text-left cursor-pointer active:scale-95 ${
                isSelected
                  ? "bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/70 shadow-xl shadow-cyan-950/60 scale-105"
                  : "bg-slate-950/85 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md backdrop-blur-sm"
              }`}
              style={{ width: "96px" }}
              title={`Select ${a.name} (${a.role})`}
            >
              {/* Avatar Icon */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner border transition group-hover:scale-105"
                style={{
                  borderColor: a.accentColor,
                  backgroundColor: `${a.accentColor}25`,
                }}
              >
                {a.avatar}
              </div>

              {/* Name & Role */}
              <div className="w-full text-center">
                <div className="font-black text-xs text-white leading-tight truncate">
                  {a.name}
                </div>
                <div
                  className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded mt-0.5 text-white truncate"
                  style={{ backgroundColor: a.accentColor }}
                >
                  {a.role}
                </div>
              </div>

              {/* Mini Health & Energy Bars */}
              <div className="w-full space-y-1">
                {/* Health Bar */}
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden flex items-center">
                  <div
                    className={`h-full ${
                      a.health > 70 ? "bg-emerald-400" : a.health > 40 ? "bg-amber-400" : "bg-red-500"
                    }`}
                    style={{ width: `${a.health}%` }}
                  />
                </div>

                {/* Energy Bar */}
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden flex items-center">
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${a.energy}%` }}
                  />
                </div>
              </div>

              {/* Current Activity Status Pill */}
              <div className="w-full flex items-center justify-center gap-1 text-[9px] font-mono text-slate-300">
                {a.currentTask ? (
                  <span className="text-amber-400 font-bold truncate flex items-center gap-0.5">
                    <Wrench className="w-2.5 h-2.5 inline" /> Work
                  </span>
                ) : a.status === "Walking" ? (
                  <span className="text-cyan-300 font-bold truncate flex items-center gap-0.5">
                    <Navigation className="w-2.5 h-2.5 inline" /> Move
                  </span>
                ) : a.status === "Needs Attention" ? (
                  <span className="text-red-400 font-bold truncate">Tired</span>
                ) : (
                  <span className="text-emerald-400 truncate flex items-center gap-0.5">
                    <CheckCircle className="w-2.5 h-2.5 inline" /> Ready
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
