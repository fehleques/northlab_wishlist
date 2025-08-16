import React, { Suspense, useEffect, useState } from 'react';
import styles from './ThreeDBackground.module.scss';

interface ThreeDBackgroundProps {
  mouseX: number;
  mouseY: number;
  prefersReducedMotion?: boolean;
  /**
   * Force-disable the 3D background and always show the CSS gradient fallback.
   * Useful for testing or to avoid using WebGL on low-power devices.
   */
  disable3D?: boolean;
}

// Detect WebGL support in the current environment
const isWebGLAvailable = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
};

const ThreeDCanvas = React.lazy(() => import('./ThreeDBackgroundCanvas'));

/**
 * Animated TV static background. Renders a WebGL scene when possible and
 * falls back to a static CSS gradient with noise when WebGL is unsupported, when the
 * `disable3D` prop is set, or when the user prefers reduced motion.
 */
export const ThreeDBackground: React.FC<ThreeDBackgroundProps> = ({
  mouseX,
  mouseY,
  prefersReducedMotion = false,
  disable3D = false,
}) => {
  const [webglSupported, setWebglSupported] = useState(false);

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
  }, []);

  const shouldRenderCanvas =
    webglSupported && !disable3D && !prefersReducedMotion;

  return (
    <div className={styles.backgroundContainer}>
      {shouldRenderCanvas ? (
        <Suspense fallback={null}>
          <ThreeDCanvas
            mouseX={mouseX}
            mouseY={mouseY}
            prefersReducedMotion={prefersReducedMotion}
          />
        </Suspense>
      ) : (
        <div className={styles.noiseFallback} />
      )}

      {/* Subtle overlay for additional depth or fallback gradient */}
      <div className={styles.overlay} />
    </div>
  );
};
