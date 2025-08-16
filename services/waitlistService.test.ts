import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

// Mock Supabase client creation to return a plain object we can manipulate
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({}))
}));
import { createClient } from '@supabase/supabase-js';

// Stubbed methods for the Supabase client
const maybeSingle = vi.fn();
const eq = vi.fn(() => ({ maybeSingle }));
const select = vi.fn(() => ({ eq }));
const single = vi.fn();
const selectAfterInsert = vi.fn(() => ({ single }));
const insert = vi.fn(() => ({ select: selectAfterInsert }));
const from = vi.fn(() => ({ select, insert }));

let addEmailToWaitlist: typeof import('./waitlistService')['addEmailToWaitlist'];
let supabase: unknown;

describe('addEmailToWaitlist', () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.com');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon');

    const mod = await import('./waitlistService');
    addEmailToWaitlist = mod.addEmailToWaitlist;
    supabase = mod.supabase;

    (supabase as unknown as { from: typeof from }).from = from;

    vi.clearAllMocks();
    maybeSingle.mockReset();
    single.mockReset();
  });

  it('returns success for valid email insertion', async () => {
    maybeSingle.mockResolvedValueOnce({ data: null, error: null });
    single.mockResolvedValueOnce({ data: { email: 'test@example.com' }, error: null });

    const result = await addEmailToWaitlist('test@example.com');

    expect(result.success).toBe(true);
    expect(result.message).toBe("Welcome aboard! You'll receive updates as we build.");
  });

  it('returns duplicate warning for existing email', async () => {
    maybeSingle.mockResolvedValueOnce({ data: { email: 'test@example.com' }, error: null });

    const result = await addEmailToWaitlist('test@example.com');

    expect(result.success).toBe(false);
    expect(result.message).toBe('This email is already on our waitlist.');
  });

  it('returns validation error for invalid email', async () => {
    const result = await addEmailToWaitlist('invalid-email');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Please enter a valid email address.');
    expect(from).not.toHaveBeenCalled();
  });

  it('normalizes email before submission', async () => {
    maybeSingle.mockResolvedValueOnce({ data: null, error: null });
    single.mockResolvedValueOnce({ data: { email: 'trim@example.com' }, error: null });

    await addEmailToWaitlist('  Trim@Example.com  ');

    expect(eq).toHaveBeenCalledWith('email', 'trim@example.com');
    expect(insert).toHaveBeenCalledWith([
      { email: 'trim@example.com', source: 'website' }
    ]);
  });
});

describe('addEmailToWaitlist with missing credentials', () => {
  it('returns an error and does not call Supabase when credentials are missing', async () => {
    vi.resetModules();
    const createClientMock = createClient as unknown as Mock;
    createClientMock.mockClear();
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { addEmailToWaitlist, supabase } = await import('./waitlistService');

    const result = await addEmailToWaitlist('test@example.com');

    expect(createClientMock).not.toHaveBeenCalled();
    expect(supabase).toBeNull();
    expect(result.success).toBe(false);
    expect(result.message).toBe('Waitlist is currently unavailable. Please try again later.');
    expect(consoleSpy).toHaveBeenCalledWith('Supabase client unavailable: missing credentials');

    consoleSpy.mockRestore();
  });
});

describe('getWaitlistStats', () => {
  const selectStats = vi.fn();
  const fromStats = vi.fn(() => ({ select: selectStats }));
  let getWaitlistStats: typeof import('./waitlistService')['getWaitlistStats'];

  beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.com');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon');

    const mod = await import('./waitlistService');
    getWaitlistStats = mod.getWaitlistStats;
    supabase = mod.supabase;
    (supabase as unknown as { from: typeof fromStats }).from = fromStats;

    vi.clearAllMocks();
    selectStats.mockReset();
  });

  it('returns count on success', async () => {
    selectStats.mockResolvedValueOnce({ count: 5, error: null });

    const result = await getWaitlistStats();

    expect(result).toEqual({ count: 5, error: null });
  });

  it('returns error when credentials are missing', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getWaitlistStats, supabase } = await import('./waitlistService');

    const result = await getWaitlistStats();

    expect(supabase).toBeNull();
    expect(result.count).toBe(0);
    expect(result.error).toBe('Supabase client unavailable: missing credentials');
    expect(consoleSpy).toHaveBeenCalledWith('Supabase client unavailable: missing credentials');

    consoleSpy.mockRestore();
  });

  it('returns error message when Supabase fails', async () => {
    selectStats.mockResolvedValueOnce({ count: null, error: { message: 'db error' } });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await getWaitlistStats();

    expect(result).toEqual({ count: 0, error: 'db error' });
    expect(consoleSpy).toHaveBeenCalledWith('Error getting waitlist stats:', { message: 'db error' });

    consoleSpy.mockRestore();
  });
});
