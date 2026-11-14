"use client";

import React from "react";
import { useGameStore } from "../../store/gameStore";
import {
  Zap,
  Wind,
  Droplet,
  Utensils,
  Wrench,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  FastForward,
  ShieldAlert,
} from "lucide-react";

interface TopNavBarProps {
  onOpenGlossary: () => void;
  onOpenCrewDrawer: () => void;
  onOpenLogsDrawer: () => void;
}

export function TopNavBar({
  onOpenGlossary,
  onOpenCrewDrawer,
  onOpenLogsDrawer,
}: TopNavBarProps) {
  const currentDay = useGameStore((s) => s.currentDay);
  const maxDays = useGameStore((s) => s.maxDays);
  const isPaused = useGameStore((s) => s.isPaused);
  const togglePause = useGameStore((s) => s.togglePause);
  const advanceDay = useGameStore((s) => s.advanceDay);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const resources = useGameStore((s) => s.resources);
  const astronauts = useGameStore((s) => s.astronauts);
  const isMissionCompleted = useGameStore((s) => s.isMissionCompleted);
  const isMissionFailed = useGameStore((s) => s.isMissionFailed);

  const avgHealth = Math.round(
    astronauts.reduce((acc, a) => acc + a.health, 0) / astronauts.length
  );

  const powerPercent = Math.round((resources.power / resources.maxPower) * 100);
  const o2Percent = Math.round((resources.oxygen / resources.maxOxygen) * 100);
  const waterPercent = Math.round((resources.water / resources.maxWater) * 100);

  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-3 flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Left: Mission Brand & Day Counter */}
        <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 px-4 py-2 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="font-extrabold text-sm md:text-base tracking-wider text-cyan-300">
              LUNAR COMMAND
            </h1>
          </div>
          <div className="h-4 w-[1px] bg-slate-700" />
          <div className="text-xs font-semibold px-2.5 py-1 bg-cyan-950/80 text-cyan-200 border border-cyan-700/50 rounded-lg">
            SOL {currentDay} / {maxDays}
          </div>
        </div>

        {/* Center: Primary Resource Meters */}
        <div className="flex items-center gap-2 md:gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-4 py-2 rounded-xl shadow-lg text-xs md:text-sm">
          {/* Power */}
          <div
            className="flex items-center gap-1.5"
            title={`Electrical Power Battery: ${resources.power} / ${resources.maxPower} kWh`}
          >
            <Zap
              className={`w-4 h-4 ${
                powerPercent < 20 ? "text-red-400 animate-bounce" : "text-amber-400"
              }`}
            />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-mono">POWER</span>
              <span
                className={`font-bold font-mono ${
                  powerPercent < 20 ? "text-red-400" : "text-amber-200"
                }`}
              >
                {resources.power} <span className="text-[10px]">kWh</span>
              </span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-800" />

          {/* Oxygen */}
          <div
            className="flex items-center gap-1.5"
            title={`Life Support Oxygen: ${resources.oxygen} / ${resources.maxOxygen} kg`}
          >
            <Wind
              className={`w-4 h-4 ${
                o2Percent < 25 ? "text-red-400 animate-bounce" : "text-cyan-400"
              }`}
            />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-mono">OXYGEN</span>
              <span
                className={`font-bold font-mono ${
                  o2Percent < 25 ? "text-red-400" : "text-cyan-200"
                }`}
              >
                {resources.oxygen} <span className="text-[10px]">kg</span>
              </span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-800" />

          {/* Water */}
          <div
            className="flex items-center gap-1.5"
            title={`Recycled Water: ${resources.water} / ${resources.maxWater} L`}
          >
            <Droplet
              className={`w-4 h-4 ${
                waterPercent < 25 ? "text-red-400 animate-bounce" : "text-blue-400"
              }`}
            />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-mono">WATER</span>
              <span
                className={`font-bold font-mono ${
                  waterPercent < 25 ? "text-red-400" : "text-blue-200"
                }`}
              >
                {resources.water} <span className="text-[10px]">L</span>
              </span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-800" />

          {/* Food */}
          <div
            className="flex items-center gap-1.5"
            title={`Food Rations: ${resources.food} packs`}
          >
            <Utensils className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-mono">FOOD</span>
              <span className="font-bold font-mono text-emerald-200">
                {resources.food}
              </span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-800" />

          {/* Spare Parts */}
          <div
            className="flex items-center gap-1.5"
            title={`Spare Tech Parts: ${resources.materials} units`}
          >
            <Wrench className="w-4 h-4 text-indigo-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-mono">PARTS</span>
              <span className="font-bold font-mono text-indigo-200">
                {resources.materials}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Crew Health, Advance Day & Actions */}
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-lg">
          {/* Crew Status Pill */}
          <button
            onClick={onOpenCrewDrawer}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition border border-slate-600 text-xs text-white"
          >
            <ShieldAlert
              className={`w-4 h-4 ${
                avgHealth < 70 ? "text-red-400 animate-pulse" : "text-emerald-400"
              }`}
            />
            <span className="font-bold">{avgHealth}% VITALS</span>
          </button>

          {/* Advance Sol Button */}
          <button
            disabled={isMissionCompleted || isMissionFailed}
            onClick={advanceDay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 transition text-white font-bold text-xs shadow-md shadow-cyan-900/50 disabled:opacity-50"
          >
            <FastForward className="w-4 h-4" />
            <span>ADVANCE SOL</span>
          </button>

          {/* Pause / Play */}
          <button
            onClick={togglePause}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title={isPaused ? "Resume Simulation" : "Pause Simulation"}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title={soundEnabled ? "Mute Audio" : "Unmute Audio"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Glossary */}
          <button
            onClick={onOpenGlossary}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
            title="Science Glossary & NASA Facts"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
