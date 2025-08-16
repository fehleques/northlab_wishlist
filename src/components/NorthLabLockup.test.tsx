/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { toHaveNoViolations } from 'vitest-axe/matchers';
import { NorthLabLockup } from './NorthLabLockup';

expect.extend({ toHaveNoViolations });

describe('NorthLabLockup', () => {
  it('is accessible with provided aria label', async () => {
    const { container, getByRole } = render(<NorthLabLockup ariaLabel="NorthLab" />);
    getByRole('img', { name: 'NorthLab' });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is hidden from assistive tech when no aria label', async () => {
    const { container } = render(<NorthLabLockup />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('focusable')).toBe('false');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
