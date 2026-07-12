import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import EmberParticles from './EmberParticles';

function deriveFlameStrength(intensityText = '') {
  const text = intensityText.toLowerCase();
  const HOT_WORDS = ['white-hot', 'blazing', 'scorching', 'inferno', 'molten', 'ablaze'];
  const COOL_WORDS = ['ember', 'smolder', 'low', 'quiet', 'faint'];
  if (HOT_WORDS.some((w) => text.includes(w))) return 1.3;
  if (COOL_WORDS.some((w) => text.includes(w))) return 0.8;
  return 1;
}

function FireAnvil3D({ accentColor = '#E8531C', intensityText, reveal = false }) {
  const flameOuterRef = useRef();
  const flameInnerRef = useRef();
  const flashRef = useRef();
  const ringRef = useRef();
  const flashProgress = useRef(0);
  const flameStrength = deriveFlameStrength(intensityText);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (flameOuterRef.current) {
      flameOuterRef.current.scale.y = (1 + Math.sin(t * 7.5) * 0.1) * flameStrength;
      flameOuterRef.current.scale.x = 1 + Math.sin(t * 5.5 + 0.8) * 0.06;
      flameOuterRef.current.rotation.z = Math.sin(t * 4) * 0.04;
    }

    if (flameInnerRef.current) {
      flameInnerRef.current.scale.y = 1 + Math.sin(t * 9 + 1.2) * 0.12;
      flameInnerRef.current.position.x = Math.sin(t * 6) * 0.03;
    }

    if (reveal && flashProgress.current < 1) {
      flashProgress.current = Math.min(1, flashProgress.current + delta * 1.8);
      const p = flashProgress.current;
      if (flashRef.current) {
        flashRef.current.material.opacity = p < 0.2 ? p * 4 : Math.max(0, 1 - (p - 0.2) * 2.5);
        flashRef.current.scale.setScalar(0.6 + p * 1.4);
      }
      if (ringRef.current) {
        ringRef.current.material.opacity = Math.max(0, 0.8 - p);
        ringRef.current.scale.setScalar(0.3 + p * 2.8);
      }
    }
  });

  return (
    <group position={[0, -0.35, 0]} scale={1.25}>
      <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.12}>
        <mesh position={[0, -0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.38, 1.05]} />
          <meshStandardMaterial color="#2a2622" roughness={0.72} metalness={0.42} />
        </mesh>

        <mesh position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.95, 0.42, 0.72]} />
          <meshStandardMaterial color="#2f2a26" roughness={0.68} metalness={0.48} />
        </mesh>

        <mesh position={[0, 0.12, 0]} castShadow>
          <boxGeometry args={[2.1, 0.28, 1.25]} />
          <meshStandardMaterial color="#3a3530" roughness={0.58} metalness={0.55} />
        </mesh>

        <mesh position={[0.95, 0.12, 0]} rotation={[0, 0, -0.15]} castShadow>
          <boxGeometry args={[0.55, 0.18, 0.45]} />
          <meshStandardMaterial color="#35302c" roughness={0.6} metalness={0.5} />
        </mesh>

        <group position={[0, 0.38, 0]}>
          <mesh ref={flameOuterRef} position={[0, 0.28, 0]}>
            <coneGeometry args={[0.38, 0.78, 20, 1, true]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={2.2}
              transparent
              opacity={0.88}
              side={THREE.DoubleSide}
            />
          </mesh>

          <mesh ref={flameInnerRef} position={[0.12, 0.22, 0.05]}>
            <coneGeometry args={[0.22, 0.55, 16, 1, true]} />
            <meshStandardMaterial
              color="#ff8a3d"
              emissive="#ff8a3d"
              emissiveIntensity={1.8}
              transparent
              opacity={0.75}
              side={THREE.DoubleSide}
            />
          </mesh>

          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#fff8e8" emissive="#fff3d0" emissiveIntensity={3} />
          </mesh>
        </group>

        <mesh ref={flashRef} position={[0, 0.2, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.35, 32]} />
          <meshBasicMaterial color="#fff3e0" transparent opacity={0} />
        </mesh>

        <mesh ref={ringRef} position={[0, 0.2, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.24, 32]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      </Float>

      <EmberParticles accentColor={accentColor} />

      <pointLight position={[0, 0.55, 0.4]} color={accentColor} intensity={3.5} distance={4.5} />
      <pointLight position={[-0.6, 0.2, 0.8]} color="#ff8a3d" intensity={1.2} distance={3} />

      <ContactShadows
        position={[0, -0.72, 0]}
        opacity={0.55}
        scale={3.5}
        blur={3}
        far={1.4}
        color="#000000"
      />
    </group>
  );
}

export default FireAnvil3D;
