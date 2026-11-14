"use client";

import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useGameStore } from "../../store/gameStore";

export function CameraController() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const cameraMode = useGameStore((s) => s.cameraMode);
  const selectedBuildingId = useGameStore((s) => s.selectedBuildingId);
  const interiorBuildingId = useGameStore((s) => s.interiorBuildingId);
  const buildings = useGameStore((s) => s.buildings);
  const selectBuilding = useGameStore((s) => s.selectBuilding);
  const exitInterior = useGameStore((s) => s.exitInterior);
  const enterInterior = useGameStore((s) => s.enterInterior);
  const togglePause = useGameStore((s) => s.togglePause);
  const activeEvent = useGameStore((s) => s.activeEvent);
  const isMainMenuOpen = useGameStore((s) => s.isMainMenuOpen);
  const isBriefingOpen = useGameStore((s) => s.isBriefingOpen);
  const isTutorialActive = useGameStore((s) => s.isTutorialActive);

  // Keyboard keys pressed state
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Transition animation state
  const isTransitioning = useRef(false);
  const transitionProgress = useRef(1); // 1 = transition done
  const transitionStartCam = useRef(new THREE.Vector3());
  const transitionStartTarget = useRef(new THREE.Vector3());
  const transitionEndCam = useRef(new THREE.Vector3(26, 22, 26));
  const transitionEndTarget = useRef(new THREE.Vector3(0, 0, 0));

  // Trigger smooth transition whenever camera mode or selected building changes
  const prevSelection = useRef<string | null>(null);
  const prevMode = useRef<string>(cameraMode);

  useEffect(() => {
    if (!controlsRef.current) return;

    if (cameraMode !== prevMode.current || selectedBuildingId !== prevSelection.current) {
      prevMode.current = cameraMode;
      prevSelection.current = selectedBuildingId;

      transitionStartCam.current.copy(camera.position);
      transitionStartTarget.current.copy(controlsRef.current.target);

      if (cameraMode === "interior") {
        transitionEndCam.current.set(0, 2.4, 5.5);
        transitionEndTarget.current.set(0, 1.8, 0);
      } else if (cameraMode === "inspecting" && selectedBuildingId) {
        const b = buildings[selectedBuildingId];
        if (b) {
          const [bx, by, bz] = b.position;
          transitionEndTarget.current.set(bx, by + 1.2, bz);
          // Position camera at comfortable angle 10 units away
          transitionEndCam.current.set(bx + 9.5, by + 7.0, bz + 9.5);
        }
      } else {
        // Colony Overview Mode
        transitionEndTarget.current.set(0, 0, 0);
        transitionEndCam.current.set(26, 22, 26);
      }

      transitionProgress.current = 0;
      isTransitioning.current = true;
    }
  }, [cameraMode, selectedBuildingId, buildings, camera]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in form inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Don't trigger game controls if modal overlays are open
      if (isMainMenuOpen || isBriefingOpen) return;

      keysPressed.current[e.key.toLowerCase()] = true;

      // Hotkey: Escape (exit interior or deselect building)
      if (e.key === "Escape") {
        if (interiorBuildingId) {
          exitInterior();
        } else if (selectedBuildingId) {
          selectBuilding(null);
        }
      }
      // Hotkey: F (Inspect Interior if supported building selected)
      else if (e.key === "f" || e.key === "F") {
        if (selectedBuildingId && (selectedBuildingId === "greenhouse" || selectedBuildingId === "shelter")) {
          if (interiorBuildingId) {
            exitInterior();
          } else {
            enterInterior(selectedBuildingId);
          }
        }
      }
      // Hotkey: Number Keys 1-6 to quick select facilities
      else if (!isTutorialActive && !activeEvent) {
        if (e.key === "1") selectBuilding("habitat");
        else if (e.key === "2") selectBuilding("life_support");
        else if (e.key === "3") selectBuilding("greenhouse");
        else if (e.key === "4") selectBuilding("solar_array");
        else if (e.key === "5") selectBuilding("shelter");
        else if (e.key === "6") selectBuilding("science_lab");
      }

      // Hotkey: Space to Pause / Resume simulation
      if ((e.key === " " || e.code === "Space") && !activeEvent && !isTutorialActive) {
        e.preventDefault();
        togglePause();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    selectedBuildingId,
    interiorBuildingId,
    activeEvent,
    isMainMenuOpen,
    isBriefingOpen,
    isTutorialActive,
    selectBuilding,
    exitInterior,
    enterInterior,
    togglePause,
  ]);

  // Frame Loop: Smooth transitions and active keyboard WASD / Arrow movement
  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // 1. If transitioning, smoothly interpolate camera to new focal point
    if (isTransitioning.current) {
      transitionProgress.current += delta * 2.2; // ~0.45 second transition
      if (transitionProgress.current >= 1) {
        transitionProgress.current = 1;
        isTransitioning.current = false;
      }

      // Smooth step easing
      const t = transitionProgress.current;
      const ease = t * t * (3 - 2 * t);

      camera.position.lerpVectors(
        transitionStartCam.current,
        transitionEndCam.current,
        ease
      );
      controlsRef.current.target.lerpVectors(
        transitionStartTarget.current,
        transitionEndTarget.current,
        ease
      );
      controlsRef.current.update();
      return;
    }

    // If modal is open, don't move camera
    if (isMainMenuOpen || isBriefingOpen) return;

    // 2. Active Keyboard Movement (WASD / Arrow Keys for Pan, Q/E for Rotate)
    const keys = keysPressed.current;
    const moveSpeed = delta * 18;
    const rotateSpeed = delta * 1.5;

    // Forward/Backward & Left/Right vectors based on camera horizontal angle
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const moveDelta = new THREE.Vector3();

    // W / ArrowUp: Move forward
    if (keys["w"] || keys["arrowup"]) {
      moveDelta.addScaledVector(forward, moveSpeed);
    }
    // S / ArrowDown: Move backward
    if (keys["s"] || keys["arrowdown"]) {
      moveDelta.addScaledVector(forward, -moveSpeed);
    }
    // A / ArrowLeft: Move left
    if (keys["a"] || keys["arrowleft"]) {
      moveDelta.addScaledVector(right, -moveSpeed);
    }
    // D / ArrowRight: Move right
    if (keys["d"] || keys["arrowright"]) {
      moveDelta.addScaledVector(right, moveSpeed);
    }

    if (moveDelta.lengthSq() > 0) {
      camera.position.add(moveDelta);
      controlsRef.current.target.add(moveDelta);
    }

    // Q / E: Rotate view around current target
    if (keys["q"]) {
      // Rotate left
      const offset = camera.position.clone().sub(controlsRef.current.target);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotateSpeed);
      camera.position.copy(controlsRef.current.target).add(offset);
    }
    if (keys["e"]) {
      // Rotate right
      const offset = camera.position.clone().sub(controlsRef.current.target);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -rotateSpeed);
      camera.position.copy(controlsRef.current.target).add(offset);
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={4}
      maxDistance={70}
      maxPolarAngle={Math.PI / 2 - 0.04} // Prevents camera from dipping beneath terrain!
      rotateSpeed={0.8}
      panSpeed={1.0}
      zoomSpeed={1.2}
    />
  );
}
