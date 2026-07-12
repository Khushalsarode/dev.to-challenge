import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import WineBottle3D from './WineBottle3D';
import FireAnvil3D from './FireAnvil3D';

function VesselScene({
  vessel,
  accentColor,
  intensityText,
  reveal = false,
  height = 420,
  interactive = false,
}) {
  const isFire = vessel === 'fire';

  return (
    <div className="vessel-scene-canvas" style={{ width: '100%', height, position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0.15, 3.6], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
      >
        <ambientLight intensity={isFire ? 0.18 : 0.38} />
        <directionalLight position={[3, 5, 2]} intensity={isFire ? 0.45 : 0.85} color={isFire ? '#ffd0a8' : '#fff8ee'} />
        <directionalLight position={[-2, 2, -1]} intensity={0.25} color={isFire ? '#ff8a3d' : '#d4af37'} />

        <Suspense fallback={null}>
          <Environment preset={isFire ? 'night' : 'apartment'} />
          {isFire ? (
            <FireAnvil3D accentColor={accentColor} intensityText={intensityText} reveal={reveal} />
          ) : (
            <WineBottle3D accentColor={accentColor} reveal={reveal} />
          )}
        </Suspense>

        {interactive && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 2.8}
            maxPolarAngle={Math.PI / 1.9}
            minAzimuthAngle={-0.35}
            maxAzimuthAngle={0.35}
          />
        )}

        {isFire && (
          <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.85} intensity={1.35} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}

export default VesselScene;
