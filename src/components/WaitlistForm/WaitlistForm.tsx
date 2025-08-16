import React, { useRef, useState } from 'react';
import { addEmailToWaitlist, supabase } from '../../services/waitlistService';
import styles from './WaitlistForm.module.scss';

/**
 * Waitlist signup form.
 *
 * Validates the email locally, surfaces server responses and gracefully
 * handles network errors by resetting the loading state and refocusing the
 * input for correction.
 */
export const WaitlistForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setMsg("Please enter your email address.");
      inputRef.current?.focus();
      return;
    }

    if (!supabase) {
      setStatus("error");
      setMsg("Waitlist signups are currently unavailable. Please try again later.");
      inputRef.current?.focus();
      return;
    }

    setMsg("");

    setStatus("loading");

    try {
      const result = await addEmailToWaitlist(email, 'website');
      
      if (result.success) {
        setStatus("success");
        setMsg(result.message);
        setEmail("");
      } else {
        setStatus("error");
        setMsg(result.message);
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus("error");
      setMsg("Something went wrong. Please try again.");
      inputRef.current?.focus();
    }
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            ref={inputRef}
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={styles.input}
            required
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className={`${styles.button} ${status === "loading" ? styles.loading : ''}`}
        >
          {status === "loading" ? "Claiming your spot..." : "Claim your spot early"}
        </button>
      </form>
      
      {msg && (
        <div className={`${styles.message} ${status === "error" ? styles.error : styles.success}`}>
          {msg}
        </div>
      )}

      <p className={styles.disclaimer}>
        Help shape the future of independent creation.
      </p>
    </div>
  );
};