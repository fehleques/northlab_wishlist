import { describe, it, expect, vi } from 'vitest';

vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon');

describe('waitlistService', () => {
  it('fails on duplicate email without inserting again', async () => {
    const { addEmailToWaitlist, supabase } = await import('./waitlistService');

    let inserted = false;
    const insertFn = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockImplementation(async () => {
          inserted = true;
          return { data: { email: 'test@example.com' }, error: null };
        })
      })
    }));

    const maybeSingleFn = vi.fn().mockImplementation(async () => {
      if (inserted) {
        return { data: null, error: { code: 'PGRST116', message: 'duplicate' } };
      }
      return { data: null, error: null };
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: maybeSingleFn
        })
      }),
      insert: insertFn
    });

    const email = 'foo@example.com';
    const first = await addEmailToWaitlist(email);
    expect(first.success).toBe(true);

    const second = await addEmailToWaitlist(email);
    expect(second.success).toBe(false);
    expect(second.message).toBe('This email is already on our waitlist.');
    expect(insertFn).toHaveBeenCalledTimes(1);
  });
});
