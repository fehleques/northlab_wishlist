/* @vitest-environment node */
import React from 'react';
import { act, create } from 'react-test-renderer';
import { describe, it, expect } from 'vitest';
import useTheme from './useTheme';

describe('useTheme in non-browser environment', () => {
  it('defaults to light and toggles without browser APIs', () => {
    let result: ReturnType<typeof useTheme>;

    const TestComponent = () => {
      result = useTheme();
      return null;
    };

    act(() => {
      create(React.createElement(TestComponent));
    });

    expect(result!.theme).toBe('light');

    act(() => {
      result!.toggleTheme();
    });

    expect(result!.theme).toBe('dark');
  });
});
