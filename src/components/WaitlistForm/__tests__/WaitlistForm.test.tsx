/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WaitlistForm } from '../WaitlistForm';

vi.mock('../../../services/waitlistService', () => ({
  addEmailToWaitlist: vi.fn(),
  supabase: {}
}));
import { addEmailToWaitlist } from '../../../services/waitlistService';

describe('WaitlistForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  it('handles successful submission', async () => {
    addEmailToWaitlist.mockResolvedValueOnce({ success: true, message: 'Success!' });

    render(<WaitlistForm />);

    const input = screen.getByLabelText('Email address');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    await screen.findByText('Success!');
    expect(addEmailToWaitlist).toHaveBeenCalledWith('test@example.com', 'website');
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('shows server error message', async () => {
    addEmailToWaitlist.mockResolvedValueOnce({ success: false, message: 'Server error' });

    render(<WaitlistForm />);

    const input = screen.getByLabelText('Email address');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button'));

    await screen.findByText('Server error');
    expect(addEmailToWaitlist).toHaveBeenCalled();
  });

  it('validates empty email', async () => {
    render(<WaitlistForm />);

    const input = screen.getByLabelText('Email address');
    const form = input.closest('form')!;
    fireEvent.submit(form);

    await screen.findByText('Please enter your email address.');
    expect(addEmailToWaitlist).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(input);
  });

  it('validates email format client-side', async () => {
    render(<WaitlistForm />);

    const input = screen.getByLabelText('Email address');
    const form = input.closest('form')!;
    fireEvent.change(input, { target: { value: 'invalid-email' } });
    fireEvent.submit(form);

    await screen.findByText('Please enter a valid email address.');
    expect(addEmailToWaitlist).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(input);
  });

  it('focuses input and enables button on network error', async () => {
    addEmailToWaitlist.mockRejectedValueOnce(new Error('network'));

    render(<WaitlistForm />);

    const input = screen.getByLabelText('Email address');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    await screen.findByText('Something went wrong. Please try again.');
    expect(button.hasAttribute('disabled')).toBe(false);
    expect(document.activeElement).toBe(input);
  });

  it('clears feedback when email changes', async () => {
    addEmailToWaitlist.mockResolvedValueOnce({ success: false, message: 'Server error' });

    render(<WaitlistForm />);

    const input = screen.getByLabelText('Email address');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button'));

    await screen.findByText('Server error');

    fireEvent.change(input, { target: { value: 'new@example.com' } });

    await waitFor(() => {
      expect(screen.queryByText('Server error')).toBeNull();
    });
  });
});
