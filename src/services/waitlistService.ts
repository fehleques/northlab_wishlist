import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client if credentials are available
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Types
export interface WaitlistEntry {
  id?: string;
  email: string;
  created_at?: string;
  source?: string;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
  data?: WaitlistEntry;
}

/**
 * Add an email to the waitlist
 */
export async function addEmailToWaitlist(
  email: string,
  source: string = 'website'
): Promise<WaitlistResponse> {
  try {
    if (!supabase) {
      console.error('Supabase client unavailable: missing credentials');
      return {
        success: false,
        message: 'Waitlist is currently unavailable. Please try again later.'
      };
    }

    // Normalize email by trimming whitespace and lowercasing
    const normalizedEmail = email.trim().toLowerCase();

    // Validate email format
    if (!isValidEmail(normalizedEmail)) {
      return {
        success: false,
        message: 'Please enter a valid email address.'
      };
    }

    // Check if email already exists
    const { data: existingEntry, error: checkError } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing email:', checkError);
      return {
        success: false,
        message: 'Something went wrong. Please try again.'
      };
    }

    if (existingEntry) {
      return {
        success: false,
        message: 'This email is already on our waitlist.'
      };
    }

    // Insert new email
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email: normalizedEmail,
          source: source
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding email to waitlist:', error);
      
      // Handle RLS policy errors specifically
      if (error.code === '42501' || error.message.includes('row-level security policy')) {
        return {
          success: false,
          message: 'Unable to process signup at this time. Please try again later.'
        };
      }
      
      return {
        success: false,
        message: 'Something went wrong. Please try again.'
      };
    }

    return {
      success: true,
      message: 'Welcome aboard! You\'ll receive updates as we build.',
      data: data
    };

  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again.'
    };
  }
}

/**
 * Get waitlist statistics (optional - for admin use)
 */
export async function getWaitlistStats() {
  try {
    if (!supabase) {
      console.error('Supabase client unavailable: missing credentials');
      return { count: 0, error: 'Supabase client unavailable' };
    }

    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting waitlist stats:', error);
      return { count: 0, error };
    }

    return { count: count || 0, error: null };
  } catch (error) {
    console.error('Unexpected error getting stats:', error);
    return { count: 0, error };
  }
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}