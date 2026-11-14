"use client";

import React, { useEffect } from "react";
import { useGameStore } from "../../store/gameStore";
import {
  AlertTriangle,
  Radio,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Info,
  Check,
  X,
  ArrowRight,
} from "lucide-react";

export function EventModal() {
  const activeEvent = useGameStore((s) => s.activeEvent);
  const resolveActiveEvent = useGameStore((s) => s.resolveActiveEvent);
  const dismissActiveEvent = useGameStore((s) => s.dismissActiveEvent);

  // Allow pressing Escape or Enter to dismiss if already resolved
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Escape" || e.key === "Enter") && activeEvent?.isResolved) {
        dismissActiveEvent();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeEvent, dismissActiveEvent]);

  if (!activeEvent) return null;

  const severityColors = {
    info: "from-blue-900/90 to-slate-900/95 border-blue-500/50 text-blue-300",
    warning: "from-amber-900/90 to-slate-900/95 border-amber-500/50 text-amber-300",
    danger: "from-red-950/95 to-slate-900/95 border-red-500/60 text-red-300",
    critical: "from-purple-950/95 to-slate-900/95 border-purple-500/60 text-purple-300",
  };

  const severityBadges = {
    info: "bg-blue-950 text-blue-300 border-blue-700",
    warning: "bg-amber-950 text-amber-300 border-amber-700",
    danger: "bg-red-950 text-red-300 border-red-700 animate-pulse",
    critical: "bg-purple-950 text-purple-300 border-purple-700 animate-pulse",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-gradient-to-b ${
          severityColors[activeEvent.severity]
        } border rounded-2xl shadow-2xl p-5 md:p-6 text-white`}
      >
        {/* Top Header & Data Source Attribution Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                severityBadges[activeEvent.severity]
              }`}
            >
              {activeEvent.severity}
            </span>
            <span className="text-xs font-mono text-slate-400">
              SOL {activeEvent.day} INCIDENT
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* NASA Attribution Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-cyan-500/40 text-[10px] text-cyan-300 font-semibold tracking-wide">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>{activeEvent.dataSourceLabel}</span>
            </div>

            {/* Close Button if event is resolved */}
            {activeEvent.isResolved && (
              <button
                onClick={dismissActiveEvent}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Dismiss to Outpost View [Esc]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg md:text-xl font-black tracking-wide text-white mb-1">
          {activeEvent.title}
        </h2>
        <p className="text-xs md:text-sm text-cyan-200/90 font-medium mb-3">
          {activeEvent.subtitle}
        </p>

        {/* Narrative Description */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs md:text-sm text-slate-200 leading-relaxed mb-4">
          {activeEvent.description}
        </div>

        {/* Educational Science Background */}
        <div className="bg-cyan-950/40 p-3.5 rounded-xl border border-cyan-800/40 text-xs text-cyan-100 mb-5">
          <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-1">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>THE SCIENCE BEHIND THIS:</span>
          </div>
          <p className="leading-relaxed text-[11px] md:text-xs text-cyan-100/90">
            {activeEvent.scienceBackground}
          </p>
        </div>

        {/* Player Tactical Choices */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Commander Directives & Tactical Choices</span>
          </div>

          {activeEvent.choices.map((choice) => {
            const isResolvedChoice = activeEvent.resolvedChoiceId === choice.id;

            return (
              <button
                key={choice.id}
                disabled={activeEvent.isResolved}
                onClick={() => resolveActiveEvent(choice.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  isResolvedChoice
                    ? "bg-emerald-950/70 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/50"
                    : activeEvent.isResolved
                    ? "opacity-50 bg-slate-950/30 border-slate-800 cursor-default"
                    : "bg-slate-950/60 border-slate-700 hover:bg-slate-800/80 hover:border-cyan-400 active:scale-99 cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs md:text-sm font-bold text-white">
                    {choice.label}
                  </span>
                  {isResolvedChoice ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <Check className="w-4 h-4" /> EXECUTED
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-snug mb-2">
                  {choice.description}
                </p>

                {/* Resource Impact Tags */}
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  {choice.powerCost !== undefined && choice.powerCost !== 0 && (
                    <span
                      className={`px-2 py-0.5 rounded ${
                        choice.powerCost > 0
                          ? "bg-amber-950/80 text-amber-300 border border-amber-800"
                          : "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                      }`}
                    >
                      {choice.powerCost > 0 ? `-${choice.powerCost}` : `+${Math.abs(choice.powerCost)}`} kWh Power
                    </span>
                  )}
                  {choice.waterCost !== undefined && choice.waterCost !== 0 && (
                    <span
                      className={`px-2 py-0.5 rounded ${
                        choice.waterCost > 0
                          ? "bg-blue-950/80 text-blue-300 border border-blue-800"
                          : "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                      }`}
                    >
                      {choice.waterCost > 0 ? `-${choice.waterCost}` : `+${Math.abs(choice.waterCost)}`} L Water
                    </span>
                  )}
                  {choice.materialsCost !== undefined && choice.materialsCost !== 0 && (
                    <span
                      className={`px-2 py-0.5 rounded ${
                        choice.materialsCost > 0
                          ? "bg-indigo-950/80 text-indigo-300 border border-indigo-800"
                          : "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                      }`}
                    >
                      {choice.materialsCost > 0 ? `-${choice.materialsCost}` : `+${Math.abs(choice.materialsCost)}`} Parts
                    </span>
                  )}
                  {choice.scienceBonus !== undefined && (
                    <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800 font-bold">
                      +{choice.scienceBonus} Science Points
                    </span>
                  )}
                  {choice.shelterCrew && (
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      Shields Crew in Bunker
                    </span>
                  )}
                </div>

                {/* Educational outcome feedback if already chosen */}
                {isResolvedChoice && (
                  <div className="mt-2.5 pt-2 border-t border-emerald-800/60 text-xs text-emerald-200 font-sans">
                    <strong>Consequence:</strong> {choice.educationalExplanation}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button to Proceed to Colony */}
        {activeEvent.isResolved && (
          <div className="mt-5 pt-3 border-t border-slate-700/80">
            <button
              onClick={dismissActiveEvent}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs md:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-cyan-950/80 transition active:scale-98 cursor-pointer"
            >
              <span>CONTINUE TO COLONY OUTPOST</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
