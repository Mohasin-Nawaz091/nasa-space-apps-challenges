"use client";

import React from "react";
import { useGameStore } from "../../store/gameStore";
import { LunarSky } from "../environment/LunarSky";
import { LunarTerrain } from "../environment/LunarTerrain";
import { ColonyInfrastructure } from "../environment/ColonyInfrastructure";
import { HabitatModule } from "../buildings/HabitatModule";
import { LifeSupportFacility } from "../buildings/LifeSupportFacility";
import { GreenhouseFacility } from "../buildings/GreenhouseFacility";
import { SolarArrayFacility } from "../buildings/SolarArrayFacility";
import { RadiationShelter } from "../buildings/RadiationShelter";
import { ScienceLaboratory } from "../buildings/ScienceLaboratory";
import { BuildingHighlight } from "../buildings/BuildingHighlight";
import { BuildingFloatingBadge } from "../buildings/BuildingFloatingBadge";
import { GreenhouseInterior } from "../buildings/interiors/GreenhouseInterior";
import { ShelterInterior } from "../buildings/interiors/ShelterInterior";
import { AstronautCrew } from "../astronauts/AstronautCrew";
import { CameraController } from "./CameraController";

export function LunarWorld() {
  const cameraMode = useGameStore((s) => s.cameraMode);
  const selectedBuildingId = useGameStore((s) => s.selectedBuildingId);
  const interiorBuildingId = useGameStore((s) => s.interiorBuildingId);
  const buildings = useGameStore((s) => s.buildings);
  const selectBuilding = useGameStore((s) => s.selectBuilding);
  const gameStage = useGameStore((s) => s.gameStage);
  const stageProgress = useGameStore((s) => s.stageProgress);

  const selectedBuilding = selectedBuildingId ? buildings[selectedBuildingId] : null;

  // Determine current active objective building for Nova's quest guidance
  let objectiveBuildingId: string | null = null;
  if (gameStage === 2) {
    if (!stageProgress.habitat) objectiveBuildingId = "habitat";
    else if (!stageProgress.solar_array) objectiveBuildingId = "solar_array";
    else if (!stageProgress.life_support) objectiveBuildingId = "life_support";
  } else if (gameStage === 3) {
    objectiveBuildingId = "solar_array";
  } else if (gameStage === 4) {
    if (!stageProgress.greenhouse) objectiveBuildingId = "greenhouse";
    else if (!stageProgress.shelter) objectiveBuildingId = "shelter";
    else if (!stageProgress.science_lab) objectiveBuildingId = "science_lab";
  }

  return (
    <>
      <CameraController />

      {/* Mode C: Interior Exploration */}
      {cameraMode === "interior" ? (
        <group>
          {interiorBuildingId === "greenhouse" && <GreenhouseInterior />}
          {interiorBuildingId === "shelter" && <ShelterInterior />}
        </group>
      ) : (
        /* Mode A & B: Full Colony / Inspection */
        <group>
          <LunarSky />
          <LunarTerrain />
          <ColonyInfrastructure />

          {/* 6 Primary Colony Buildings */}
          <HabitatModule
            building={buildings.habitat}
            isSelected={selectedBuildingId === "habitat"}
            onSelect={() => selectBuilding("habitat")}
          />
          <BuildingFloatingBadge
            position={buildings.habitat.position}
            heightOffset={5.5}
            emoji="🏠"
            name="Habitat"
            isSelected={selectedBuildingId === "habitat"}
            isObjective={objectiveBuildingId === "habitat"}
            condition={buildings.habitat.condition}
            onSelect={() => selectBuilding("habitat")}
          />

          <LifeSupportFacility
            building={buildings.life_support}
            isSelected={selectedBuildingId === "life_support"}
            onSelect={() => selectBuilding("life_support")}
          />
          <BuildingFloatingBadge
            position={buildings.life_support.position}
            heightOffset={4.8}
            emoji="💨"
            name="Life Support"
            isSelected={selectedBuildingId === "life_support"}
            isObjective={objectiveBuildingId === "life_support"}
            condition={buildings.life_support.condition}
            onSelect={() => selectBuilding("life_support")}
          />

          <GreenhouseFacility
            building={buildings.greenhouse}
            isSelected={selectedBuildingId === "greenhouse"}
            onSelect={() => selectBuilding("greenhouse")}
          />
          <BuildingFloatingBadge
            position={buildings.greenhouse.position}
            heightOffset={5.2}
            emoji="🌿"
            name="Greenhouse"
            isSelected={selectedBuildingId === "greenhouse"}
            isObjective={objectiveBuildingId === "greenhouse"}
            condition={buildings.greenhouse.condition}
            onSelect={() => selectBuilding("greenhouse")}
          />

          <SolarArrayFacility
            building={buildings.solar_array}
            isSelected={selectedBuildingId === "solar_array"}
            onSelect={() => selectBuilding("solar_array")}
          />
          <BuildingFloatingBadge
            position={buildings.solar_array.position}
            heightOffset={6.2}
            emoji="⚡"
            name="Solar Array"
            isSelected={selectedBuildingId === "solar_array"}
            isObjective={objectiveBuildingId === "solar_array"}
            condition={buildings.solar_array.condition}
            onSelect={() => selectBuilding("solar_array")}
          />

          <RadiationShelter
            building={buildings.shelter}
            isSelected={selectedBuildingId === "shelter"}
            onSelect={() => selectBuilding("shelter")}
          />
          <BuildingFloatingBadge
            position={buildings.shelter.position}
            heightOffset={4.6}
            emoji="🛡️"
            name="Storm Shelter"
            isSelected={selectedBuildingId === "shelter"}
            isObjective={objectiveBuildingId === "shelter"}
            condition={buildings.shelter.condition}
            onSelect={() => selectBuilding("shelter")}
          />

          <ScienceLaboratory
            building={buildings.science_lab}
            isSelected={selectedBuildingId === "science_lab"}
            onSelect={() => selectBuilding("science_lab")}
          />
          <BuildingFloatingBadge
            position={buildings.science_lab.position}
            heightOffset={5.2}
            emoji="🔬"
            name="Science Lab"
            isSelected={selectedBuildingId === "science_lab"}
            isObjective={objectiveBuildingId === "science_lab"}
            condition={buildings.science_lab.condition}
            onSelect={() => selectBuilding("science_lab")}
          />

          {/* Visual Highlight Reticle for Selected Building */}
          {selectedBuilding && (
            <BuildingHighlight
              position={selectedBuilding.position}
              radius={selectedBuilding.type === "solar_array" ? 5.2 : 4.2}
              name={selectedBuilding.name}
            />
          )}

          {/* Astronaut Crew Waypoint Movement */}
          <AstronautCrew />
        </group>
      )}
    </>
  );
}
