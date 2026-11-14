/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/ui/LeftNavPanel.tsx
 * Left vertical command toolbar and tactical drawers for Base Overview,
 * Modules, Construction, Rover Expeditions, Research Lab, Crew Dossiers,
 * Mission Objectives, Achievements, and Resource Telemetry.
 */

import React from 'react';
import { useGameStore, ActiveNavTab } from '../store/store.ts';
import { BuildingId, CrewId, ResearchProjectId, RoverDestinationId, ConstructionProjectId } from '../sim/types.ts';
import { RESEARCH_PROJECTS } from '../sim/rules/research.ts';
import { ROVER_DESTINATIONS } from '../sim/rules/rover.ts';
import { CONSTRUCTION_PROJECTS } from '../sim/rules/construction.ts';
import { getCrewDisplayName } from '../sim/rules/crew.ts';
import {
  Globe,
  Building2,
  Hammer,
  Truck,
  FlaskConical,
  Users,
  Target,
  Award,
  BarChart3,
  X,
  ChevronRight,
  CheckCircle2,
  Lock,
  Zap,
  Droplets,
  ShieldAlert,
  Radio,
  Cpu,
  MapPin,
} from 'lucide-react';

interface NavItemDef {
  id: ActiveNavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItemDef[] = [
  { id: 'overview', label: 'Colony Overview', icon: Globe },
  { id: 'buildings', label: 'Base Modules', icon: Building2 },
  { id: 'construction', label: 'Construction', icon: Hammer },
  { id: 'rover', label: 'Rover Expeditions', icon: Truck },
  { id: 'research', label: 'Research Lab', icon: FlaskConical },
  { id: 'astronauts', label: 'Crew Dossiers', icon: Users },
  { id: 'objectives', label: 'Objectives', icon: Target },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'stats', label: 'Telemetry Reports', icon: BarChart3 },
];

const BUILDING_METADATA: { id: BuildingId; name: string; code: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'habitat', name: 'Habitat Command', code: 'HAB-01', icon: Building2 },
  { id: 'power_station', name: 'Solar Array Substation', code: 'EPS-01', icon: Zap },
  { id: 'greenhouse', name: 'Hydroponic Greenhouse', code: 'BIO-01', icon: FlaskConical },
  { id: 'recycler', name: 'Water Recycler (WRS)', code: 'ECLSS-01', icon: Droplets },
  { id: 'shelter', name: 'Radiation Shelter', code: 'RAD-01', icon: ShieldAlert },
  { id: 'laboratory', name: 'Science Laboratory', code: 'LAB-01', icon: Cpu },
  { id: 'comms', name: 'Comms Phased Dish', code: 'COM-01', icon: Radio },
  { id: 'rover_bay', name: 'Rover Maintenance Bay', code: 'BAY-01', icon: Truck },
];

