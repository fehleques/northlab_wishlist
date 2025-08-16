/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import styles from './ThreeDBackground.module.scss';

vi.mock('./ThreeDBackgroundCanvas', () => new Promise(() => {}));

import { ThreeDBackground } from './ThreeDBackground';

describe('ThreeDBackground', () => {
  it('omits canvas and shows gradient overlay when prefersReducedMotion is true', async () => {
    // Mock WebGL support so the canvas would render if not for prefersReducedMotion
    Object.defineProperty(window, 'WebGLRenderingContext', {
      value: function () {},
      writable: true,
    });
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({});

    const { container } = render(
      <ThreeDBackground mouseX={0} mouseY={0} prefersReducedMotion />
    );

    // Ensure no canvas is rendered
    await waitFor(() => {
      expect(container.querySelector('canvas')).toBeNull();
    });

    const overlay = container.querySelector(`.${styles.overlay}`);
    expect(overlay).not.toBeNull();
    expect((overlay as HTMLElement).className).toContain(styles.overlay);

    const noise = container.querySelector(`.${styles.noiseFallback}`);
    expect(noise).not.toBeNull();
  });

  it('renders fallback and overlay while the canvas is loading', () => {
    Object.defineProperty(window, 'WebGLRenderingContext', {
      value: function () {},
      writable: true,
    });
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({});

    const { container } = render(
      <ThreeDBackground mouseX={0} mouseY={0} />
    );

    const noise = container.querySelector(`.${styles.noiseFallback}`);
    expect(noise).not.toBeNull();

    const overlay = container.querySelector(`.${styles.overlay}`);
    expect(overlay).not.toBeNull();
  });
});
