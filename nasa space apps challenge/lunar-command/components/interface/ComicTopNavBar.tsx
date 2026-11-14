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
  Users,
  Moon,
} from "lucide-react";
import { sounds } from "../../utils/audio";

interface ComicTopNavBarProps {
  onOpenHowToPlay: () => void;
  onOpenCrewDrawer: () => void;
}

export function ComicTopNavBar({ onOpenHowToPlay, onOpenCrewDrawer }: ComicTopNavBarProps) {
  const currentDay = useGameStore((s) => s.currentDay);
  const maxDays = useGameStore((s) => s.maxDays);
  const resources = useGameStore((s) => s.resources);
  const astronauts = useGameStore((s) => s.astronauts);
  const isPaused = useGameStore((s) => s.isPaused);
  const togglePause = useGameStore((s) => s.togglePause);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const setResourceExplanationKey = useGameStore((s) => s.setResourceExplanationKey);
  const setCrewSelectionOpen = useGameStore((s) => s.setCrewSelectionOpen);

  const avgHealth = Math.round(
    astronauts.reduce((acc, a) => acc + a.health, 0) / astronauts.length
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none p-3 flex flex-col gap-2 select-none">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pointer-events-auto">
        {/* Left: Base Title & Sol Turn Box */}
        <div className="flex items-center gap-2 bg-[#DCE5F2] border-2.5 border-[#101820] px-3.5 py-1.5 rounded-xl shadow-[3px_3px_0px_#101820]">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌙</span>
            <div>
              <div className="font-black text-xs md:text-sm tracking-wide text-[#101820] uppercase leading-none">
                LUNAR COMMAND
              </div>
              <span className="text-[9px] text-[#7189A6] font-mono font-black tracking-wider uppercase block">
                Artemis Base Alpha
              </span>
            </div>
          </div>

          <div className="h-6 w-[2px] bg-[#101820]/30 mx-1" />

          {/* Sol Badge (Comic Pill Style) */}
          <div className="px-2.5 py-1 rounded-lg bg-[#E7E0CB] border-2 border-[#101820] text-xs font-black text-[#101820] flex items-center gap-1.5 font-mono shadow-[1px_1px_0px_#101820]">
            <span>🌞</span>
            <span>SOL {currentDay} / {maxDays}</span>
          </div>
        </div>

        {/* Center: Comic Illustrated Resource Tokens (Stacks:Space Card Token Style) */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 bg-[#DCE5F2] border-2.5 border-[#101820] p-1.5 rounded-xl shadow-[3px_3px_0px_#101820]">
          {/* Power */}
          <button
            onClick={() => {
              sounds.playClick();
              setResourceExplanationKey("power");
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white border-1.5 border-[#101820] text-xs font-mono font-black text-[#101820] transition shadow-[1px_1px_0px_#101820] cursor-pointer"
            title="Colony Electricity (kWh)"
          >
            <Zap className="w-3.5 h-3.5 text-[#C78C55]" />
            <span>{resources.power} <span className="text-[10px] text-[#101820]/70 font-sans">kWh</span></span>
          </button>

          {/* Oxygen */}
          <button
            onClick={() => {
              sounds.playClick();
              setResourceExplanationKey("oxygen");
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white border-1.5 border-[#101820] text-xs font-mono font-black text-[#101820] transition shadow-[1px_1px_0px_#101820] cursor-pointer"
            title="Colony Oxygen (kg)"
          >
            <Wind className="w-3.5 h-3.5 text-[#7189A6]" />
            <span>{resources.oxygen} <span className="text-[10px] text-[#101820]/70 font-sans">kg</span></span>
          </button>

          {/* Water */}
          <button
            onClick={() => {
              sounds.playClick();
              setResourceExplanationKey("water");
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white border-1.5 border-[#101820] text-xs font-mono font-black text-[#101820] transition shadow-[1px_1px_0px_#101820] cursor-pointer"
            title="Colony Water Reserves (L)"
          >
            <Droplet className="w-3.5 h-3.5 text-[#7189A6]" />
            <span>{resources.water} <span className="text-[10px] text-[#101820]/70 font-sans">L</span></span>
          </button>

          {/* Food */}
          <button
            onClick={() => {
              sounds.playClick();
              setResourceExplanationKey("food");
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white border-1.5 border-[#101820] text-xs font-mono font-black text-[#101820] transition shadow-[1px_1px_0px_#101820] cursor-pointer"
            title="Fresh Food Rations"
          >
            <Utensils className="w-3.5 h-3.5 text-[#79966B]" />
            <span>{resources.food} <span className="text-[10px] text-[#101820]/70 font-sans">Rats</span></span>
          </button>

          {/* Research Science Points */}
          <button
            onClick={() => {
              sounds.playClick();
              setResourceExplanationKey("science");
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E7E0CB] hover:bg-white border-1.5 border-[#101820] text-xs font-mono font-black text-[#101820] transition shadow-[1px_1px_0px_#101820] cursor-pointer"
            title="NASA Science Research Goal"
          >
            <FlaskConical className="w-3.5 h-3.5 text-[#182536]" />
            <span>{resources.researchPoints} / {resources.targetResearchPoints} <span className="text-[10px] text-[#101820]/70 font-sans">pts</span></span>
          </button>

          {/* Spare Parts */}
          <button
            onClick={() => {
              sounds.playClick();
              setResourceExplanationKey("materials");
            }}
            className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/90 hover:bg-white border-1.5 border-[#101820] text-xs font-mono font-black text-[#101820] transition shadow-[1px_1px_0px_#101820] cursor-pointer"
            title="Facility Spare Parts"
          >
            <Wrench className="w-3.5 h-3.5 text-[#C78C55]" />
            <span>{resources.materials}</span>
          </button>
        </div>

        {/* Right: Crew Vitals, Choose Crew, and Menu Controls */}
        <div className="flex items-center gap-2 bg-[#DCE5F2] border-2.5 border-[#101820] p-1.5 rounded-xl shadow-[3px_3px_0px_#101820]">
          {/* Crew Vitals Card */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenCrewDrawer();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white border border-[#101820] text-xs font-mono font-black text-[#101820] transition cursor-pointer"
            title="View Crew Roster"
          >
            <span>👨‍🚀</span>
            <span>{avgHealth}% HP</span>
          </button>

          {/* Choose Crew Hero Selection Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setCrewSelectionOpen(true);
            }}
            className="comic-btn flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#C78C55] hover:bg-[#d49964] text-white text-xs font-black tracking-wider uppercase"
            title="Select Crew & Review Heroes"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CHOOSE CREW</span>
          </button>

          {/* Pause / Resume */}
          <button
            onClick={() => {
              sounds.playClick();
              togglePause();
            }}
            className="p-1.5 rounded-lg border border-[#101820] bg-white hover:bg-[#E7E0CB] text-[#101820] transition cursor-pointer"
            title={isPaused ? "Resume [Space]" : "Pause [Space]"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              toggleSound();
            }}
            className="p-1.5 rounded-lg border border-[#101820] bg-white hover:bg-[#E7E0CB] text-[#101820] transition cursor-pointer"
            title={soundEnabled ? "Mute Audio" : "Enable Audio"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Manual */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenHowToPlay();
            }}
            className="p-1.5 rounded-lg border border-[#101820] bg-white hover:bg-[#E7E0CB] text-[#101820] transition cursor-pointer"
            title="How to Play Manual"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
