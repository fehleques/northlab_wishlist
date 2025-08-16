/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { toHaveNoViolations } from 'vitest-axe/matchers';
import { Header } from './Header';

// jsdom does not implement canvas; mock to avoid errors in axe contrast checks
HTMLCanvasElement.prototype.getContext = vi.fn();

expect.extend({ toHaveNoViolations });

describe('Header', () => {
  it('renders an accessible logo', async () => {
    const { container, getByRole } = render(
      <Header isLoaded={true} theme="light" onToggleTheme={() => {}} />
    );

    getByRole('img', { name: 'NorthLab' });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
