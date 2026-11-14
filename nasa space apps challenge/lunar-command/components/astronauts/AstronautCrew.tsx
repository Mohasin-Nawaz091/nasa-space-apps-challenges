"use client";

import React from "react";
import { useGameStore } from "../../store/gameStore";
import { SingleInteractiveAstronaut } from "./SingleInteractiveAstronaut";
import { DestinationMarker } from "./DestinationMarker";

export function AstronautCrew() {
  const astronauts = useGameStore((s) => s.astronauts);
  const selectedAstronautId = useGameStore((s) => s.selectedAstronautId);
  const selectAstronaut = useGameStore((s) => s.selectAstronaut);
  const cameraMode = useGameStore((s) => s.cameraMode);

  // Hide exterior crew when inside building interior
  if (cameraMode === "interior") return null;

  return (
    <group>
      {/* 3D Destination Pulsing Reticle */}
      <DestinationMarker />

      {/* 3 Interactive Astronauts: Alex, Mia, Leo */}
      {astronauts.map((astronaut) => (
        <SingleInteractiveAstronaut
          key={astronaut.id}
          astronaut={astronaut}
          isSelected={selectedAstronautId === astronaut.id}
          onSelect={() => selectAstronaut(astronaut.id)}
        />
      ))}
    </group>
  );
}
