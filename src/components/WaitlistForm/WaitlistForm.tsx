import React from 'react';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useWaitlistForm } from '../../hooks/useWaitlistForm';

/**
 * Waitlist signup form.
 *
 * Validates the email locally, surfaces server responses and gracefully
 * handles network errors by resetting the loading state and refocusing the
 * input for correction.
 */
export const WaitlistForm: React.FC = () => {
  const { email, setEmail, status, msg, inputRef, onSubmit } = useWaitlistForm();

  return (
    <div style={{ marginTop: 'var(--spacing-4)' }}>
      <form
        onSubmit={onSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-2)',
          maxWidth: 'var(--max-w-lg)',
          width: '100%',
          minWidth: 0,
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <label htmlFor="email" className="sr-only">Email address</label>
          <Input
            ref={inputRef}
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        <Button type="submit" disabled={status === 'loading'} isLoading={status === 'loading'}>
          {status === 'loading' ? 'Claiming your spot...' : 'Claim your spot early'}
        </Button>
      </form>

      {msg && (
        <div
          style={{
            marginTop: 'var(--spacing-1-5)',
            fontSize: 'var(--font-size-2)',
            fontWeight: 500,
            color:
              status === 'error'
                ? 'var(--color-red-400)'
                : 'var(--color-emerald-400)',
            transition: 'all 0.3s ease-out'
          }}
        >
          {msg}
        </div>
      )}

      <p
        style={{
          marginTop: 'var(--spacing-2)',
          fontSize: 'var(--font-size-2)',
          color: 'var(--color-text-tertiary)',
          lineHeight: 'var(--line-height-relaxed)'
        }}
      >
        Help shape the future of independent creation.
      </p>
    </div>
  );
};
