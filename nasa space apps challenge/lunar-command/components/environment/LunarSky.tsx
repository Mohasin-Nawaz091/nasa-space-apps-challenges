"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

export function LunarSky() {
  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.04;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.055;
    }
  });

  return (
    <>
      {/* Deep Space Starfield */}
      <Stars
        radius={180}
        depth={60}
        count={5000}
        factor={4}
        saturation={0.1}
        fade
        speed={0.5}
      />

      {/* Distant Earth suspended in the lunar sky */}
      {/* Positioned high above the horizon, visible from the South Pole */}
      <group position={[45, 38, -65]}>
        {/* Atmosphere glow aura */}
        <mesh>
          <sphereGeometry args={[7.3, 32, 32]} />
          <meshBasicMaterial
            color="#2a75d3"
            transparent
            opacity={0.18}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Earth Globe */}
        <group ref={earthRef} rotation={[0.4, 0, 0.2]}>
          <mesh>
            <sphereGeometry args={[7, 48, 48]} />
            <meshStandardMaterial
              color="#104273"
              roughness={0.7}
              metalness={0.1}
              emissive="#0d2847"
              emissiveIntensity={0.15}
            />
          </mesh>

          {/* Continents & Landmass Accents */}
          <mesh>
            <sphereGeometry args={[7.02, 32, 32]} />
            <meshStandardMaterial
              color="#2a6639"
              roughness={0.9}
              transparent
              opacity={0.75}
              wireframe={false}
            />
          </mesh>

          {/* Cloud Layer */}
          <mesh ref={cloudsRef}>
            <sphereGeometry args={[7.06, 32, 32]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={1}
              transparent
              opacity={0.35}
            />
          </mesh>
        </group>
      </group>

      {/* Low-angle harsh lunar sunlight from the horizon */}
      <directionalLight
        position={[-60, 28, 40]}
        intensity={2.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={150}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0004}
      />

      {/* Faint blueish-gray bounce ambient for readable shadows */}
      <ambientLight intensity={0.4} color="#a0b4c8" />

      {/* Earthshine subtle light */}
      <directionalLight position={[45, 38, -65]} intensity={0.35} color="#5588cc" />
    </>
  );
}
