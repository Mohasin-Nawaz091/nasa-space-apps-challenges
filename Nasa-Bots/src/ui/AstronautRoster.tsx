/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/ui/AstronautRoster.tsx
 * Professional Crew Management Dock displaying the 3 primary expedition specialists:
 * ALEX (Engineer), MIA (Scientist), and LEO (Botanist).
 */

import React from 'react';
import { useGameStore } from '../store/store.ts';
import { CrewId } from '../sim/types.ts';
import { getCrewDisplayName } from '../sim/rules/crew.ts';
import { Wrench, FlaskConical, Sprout, Zap, MapPin } from 'lucide-react';

interface SpecialistConfig {
  id: CrewId;
  name: string;
  role: string;
  roleBadge: string;
  accent: string;
  badgeBg: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRIMARY_CREW: SpecialistConfig[] = [
  {
    id: 'alex',
    name: 'ALEX',
    role: 'SYSTEMS ENGINEER',
    roleBadge: 'ENGINEER',
    accent: '#38bdf8', // Cyan
    badgeBg: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
    icon: Wrench,
  },
  {
    id: 'sara',
    name: 'MIA',
    role: 'RESEARCH SCIENTIST',
    roleBadge: 'SCIENTIST',
    accent: '#34d399', // Emerald
    badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    icon: FlaskConical,
  },
  {
    id: 'daniel',
    name: 'LEO',
    role: 'BOTANIST & GEOLOGIST',
    roleBadge: 'BOTANIST',
    accent: '#fbbf24', // Amber
    badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    icon: Sprout,
  },
];

export const AstronautRoster: React.FC = () => {
  const crew = useGameStore((s) => s.state.crew);
  const activePlayerCrew = useGameStore((s) => s.activePlayerCrew);
  const setActivePlayerCrew = useGameStore((s) => s.setActivePlayerCrew);
  const setSelectedEntity = useGameStore((s) => s.setSelectedEntity);
  const openTaskMenu = useGameStore((s) => s.openTaskMenu);
  const rosterCollapsed = useGameStore((s) => s.rosterCollapsed);
  const toggleRosterCollapsed = useGameStore((s) => s.toggleRosterCollapsed);

  // Minimized Compact Strip View
  if (rosterCollapsed) {
    return (
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-auto select-none font-mono">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/90 border border-slate-800 shadow-xl backdrop-blur-md text-[10px]">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider hidden sm:inline">CREW:</span>
          {PRIMARY_CREW.map((spec) => {
            const m = crew[spec.id];
            if (!m) return null;
            const isSelected = activePlayerCrew === spec.id;
            return (
              <button
                key={spec.id}
                onClick={() => {
                  setActivePlayerCrew(spec.id);
                  setSelectedEntity({ type: 'crew', id: spec.id });
                }}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-all ${
                  isSelected ? 'bg-sky-500/20 text-white border border-sky-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: spec.accent }} />
                <span>{spec.name}</span>
                <span className="text-slate-400">{m.health}HP</span>
                <span className="text-slate-500">{m.stamina}h</span>
              </button>
            );
          })}
          <button
            onClick={toggleRosterCollapsed}
            className="text-sky-400 hover:text-white text-[9px] font-bold ml-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 cursor-pointer"
            title="Expand Crew Management Dock"
          >
            EXPAND ▲
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-auto select-none max-w-4xl w-[calc(100%-2rem)]">
      <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-md">
        {/* Header: Title, Minimizer & Shortcut Hints */}
        <div className="flex items-center justify-between px-2 pb-1.5 mb-1.5 border-b border-slate-800/80 text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-white">
              EXPEDITION CREW STATUS
            </span>
            <span className="text-[9px] text-slate-400 hidden sm:inline">
              SELECT CREW TO ASSIGN ORDERS OR DIRECT MOVEMENT
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[9px] text-sky-400 hidden md:inline">HOTKEYS: [1] ALEX · [2] MIA · [3] LEO</span>
            <button
              onClick={toggleRosterCollapsed}
              className="text-slate-400 hover:text-white text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer"
              title="Minimize Crew Dock to clean up screen"
            >
              MINIMIZE ▼
            </button>
          </div>
        </div>

        {/* 3 Primary Astronaut Cards in 1 Unified Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {PRIMARY_CREW.map((spec) => {
            const member = crew[spec.id];
            if (!member) return null;

            const info = getCrewDisplayName(member);
            const isSelected = activePlayerCrew === spec.id;
            const isWorking = !!member.currentTask;
            const IconComp = spec.icon;

            return (
              <div
                key={spec.id}
                onClick={() => {
                  setActivePlayerCrew(spec.id);
                  setSelectedEntity({ type: 'crew', id: spec.id });
                }}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between font-mono ${
                  isSelected
                    ? 'bg-slate-900 border-sky-400 ring-1 ring-sky-400/80 shadow-lg shadow-sky-950'
                    : 'bg-slate-950/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {/* Top Row: Specialist Badge & Health */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Rendered Spec Icon Shield */}
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center border shrink-0"
                      style={{
                        backgroundColor: `${spec.accent}15`,
                        borderColor: `${spec.accent}40`,
                        color: spec.accent,
                      }}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white tracking-wider">
                          {spec.name}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${spec.badgeBg}`}
                        >
                          {spec.roleBadge}
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-400 truncate max-w-[140px]">
                        {info.fullName}
                      </div>
                    </div>
                  </div>

                  {/* HP Value Badge */}
                  <div
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                      member.health < 40
                        ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                        : member.health < 70
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}
                  >
                    {member.health} HP
                  </div>
                </div>

                {/* Middle: Stamina Progress Bar */}
                <div className="my-1.5">
                  <div className="flex justify-between text-[9px] text-slate-400 mb-0.5">
                    <span>STAMINA</span>
                    <span className="text-slate-300">{member.stamina} / 8h</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(Math.max(0, member.stamina) / 8) * 100}%`,
                        backgroundColor: spec.accent,
                      }}
                    />
                  </div>
                </div>

                {/* Bottom Row: Current Status & Command Action */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[9px]">
                  <div className="truncate max-w-[130px] flex items-center gap-1">
                    {isWorking ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-bold">
                        <Zap className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {member.currentTask?.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0 text-slate-500" />
                        <span className="truncate capitalize">{member.location.replace('_', ' ')}</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openTaskMenu(
                        member.location === 'surface' || member.location === 'transit'
                          ? 'habitat'
                          : member.location
                      );
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-sky-400 font-bold text-[9px] transition-colors border border-slate-700 cursor-pointer"
                  >
                    ASSIGN ➔
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
