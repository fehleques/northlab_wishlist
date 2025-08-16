/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { toHaveNoViolations } from 'vitest-axe/matchers';
import { Header } from './Header';

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
