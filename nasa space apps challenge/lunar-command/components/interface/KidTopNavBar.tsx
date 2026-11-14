"use client";

import React from "react";
import { useGameStore } from "../../store/gameStore";
import {
  Zap,
  Wind,
  Droplet,
  Utensils,
  Wrench,
  FlaskConical,
  Volume2,
  VolumeX,
  Play,
  Pause,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { sounds } from "../../utils/audio";

interface KidTopNavBarProps {
  onOpenHowToPlay: () => void;
  onOpenCrewDrawer: () => void;
}

export function KidTopNavBar({ onOpenHowToPlay, onOpenCrewDrawer }: KidTopNavBarProps) {
  const currentDay = useGameStore((s) => s.currentDay);
  const maxDays = useGameStore((s) => s.maxDays);
  const resources = useGameStore((s) => s.resources);
  const astronauts = useGameStore((s) => s.astronauts);
  const isPaused = useGameStore((s) => s.isPaused);
  const togglePause = useGameStore((s) => s.togglePause);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const setResourceExplanationKey = useGameStore((s) => s.setResourceExplanationKey);
  const missionStars = useGameStore((s) => s.missionStars);

  const avgHealth = Math.round(
    astronauts.reduce((acc, a) => acc + a.health, 0) / astronauts.length
  );

  // Status indicators (Good / Watch Out / Critical)
  const getPowerStatus = () => {
    if (resources.power < 40) return { label: "Critical", color: "bg-red-500 text-white" };
    if (resources.power < 100) return { label: "Watch Out", color: "bg-amber-400 text-slate-900" };
    return { label: "Good", color: "bg-emerald-500 text-white" };
  };

  const getOxygenStatus = () => {
    if (resources.oxygen < 30) return { label: "Critical", color: "bg-red-500 text-white" };
    if (resources.oxygen < 60) return { label: "Watch Out", color: "bg-amber-400 text-slate-900" };
    return { label: "Good", color: "bg-emerald-500 text-white" };
  };

  const getWaterStatus = () => {
    if (resources.water < 40) return { label: "Critical", color: "bg-red-500 text-white" };
    if (resources.water < 80) return { label: "Watch Out", color: "bg-amber-400 text-slate-900" };
    return { label: "Good", color: "bg-emerald-500 text-white" };
  };

  const getFoodStatus = () => {
    if (resources.food < 20) return { label: "Critical", color: "bg-red-500 text-white" };
    if (resources.food < 45) return { label: "Watch Out", color: "bg-amber-400 text-slate-900" };
    return { label: "Good", color: "bg-emerald-500 text-white" };
  };

  const powerStatus = getPowerStatus();
  const o2Status = getOxygenStatus();
  const waterStatus = getWaterStatus();
  const foodStatus = getFoodStatus();

  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-3.5 flex flex-col gap-2 select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Base Brand & Sol Counter */}
        <div className="flex items-center gap-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌙</span>
            <div>
              <h1 className="font-black text-sm md:text-base tracking-wide text-slate-900 dark:text-white leading-none">
                LUNAR COMMAND
              </h1>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-extrabold tracking-wider uppercase">
                Artemis Base Alpha
              </span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* Sol Badge */}
          <div className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
            <span>🌞</span>
            <span>SOL {currentDay} / {maxDays}</span>
          </div>
        </div>

        {/* Center: Simplified Child-Friendly Resource Meters */}
        <div className="flex items-center gap-2 md:gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-xl">
          {/* Power */}
          <button
            onClick={() => {
              sounds.playClick();
              setResourceExplanationKey("power");
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer group"
            title="Click for Electricity Details"
          >
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition">
              <Zap className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  POWER
                </span>
                <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${powerStatus.color}`}>
                  {powerStatus.label}
                </span>
              </div>
              <span className="font-black font-mono text-xs md:text-sm text-slate-900 dark:text-white">
                {resources.power} <span className="text-[10px] font-normal text-slate-500">kWh</span>
              </span>
            </div>
          </button>

          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* Oxygen */}
          <button
            onClick={() => {
              sounds.playClick();
              setResourceExplanationKey("oxygen");
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer group"
            title="Click for Oxygen Details"
          >
            <div className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  OXYGEN
                </span>
                <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${o2Status.color}`}>
                  {o2Status.label}
                </span>
              </div>
              <span className="font-black font-mono text-xs md:text-sm text-slate-900 dark:text-white">
                {resources.oxygen} <span className="text-[10px] font-normal text-slate-500">kg</span>
              </span>
            </div>
          </button>

          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* Water */}
          <button
            onClick={() => {
              sounds.playClick();
              setResourceExplanationKey("water");
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer group"
            title="Click for Water Details"
          >
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition">
              <Droplet className="w-4 h-4 fill-blue-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  WATER
                </span>
                <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${waterStatus.color}`}>
                  {waterStatus.label}
                </span>
              </div>
              <span className="font-black font-mono text-xs md:text-sm text-slate-900 dark:text-white">
                {resources.water} <span className="text-[10px] font-normal text-slate-500">L</span>
              </span>
            </div>
          </button>

          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* Food */}
          <button
            onClick={() => {
              sounds.playClick();
              setResourceExplanationKey("food");
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer group"
            title="Click for Food Details"
          >
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  FOOD
                </span>
                <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${foodStatus.color}`}>
                  {foodStatus.label}
                </span>
              </div>
              <span className="font-black font-mono text-xs md:text-sm text-slate-900 dark:text-white">
                {resources.food} <span className="text-[10px] font-normal text-slate-500">packs</span>
              </span>
            </div>
          </button>
        </div>

        {/* Right: Crew Health & Controls */}
        <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-2xl shadow-xl">
          {/* Crew Health Badge */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenCrewDrawer();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Click to check Crew Details"
          >
            <span className="text-base">{avgHealth >= 80 ? "😊" : avgHealth >= 50 ? "😐" : "😟"}</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-100">
              {avgHealth}% HEALTH
            </span>
          </button>

          {/* Pause Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              togglePause();
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
            title={isPaused ? "Resume Simulation" : "Pause Simulation"}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-500 fill-emerald-500" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              toggleSound();
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
            title={soundEnabled ? "Mute Sound FX" : "Unmute Sound FX"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Guide Manual */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenHowToPlay();
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-500 transition"
            title="How to Play Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
