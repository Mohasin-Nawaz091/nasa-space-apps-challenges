"use client";

import React from "react";
import { HelpCircle, Move, RotateCw, MousePointer, Eye, FastForward } from "lucide-react";

interface ControlsFooterBarProps {
  onOpenHowToPlay: () => void;
}

export function ControlsFooterBar({ onOpenHowToPlay }: ControlsFooterBarProps) {
  return (
    <footer className="absolute bottom-2 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-2 text-xs">
      {/* Keyboard & Mouse Quick Hints */}
      <div className="hidden sm:flex items-center gap-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/70 px-3.5 py-1.5 rounded-xl shadow-lg text-slate-300 font-mono pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <Move className="w-3.5 h-3.5 text-cyan-400" />
          <span><kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 text-cyan-300 font-bold">WASD</kbd> Move</span>
        </div>
        <div className="h-3 w-[1px] bg-slate-700" />
        <div className="flex items-center gap-1.5">
          <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
          <span><kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 text-cyan-300 font-bold">Q</kbd> / <kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 text-cyan-300 font-bold">E</kbd> Rotate</span>
        </div>
        <div className="h-3 w-[1px] bg-slate-700" />
        <div className="flex items-center gap-1.5">
          <MousePointer className="w-3.5 h-3.5 text-amber-400" />
          <span>Click Building</span>
        </div>
        <div className="h-3 w-[1px] bg-slate-700" />
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span><kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 text-emerald-300 font-bold">F</kbd> Interior</span>
        </div>
        <div className="h-3 w-[1px] bg-slate-700" />
        <div className="flex items-center gap-1.5">
          <FastForward className="w-3.5 h-3.5 text-cyan-400" />
          <span><kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 text-cyan-300 font-bold">Space</kbd> Advance</span>
        </div>
      </div>

      {/* How To Play Button */}
      <button
        onClick={onOpenHowToPlay}
        className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/50 text-amber-300 font-bold transition shadow-lg active:scale-95 ml-auto"
      >
        <HelpCircle className="w-4 h-4 text-amber-400" />
        <span>HOW TO PLAY & CONTROLS</span>
      </button>
    </footer>
  );
}
