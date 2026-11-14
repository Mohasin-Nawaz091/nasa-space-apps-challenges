/**
 * LUNAR FRONTIER: THE LAST 30 DAYS
 * src/game3d/Characters/PlayerController.tsx
 * Real-time third-person astronaut controller: WASD movement, sprint, direct interaction [E], and quick astronaut switching [Q, 1-4, Tab].
 */

import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/store.ts';
import { BUILDING_COORDINATES } from '../../sim/rules/crew.ts';
import { BuildingId, CrewId } from '../../sim/types.ts';
import { eventBus } from '../../store/bus.ts';

const CREW_LIST: CrewId[] = ['alex', 'sara', 'daniel'];

export const PlayerController: React.FC = () => {
  const { camera } = useThree();

  const activePlayerCrew = useGameStore((s) => s.activePlayerCrew);
  const setActivePlayerCrew = useGameStore((s) => s.setActivePlayerCrew);
  const updateAstronautPosition = useGameStore((s) => s.updateAstronautPosition);
  const setNearbyBuilding = useGameStore((s) => s.setNearbyBuilding);
  const nearbyBuilding = useGameStore((s) => s.nearbyBuilding);
  const setSelectedEntity = useGameStore((s) => s.setSelectedEntity);
  const openTaskMenu = useGameStore((s) => s.openTaskMenu);
  const activeModal = useGameStore((s) => s.activeModal);
  const crewTargets = useGameStore((s) => s.crewTargets);
  const setCrewTarget = useGameStore((s) => s.setCrewTarget);
  const setDestinationMarker = useGameStore((s) => s.setDestinationMarker);
  const cameraMode = useGameStore((s) => s.cameraMode);

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const currentPos = useRef(new THREE.Vector3(-2, 0, -1));
  const currentRotation = useRef(0);

  // Setup keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toLowerCase();
      keysPressed.current[key] = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        keysPressed.current['shift'] = true;
      }

      // 3 Primary Specialists: [1] ALEX · [2] MIA · [3] LEO
      if (e.key === '1') setActivePlayerCrew('alex');
      if (e.key === '2') setActivePlayerCrew('sara');
      if (e.key === '3') setActivePlayerCrew('daniel');

      // Cycle previous astronaut: Q
      if (key === 'q') {
        const currIdx = CREW_LIST.indexOf(activePlayerCrew);
        const prevIdx = (currIdx - 1 + CREW_LIST.length) % CREW_LIST.length;
        setActivePlayerCrew(CREW_LIST[prevIdx]);
      }

      // Physical interaction key: E
      if (key === 'e') {
        if (nearbyBuilding && activeModal === 'none') {
          setSelectedEntity(null);
          openTaskMenu(nearbyBuilding);
          eventBus.emit('sound:play', { name: 'click' });
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current[key] = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        keysPressed.current['shift'] = false;
      }
    };

    // First-person mouse look drag
    let isDragging = false;
    let prevMouseX = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (useGameStore.getState().cameraMode === 'eye') {
        isDragging = true;
        prevMouseX = e.clientX;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && useGameStore.getState().cameraMode === 'eye') {
        const dx = e.clientX - prevMouseX;
        prevMouseX = e.clientX;
        currentRotation.current += dx * 0.005;
        updateAstronautPosition(activePlayerCrew, {
          x: currentPos.current.x,
          z: currentPos.current.z,
          rotation: currentRotation.current,
        });
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    activePlayerCrew,
    nearbyBuilding,
    activeModal,
    setActivePlayerCrew,
    setSelectedEntity,
    openTaskMenu,
    updateAstronautPosition,
  ]);

  // Sync internal position reference when active astronaut changes
  const prevCrew = useRef(activePlayerCrew);
  useEffect(() => {
    const state = useGameStore.getState();
    const pos = state.astronautPositions[activePlayerCrew];
    if (pos) {
      currentPos.current.set(pos.x, 0, pos.z);
      currentRotation.current = pos.rotation;
    }
    prevCrew.current = activePlayerCrew;
  }, [activePlayerCrew]);

  useFrame((_, delta) => {
    // Only allow movement when no blocking modal is open
    if (activeModal !== 'none') return;

    // Check manual keyboard input
    const camForward = new THREE.Vector3();
    camera.getWorldDirection(camForward);
    camForward.y = 0;
    camForward.normalize();

    const camRight = new THREE.Vector3();
    camRight.crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize();

    const moveDir = new THREE.Vector3(0, 0, 0);
    if (keysPressed.current['w'] || keysPressed.current['arrowup']) moveDir.add(camForward);
    if (keysPressed.current['s'] || keysPressed.current['arrowdown']) moveDir.sub(camForward);
    if (keysPressed.current['d'] || keysPressed.current['arrowright']) moveDir.add(camRight);
    if (keysPressed.current['a'] || keysPressed.current['arrowleft']) moveDir.sub(camRight);

    const isManualMoving = moveDir.lengthSq() > 0.001;

    if (isManualMoving) {
      // Manual WASD cancels any active point-and-click target
      if (crewTargets[activePlayerCrew]) {
        setCrewTarget(activePlayerCrew, null);
        setDestinationMarker(null);
      }

      moveDir.normalize();
      const isSprinting = !!keysPressed.current['shift'];
      const speed = isSprinting ? 8.2 : 4.5; // units per second

      currentPos.current.x = THREE.MathUtils.clamp(
        currentPos.current.x + moveDir.x * speed * delta,
        -32,
        32
      );
      currentPos.current.z = THREE.MathUtils.clamp(
        currentPos.current.z + moveDir.z * speed * delta,
        -32,
        32
      );

      // In eye mode, orientation is controlled by mouse look or forward keys
      if (cameraMode !== 'eye') {
        const targetAngle = Math.atan2(moveDir.x, moveDir.z);
        currentRotation.current = THREE.MathUtils.lerp(currentRotation.current, targetAngle, 0.25);
      }

      updateAstronautPosition(activePlayerCrew, {
        x: currentPos.current.x,
        z: currentPos.current.z,
        rotation: currentRotation.current,
      });
    } else {
      // 2. Point-and-Click Autonomous Movement toward Destination Target
      const target = crewTargets[activePlayerCrew];
      if (target) {
        const dx = target.x - currentPos.current.x;
        const dz = target.z - currentPos.current.z;
        const dist = Math.hypot(dx, dz);

        if (dist > 0.45) {
          const dirX = dx / dist;
          const dirZ = dz / dist;
          const clickSpeed = 5.2;

          currentPos.current.x += dirX * clickSpeed * delta;
          currentPos.current.z += dirZ * clickSpeed * delta;

          const targetAngle = Math.atan2(dirX, dirZ);
          currentRotation.current = THREE.MathUtils.lerp(currentRotation.current, targetAngle, 0.25);

          updateAstronautPosition(activePlayerCrew, {
            x: currentPos.current.x,
            z: currentPos.current.z,
            rotation: currentRotation.current,
          });
        } else {
          // Reached target destination!
          setCrewTarget(activePlayerCrew, null);
          setDestinationMarker(null);
        }
      }
    }

    // Proximity check against all 8 base buildings
    let closestBuilding: BuildingId | null = null;
    let minDistance = Infinity;

    for (const [bid, coords] of Object.entries(BUILDING_COORDINATES)) {
      const dist = Math.hypot(coords.x - currentPos.current.x, coords.z - currentPos.current.z);
      if (dist <= 4.2 && dist < minDistance) {
        minDistance = dist;
        closestBuilding = bid as BuildingId;
      }
    }

    setNearbyBuilding(closestBuilding);
  });

  return null;
};
