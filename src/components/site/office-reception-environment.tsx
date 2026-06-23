"use client";

import { Text } from "@react-three/drei";
import { useMemo } from "react";

const wood = "#6b5344";
const woodDark = "#4a3a30";
const wall = "#d8d2c8";
const wallAccent = "#2c3847";
const carpet = "#3d4248";
const white = "#f2f0ec";
const leather = "#1a222c";

export function OfficeReceptionEnvironment() {
  const waitingChairs = useMemo(
    () => [
      { x: -2.8, z: 1.6, rot: 0.35 },
      { x: -1.6, z: 2.1, rot: 0.15 },
    ],
    [],
  );

  return (
    <group>
      {/* Floor — carpet tiles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color={carpet} roughness={0.92} metalness={0.02} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -3.2]} receiveShadow>
        <planeGeometry args={[5.5, 4]} />
        <meshStandardMaterial color={woodDark} roughness={0.78} metalness={0.04} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2.2, -5.8]} receiveShadow>
        <boxGeometry args={[14, 4.4, 0.18]} />
        <meshStandardMaterial color={wall} roughness={0.88} />
      </mesh>
      <mesh position={[0, 2.2, -5.68]} receiveShadow>
        <boxGeometry args={[5.5, 2.4, 0.06]} />
        <meshStandardMaterial color={wallAccent} roughness={0.75} />
      </mesh>
      <Text position={[0, 2.55, -5.62]} fontSize={0.28} color={white} anchorX="center" anchorY="middle" letterSpacing={0.06}>
        AGENTOMATIC
      </Text>
      <Text position={[0, 2.15, -5.62]} fontSize={0.09} color="#8cffd2" anchorX="center" anchorY="middle" letterSpacing={0.18}>
        RECEPTION
      </Text>

      {/* Side walls */}
      <mesh position={[-7, 2.2, 0]} receiveShadow>
        <boxGeometry args={[0.18, 4.4, 14]} />
        <meshStandardMaterial color={wall} roughness={0.9} />
      </mesh>
      <mesh position={[7, 2.2, 0]} receiveShadow>
        <boxGeometry args={[0.18, 4.4, 14]} />
        <meshStandardMaterial color={wall} roughness={0.9} />
      </mesh>

      {/* Window wall — soft daylight */}
      <mesh position={[6.85, 2.1, 0.5]}>
        <planeGeometry args={[0.04, 3.2, 1]} />
        <meshStandardMaterial color="#a8c4e8" emissive="#6a8ab0" emissiveIntensity={0.35} roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[6.84, 2.1, 0.5]}>
        <planeGeometry args={[0.02, 3.1]} />
        <meshStandardMaterial color="#dce8f5" emissive="#b8cce0" emissiveIntensity={0.55} />
      </mesh>

      {/* Ceiling + lights */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.2, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#eceae6" roughness={0.95} />
      </mesh>
      {[
        [-2.5, 3.95, -1],
        [2.5, 3.95, -1],
        [0, 3.95, 2],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.4, 0.45]} />
          <meshStandardMaterial color="#fff8ee" emissive="#ffe8c8" emissiveIntensity={0.9} />
        </mesh>
      ))}

      {/* L-shaped reception desk */}
      <group position={[0, 0, 0.35]}>
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.1, 1.05]} />
          <meshStandardMaterial color={white} roughness={0.35} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[3.35, 0.18, 1]} />
          <meshStandardMaterial color={wood} roughness={0.65} />
        </mesh>
        <mesh position={[1.55, 0.52, 0.75]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.1, 0.85]} />
          <meshStandardMaterial color={white} roughness={0.35} />
        </mesh>
        <mesh position={[1.55, 0.38, 0.75]} castShadow>
          <boxGeometry args={[1.05, 0.18, 0.8]} />
          <meshStandardMaterial color={wood} roughness={0.65} />
        </mesh>
        {/* Front panel */}
        <mesh position={[0, 0.22, 0.48]}>
          <boxGeometry args={[3.2, 0.44, 0.06]} />
          <meshStandardMaterial color={wallAccent} roughness={0.55} />
        </mesh>

        {/* Monitor */}
        <group position={[0.35, 0.58, -0.15]}>
          <mesh position={[0, 0.32, 0]} castShadow>
            <boxGeometry args={[0.62, 0.4, 0.035]} />
            <meshStandardMaterial color="#111820" roughness={0.3} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.32, 0.02]}>
            <boxGeometry args={[0.56, 0.34, 0.01]} />
            <meshStandardMaterial color="#0a1420" emissive="#8cffd2" emissiveIntensity={0.15} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.05, 0.2, 0.05]} />
            <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>

        {/* Phone + plant */}
        <mesh position={[-1.1, 0.58, 0.2]} castShadow>
          <boxGeometry args={[0.12, 0.04, 0.18]} />
          <meshStandardMaterial color="#222" roughness={0.4} metalness={0.5} />
        </mesh>
        <group position={[-0.55, 0.58, 0.25]}>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.06, 0.07, 0.12, 10]} />
            <meshStandardMaterial color={white} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <sphereGeometry args={[0.1, 10, 10]} />
            <meshStandardMaterial color="#3d6b52" roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* Office chair */}
      <group position={[0.05, 0, -0.55]}>
        <mesh position={[0, 0.26, 0]} castShadow>
          <boxGeometry args={[0.52, 0.07, 0.52]} />
          <meshStandardMaterial color={leather} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.58, -0.18]} castShadow>
          <boxGeometry args={[0.48, 0.62, 0.06]} />
          <meshStandardMaterial color={leather} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.28, 8]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Waiting chairs */}
      {waitingChairs.map(({ x, z, rot }, i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, rot, 0]}>
          <mesh position={[0, 0.24, 0]} castShadow>
            <boxGeometry args={[0.5, 0.06, 0.5]} />
            <meshStandardMaterial color="#4a5564" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.52, -0.16]} castShadow>
            <boxGeometry args={[0.48, 0.5, 0.05]} />
            <meshStandardMaterial color="#4a5564" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Lobby plants */}
      {[
        { x: -4.5, z: -2.5 },
        { x: 4.8, z: -3 },
        { x: 5.2, z: 2.5 },
      ].map(({ x, z }, i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.28, 0.34, 0.56, 12]} />
            <meshStandardMaterial color={white} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.72, 0]} castShadow>
            <sphereGeometry args={[0.42, 10, 10]} />
            <meshStandardMaterial color="#3d6b52" roughness={0.88} />
          </mesh>
        </group>
      ))}

      {/* Entrance frame (where she walks from) */}
      <mesh position={[4.2, 2, 3.8]}>
        <boxGeometry args={[0.12, 3.6, 1.8]} />
        <meshStandardMaterial color={woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[4.2, 2, 3.8]}>
        <boxGeometry args={[0.08, 3.4, 1.6]} />
        <meshStandardMaterial color="#1a1410" roughness={0.95} />
      </mesh>
    </group>
  );
}
