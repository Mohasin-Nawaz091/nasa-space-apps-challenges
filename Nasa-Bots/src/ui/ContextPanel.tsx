/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/ui/ContextPanel.tsx
 * Right contextual tactical inspection panel for Selected Building
 * (Status, Condition %, Power kWh/Sol, Available Actions: Inspect, Assign, Repair, Operating Mode)
 * and Selected Crew Specialist (ALEX, MIA, LEO — Biometrics, Assignment, Orders).
 */

import React, { useState } from 'react';
import { useGameStore } from '../store/store.ts';
import { BuildingId, CrewId, CropType } from '../sim/types.ts';
import { getCrewDisplayName } from '../sim/rules/crew.ts';
import { getUpgradesForBuilding } from '../sim/rules/upgrades.ts';
import {
  Building2,
  Zap,
  FlaskConical,
  Droplets,
  ShieldAlert,
  Cpu,
  Radio,
  Truck,
  Wrench,
  Search,
  RotateCw,
  X,
  Sprout,
  Heart,
  Battery,
  MapPin,
  ChevronRight,
  Shield,
  Sparkles,
} from 'lucide-react';

const MODULE_DATA: Record<
  BuildingId,
  {
    name: string;
    code: string;
    subsystem: string;
    icon: React.ComponentType<{ className?: string }>;
    basePower: string;
    role: string;
  }
> = {
  habitat: {
    name: 'HABITAT COMMAND',
    code: 'HAB-01',
    subsystem: 'ECLSS Thermal & Life Support',
    icon: Building2,
    basePower: '-15 kWh / Sol',
    role: 'Base Crew Living Quarters',
  },
  power_station: {
    name: 'SOLAR POWER ARRAY',
    code: 'EPS-01',
    subsystem: 'Photovoltaic Cell Substation',
    icon: Zap,
    basePower: '+120 kWh / Sol (Peak)',
    role: 'Primary Outpost Energy Grid',
  },
  greenhouse: {
    name: 'HYDROPONIC GREENHOUSE',
    code: 'BIO-01',
    subsystem: 'Vertical Aeroponic Grow Racks',
    icon: FlaskConical,
    basePower: '-12 kWh / Sol',
    role: 'Fresh Calorie & Oxygen Generation',
  },
  recycler: {
    name: 'WATER RECYCLER',
    code: 'ECLSS-01',
    subsystem: 'Vacuum Distillation Unit',
    icon: Droplets,
    basePower: '-8 kWh / Sol',
    role: '75% Closed-Loop Wastewater Recovery',
  },
  shelter: {
    name: 'RADIATION SHELTER',
    code: 'RAD-01',
    subsystem: 'Sintered Regolith Storm Bunker',
    icon: ShieldAlert,
    basePower: '-5 kWh / Sol',
    role: 'High-Energy Solar Flare Protection',
  },
  laboratory: {
    name: 'SCIENCE LABORATORY',
    code: 'LAB-01',
    subsystem: 'Regolith Mass-Spectrometer',
    icon: Cpu,
    basePower: '-10 kWh / Sol',
    role: 'Core Sample & Volatile Research',
  },
  comms: {
    name: 'COMMS PHASED DISH',
    code: 'COM-01',
    subsystem: 'Deep Space Network Antenna',
    icon: Radio,
    basePower: '-6 kWh / Sol',
    role: 'Earth Houston Telemetry Uplink',
  },
  rover_bay: {
    name: 'ROVER MAINTENANCE BAY',
    code: 'BAY-01',
    subsystem: 'Robotic Umbilical Gantry',
    icon: Truck,
    basePower: '-4 kWh / Sol',
    role: 'Exploration Sortie Staging & Recharging',
  },
};

