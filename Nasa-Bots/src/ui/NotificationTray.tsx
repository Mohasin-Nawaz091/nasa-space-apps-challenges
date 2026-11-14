/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/ui/NotificationTray.tsx
 * Restrained tactical notification tray and Space-Weather Advisory banner.
 */

import React, { useState } from 'react';
import { useGameStore } from '../store/store.ts';
import { eventBus } from '../store/bus.ts';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Shield,
  ChevronDown,
} from 'lucide-react';

export const NotificationTray: React.FC = () => {
  const radiationAdvisory = useGameStore((s) => s.state.radiationAdvisory);
  const log = useGameStore((s) => s.state.log);
  const dispatch = useGameStore((s) => s.dispatch);
  const selectedEntity = useGameStore((s) => s.selectedEntity);
  const [showHistory, setShowHistory] = useState(false);

  const isAdvisoryActive = radiationAdvisory && !radiationAdvisory.resolved;
  const recentLogs = log.slice(-4).reverse();
  const latestLog = recentLogs[0];

  // If contextual panel is open on the right, shift slightly or keep compact
  return (
    <div
      className={`absolute top-20 right-3 z-20 pointer-events-none select-none flex flex-col items-end gap-1.5 transition-all font-mono ${
        selectedEntity ? 'max-w-xs' : 'max-w-sm'
      } w-full`}
    >
      {/* 1. SPACE WEATHER CRITICAL ADVISORY BANNER */}
      {isAdvisoryActive && (
        <div className="pointer-events-auto w-full p-3 rounded-xl bg-slate-950/95 border border-amber-500/80 shadow-2xl backdrop-blur-xl text-slate-100 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  Solar Storm Advisory
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {radiationAdvisory.sourceBadge}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-sans mt-0.5">
                {radiationAdvisory.eventType} detected! High-energy proton flux arrival in{' '}
                <strong className="text-amber-400 font-bold font-mono">
                  {radiationAdvisory.countdownTicks} Sols
                </strong>
                .
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    for (const cid of ['alex', 'sara', 'daniel'] as const) {
                      dispatch({
                        type: 'MOVE_CREW',
                        crewId: cid,
                        targetBuilding: 'shelter',
                      });
                    }
                    eventBus.emit('sound:play', { name: 'alarm' });
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Shelter All Crew (RAD-01)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPACT NOTIFICATION FEED */}
      {latestLog && (
        <div className="pointer-events-auto flex flex-col items-end gap-1 w-full max-w-xs">
          {/* Latest Single Alert / Event Pill */}
          <div
            className={`p-2 px-3 rounded-lg text-xs font-medium shadow-xl backdrop-blur-md flex items-center justify-between gap-2 border transition-all w-full ${
              latestLog.type === 'alert'
                ? 'bg-rose-950/80 border-rose-500/60 text-rose-300'
                : latestLog.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                : 'bg-slate-950/85 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {latestLog.type === 'alert' ? (
                <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
              ) : latestLog.type === 'success' ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              ) : (
                <Info className="w-3 h-3 text-sky-400 shrink-0" />
              )}
              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                D{latestLog.day}:
              </span>
              <span className="text-[10px] leading-snug line-clamp-1 font-sans">{latestLog.message}</span>
            </div>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-[9px] font-mono text-sky-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 shrink-0 transition-colors cursor-pointer flex items-center gap-0.5"
              title="Toggle Telemetry Log Feed"
            >
              <span>{showHistory ? 'Hide' : 'Log'}</span>
              <ChevronDown className={`w-2.5 h-2.5 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expanded Previous Logs */}
          {showHistory && (
            <div className="space-y-1 w-full animate-fadeIn">
              {recentLogs.slice(1).map((entry) => (
                <div
                  key={entry.id}
                  className="p-1.5 px-2.5 rounded-lg text-[10px] bg-slate-950/90 border border-slate-800/80 text-slate-300 flex items-start gap-1.5 font-sans"
                >
                  <span className="font-mono text-[9px] text-sky-400 shrink-0 font-bold">
                    D{entry.day}:
                  </span>
                  <span className="line-clamp-2 leading-tight">{entry.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
