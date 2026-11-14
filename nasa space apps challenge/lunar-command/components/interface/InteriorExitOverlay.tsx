"use client";

import React, { useEffect } from "react";
import { useGameStore } from "../../store/gameStore";
import {
  ArrowLeft,
  Home,
  Sprout,
  ShieldAlert,
  Sliders,
  Wrench,
  CheckCircle2,
  Info,
} from "lucide-react";
import { BUILDING_INTERACTIONS } from "../../constants/buildings";
import { sounds } from "../../utils/audio";

export function InteriorExitOverlay() {
  const cameraMode = useGameStore((s) => s.cameraMode);
  const interiorBuildingId = useGameStore((s) => s.interiorBuildingId);
  const buildings = useGameStore((s) => s.buildings);
  const exitInterior = useGameStore((s) => s.exitInterior);
  const updateBuildingSetting = useGameStore((s) => s.updateBuildingSetting);
  const repairBuilding = useGameStore((s) => s.repairBuilding);
  const materials = useGameStore((s) => s.resources.materials);

  // Keyboard shortcut listener for Esc or F
  useEffect(() => {
    if (cameraMode !== "interior") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "f" || e.key === "F") {
        sounds.playClick();
        exitInterior();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cameraMode, exitInterior]);

  if (cameraMode !== "interior" || !interiorBuildingId) return null;

  const currentBuilding = buildings[interiorBuildingId];
  if (!currentBuilding) return null;

  const interactions = BUILDING_INTERACTIONS[interiorBuildingId] || [];

  const equipmentList =
    interiorBuildingId === "greenhouse"
      ? [
          "Aeroponic Vertical Growth Towers",
          "Photosynthetic UV LED Spectrum Array",
          "Automated Botanist Nutrient Console",
          "Ultrasonic Nutrient Moisture Misters",
        ]
      : [
          "2-Meter Sintered Regolith Basalt Vault",
          "Active Radiation Dosimeter Terminal",
          "Crew Emergency Bunk Rest Quarter",
          "Isolated ECLSS Life Support Reserve",
        ];

  return (
    <div className="absolute inset-x-4 top-20 z-30 pointer-events-none flex flex-col md:flex-row items-start justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Left: Building Information & Equipment */}
      <div className="pointer-events-auto max-w-lg bg-slate-900/95 backdrop-blur-xl border border-cyan-500/50 rounded-2xl p-4 shadow-2xl text-white space-y-3">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            {interiorBuildingId === "greenhouse" ? (
              <Sprout className="w-5 h-5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-red-400" />
            )}
            <div>
              <h2 className="text-sm md:text-base font-black tracking-wide text-cyan-200 uppercase">
                INTERIOR: {currentBuilding.name}
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                FACILITY INTEGRITY: {currentBuilding.condition}% • DRAW: {currentBuilding.powerConsumption} kWh/day
              </p>
            </div>
          </div>
        </div>

        {/* Function Narrative */}
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
          {currentBuilding.description}
        </p>

        {/* Equipment Visible */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5 font-bold">
            INTERNAL SUBSYSTEMS & EQUIPMENT:
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
            {equipmentList.map((eq, i) => (
              <div
                key={i}
                className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span className="truncate">{eq}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Working Controls & Prominent Exit Button */}
      <div className="pointer-events-auto w-full md:w-80 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/50 rounded-2xl p-4 shadow-2xl text-white space-y-3">
        {/* Prominent Exit Button */}
        <button
          onClick={() => {
            sounds.playClick();
            exitInterior();
          }}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs md:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-cyan-950/80 transition active:scale-95 cursor-pointer animate-pulse"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO COLONY VIEW [ESC / F]</span>
        </button>

        {/* Working Operational Controls */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span>FACILITY MODE</span>
            </span>
            {currentBuilding.condition < 100 && (
              <button
                disabled={materials < 4}
                onClick={() => {
                  sounds.playClick();
                  repairBuilding(currentBuilding.id);
                }}
                className="text-[10px] px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 font-bold text-white flex items-center gap-1"
              >
                <Wrench className="w-2.5 h-2.5" />
                <span>Repair (-4 Parts)</span>
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {interactions.map((opt) => {
              const isSelected = currentBuilding.operationalSetting === opt.settingKey;
              return (
                <button
                  key={opt.settingKey}
                  onClick={() => {
                    sounds.playClick();
                    updateBuildingSetting(currentBuilding.id, opt.settingKey);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${
                    isSelected
                      ? "bg-cyan-950/80 border-cyan-500 text-cyan-100 shadow-sm shadow-cyan-950/50"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{opt.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
