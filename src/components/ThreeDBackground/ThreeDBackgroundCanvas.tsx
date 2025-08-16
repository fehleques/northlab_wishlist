import React, { useRef } from 'react';
import { Canvas, useFrame, useThree, extend, Object3DNode } from '@react-three/fiber';
import * as THREE from 'three';

interface CanvasProps {
  mouseX: number;
  mouseY: number;
  prefersReducedMotion?: boolean;
}

class TVStaticShaderMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.15 },
        scale: { value: 400.0 },
        speed: { value: 0.8 },
        mousePosition: { value: new THREE.Vector2(0, 0) },
        staticIntensity: { value: 0.6 },
        flickerSpeed: { value: 15.0 },
        grainSize: { value: 0.8 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float opacity;
        uniform float scale;
        uniform float speed;
        uniform vec2 mousePosition;
        uniform float staticIntensity;
        uniform float flickerSpeed;
        uniform float grainSize;

        varying vec2 vUv;
        varying vec3 vPosition;

        float hash(vec2 p) {
          p = fract(p * vec2(443.8975, 397.2973));
          p += dot(p.xy, p.yx + 19.19);
          return fract(p.x * p.y);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);

          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));

          vec2 u = f * f * (3.0 - 2.0 * f);

          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        float tvStatic(vec2 p, float t) {
          float n1 = noise(p * 1.0 + t * 0.5);
          float n2 = noise(p * 2.0 + t * 0.8);
          float n3 = noise(p * 4.0 + t * 1.2);

          float combined = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);

          float flicker = hash(floor(p * grainSize) + floor(t * flickerSpeed));
          flicker = (flicker - 0.5) * 2.0;

          float scanline = sin(p.y * 800.0 + t * 10.0) * 0.02;

          return combined + flicker * staticIntensity + scanline;
        }

        void main() {
          vec2 coord = vUv * scale;
          coord += vec2(time * speed * 0.4, time * speed * 0.6);
          vec2 mouseInfluence = mousePosition * 0.0005;
          coord += mouseInfluence;
          float staticValue = tvStatic(coord, time);
          staticValue = clamp(staticValue, 0.0, 1.0);
          vec3 darkColor = vec3(0.01, 0.01, 0.015);
          vec3 lightColor = vec3(0.04, 0.04, 0.06);
          vec3 finalColor = mix(darkColor, lightColor, staticValue);
          finalColor += vec3(0.005, 0.003, 0.008) * sin(vUv.x * 20.0 + time * 1.5);
          finalColor += vec3(0.003, 0.005, 0.002) * sin(vUv.y * 15.0 + time * 2.0);
          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending
    });
  }
}

extend({ TVStaticShaderMaterial });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      tVStaticShaderMaterial: Object3DNode<
        TVStaticShaderMaterial,
        typeof TVStaticShaderMaterial
      >;
    }
  }
}

const TVStaticBackground: React.FC<CanvasProps> = ({
  mouseX,
  mouseY,
  prefersReducedMotion = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<TVStaticShaderMaterial>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;

      if (!prefersReducedMotion) {
        materialRef.current.uniforms.mousePosition.value.set(
          (mouseX / viewport.width) * 2,
          -(mouseY / viewport.height) * 2,
        );
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[25, 25]} />
      <tVStaticShaderMaterial ref={materialRef} />
    </mesh>
  );
};

const AmbientLighting: React.FC = () => (
  <>
    <ambientLight intensity={0.02} />
    <pointLight
      position={[10, 10, 10]}
      color="#1a1a2e"
      intensity={0.01}
      distance={20}
      decay={2}
    />
  </>
);

const Scene: React.FC<CanvasProps> = ({
  mouseX,
  mouseY,
  prefersReducedMotion = false,
}) => (
  <>
    <AmbientLighting />
    <TVStaticBackground
      mouseX={mouseX}
      mouseY={mouseY}
      prefersReducedMotion={prefersReducedMotion}
    />
  </>
);

const ThreeDBackgroundCanvas: React.FC<CanvasProps> = ({
  mouseX,
  mouseY,
  prefersReducedMotion = false,
}) => (
  <Canvas
    camera={{ position: [0, 0, 5], fov: 60 }}
    gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
  >
    <Scene
      mouseX={mouseX}
      mouseY={mouseY}
      prefersReducedMotion={prefersReducedMotion}
    />
  </Canvas>
);

export default ThreeDBackgroundCanvas;
