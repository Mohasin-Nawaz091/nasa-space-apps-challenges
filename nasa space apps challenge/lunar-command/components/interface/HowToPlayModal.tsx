"use client";

import React, { useEffect } from "react";
import {
  X,
  Target,
  Zap,
  Wind,
  Droplet,
  Utensils,
  ShieldAlert,
  FastForward,
  Keyboard,
  Mouse,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { sounds } from "../../utils/audio";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
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

  return (
    <div
      onClick={() => {
        sounds.playClick();
        onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      title="Click outside to close"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl p-6 text-white space-y-5 cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Target className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-xl font-black tracking-wide text-cyan-200">
                COMMANDER FLIGHT MANUAL: HOW TO PLAY
              </h2>
              <p className="text-xs text-slate-400">
                Artemis Base Alpha Survival Guide (Ages 7–12)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/70 text-red-200 hover:text-white font-black text-xs transition active:scale-95 shadow-lg mr-2 cursor-pointer"
            title="Close Guide [Esc]"
          >
            <X className="w-4 h-4 text-red-400" />
            <span>CLOSE</span>
          </button>
        </div>

        {/* 1. Mission Goal */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
          <h3 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 text-xs flex items-center justify-center font-bold">1</span>
            YOUR MISSION OBJECTIVE
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Keep your 3 astronauts (Sarah, Hiroshi, and Maya) alive for <strong>10 simulated Sols (days)</strong> at the lunar south pole while collecting at least <strong>60 Research Points</strong> to earn your NASA Flight Certification!
          </p>
        </div>

        {/* 2. Controls */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
          <h3 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 text-xs flex items-center justify-center font-bold">2</span>
            HOW TO CONTROL THE CAMERA & BASE
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Mouse className="w-4 h-4 text-cyan-400 shrink-0" />
              <span><strong>Left Drag:</strong> Rotate / Orbit</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Mouse className="w-4 h-4 text-cyan-400 shrink-0" />
              <span><strong>Right Drag / WASD:</strong> Pan View</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Mouse className="w-4 h-4 text-cyan-400 shrink-0" />
              <span><strong>Scroll Wheel:</strong> Zoom In / Out</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-cyan-400 shrink-0" />
              <span><strong>Keys 1–6:</strong> Quick Select Buildings</span>
            </div>
          </div>
        </div>

        {/* 3. Resources */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
          <h3 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 text-xs flex items-center justify-center font-bold">3</span>
            KEEP YOUR LIFE SUPPORT BALANCED
          </h3>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>Power:</strong> Keep Solar Arrays clean. Battery blackout causes emergency shutdown!</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400 shrink-0" />
              <span><strong>Oxygen:</strong> Recycled continuously by Life Support (ECLSS).</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-blue-400 shrink-0" />
              <span><strong>Water:</strong> Consumed by crew and greenhouse crops; 90% recycled by ECLSS.</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Food:</strong> Grown in the bio-dome greenhouse. Each astronaut eats 3 packs per day.</span>
            </div>
          </div>
        </div>

        {/* 4. Sol Loop */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
          <h3 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 text-xs flex items-center justify-center font-bold">4</span>
            DAILY GAMEPLAY CYCLE
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            1) Check morning NASA hazard alert. 2) Inspect building power and repair dust damage. 3) If a solar flare strikes, shelter the crew. 4) Advance to the next Sol!
          </p>
        </div>

        {/* Bottom Close Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO COLONY EXPEDITION [ESC]</span>
          </button>
        </div>
      </div>
    </div>
  );
}
