"use client";

import React, { useEffect } from "react";
import { useGameStore } from "../../store/gameStore";
import { X, ClipboardList, Info, AlertTriangle, CheckCircle, Lightbulb, ArrowLeft } from "lucide-react";
import { sounds } from "../../utils/audio";

interface MissionLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MissionLogDrawer({ isOpen, onClose }: MissionLogDrawerProps) {
  const missionLogs = useGameStore((s) => s.missionLogs);

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

  const logIcons = {
    status: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    discovery: <Lightbulb className="w-4 h-4 text-purple-400 shrink-0" />,
    decision: <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />,
    alert: <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />,
  };

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
            <ClipboardList className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base md:text-lg font-black tracking-wide text-cyan-200">
                Mission Telemetry Log
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Historical Event Transcript
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
            title="Close Mission Logs [Esc]"
          >
            <X className="w-4 h-4 text-red-400" />
            <span>CLOSE</span>
          </button>
        </div>

        {/* Logs List */}
        <div className="flex-1 overflow-y-auto space-y-3 my-4 pr-1">
          {missionLogs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  {logIcons[log.type] || logIcons.status}
                  <span className="text-cyan-300 font-mono">Sol {log.day}</span>
                  <span>•</span>
                  <span>{log.title}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {log.timestamp}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed pl-6">{log.message}</p>
              {log.scienceNote && (
                <div className="ml-6 mt-1 p-2 rounded bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200 leading-snug">
                  <strong>NASA Science Fact:</strong> {log.scienceNote}
                </div>
              )}
            </div>
          ))}
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
            <span>CLOSE LOGS & RETURN TO COLONY VIEW [ESC]</span>
          </button>
        </div>
      </div>
    </div>
  );
}