export const ContextPanel: React.FC = () => {
  const selectedEntity = useGameStore((s) => s.selectedEntity);
  const setSelectedEntity = useGameStore((s) => s.setSelectedEntity);
  const state = useGameStore((s) => s.state);
  const dispatch = useGameStore((s) => s.dispatch);

  const [activeTab, setActiveTab] = useState<'actions' | 'upgrades'>('actions');
  const [selectedWorker, setSelectedWorker] = useState<CrewId>('alex');
  const [selectedBed, setSelectedBed] = useState<'bed1' | 'bed2'>('bed1');
  const [selectedCrop, setSelectedCrop] = useState<CropType>('quick_greens');

  if (!selectedEntity) return null;

  // 1. BUILDING INSPECTION & ACTIONS
  if (selectedEntity.type === 'building') {
    const bid = selectedEntity.id;
    const meta = MODULE_DATA[bid] || {
      name: bid.toUpperCase(),
      code: 'MOD-01',
      subsystem: 'Auxiliary System',
      icon: Building2,
      basePower: '0 kWh / Sol',
      role: 'Outpost Infrastructure',
    };
    const Icon = meta.icon;

    // Condition & status telemetry
    let condition = 100;
    let isFaulted = false;
    if (bid === 'power_station') {
      condition = state.systems.solarArray.condition;
      isFaulted = state.systems.solarArray.isFaulted;
    } else if (bid === 'habitat') {
      condition = state.systems.lifeSupport.condition;
      isFaulted = state.systems.lifeSupport.isFaulted;
    } else if (bid === 'recycler') {
      condition = state.systems.recycler.condition;
      isFaulted = state.systems.recycler.isFaulted;
    } else if (bid === 'greenhouse') {
      condition = state.systems.greenhouse.condition;
      isFaulted = state.systems.greenhouse.isFaulted;
    } else if (bid === 'comms') {
      condition = state.systems.comms.condition;
      isFaulted = state.systems.comms.isFaulted;
    } else if (bid === 'rover_bay') {
      condition = state.rover.condition;
      isFaulted = state.rover.isFaulted;
    }

    let statusLabel = 'Operational';
    let statusClass = 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
    let conditionBarClass = 'bg-emerald-400';
    if (isFaulted || condition < 25) {
      statusLabel = 'Critical Fault';
      statusClass = 'text-rose-400 bg-rose-500/20 border-rose-500/40';
      conditionBarClass = 'bg-rose-400';
    } else if (condition < 65) {
      statusLabel = 'Degraded';
      statusClass = 'text-amber-400 bg-amber-500/20 border-amber-500/40';
      conditionBarClass = 'bg-amber-400';
    } else if (condition < 90) {
      statusLabel = 'Nominal';
      statusClass = 'text-sky-400 bg-sky-500/20 border-sky-500/40';
      conditionBarClass = 'bg-sky-400';
    }

    const upgrades = getUpgradesForBuilding(bid);
    const isAlex = selectedWorker === 'alex';
    const workerInfo = getCrewDisplayName(state.crew[selectedWorker]);

    return (
      <div className="absolute right-3 top-20 bottom-24 w-88 bg-slate-950/95 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-xl z-20 flex flex-col overflow-hidden text-slate-200 select-none pointer-events-auto animate-fadeIn font-mono">
        {/* Module Header */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/40 flex items-center justify-center text-sky-400">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black text-white tracking-wider">{meta.name}</h3>
                <span className="text-[9px] text-slate-400">{meta.code}</span>
              </div>
              <div className="text-[10px] text-sky-400 font-sans">{meta.subsystem}</div>
            </div>
          </div>
          <button
            onClick={() => setSelectedEntity(null)}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Status & Power Ribbon */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-900/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[10px] uppercase">Operating Status:</span>
            <span className={`px-2 py-0.2 rounded text-[9px] font-bold border ${statusClass}`}>
              {statusLabel}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 text-[10px] uppercase">Structural Integrity:</span>
              <span className="font-bold text-white font-mono text-xs">{condition}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full ${conditionBarClass} rounded-full transition-all duration-300`}
                style={{ width: `${condition}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-slate-400 text-[10px] uppercase">Energy Impact:</span>
            <span className="font-bold text-sky-400 font-mono text-xs">{meta.basePower}</span>
          </div>
        </div>

        {/* Tab Switcher: Actions vs Upgrades */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 text-xs">
          <button
            onClick={() => setActiveTab('actions')}
            className={`flex-1 py-2 font-bold transition-colors cursor-pointer text-center ${
              activeTab === 'actions'
                ? 'text-sky-400 border-b-2 border-sky-400 bg-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AVAILABLE ACTIONS
          </button>
          <button
            onClick={() => setActiveTab('upgrades')}
            className={`flex-1 py-2 font-bold transition-colors cursor-pointer text-center ${
              activeTab === 'upgrades'
                ? 'text-sky-400 border-b-2 border-sky-400 bg-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            TECH UPGRADES ({upgrades.length})
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="p-3 overflow-y-auto space-y-3 flex-1 text-xs">
          {activeTab === 'actions' ? (
            <div className="space-y-3">
              {/* Specialist Selector for Task Assignment */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Assign Specialist:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['alex', 'sara', 'daniel'] as CrewId[]).map((cid) => {
                    const cinfo = getCrewDisplayName(state.crew[cid]);
                    const isPicked = selectedWorker === cid;
                    return (
                      <button
                        key={cid}
                        onClick={() => setSelectedWorker(cid)}
                        className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          isPicked
                            ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold'
                            : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-bold">{cinfo.name}</div>
                        <div className="text-[8px] text-slate-400">{cinfo.shortRole}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action 1: Diagnostic Inspection */}
              <button
                onClick={() => {
                  dispatch({
                    type: 'ASSIGN_TASK',
                    crewId: selectedWorker,
                    taskType: 'inspect',
                    buildingId: bid,
                  });
                }}
                className="w-full p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-sky-400 flex items-center justify-between transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-sky-300">
                      Inspect Subsystems
                    </div>
                    <div className="text-[9px] text-slate-400">
                      1h diagnostic verify · Detect early micro-faults
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-sky-400" />
              </button>

              {/* Action 2: Routine Maintenance / Minor Repair */}
              <button
                disabled={condition >= 100}
                onClick={() => {
                  dispatch({
                    type: 'ASSIGN_TASK',
                    crewId: selectedWorker,
                    taskType: 'minor_repair',
                    buildingId: bid,
                  });
                }}
                className="w-full p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-400 disabled:opacity-40 flex items-center justify-between transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                    <Wrench className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300">
                      Routine Maintenance (3h)
                    </div>
                    <div className="text-[9px] text-slate-400">
                      +30% condition · Zero spare parts consumed
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400" />
              </button>

              {/* Action 3: Major Overhaul / Critical Repair */}
              <button
                disabled={condition >= 90 || state.resources.spareParts < (isAlex ? 1 : 2)}
                onClick={() => {
                  dispatch({
                    type: 'ASSIGN_TASK',
                    crewId: selectedWorker,
                    taskType: 'major_repair',
                    buildingId: bid,
                  });
                }}
                className="w-full p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 disabled:opacity-40 flex items-center justify-between transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <RotateCw className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-amber-300">
                      Full Component Overhaul (7h)
                    </div>
                    <div className="text-[9px] text-slate-400">
                      Restore 100% · Costs {isAlex ? '1 part (Alex)' : '2 parts'}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400" />
              </button>

              {/* Action 4: Module-Specific Operating Subsystems */}
              {bid === 'greenhouse' && (
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase flex items-center justify-between">
                    <span>Hydroponic Bed Controller</span>
                    <Sprout className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex gap-1.5 text-[10px]">
                    {(['bed1', 'bed2'] as const).map((b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedBed(b)}
                        className={`flex-1 py-1 rounded font-bold transition-all cursor-pointer ${
                          selectedBed === b
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Bed {b === 'bed1' ? '1 (Active)' : '2 (D6 Unlock)'}
                      </button>
                    ))}
                  </div>

                  {state.greenhouseBeds[selectedBed].stage === 'ready' ? (
                    <button
                      onClick={() => {
                        dispatch({
                          type: 'ASSIGN_TASK',
                          crewId: selectedWorker,
                          taskType: 'harvest_crop',
                          buildingId: 'greenhouse',
                          bedId: selectedBed,
                        });
                      }}
                      className="w-full py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                    >
                      Harvest Fresh Food Yield!
                    </button>
                  ) : state.greenhouseBeds[selectedBed].stage === 'growing' ? (
                    <button
                      onClick={() => {
                        dispatch({
                          type: 'ASSIGN_TASK',
                          crewId: selectedWorker,
                          taskType: 'tend_crop',
                          buildingId: 'greenhouse',
                          bedId: selectedBed,
                        });
                      }}
                      className="w-full py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                    >
                      Tend Aeroponics & Inspect Roots (1h)
                    </button>
                  ) : (
                    <div className="space-y-1.5">
                      <select
                        value={selectedCrop}
                        onChange={(e) => setSelectedCrop(e.target.value as CropType)}
                        className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="quick_greens">Microgreens (8d, +12 Food)</option>
                        <option value="dwarf_tomatoes">Dwarf Tomatoes (11d, +18 Food)</option>
                        <option value="potatoes">High-Calorie Potatoes (14d, +30 Food)</option>
                      </select>
                      <button
                        onClick={() => {
                          dispatch({
                            type: 'ASSIGN_TASK',
                            crewId: selectedWorker,
                            taskType: 'plant_crop',
                            buildingId: 'greenhouse',
                            bedId: selectedBed,
                            cropType: selectedCrop,
                          });
                        }}
                        className="w-full py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                      >
                        Sow Crop Bed (2h)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {bid === 'shelter' && (
                <button
                  disabled={state.resources.shieldLayersBuilt >= 3}
                  onClick={() => dispatch({ type: 'BUILD_SHIELD_LAYER' })}
                  className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>
                    Build Sintered Shield Layer ({state.resources.shieldLayersBuilt}/3)
                  </span>
                </button>
              )}
            </div>
          ) : (
            /* TECH UPGRADES SUB-TAB */
            <div className="space-y-2">
              {upgrades.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No hardware upgrades cataloged for this module.
                </div>
              ) : (
                upgrades.map((u) => {
                  const isInstalled = state.upgrades?.[u.id];
                  return (
                    <div key={u.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{u.name}</span>
                        {isInstalled ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            INSTALLED
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400">
                            {u.costParts} parts · {u.costPower} pwr
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans">{u.description}</p>
                      <div className="text-[10px] text-sky-400">{u.benefit}</div>
                      {!isInstalled && (
                        <button
                          disabled={state.resources.spareParts < u.costParts || state.resources.battery < u.costPower}
                          onClick={() => {
                            dispatch({
                              type: 'PURCHASE_UPGRADE',
                              buildingId: bid,
                              upgradeId: u.id,
                              crewId: selectedWorker,
                            });
                          }}
                          className="w-full mt-1 py-1 rounded bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                        >
                          Install Upgrade ({workerInfo.name})
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. CREW SPECIALIST COMMAND & DOSSIER
  if (selectedEntity.type === 'crew') {
    const member = state.crew[selectedEntity.id];
    if (!member) return null;
    const info = getCrewDisplayName(member);

    return (
      <div className="absolute right-3 top-20 bottom-24 w-88 bg-slate-950/95 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-xl z-20 flex flex-col overflow-hidden text-slate-200 select-none pointer-events-auto animate-fadeIn font-mono">
        {/* Header */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/40 flex items-center justify-center text-sky-400 font-bold text-xs">
              {info.name[0]}
            </div>
            <div>
              <h3 className="text-xs font-black text-white tracking-wider uppercase">
                {info.fullName}
              </h3>
              <div className="text-[10px] text-sky-400 font-sans">{info.role}</div>
            </div>
          </div>
          <button
            onClick={() => setSelectedEntity(null)}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Biometrics */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-900/40 grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[9px] text-slate-400 uppercase flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 text-rose-400" />
              <span>Biometric HP</span>
            </div>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
              {member.health} <span className="text-xs text-slate-500">HP</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[9px] text-slate-400 uppercase flex items-center gap-1">
              <Battery className="w-2.5 h-2.5 text-sky-400" />
              <span>EVA Stamina</span>
            </div>
            <div className="text-base font-bold text-white font-mono mt-0.5">
              {member.stamina} <span className="text-xs text-slate-500">/ 8h</span>
            </div>
          </div>
        </div>

        {/* Duty Status & Perk */}
        <div className="p-3 overflow-y-auto space-y-2.5 flex-1 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">Current Assignment</div>
            <div className="text-xs font-bold text-white mt-1">
              {member.currentTask
                ? `${member.currentTask.type.replace('_', ' ').toUpperCase()} at ${member.currentTask.buildingId.toUpperCase()}`
                : 'OFF DUTY / ON CALL'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono flex items-center gap-1">
              <MapPin className="w-3 h-3 text-sky-400" />
              <span>Location: {member.location}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-sky-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Specialized Mission Perk</span>
            </div>
            <div className="text-[11px] text-slate-300 font-sans mt-0.5">{member.perk}</div>
          </div>

          {/* Direct Relocation Orders */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">
              Direct Orders — Relocate:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['habitat', 'shelter', 'greenhouse', 'laboratory'] as BuildingId[]).map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    dispatch({
                      type: 'MOVE_CREW',
                      crewId: member.id,
                      targetBuilding: loc,
                    });
                  }}
                  className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-sky-500 hover:text-slate-950 border border-slate-800 hover:border-sky-400 text-slate-300 text-xs font-bold transition-all capitalize cursor-pointer text-left flex items-center justify-between"
                >
                  <span>{loc}</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
