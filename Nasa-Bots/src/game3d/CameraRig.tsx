/**
 * LUNAR FRONTIER: THE LAST 30 DAYS
 * src/game3d/CameraRig.tsx
 * Dual-mode camera rig: Tactical Orbit view and First-Person Astronaut Helmet Eye View.
 */

import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { eventBus } from '../store/bus.ts';
import { BUILDING_COORDINATES } from '../sim/rules/crew.ts';
import { useGameStore } from '../store/store.ts';

export const CameraRig: React.FC = () => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const reducedMotion = useGameStore((s) => s.reducedMotion);
  const activePlayerCrew = useGameStore((s) => s.activePlayerCrew);
  const astronautPositions = useGameStore((s) => s.astronautPositions);
  const cameraMode = useGameStore((s) => s.cameraMode);

  const targetLookAt = useRef(new THREE.Vector3(0, 1.2, 0));
  const currentEyeLook = useRef(new THREE.Vector3(0, 1.45, -10));

  useEffect(() => {
    camera.position.set(0, 10, 14);
    camera.lookAt(0, 1.2, 0);

    const unsubFocus = eventBus.on('camera:focus', ({ buildingId, crewId }) => {
      if (buildingId) {
        const coords = BUILDING_COORDINATES[buildingId];
        targetLookAt.current.set(coords.x, 1.2, coords.z);
      } else if (crewId) {
        const pos = useGameStore.getState().astronautPositions[crewId];
        if (pos) targetLookAt.current.set(pos.x, 1.2, pos.z);
      }
    });

    const unsubReset = eventBus.on('camera:reset', () => {
      const pos = useGameStore.getState().astronautPositions[useGameStore.getState().activePlayerCrew];
      if (pos) targetLookAt.current.set(pos.x, 1.2, pos.z);
    });

    return () => {
      unsubFocus();
      unsubReset();
    };
  }, [camera]);

  useFrame(() => {
    const pos = astronautPositions[activePlayerCrew] || { x: 0, z: 0, rotation: 0 };

    if (cameraMode === 'eye') {
      // 1. FIRST-PERSON ASTRONAUT EYE VIEW (Helmet POV)
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }

      const rot = pos.rotation ?? 0;
      const forwardX = Math.sin(rot);
      const forwardZ = Math.cos(rot);

      // Camera positioned exactly at eye level inside helmet
      const eyeX = pos.x + forwardX * 0.15;
      const eyeY = 1.55;
      const eyeZ = pos.z + forwardZ * 0.15;

      camera.position.set(eyeX, eyeY, eyeZ);

      // Look direction along astronaut's forward heading
      const targetX = eyeX + forwardX * 14;
      const targetY = 1.52;
      const targetZ = eyeZ + forwardZ * 14;

      currentEyeLook.current.lerp(new THREE.Vector3(targetX, targetY, targetZ), reducedMotion ? 1 : 0.25);
      camera.lookAt(currentEyeLook.current);
    } else {
      // 2. TACTICAL ORBIT & THIRD-PERSON FOLLOW
      if (!controlsRef.current) return;
      controlsRef.current.enabled = true;

      targetLookAt.current.set(pos.x, 1.2, pos.z);

      if (reducedMotion) {
        controlsRef.current.target.copy(targetLookAt.current);
      } else {
        controlsRef.current.target.lerp(targetLookAt.current, 0.12);
      }

      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      {...({ dampingFactor: 0.08 } as any)}
      minDistance={3.0}
      maxDistance={32}
      minPolarAngle={THREE.MathUtils.degToRad(15)}
      maxPolarAngle={THREE.MathUtils.degToRad(80)}
    />
  );
};
