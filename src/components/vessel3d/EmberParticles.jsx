import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 48;

function EmberParticles({ accentColor = '#E8531C' }) {
  const pointsRef = useRef();
  const data = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 1.4;
      positions[i * 3 + 1] = Math.random() * 0.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      speeds[i] = 0.3 + Math.random() * 0.7;
    }
    return { positions, speeds };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < COUNT; i += 1) {
      const idx = i * 3 + 1;
      pos[idx] += data.speeds[i] * delta;
      if (pos[idx] > 1.6) {
        pos[idx] = 0.1 + Math.random() * 0.2;
        pos[i * 3] = (Math.random() - 0.5) * 1.4;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={data.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={accentColor}
        size={0.045}
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default EmberParticles;
