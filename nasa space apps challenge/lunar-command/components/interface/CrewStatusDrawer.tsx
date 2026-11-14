"use client";

import React, { useEffect } from "react";
import { useGameStore } from "../../store/gameStore";
import { X, Shield, Activity, Radio, AlertOctagon, ArrowLeft, Zap, Crosshair } from "lucide-react";
import { sounds } from "../../utils/audio";

interface CrewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrewStatusDrawer({ isOpen, onClose }: CrewDrawerProps) {
  const astronauts = useGameStore((s) => s.astronauts);
  const setCrewSheltered = useGameStore((s) => s.setCrewSheltered);
  const selectAstronaut = useGameStore((s) => s.selectAstronaut);
  const selectedAstronautId = useGameStore((s) => s.selectedAstronautId);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        sounds.playClick();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allSheltered = astronauts.every((a) => a.isSheltered);

  return (
    <div
      onClick={() => {
        sounds.playClick();
        onClose();
      }}
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
      title="Click outside to close"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-slate-900 border-l-2 border-cyan-500/50 p-5 text-white flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300 cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base md:text-lg font-black tracking-wide text-cyan-200">
                Astronaut Crew Roster
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Artemis Base Alpha Personnel
              </p>
            </div>
          </div>

          {/* Prominent High-Contrast Close Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/70 text-red-200 hover:text-white font-black text-xs transition active:scale-95 shadow-lg mr-4 cursor-pointer"
            title="Close Crew Roster [Esc]"
          >
            <X className="w-4 h-4 text-red-400" />
            <span>CLOSE</span>
          </button>
        </div>

        {/* Global Shelter Protocol Action */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Emergency Shelter Protocol
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                allSheltered
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-700"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {allSheltered ? "LOCKDOWN ACTIVE" : "STANDBY"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug mb-3">
            Evacuating crew to the 2-meter regolith storm shelter drops solar flare radiation absorption by 99%, but pauses outdoor activities.
          </p>
          <button
            onClick={() => {
              sounds.playClick();
              setCrewSheltered(!allSheltered);
            }}
            className={`w-full py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition ${
              allSheltered
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                : "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-950/50"
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>
              {allSheltered
                ? "RELEASE CREW TO NORMAL DUTIES"
                : "ORDER ALL CREW TO REGOLITH SHELTER"}
            </span>
          </button>
        </div>

        {/* Astronaut Cards */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {astronauts.map((a) => {
            const isSelected = selectedAstronautId === a.id;
            return (
              <div
                key={a.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400"
                    : "bg-slate-950/70 border-slate-800/80"
                } space-y-2.5`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner border"
                      style={{ borderColor: a.accentColor, backgroundColor: `${a.accentColor}22` }}
                    >
                      {a.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-cyan-200">{a.name}</h3>
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white font-mono"
                          style={{ backgroundColor: a.accentColor }}
                        >
                          {a.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Status: <span className="text-white font-bold">{a.status}</span>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      a.health > 80
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-red-950 text-red-400 border border-red-800 animate-pulse"
                    }`}
                  >
                    {a.health}% HP
                  </span>
                </div>

                {/* Health & Energy Progress Bars */}
                <div className="space-y-1.5">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>Health</span>
                      <span>{a.health}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          a.health > 80
                            ? "bg-emerald-500"
                            : a.health > 50
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${a.health}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                      <span className="flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 text-amber-400" />
                        Stamina / Energy
                      </span>
                      <span>{a.energy}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all duration-300"
                        style={{ width: `${a.energy}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Radiation and Status Line */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <div className="flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Dose: {a.radiationDose} mSv</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <span className="capitalize">{a.status}</span>
                  </div>
                </div>

                {/* Current Task if any */}
                {a.currentTask && (
                  <div className="bg-slate-900/90 border border-amber-500/40 rounded-lg p-2 text-xs">
                    <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
                      <span>⚙️ {a.currentTask.title}</span>
                      <span className="text-[10px] font-mono text-slate-300">
                        {Math.round((a.currentTask.elapsed / a.currentTask.duration) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all duration-200"
                        style={{
                          width: `${Math.min(
                            100,
                            (a.currentTask.elapsed / a.currentTask.duration) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Status Message */}
                <p className="text-[11px] text-slate-300 italic border-t border-slate-800/60 pt-2 leading-relaxed">
                  "{a.statusMessage}"
                </p>

                {/* Select / Control Astronaut Button */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    selectAstronaut(a.id);
                    onClose();
                  }}
                  className={`w-full py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    isSelected
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>{isSelected ? "CONTROLLING THIS ASTRONAUT" : "SELECT & COMMAND"}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Close Button */}
        <div className="pt-4 border-t border-slate-800 mt-2">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition active:scale-98 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>CLOSE ROSTER & RETURN TO COLONY VIEW [ESC]</span>
          </button>
        </div>
      </div>
    </div>
  );
}
