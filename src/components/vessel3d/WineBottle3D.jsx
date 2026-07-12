import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const BOTTLE_PROFILE = [
  [0, 0],
  [0.54, 0],
  [0.6, 0.06],
  [0.64, 0.32],
  [0.7, 0.56],
  [0.44, 0.66],
  [0.22, 0.76],
  [0.24, 0.92],
  [0.28, 1.02],
  [0, 1.02],
];

function WineBottle3D({ accentColor = '#6B1A2A', reveal = false }) {
  const corkRef = useRef();
  const liquidRef = useRef();
  const shineRef = useRef();
  const corkProgress = useRef(0);
  const liquidProgress = useRef(0);

  const profile = useMemo(
    () => BOTTLE_PROFILE.map(([x, y]) => new THREE.Vector2(x, y)),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (reveal) {
      corkProgress.current = Math.min(1, corkProgress.current + delta * 0.9);
      liquidProgress.current = Math.min(1, liquidProgress.current + delta * 1.4);
    }

    if (liquidRef.current) {
      const target = reveal ? 0.58 * liquidProgress.current : 0.01;
      liquidRef.current.scale.y = THREE.MathUtils.lerp(liquidRef.current.scale.y, target, delta * 3);
    }

    if (corkRef.current) {
      const pop = corkProgress.current;
      corkRef.current.position.y = 0.9 + pop * 0.75;
      corkRef.current.rotation.z = pop * 1.1;
      corkRef.current.material.opacity = 1 - pop * 0.95;
    }

    if (shineRef.current) {
      shineRef.current.position.x = Math.sin(t * 0.6) * 0.08;
      shineRef.current.material.opacity = 0.08 + Math.sin(t * 1.2) * 0.03;
    }
  });

  return (
    <group position={[0, -0.55, 0]} scale={1.85}>
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.22}>
        <mesh castShadow receiveShadow>
          <latheGeometry args={[profile, 72]} />
          <meshPhysicalMaterial
            color="#163325"
            transmission={0.92}
            thickness={0.4}
            roughness={0.035}
            metalness={0.08}
            ior={1.52}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh ref={liquidRef} position={[0, 0.12, 0]} scale={[1, 0.01, 1]}>
          <cylinderGeometry args={[0.56, 0.6, 0.9, 40]} />
          <meshStandardMaterial color={accentColor} transparent opacity={0.78} roughness={0.35} />
        </mesh>

        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.58, 0.58, 0.04, 40]} />
          <meshStandardMaterial color={accentColor} transparent opacity={0.55} />
        </mesh>

        <mesh position={[0, 0.84, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.07, 32]} />
          <meshStandardMaterial color="#c9a227" metalness={0.85} roughness={0.2} />
        </mesh>

        <mesh ref={corkRef} position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.19, 0.19, 0.14, 20]} />
          <meshStandardMaterial color="#d9b382" transparent />
        </mesh>

        <mesh ref={shineRef} position={[0.35, 0.45, 0.42]} rotation={[0, 0.2, 0]}>
          <planeGeometry args={[0.08, 1.1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      </Float>

      <ContactShadows
        position={[0, -0.02, 0]}
        opacity={0.5}
        scale={3.2}
        blur={2.8}
        far={1.2}
        color="#000000"
      />
    </group>
  );
}

export default WineBottle3D;
