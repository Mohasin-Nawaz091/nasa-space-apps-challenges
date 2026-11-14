"use client";

import React, { useState, useEffect } from "react";
import { useGameStore } from "../../store/gameStore";
import {
  Rocket,
  Play,
  RotateCcw,
  BookOpen,
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  X,
} from "lucide-react";
import { sounds } from "../../utils/audio";

interface MainMenuModalProps {
  onOpenHowToPlay: () => void;
}

export function MainMenuModal({ onOpenHowToPlay }: MainMenuModalProps) {
  const isMainMenuOpen = useGameStore((s) => s.isMainMenuOpen);
  const setMainMenuOpen = useGameStore((s) => s.setMainMenuOpen);
  const startNewMission = useGameStore((s) => s.startNewMission);
  const continueMission = useGameStore((s) => s.continueMission);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const musicEnabled = useGameStore((s) => s.musicEnabled);
  const toggleMusic = useGameStore((s) => s.toggleMusic);
  const graphicsQuality = useGameStore((s) => s.graphicsQuality);
  const setGraphicsQuality = useGameStore((s) => s.setGraphicsQuality);
  const setTutorialActive = useGameStore((s) => s.setTutorialActive);

  const [hasSaveData, setHasSaveData] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lunar_command_save");
      setHasSaveData(!!saved);
    }
  }, [isMainMenuOpen]);

  if (!isMainMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/40 rounded-3xl shadow-2xl p-6 md:p-8 text-white text-center overflow-hidden">
        {/* Glow Ambient Aura */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo / Badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            NASA Space Apps Challenge 2026
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-400 mb-2">
          LUNAR COMMAND
        </h1>
        <p className="text-xs text-slate-400 tracking-wide mb-6">
          Junior Astronaut Mission Trainer — Shackleton Crater Expedition
        </p>

        {/* Menu Buttons */}
        {!showSettings ? (
          <div className="space-y-3">
            {/* Start New Mission */}
            <button
              onClick={() => {
                sounds.playClick();
                startNewMission();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-950/70 transition active:scale-98"
            >
              <Rocket className="w-5 h-5 text-cyan-200" />
              <span>START NEW EXPEDITION</span>
            </button>

            {/* Continue Saved Mission */}
            <button
              disabled={!hasSaveData}
              onClick={() => {
                sounds.playClick();
                const ok = continueMission();
                if (!ok) alert("No saved mission found.");
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-40 text-slate-200 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border border-slate-700 transition active:scale-98"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              <span>CONTINUE SAVED MISSION</span>
            </button>

            {/* Interactive Flight Tutorial */}
            <button
              onClick={() => {
                sounds.playClick();
                setMainMenuOpen(false);
                setTutorialActive(true, 1);
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-200 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border border-cyan-800/50 transition active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>INTERACTIVE FLIGHT TUTORIAL</span>
            </button>

            {/* How to Play Manual */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenHowToPlay();
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border border-slate-800 transition active:scale-98"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>HOW TO PLAY & CONTROLS</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowSettings(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Audio & Graphics Settings</span>
            </button>
          </div>
        ) : (
          /* Settings View */
          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 text-left space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-sm text-cyan-300">Settings</span>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sound FX */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Sound Effects</span>
              <button
                onClick={toggleSound}
                className={`px-3 py-1 rounded font-bold transition ${
                  soundEnabled
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {soundEnabled ? "ENABLED" : "MUTED"}
              </button>
            </div>

            {/* Graphics Quality */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Graphics Quality</span>
              <div className="flex gap-1">
                {(["low", "medium", "high"] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => setGraphicsQuality(q)}
                    className={`px-2.5 py-1 rounded font-bold uppercase text-[10px] transition ${
                      graphicsQuality === q
                        ? "bg-cyan-500 text-slate-950"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-center text-white"
            >
              Back to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
