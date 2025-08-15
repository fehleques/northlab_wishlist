import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import styles from './ThreeDBackground.module.scss';

interface ThreeDBackgroundProps {
  mouseX: number;
  mouseY: number;
  prefersReducedMotion?: boolean;
}

// TV Static shader material for fine-grained noise
class TVStaticShaderMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.15 },
        scale: { value: 400.0 }, // Much higher for finer noise
        speed: { value: 0.8 },
        mousePosition: { value: new THREE.Vector2(0, 0) },
        staticIntensity: { value: 0.6 },
        flickerSpeed: { value: 15.0 }, // Much faster flicker
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
        
        // High-quality hash function for fine noise
        float hash(vec2 p) {
          p = fract(p * vec2(443.8975, 397.2973));
          p += dot(p.xy, p.yx + 19.19);
          return fract(p.x * p.y);
        }
        
        // Fine-grained noise function
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
        
        // TV static function with rapid flicker
        float tvStatic(vec2 p, float t) {
          // Multiple layers of noise at different scales
          float n1 = noise(p * 1.0 + t * 0.5);
          float n2 = noise(p * 2.0 + t * 0.8);
          float n3 = noise(p * 4.0 + t * 1.2);
          
          // Combine layers
          float combined = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);
          
          // Add rapid flicker
          float flicker = hash(floor(p * grainSize) + floor(t * flickerSpeed));
          flicker = (flicker - 0.5) * 2.0; // Convert to -1 to 1 range
          
          // Add scanline-like interference
          float scanline = sin(p.y * 800.0 + t * 10.0) * 0.02;
          
          return combined + flicker * staticIntensity + scanline;
        }
        
        void main() {
          // Base coordinates with fine scaling
          vec2 coord = vUv * scale;
          
          // Add time-based movement for TV static effect
          coord += vec2(time * speed * 0.4, time * speed * 0.6);
          
          // Subtle mouse influence
          vec2 mouseInfluence = mousePosition * 0.0005;
          coord += mouseInfluence;
          
          // Generate TV static
          float staticValue = tvStatic(coord, time);
          
          // Clamp and adjust the static value
          staticValue = clamp(staticValue, 0.0, 1.0);
          
          // Very dark color palette for moody effect
          vec3 darkColor = vec3(0.01, 0.01, 0.015);  // Almost black
          vec3 lightColor = vec3(0.04, 0.04, 0.06);  // Very dark gray
          
          // Mix colors based on static value
          vec3 finalColor = mix(darkColor, lightColor, staticValue);
          
          // Add subtle color variation based on position
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

// Extend to make it available in JSX
extend({ TVStaticShaderMaterial });

// Declare the extended material for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      tVStaticShaderMaterial: any;
    }
  }
}

// TV Static background component
const TVStaticBackground: React.FC<{
  mouseX: number;
  mouseY: number;
  prefersReducedMotion?: boolean;
}> = ({ mouseX, mouseY, prefersReducedMotion = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<TVStaticShaderMaterial>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      // Update time uniform for animation
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      
      if (!prefersReducedMotion) {
        // Update mouse position uniform
        materialRef.current.uniforms.mousePosition.value.set(
          (mouseX / viewport.width) * 2,
          -(mouseY / viewport.height) * 2
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

// Subtle ambient lighting
const AmbientLighting: React.FC = () => {
  return (
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
};

// Main scene component
const Scene: React.FC<{
  mouseX: number;
  mouseY: number;
  prefersReducedMotion?: boolean;
}> = ({ mouseX, mouseY, prefersReducedMotion = false }) => {
  return (
    <>
      <AmbientLighting />
      
      {/* TV Static background */}
      <TVStaticBackground
        mouseX={mouseX}
        mouseY={mouseY}
        prefersReducedMotion={prefersReducedMotion}
      />
    </>
  );
};

export const ThreeDBackground: React.FC<ThreeDBackgroundProps> = ({
  mouseX,
  mouseY,
  prefersReducedMotion = false
}) => {
  return (
    <div className={styles.backgroundContainer}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Scene mouseX={mouseX} mouseY={mouseY} prefersReducedMotion={prefersReducedMotion} />
      </Canvas>

      {/* Subtle overlay for additional depth */}
      <div className={styles.overlay} />
    </div>
  );
};