export const LeftNavPanel: React.FC = () => {
  const activeNavTab = useGameStore((s) => s.activeNavTab);
  const setActiveNavTab = useGameStore((s) => s.setActiveNavTab);
  const setSelectedEntity = useGameStore((s) => s.setSelectedEntity);
  const state = useGameStore((s) => s.state);
  const dispatch = useGameStore((s) => s.dispatch);

  const toggleTab = (tab: ActiveNavTab) => {
    setActiveNavTab(activeNavTab === tab ? null : tab);
  };

  const activeItem = NAV_ITEMS.find((n) => n.id === activeNavTab);

  return (
    <div className="absolute left-3 top-20 bottom-24 z-20 flex pointer-events-none select-none font-mono">
      {/* 1. Tactical Vertical Icon Rail */}
      <div className="flex flex-col gap-1 p-1 bg-slate-950/90 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-md pointer-events-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNavTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => toggleTab(item.id)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer relative group ${
                isActive
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title={item.label}
            >
              <Icon className="w-4 h-4" />
              {/* Tooltip on hover */}
              <span className="absolute left-full ml-2.5 px-2.5 py-1 rounded bg-slate-900 text-white text-[10px] font-bold tracking-wider uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700 shadow-xl pointer-events-none z-50">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Tactical Drawer */}
      {activeNavTab && activeItem && (
        <div className="ml-2 w-84 bg-slate-950/95 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-xl pointer-events-auto flex flex-col overflow-hidden animate-fadeIn text-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-800 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <activeItem.icon className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {activeItem.label}
              </h3>
            </div>
            <button
              onClick={() => setActiveNavTab(null)}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-3 overflow-y-auto space-y-3 max-h-[calc(100vh-240px)] text-xs">
            {/* TAB: OVERVIEW */}
            {activeNavTab === 'overview' && (
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                    Colony Operational Status
                  </div>
                  <div className="text-sm font-bold mt-0.5 text-white">
                    {state.mission.day >= 16 && state.mission.day <= 22
                      ? 'Lunar Night Conservation Phase'
                      : 'Nominal South Polar Operations'}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1">
                    Solar arrays producing {Math.round(state.powerBreakdown.generationPerDay)} kWh/Sol at{' '}
                    {Math.round(state.powerBreakdown.sunlightFactor * 100)}% solar illumination factor.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Spare Parts</div>
                    <div className="text-base font-bold text-white font-mono mt-0.5">
                      {state.resources.spareParts} <span className="text-xs text-slate-500">units</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Research Data</div>
                    <div className="text-base font-bold text-sky-400 font-mono mt-0.5">
                      {state.resources.science} <span className="text-xs text-slate-500">pts</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Subsystem Load Priorities
                  </div>
                  <div className="space-y-1 text-[11px]">
                    {state.powerPriority.map((p, idx) => (
                      <div key={p} className="flex items-center justify-between text-slate-400 font-mono">
                        <span className="capitalize">{idx + 1}. {p.replace('_', ' ')}</span>
                        <span className="text-emerald-400 text-[10px]">ONLINE</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BUILDINGS */}
            {activeNavTab === 'buildings' && (
              <div className="space-y-1.5">
                {BUILDING_METADATA.map((b) => {
                  const Icon = b.icon;
                  return (
                    <button
                      key={b.id}
                      onClick={() => {
                        setSelectedEntity({ type: 'building', id: b.id });
                      }}
                      className="w-full p-2.5 rounded-lg bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-sky-400">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                            {b.name}
                          </div>
                          <div className="text-[9px] text-slate-500 font-mono">{b.code} · Diagnostics</div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-sky-400" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAB: CONSTRUCTION */}
            {activeNavTab === 'construction' && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400 font-sans">
                  Construct outpost expansion modules to enhance life support, storage, and survival resilience:
                </p>
                {Object.values(CONSTRUCTION_PROJECTS).map((proj) => {
                  const cstate = state.construction?.[proj.id];
                  const isBuilt = cstate?.built;
                  const inProgress = cstate?.inProgress;
                  return (
                    <div key={proj.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{proj.name}</span>
                        {isBuilt ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            OPERATIONAL
                          </span>
                        ) : inProgress ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 animate-pulse border border-amber-500/40">
                            {cstate.progressTicks}/{proj.hoursNeeded}h
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {proj.costParts} parts · {proj.costPower} pwr
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans">{proj.description}</p>
                      <div className="text-[10px] text-sky-400">{proj.benefit}</div>
                      {!isBuilt && !inProgress && (
                        <button
                          onClick={() => {
                            dispatch({
                              type: 'START_CONSTRUCTION',
                              projectId: proj.id as ConstructionProjectId,
                              crewId: 'alex',
                            });
                          }}
                          className="w-full mt-1 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                        >
                          Construct (Assign Alex)
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB: ROVER EXPEDITIONS */}
            {activeNavTab === 'rover' && (
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Chassis Status:</span>{' '}
                    <strong className={state.rover.isAway ? 'text-amber-400' : 'text-emerald-400'}>
                      {state.rover.isAway ? 'Expedition in Field' : 'Docked at Bay'}
                    </strong>
                  </div>
                  <div className="font-mono text-sky-400">
                    {state.rover.condition}% Integrity
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-sans">
                  Deploy surface rover sorties across Shackleton Crater rim:
                </div>

                {Object.values(ROVER_DESTINATIONS).map((dest) => (
                  <div key={dest.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{dest.name}</span>
                      <span className="text-[10px] font-mono text-sky-400">
                        +{dest.scienceYield} Science
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{dest.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Distance: {dest.distanceKm} km</span>
                      <span>{dest.travelTicks}h · {dest.batteryCost} kWh</span>
                    </div>
                    <button
                      disabled={state.rover.isAway || state.rover.condition <= 0}
                      onClick={() => {
                        dispatch({
                          type: 'START_EXPEDITION',
                          destinationId: dest.id as RoverDestinationId,
                          crew1: 'daniel',
                          crew2: 'sara',
                        });
                      }}
                      className="w-full mt-1 py-1 rounded bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                    >
                      Launch Sortie (Leo & Mia)
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: RESEARCH LAB */}
            {activeNavTab === 'research' && (
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Analytical Lab:</span>{' '}
                    <strong className={state.lab.activeExperiment ? 'text-sky-400' : 'text-slate-400'}>
                      {state.lab.activeExperiment ? 'Analysis Running' : 'Standby'}
                    </strong>
                  </div>
                  <div className="font-mono text-emerald-400">
                    {state.lab.completedProjects?.length || 0}/6 Unlocked
                  </div>
                </div>

                {Object.values(RESEARCH_PROJECTS).map((proj) => {
                  const isCompleted = state.lab.completedProjects?.includes(proj.id as ResearchProjectId);
                  const isCurrent = state.lab.activeProject === proj.id;
                  return (
                    <div key={proj.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{proj.name}</span>
                        {isCompleted ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            UNLOCKED
                          </span>
                        ) : isCurrent ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-500/20 text-sky-400 animate-pulse border border-sky-500/40">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-sky-400">
                            +{proj.scienceReward} Science
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans">{proj.description}</p>
                      <div className="text-[10px] text-emerald-400">{proj.perkUnlocked}</div>
                      {!isCompleted && !isCurrent && (
                        <button
                          disabled={state.lab.activeExperiment}
                          onClick={() => {
                            dispatch({
                              type: 'START_RESEARCH',
                              projectId: proj.id as ResearchProjectId,
                              crewId: 'sara',
                            });
                          }}
                          className="w-full mt-1 py-1 rounded bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                        >
                          Initiate Research (Mia)
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB: CREW DOSSIERS */}
            {activeNavTab === 'astronauts' && (
              <div className="space-y-2">
                {(['alex', 'sara', 'daniel'] as CrewId[]).map((cid) => {
                  const member = state.crew[cid];
                  if (!member) return null;
                  const info = getCrewDisplayName(member);
                  return (
                    <button
                      key={cid}
                      onClick={() => setSelectedEntity({ type: 'crew', id: cid })}
                      className="w-full p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-white uppercase">{info.name}</span>
                        <span className="text-emerald-400 font-mono">{member.health} HP</span>
                      </div>
                      <div className="text-[10px] text-sky-400 font-medium">{info.role}</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono flex items-center justify-between">
                        <span>Stamina: {member.stamina}/8h</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-slate-500" /> {member.location}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAB: OBJECTIVES */}
            {activeNavTab === 'objectives' && (
              <div className="space-y-2">
                {state.objectives?.map((obj) => (
                  <div key={obj.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {obj.isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Target className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        )}
                        <span>{obj.title}</span>
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          obj.isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {obj.isCompleted ? 'DONE' : `${obj.progress}/${obj.target}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{obj.description}</p>
                    <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-sky-400 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (obj.progress / obj.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: ACHIEVEMENTS */}
            {activeNavTab === 'achievements' && (
              <div className="space-y-1.5">
                {state.achievements?.map((ach) => (
                  <div
                    key={ach.id}
                    className={`p-2 rounded-lg border flex items-center gap-2.5 transition-all ${
                      ach.unlocked
                        ? 'bg-slate-900/80 border-sky-400/50'
                        : 'bg-slate-950/60 border-slate-850 opacity-60'
                    }`}
                  >
                    <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0">
                      {ach.unlocked ? (
                        <Award className="w-4 h-4 text-sky-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{ach.title}</span>
                        {ach.unlocked && (
                          <span className="text-[8px] text-emerald-400 font-bold px-1 py-0.2 bg-emerald-500/20 rounded">
                            SOL {ach.unlockedDay}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans">{ach.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: TELEMETRY REPORTS */}
            {activeNavTab === 'stats' && (
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Oxygen Nominal:</span>
                    <strong className="text-white font-mono">{state.stats.daysOxygenNotRed} Sols</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Battery Above 20%:</span>
                    <strong className="text-white font-mono">{state.stats.daysBatteryAbove20} Sols</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Solar Storms Survived:</span>
                    <strong className="text-sky-400 font-mono">{state.stats.advisoriesSurvived}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Soil Samples Analyzed:</span>
                    <strong className="text-white font-mono">{state.stats.samplesCollected}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Flight Decisions Executed:</span>
                    <strong className="text-white font-mono">{state.stats.decisionsMade.length}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
