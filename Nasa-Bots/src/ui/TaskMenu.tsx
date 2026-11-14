/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/ui/TaskMenu.tsx
 * Task assignment menu with complete Cost Preview (hours, power, parts, risk)
 * for the 3 primary astronauts: ALEX (Engineer), MIA (Scientist), and LEO (Botanist).
 */

import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/store.ts';
import { CrewId, CropType } from '../sim/types.ts';
import { getCrewDisplayName } from '../sim/rules/crew.ts';
import { eventBus } from '../store/bus.ts';
import {
  Wrench,
  Search,
  RotateCw,
  Move,
  Sprout,
  Shield,
  Truck,
  Cpu,
  Radio,
  X,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

const PRIMARY_CREW_IDS: CrewId[] = ['alex', 'sara', 'daniel'];

export const TaskMenu: React.FC = () => {
  const buildingId = useGameStore((s) => s.taskTargetBuilding);
  const activeModal = useGameStore((s) => s.activeModal);
  const activePlayerCrew = useGameStore((s) => s.activePlayerCrew);
  const state = useGameStore((s) => s.state);
  const dispatch = useGameStore((s) => s.dispatch);
  const setModal = useGameStore((s) => s.setModal);

  const [selectedCrew, setSelectedCrew] = useState<CrewId>('alex');
  const [selectedCrop, setSelectedCrop] = useState<CropType>('quick_greens');
  const [selectedBed, setSelectedBed] = useState<'bed1' | 'bed2'>('bed1');

  // Sync selected astronaut with physically controlled astronaut on open
  useEffect(() => {
    if (activeModal === 'task_menu' && activePlayerCrew) {
      if (PRIMARY_CREW_IDS.includes(activePlayerCrew)) {
        setSelectedCrew(activePlayerCrew);
      } else {
        setSelectedCrew('alex');
      }
    }
  }, [activeModal, activePlayerCrew]);

  // ESC key closes Task Menu immediately
  useEffect(() => {
    if (activeModal !== 'task_menu') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setModal('none');
        eventBus.emit('sound:play', { name: 'click' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, setModal]);

  if (activeModal !== 'task_menu' || !buildingId) return null;

  const closeMenu = () => {
    setModal('none');
    eventBus.emit('sound:play', { name: 'click' });
  };
  const crewMember = state.crew[selectedCrew];
  const crewInfo = getCrewDisplayName(crewMember);

  // Helper to preview and validate cost
  const getPreview = (
    hours: number,
    power: number,
    parts: number,
    riskDesc: string
  ) => {
    const hasHours = crewMember.stamina >= hours;
    const hasPower = state.resources.battery >= power;
    const hasParts = state.resources.spareParts >= parts;
    const canAfford = hasPower && hasParts;

    return {
      hours,
      power,
      parts,
      risk: riskDesc,
      canAfford,
      overtimeWarning: !hasHours,
    };
  };

  const minorRepairHours = selectedCrew === 'alex' ? 3 : 4;
  const majorRepairHours = selectedCrew === 'alex' ? 7 : 8;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none pointer-events-auto font-mono"
      onClick={closeMenu}
    >
      <div
        className="bg-slate-950 border border-slate-800 rounded-xl max-w-lg w-full p-5 shadow-2xl text-slate-200 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">
                Flight Operations
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 uppercase">{buildingId.replace('_', ' ')}</span>
            </div>
            <h2 className="text-base font-black text-white capitalize mt-0.5">
              Task Assignment & Cost Preview
            </h2>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeMenu();
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer border border-slate-800"
            title="Close Menu (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Primary Astronaut Selectors */}
        <div className="mb-4">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Assign Specialist:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRIMARY_CREW_IDS.map((cid) => {
              const c = state.crew[cid];
              const info = getCrewDisplayName(c);
              const isSel = selectedCrew === cid;

              return (
                <button
                  key={cid}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCrew(cid);
                    eventBus.emit('sound:play', { name: 'click' });
                  }}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSel
                      ? 'bg-sky-500/20 border-sky-400 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="w-full">
                    <div className="text-xs font-bold uppercase text-white flex items-center justify-between">
                      <span>{info.name}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">{c.health}HP</span>
                    </div>
                    <div className="text-[9px] text-sky-400 truncate mt-0.5">
                      {info.shortRole}
                    </div>
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono mt-2 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                    <span>Stamina</span>
                    <span className="text-white font-bold">{c.stamina}/8h</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="text-[10px] text-slate-400 mt-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 font-sans flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>
              <strong className="text-white font-mono">{crewInfo.name}</strong> ({crewInfo.role}):{' '}
              <span className="text-slate-300">{crewMember.perk}</span>
            </span>
          </div>
        </div>

        {/* Available Tasks List with Live Cost Preview */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 text-xs">
          {/* Universal Task 1: Move Crew */}
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-slate-400" />
                <span>Relocate Specialist to Module</span>
              </div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                Physical transit across lunar colony plateau
              </div>
            </div>
            <button
              onClick={() => {
                dispatch({
                  type: 'MOVE_CREW',
                  crewId: selectedCrew,
                  targetBuilding: buildingId,
                });
                closeMenu();
              }}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Relocate
            </button>
          </div>

          {/* Universal Task 2: Inspect Hardware */}
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-sky-400" />
                <span>Diagnostic Inspection (1h)</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Cost: 1h stamina · 0 kWh · 0 parts
              </div>
            </div>
            <button
              onClick={() => {
                dispatch({
                  type: 'ASSIGN_TASK',
                  crewId: selectedCrew,
                  taskType: 'inspect',
                  buildingId,
                });
                closeMenu();
              }}
              className="px-3 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
            >
              Inspect
            </button>
          </div>

          {/* Universal Task 3: Minor Repair */}
          {(() => {
            const preview = getPreview(minorRepairHours, 0, 1, 'Restores +30 condition.');
            return (
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Routine Maintenance (+30% condition)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Cost: <strong className="text-sky-300">{minorRepairHours}h</strong> stamina · 0 parts
                  </div>
                  {preview.overtimeWarning && (
                    <div className="text-[9px] text-amber-400 flex items-center gap-1 mt-0.5">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>Exceeds daily stamina (-3 HP fatigue penalty)</span>
                    </div>
                  )}
                </div>
                <button
                  disabled={!preview.canAfford}
                  onClick={() => {
                    dispatch({
                      type: 'ASSIGN_TASK',
                      crewId: selectedCrew,
                      taskType: 'minor_repair',
                      buildingId,
                    });
                    closeMenu();
                  }}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                    preview.canAfford
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Repair
                </button>
              </div>
            );
          })()}

          {/* Universal Task 4: Major Repair */}
          {(() => {
            const preview = getPreview(majorRepairHours, 5, 2, 'Restores 100% & clears faults.');
            return (
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Component Overhaul (Restore 100%)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Cost: <strong className="text-sky-300">{majorRepairHours}h</strong> ·{' '}
                    <strong className="text-sky-300">5 kWh</strong> ·{' '}
                    <strong className="text-amber-300">{selectedCrew === 'alex' ? '1 part' : '2 parts'}</strong>
                  </div>
                </div>
                <button
                  disabled={!preview.canAfford}
                  onClick={() => {
                    dispatch({
                      type: 'ASSIGN_TASK',
                      crewId: selectedCrew,
                      taskType: 'major_repair',
                      buildingId,
                    });
                    closeMenu();
                  }}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                    preview.canAfford
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Overhaul
                </button>
              </div>
            );
          })()}

          {/* Building-Specific: Greenhouse Operations */}
          {buildingId === 'greenhouse' && (
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5" />
                <span>Hydroponic Crop Management</span>
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedBed}
                  onChange={(e) => setSelectedBed(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-xs rounded px-2 py-1 text-slate-200 font-mono"
                >
                  <option value="bed1">Bed 1 (Active)</option>
                  <option value="bed2" disabled={!state.greenhouseBeds.bed2.unlocked}>
                    Bed 2 {state.greenhouseBeds.bed2.unlocked ? '(Active)' : '(Locked Day 6)'}
                  </option>
                </select>

                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-xs rounded px-2 py-1 text-slate-200 font-mono"
                >
                  <option value="quick_greens">Microgreens (8d, +12 Food)</option>
                  <option value="dwarf_tomatoes">Dwarf Tomatoes (11d, +18 Food)</option>
                  <option value="potatoes">Potatoes (14d, +30 Food)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    dispatch({
                      type: 'ASSIGN_TASK',
                      crewId: selectedCrew,
                      taskType: 'plant_crop',
                      buildingId: 'greenhouse',
                      bedId: selectedBed,
                      cropType: selectedCrop,
                    });
                    closeMenu();
                  }}
                  className="flex-1 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  Plant Seeds (2h)
                </button>

                <button
                  onClick={() => {
                    dispatch({
                      type: 'ASSIGN_TASK',
                      crewId: selectedCrew,
                      taskType: 'harvest_crop',
                      buildingId: 'greenhouse',
                      bedId: selectedBed,
                    });
                    closeMenu();
                  }}
                  className="flex-1 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  Harvest Crop
                </button>
              </div>
            </div>
          )}

          {/* Building-Specific: Radiation Shelter Shield Layer Upgrade */}
          {buildingId === 'shelter' && (
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Build Sintered Shield Layer</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Cost: 10h · 8 kWh · 1 part (Built: {state.resources.shieldLayersBuilt}/3)
                </div>
              </div>
              <button
                disabled={
                  state.resources.shieldLayersBuilt >= 3 ||
                  state.resources.spareParts < 1 ||
                  state.resources.battery < 8
                }
                onClick={() => {
                  dispatch({ type: 'BUILD_SHIELD_LAYER' });
                  closeMenu();
                }}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  state.resources.shieldLayersBuilt < 3 &&
                  state.resources.spareParts >= 1 &&
                  state.resources.battery >= 8
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Build Layer
              </button>
            </div>
          )}

          {/* Building-Specific: Rover Sampling Expedition */}
          {buildingId === 'rover_bay' && (
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Crater Surface Sortie (6h)</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Cost: 6h · 20 kWh · -10% chassis (+15 science)
                </div>
              </div>
              <button
                disabled={
                  state.rover.isAway ||
                  state.rover.condition <= 0 ||
                  state.resources.battery < 20
                }
                onClick={() => {
                  dispatch({
                    type: 'START_ROVER_TRIP',
                    crew1: 'daniel',
                    crew2: selectedCrew === 'daniel' ? 'alex' : selectedCrew,
                  });
                  closeMenu();
                }}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  !state.rover.isAway &&
                  state.rover.condition > 0 &&
                  state.resources.battery >= 20
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Launch Sortie
              </button>
            </div>
          )}

          {/* Building-Specific: Laboratory Research Experiment */}
          {buildingId === 'laboratory' && (
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Mass-Spectrometer Regolith Analysis</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Cost: 4h · 15 kWh/Sol for 3 Sols (+10 science)
                </div>
              </div>
              <button
                disabled={state.lab.activeExperiment || state.lab.condition <= 0}
                onClick={() => {
                  dispatch({ type: 'START_EXPERIMENT', crewId: selectedCrew });
                  closeMenu();
                }}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  !state.lab.activeExperiment && state.lab.condition > 0
                    ? 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {state.lab.activeExperiment ? 'Running...' : 'Start'}
              </button>
            </div>
          )}

          {/* Building-Specific: Ask Mission Control */}
          {buildingId === 'comms' && (
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Houston Flight Control Consultation</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Cost: 1h · 5 kWh (+2 science telemetry)
                </div>
              </div>
              <button
                disabled={state.systems.comms.condition < 25 || state.resources.battery < 5}
                onClick={() => {
                  dispatch({ type: 'ASK_MISSION_CONTROL', crewId: selectedCrew });
                  closeMenu();
                }}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  state.systems.comms.condition >= 25 && state.resources.battery >= 5
                    ? 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Consult
              </button>
            </div>
          )}
        </div>

        {/* Footer Dismiss Button */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[10px] text-slate-500">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-400 font-mono text-[9px]">ESC</kbd> to cancel
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeMenu();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer border border-slate-800"
          >
            Cancel Orders
          </button>
        </div>
      </div>
    </div>
  );
};
