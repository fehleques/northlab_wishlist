/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThreeDBackground } from './ThreeDBackground';
import styles from './ThreeDBackground.module.scss';

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
    // The overlay element uses a CSS class that applies the gradient fallback
    expect((overlay as HTMLElement).className).toContain(styles.overlay);
  });
});

