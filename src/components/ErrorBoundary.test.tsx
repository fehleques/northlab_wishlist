/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

function ProblemChild() {
  throw new Error('Boom');
}

describe('ErrorBoundary', () => {
  it('renders fallback UI when a child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getByRole } = render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );

    getByRole('alert');
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
});
