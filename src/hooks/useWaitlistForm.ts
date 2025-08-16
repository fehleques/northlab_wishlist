import { useEffect, useRef, useState } from 'react';
import { addEmailToWaitlist, supabase } from '../services/waitlistService';

export function useWaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const skipResetRef = useRef(false);

  useEffect(() => {
    if (skipResetRef.current) {
      skipResetRef.current = false;
      return;
    }
    setStatus('idle');
    setMsg('');
  }, [email]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setMsg('Please enter your email address.');
      inputRef.current?.focus();
      return;
    }

    if (!supabase) {
      setStatus('error');
      setMsg('Waitlist signups are currently unavailable. Please try again later.');
      inputRef.current?.focus();
      return;
    }

    setMsg('');
    setStatus('loading');

    try {
      const result = await addEmailToWaitlist(email, 'website');

      if (result.success) {
        setStatus('success');
        setMsg(result.message);
        skipResetRef.current = true;
        setEmail('');
      } else {
        setStatus('error');
        setMsg(result.message);
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setMsg('Something went wrong. Please try again.');
      inputRef.current?.focus();
    }
  }

  return {
    email,
    setEmail,
    status,
    msg,
    inputRef,
    onSubmit,
  } as const;
}

export default useWaitlistForm;
