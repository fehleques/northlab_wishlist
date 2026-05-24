import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createClient } from '@supabase/supabase-js';
import { 
  ArrowRight, 
  Check, 
  ChevronDown, 
  Shield, 
  Users, 
  Zap, 
  Loader2, 
  Compass, 
  Volume2, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';

// ==========================================
// SUPABASE CLIENT INITIALIZATION & FAIL-SAFE
// ==========================================
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

interface WaitlistResponse {
  success: boolean;
  message: string;
}

async function addEmailToWaitlist(email: string): Promise<WaitlistResponse> {
  const normalizedEmail = email.trim().toLowerCase();
  
  if (supabase) {
    try {
      const { data: existing, error: checkError } = await supabase
        .from('waitlist')
        .select('email')
        .eq('email', normalizedEmail)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existing) {
        return { success: false, message: 'This email is already on our waitlist.' };
      }
      
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email: normalizedEmail, source: 'website' }]);
        
      if (error) throw error;
      
      return { success: true, message: "Welcome aboard! You'll receive updates as we build." };
    } catch (e) {
      console.error("Supabase write failed, falling back to localStorage", e);
    }
  }
  
  // Local fallback
  const fallbackKey = 'northlab_waitlist';
  const currentList = JSON.parse(localStorage.getItem(fallbackKey) || '[]');
  if (currentList.includes(normalizedEmail)) {
    return { success: false, message: 'This email is already on our waitlist.' };
  }
  
  currentList.push(normalizedEmail);
  localStorage.setItem(fallbackKey, JSON.stringify(currentList));
  return { 
    success: true, 
    message: "Welcome aboard! You've successfully claimed your early spot. (Local persist enabled)" 
  };
}

// ==========================================
// NORTHLAB BRAND SVG WORDMARK LOGO
// ==========================================
const NorthLabLockup = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      width="160"
      height="26"
      viewBox="0.34 0.88 389.18 57.12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="NorthLab Logo"
    >
      <title>NorthLab</title>
      <path d="M125.248 2.96037V36.4404L101.538 2.96037H93.2579V50.3304H101.408V16.8304L125.118 50.3304H133.428V2.96037H125.248Z" fill="currentColor"/>
      <path d="M173.028 23.4804C171.398 20.6804 169.148 18.4804 166.278 16.8804C163.408 15.2904 160.218 14.4904 156.738 14.4904C151.388 14.4904 146.928 16.2404 143.348 19.7504C139.768 23.2504 137.988 27.6104 137.988 32.8304C137.988 38.0504 139.768 42.3904 143.348 45.9004C146.928 49.4204 151.388 51.1604 156.738 51.1604C160.218 51.1604 163.398 50.3604 166.278 48.7704C169.138 47.1704 171.398 44.9704 173.028 42.1704C174.668 39.3504 175.478 36.2404 175.478 32.8304C175.478 29.4204 174.668 26.3004 173.028 23.4804ZM164.428 40.5904C162.388 42.6804 159.818 43.7304 156.738 43.7304C153.658 43.7304 151.068 42.6804 148.998 40.5904C146.918 38.5004 145.878 35.9104 145.878 32.8304C145.878 29.7504 146.928 27.1504 148.998 25.0504C151.078 22.9504 153.658 21.8904 156.738 21.8904C159.818 21.8904 162.378 22.9404 164.428 25.0304C166.478 27.1204 167.508 29.7204 167.508 32.8304C167.508 35.9404 166.488 38.5004 164.428 40.5904Z" fill="currentColor"/>
      <path d="M197.848 14.7504C193.378 14.7504 189.748 16.6504 186.958 20.4504V15.3204H179.248V50.3304H186.958V33.3004C186.958 30.0304 187.918 27.4604 189.858 25.5404C191.798 23.6204 194.458 22.6704 197.848 22.6704H199.158V14.7604H197.848V14.7504Z" fill="currentColor"/>
      <path d="M221.088 22.3004V15.3304H211.208V6.24037H203.518V40.1004C203.518 43.5904 204.458 46.3004 206.338 48.2504C208.218 50.2004 211.008 51.1604 214.688 51.1604C217.068 51.1604 219.188 50.6804 221.088 49.7204V42.5104C219.438 43.3204 217.848 43.7204 216.298 43.7204C214.658 43.7204 213.398 43.3204 212.518 42.5004C211.638 41.6804 211.198 40.4704 211.198 38.8704V22.3004H221.088Z" fill="currentColor"/>
      <path d="M254.638 18.2804C252.108 15.7504 248.758 14.4904 244.598 14.4904C239.588 14.4904 235.658 16.3404 232.788 20.0504V0.880371H225.078V50.3304H232.788V30.9404C232.788 28.2204 233.648 26.0304 235.338 24.3704C237.038 22.7204 239.268 21.8904 242.038 21.8904C244.808 21.8904 246.788 22.7104 248.378 24.3404C249.958 25.9804 250.758 28.1304 250.758 30.8104V50.3304H258.448V28.3004C258.448 24.1404 257.178 20.8004 254.638 18.2904V18.2804Z" fill="currentColor"/>
      <path d="M279.138 42.6604V50.3304H286.808V42.6604H279.138ZM264.718 50.3304H272.868V2.96037H264.718V50.3304Z" fill="currentColor"/>
      <path d="M326.808 15.3204V20.3204C323.748 16.4204 319.648 14.4904 314.538 14.4904C311.298 14.4904 308.348 15.2904 305.708 16.8804C303.068 18.4804 301.018 20.6804 299.518 23.4704C298.038 26.2604 297.298 29.3904 297.298 32.8304C297.298 36.2704 298.038 39.3904 299.518 42.1804C301.018 44.9704 303.068 47.1704 305.708 48.7704C308.348 50.3604 311.288 51.1604 314.538 51.1604C319.638 51.1604 323.718 49.2104 326.808 45.2904V50.3304H334.518V15.3204H326.808ZM323.738 40.5904C321.698 42.6804 319.128 43.7304 316.048 43.7304C312.968 43.7304 310.348 42.6804 308.278 40.5904C306.208 38.5004 305.178 35.9104 305.178 32.8304C305.178 29.7504 306.208 27.1204 308.278 25.0304C310.348 22.9404 312.938 21.8904 316.048 21.8904C319.158 21.8904 321.688 22.9404 323.738 25.0304C325.778 27.1204 326.818 29.7204 326.818 32.8304C326.818 35.9404 325.788 38.5004 323.738 40.5904Z" fill="currentColor"/>
      <path d="M375.408 23.4804C373.908 20.6804 371.848 18.4804 369.208 16.8804C366.568 15.2904 363.648 14.4904 360.428 14.4904C357.878 14.4904 355.548 15.0004 353.428 16.0204C351.328 17.0504 349.528 18.5004 348.078 20.3804V0.880371H340.368V50.3304H348.078V45.2304C349.548 47.1304 351.348 48.5904 353.448 49.6204C355.548 50.6404 357.868 51.1504 360.418 51.1504C363.638 51.1504 366.558 50.3504 369.198 48.7604C371.838 47.1604 373.898 44.9604 375.398 42.1604C376.908 39.3404 377.658 36.2304 377.658 32.8204C377.658 29.4104 376.908 26.2904 375.398 23.4704L375.408 23.4804ZM366.628 40.5904C364.578 42.6804 361.998 43.7304 358.918 43.7304C355.838 43.7304 353.248 42.6804 351.188 40.5904C349.118 38.5004 348.088 35.9104 348.088 32.8304C348.088 29.7504 349.118 27.1504 351.188 25.0504C353.258 22.9504 355.828 21.8904 358.918 21.8904C362.008 21.8904 364.568 22.9504 366.628 25.0504C368.678 27.1504 369.718 29.7404 369.718 32.8304C369.718 35.9204 368.688 38.5004 366.628 40.5904Z" fill="currentColor"/>
      <path d="M387.988 49.5304C386.958 50.5604 385.688 51.0704 384.158 51.0704C382.628 51.0704 381.348 50.5604 380.338 49.5304C379.308 48.5204 378.798 47.2704 378.798 45.7704C378.798 44.2704 379.308 43.0204 380.338 41.9904C381.348 40.9604 382.618 40.4504 384.158 40.4504C385.698 40.4504 386.968 40.9604 387.988 41.9904C389.008 43.0304 389.518 44.2904 389.518 45.7704C389.518 47.2504 389.008 48.5204 387.988 49.5304ZM384.158 50.0104C385.388 50.0104 386.398 49.6004 387.198 48.7904C387.988 47.9704 388.378 46.9704 388.378 45.7704C388.378 44.5704 387.988 43.5504 387.198 42.7304C386.398 41.9204 385.388 41.5204 384.158 41.5204C382.928 41.5204 381.938 41.9204 381.138 42.7304C380.338 43.5404 379.938 44.5504 379.938 45.7704C379.938 46.9904 380.338 47.9804 381.138 48.7904C381.938 49.6104 382.948 50.0104 384.158 50.0104ZM384.218 48.8904C383.358 48.8904 382.678 48.6004 382.168 48.0304C381.658 47.4604 381.398 46.7004 381.398 45.7604C381.398 44.8204 381.648 44.0504 382.158 43.4904C382.668 42.9204 383.348 42.6404 384.218 42.6404C384.948 42.6404 385.558 42.8404 386.028 43.2504C386.498 43.6604 386.778 44.2004 386.858 44.9004H385.658C385.588 44.5104 385.428 44.2104 385.168 44.0004C384.908 43.7904 384.588 43.6804 384.218 43.6804C383.718 43.6804 383.318 43.8604 383.038 44.2304C382.758 44.6004 382.608 45.1104 382.608 45.7804C382.608 46.4504 382.748 46.9604 383.038 47.3204C383.328 47.6804 383.718 47.8604 384.218 47.8604C384.608 47.8604 384.928 47.7504 385.198 47.5304C385.468 47.3104 385.618 47.0004 385.678 46.6004H386.878C386.788 47.2904 386.508 47.8504 386.028 48.2700C385.548 48.6900 384.948 48.9000 384.228 48.9000L384.218 48.8904Z" fill="currentColor"/>
      <path d="M294.478 34.9704H286.808V42.6604H294.478V34.9704Z" fill="currentColor"/>
      <path d="M286.808 42.6604H279.138V50.3304H286.808V42.6604Z" fill="currentColor"/>
      <path d="M279.138 50.3304L271.448 50.3304V58.0004H279.138V50.3304Z" fill="currentColor"/>
      <path d="M49.3779 15.3504L58.2379 12.0604C54.0679 8.01037 48.3879 5.52037 42.1179 5.52037H23.4979C23.4279 5.52037 23.3579 5.52037 23.2879 5.52037C28.2279 14.7104 39.3179 19.0904 49.3779 15.3504ZM16.8079 6.50037C7.27789 9.37037 0.337891 18.2104 0.337891 28.6704C0.337891 30.2904 0.507891 31.8704 0.827891 33.4004L3.80789 32.2904C14.2979 28.3904 19.8679 17.0804 16.8079 6.50037ZM5.93789 38.0504L2.86789 39.1904C6.69789 46.6904 14.4879 51.8204 23.4879 51.8204H33.7179L33.2479 50.5604C29.1579 39.5604 16.9379 33.9604 5.93789 38.0504ZM62.1879 17.1404L51.5179 21.1104C40.5179 25.2004 34.9179 37.4204 39.0079 48.4204L40.2779 51.8204H42.1179C54.9079 51.8204 65.2679 41.4504 65.2679 28.6704C65.2679 24.4704 64.1479 20.5404 62.1879 17.1404Z" fill="currentColor"/>
    </svg>
  );
};

export default function App() {
  const [email, setEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  const waitlistRef = useRef<HTMLDivElement>(null);

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setWaitlistStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setWaitlistStatus("loading");
    setMessage("");
    
    try {
      const response = await addEmailToWaitlist(email);
      if (response.success) {
        setWaitlistStatus("success");
        setMessage(response.message);
        setEmail("");
      } else {
        setWaitlistStatus("error");
        setMessage(response.message);
      }
    } catch {
      setWaitlistStatus("error");
      setMessage("An unexpected error occurred. Please try again.");
    }
  };

  // Static content extracted from original codebase
  const features = [
    "Organize scattered ideas in one connected system",
    "Sharpen loose work into clear creative direction",
    "Get better peer feedback with signal and less noise",
    "Move toward stronger client & collaborator opportunities"
  ];

  const coreHelps = [
    {
      title: "Capture and Archive",
      copy: "Capture your ideas, briefs, references, and project history in one cohesive stream."
    },
    {
      title: "Sharpen Direction",
      copy: "Turn loose ideas, drafts, and inspirations into sharper, actionable creative direction."
    },
    {
      title: "Structured Feedback",
      copy: "Get structured, peer-validated feedback with more real signal and less noise."
    },
    {
      title: "Progression Tracking",
      copy: "Track how your creative skills, workflow choices, and work improve over time."
    },
    {
      title: "Stronger Foundation",
      copy: "Build a stronger professional foundation for better clients, collaborators, and opportunities."
    }
  ];

  const workspacePillars = [
    {
      title: "Creative Memory",
      desc: "An ambient space to capture scattered ideas, drafts, creative context, and project history."
    },
    {
      title: "Adaptive Briefs",
      desc: "Shaping dynamic briefs that evolve continuously as your project decisions grow."
    },
    {
      title: "Bias-Resistant Feedback",
      desc: "Structured evaluation loops designed to isolate high-signal suggestions from noise."
    }
  ];

  const opportunityPillars = [
    {
      title: "Skill Progression & Spaces",
      desc: "Documenting your creative compound mastery and working within shared collaborator hubs."
    },
    {
      title: "Verified Creator Profiles",
      desc: "Earning verified indicators validated by your organic workspace progress and decisions."
    },
    {
      title: "Collaborator Matching",
      desc: "Sourcing better client matching pipelines that favor genuine creative fit over list volume."
    }
  ];



  const faqs = [
    {
      question: "What is NorthLab?",
      answer: "NorthLab is an AI-powered creative operating system for independent creators. It helps you organize your creative process, develop stronger projects, get structured feedback, track your growth, and move toward better opportunities."
    },
    {
      question: "Who is it for?",
      answer: "NorthLab is for freelancers, designers, artists, writers, strategists, creative technologists, solo builders, and independent creators who want more structure around their work and growth."
    },
    {
      question: "Is it a marketplace?",
      answer: "Not at first. NorthLab starts as a workspace and guidance system. The marketplace comes later, built on verified creative history, skill progression, feedback, and fit. The goal is not to list more creators. The goal is to create better matches."
    },
    {
      question: "How is this different from a portfolio or project management tool?",
      answer: "A portfolio shows finished work. A project management tool tracks tasks. NorthLab focuses on the layer between them: your ideas, decisions, feedback, progress, and creative direction. It helps you understand what you are building, how it is improving, and where it can take you next."
    },
    {
      question: "Will it help me get better clients?",
      answer: "That is the long-term goal. NorthLab is being built to make creative skill, growth, and fit easier to understand, so better opportunities can be matched with the right creators over time."
    },
    {
      question: "Why should I join early?",
      answer: "Early members get access before public launch and help shape the core product while it is still being built. If you care about the future of independent creative work, this is the stage where your input matters most."
    }
  ];

  return (
    <div className="bg-brand-canvas text-brand-ink min-h-screen relative overflow-x-hidden selection:bg-brand-ink selection:text-brand-canvas">
      
      {/* ==========================================
          NAV BAR (64px, Flush top, Editorial spacing)
          ========================================== */}
      <nav id="nav-bar" className="sticky top-0 bg-brand-canvas border-b border-brand-hairline-soft h-16 flex items-center justify-between px-6 lg:px-12 z-50 transition-all">
        <a href="#" className="text-brand-ink hover:opacity-80 transition-all flex items-center">
          <span className="sr-only">northlab</span>
          <NorthLabLockup className="text-brand-ink" />
        </a>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-brand-ink-soft hover:text-brand-ink text-sm font-semibold tracking-wide transition-colors">About</a>
          <a href="#roadmap" className="text-brand-ink-soft hover:text-brand-ink text-sm font-semibold tracking-wide transition-colors">Roadmap</a>
          <a href="#waitlist" className="text-brand-ink-soft hover:text-brand-ink text-sm font-semibold tracking-wide transition-colors">Join Waitlist</a>
          <a href="#faq" className="text-brand-ink-soft hover:text-brand-ink text-sm font-semibold tracking-wide transition-colors">FAQ</a>
        </div>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-brand-ink hover:bg-brand-hairline-soft rounded-full transition-all"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* MOBILE NAV OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 right-0 bg-brand-canvas border-b border-brand-hairline shadow-sm z-40 flex flex-col p-6 gap-4 md:hidden"
          >
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-brand-ink-soft hover:text-brand-ink py-2 text-base font-semibold"
            >
              About
            </a>
            <a 
              href="#roadmap" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-brand-ink-soft hover:text-brand-ink py-2 text-base font-semibold"
            >
              Roadmap
            </a>
            <a 
              href="#waitlist" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-brand-ink-soft hover:text-brand-ink py-2 text-base font-semibold"
            >
              Join Waitlist
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-brand-ink-soft hover:text-brand-ink py-2 text-base font-semibold"
            >
              FAQ
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          SECTION 1: HERO (Atmospheric, Dark photographic scrim)
          ========================================== */}
      <header id="hero-section" className="relative bg-brand-scrim min-h-[85vh] flex flex-col justify-between overflow-hidden">
        {/* Cinematic Backdrop Image with opacity layer overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-45 mix-blend-luminosity scale-105 select-none"
          style={{ imageRendering: 'auto', backgroundImage: `url('/src/assets/images/indigo_night_hero_1779626617806.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-scrim via-transparent to-brand-scrim/80 pointer-events-none" />

        {/* Hero content area wrapper */}
        <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-24 pb-12 flex-grow flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl text-left"
          >
            {/* Editorial Eyebrow */}
            <span className="inline-block text-brand-slate-soft text-xs uppercase tracking-[0.35px] font-semibold mb-4 letter-tracking-eyebrow">
              00 / CREATOR LAUNCH DIRECTION
            </span>
            
            {/* Display Editorial Title */}
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.0] letter-tracking-display mb-6">
              Give your independent journey a clear North.
            </h1>
            
            <p className="text-brand-ash/85 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl mb-12">
              NorthLab helps independent creators organize their ideas, sharpen their work, get better feedback, and move toward stronger opportunities.
            </p>
            
            {/* Pill Primary Call-To-Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-20">
              <button 
                onClick={scrollToWaitlist}
                className="bg-white text-brand-primary hover:bg-brand-ash active:scale-[0.98] transition-all px-8 py-2.5 rounded-full text-sm font-semibold h-10 flex items-center justify-center cursor-pointer"
                id="hero-primary-cta"
              >
                Claim your spot early
              </button>
              <a 
                href="#about"
                className="text-white hover:text-brand-ash border border-white/20 hover:border-white/55 px-8 py-2.5 rounded-full text-sm font-semibold h-10 flex items-center justify-center transition-all"
                id="hero-secondary-cta"
              >
                Explore the vision
              </a>
            </div>
          </motion.div>
        </div>

        {/* Cinematic horizontal features ribbon with thin hairlines */}
        <div className="relative border-t border-white/10 bg-brand-scrim/80 backdrop-blur-md z-10 w-full">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 flex items-start gap-4 text-white/90">
                <span className="text-xs text-brand-slate-soft font-semibold mt-1">0{idx + 1}</span>
                <p className="text-sm font-medium leading-relaxed max-w-xs">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ==========================================
          SECTION 2: ABOUT / BENEFITS (Crisp canvas background)
          ========================================== */}
      <section id="about" className="py-20 lg:py-28 bg-brand-canvas border-b border-brand-hairline">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16 lg:mb-24">
            {/* Signature Editorial Lockup */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <span className="text-brand-slate text-xs uppercase tracking-[0.35px] font-semibold block mb-3 letter-tracking-eyebrow">
                01 / INDEPENDENT DIRECTIVES
              </span>
              <h2 className="text-brand-ink text-3xl sm:text-4xl font-normal leading-[1.0] letter-tracking-heading-md max-w-md">
                A creative operating system for independent creators
              </h2>
            </div>
            
            <div className="lg:col-span-8 lg:pl-10 text-brand-graphite text-base leading-relaxed space-y-6">
              <p className="text-lg text-brand-ink-soft leading-normal font-normal">
                Working independently gives you freedom, but it also puts everything on you.
              </p>
              <p>
                You have to find the idea, shape the brief, manage the work, ask for feedback, prove your value, and figure out what comes next.
              </p>
              <p>
                NorthLab brings that journey into one connected system.
              </p>
              <p>
                It helps you turn scattered ideas, project context, creative decisions, feedback, and progress into a clearer path forward.
              </p>
            </div>
          </div>

          <div className="pt-12 border-t border-brand-hairline-soft mb-6">
            <h3 className="text-xs uppercase tracking-widest font-semibold block text-brand-slate mb-8">
              BUILT TO HELP YOU
            </h3>
          </div>

          {/* Benefits Grid styled with thin hairlines and generous whitespace */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 py-2">
            {coreHelps.map((help, idx) => {
              return (
                <div key={idx} className="flex flex-col justify-between p-6 bg-brand-canvas-warm rounded-lg border border-brand-hairline-soft text-left hover:scale-[1.01] transition-transform duration-300">
                  <div>
                    <div className="text-brand-primary mb-6 font-bold text-xs select-none">
                      [0{idx + 1}]
                    </div>
                    <h3 className="text-brand-ink text-sm font-semibold mb-3 min-h-[44px]">
                      {help.title}
                    </h3>
                    <p className="text-brand-graphite text-xs leading-relaxed">
                      {help.copy}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 3: WORKSPACE & OPPORTUNITY (Canvas Warm background)
          ========================================== */}
      <section id="roadmap" className="py-20 lg:py-28 bg-brand-canvas-warm border-b border-brand-hairline">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          
          <div className="mb-16">
            <span className="text-brand-slate text-xs uppercase tracking-[0.35px] font-semibold block mb-3 letter-tracking-eyebrow">
              02 / SYSTEM ARCS
            </span>
            <h2 className="text-brand-ink text-3xl sm:text-4xl font-normal leading-[1.0] letter-tracking-heading-md mb-4">
              From workspace to opportunity system
            </h2>
            <p className="text-brand-graphite text-sm leading-relaxed max-w-xl">
              NorthLab starts as a focused creative workspace. From there, it grows into a larger system for independent creative work, combining:
            </p>
          </div>

          {/* 2-Column transition path */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 mb-16">
            
            {/* Workspace Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="inline-block px-3 py-1 bg-brand-hairline text-brand-slate text-xs font-semibold rounded-sm tracking-wide">
                  PHASE 01
                </span>
                <h3 className="text-brand-ink text-sm uppercase tracking-wider font-bold">FOCUSED CREATIVE WORKSPACE</h3>
              </div>
              <div className="space-y-4">
                {workspacePillars.map((pillar, idx) => (
                  <div key={idx} className="p-6 bg-brand-canvas rounded-lg border border-brand-hairline-soft">
                    <h4 className="text-brand-ink text-sm font-semibold mb-2 flex items-center gap-2">
                      {pillar.title}
                    </h4>
                    <p className="text-brand-graphite text-xs leading-relaxed">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunity System Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="inline-block px-3 py-1 bg-brand-primary text-brand-on-primary text-xs font-semibold rounded-sm tracking-wide">
                  PHASE 02
                </span>
                <h3 className="text-brand-ink text-sm uppercase tracking-wider font-bold">GROWING OPPORTUNITY SYSTEM</h3>
              </div>
              <div className="space-y-4">
                {opportunityPillars.map((pillar, idx) => (
                  <div key={idx} className="p-6 bg-brand-canvas rounded-lg border border-brand-hairline-soft">
                    <h4 className="text-brand-ink text-sm font-semibold mb-2 flex items-center gap-2">
                      {pillar.title}
                    </h4>
                    <p className="text-brand-graphite text-xs leading-relaxed">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          SECTION 5: LAUNCH PARTNERSHIP (Early Access Registration)
          ========================================== */}
      <section id="waitlist" className="py-20 lg:py-28 bg-brand-canvas border-b border-brand-hairline">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          
          {/* Minimal Form-field submission block */}
          <div ref={waitlistRef} className="max-w-xl mx-auto text-center">
            <span className="text-brand-slate text-xs uppercase tracking-[0.35px] font-semibold block mb-3 letter-tracking-eyebrow">
              03 / BUILD WITH US
            </span>
            <h2 className="text-brand-ink text-3xl sm:text-4xl font-normal leading-[1.0] letter-tracking-heading-md mb-4">
              Join the first group shaping NorthLab
            </h2>
            <p className="text-brand-graphite text-sm leading-relaxed mb-12 max-w-lg mx-auto">
              NorthLab is opening to early creators first. Early members get priority access, private product updates, and the chance to influence how creative memory, feedback, skill progression, collaboration, and opportunity matching are built before public launch.
            </p>

            <form onSubmit={handleWaitlistSubmit} className="space-y-8 text-left" id="waitlist-capture-form">
              <div>
                <label htmlFor="form-email" className="text-xs uppercase tracking-widest font-semibold block text-brand-slate mb-2">
                  Email address *
                </label>
                <input 
                  type="email" 
                  id="form-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  disabled={waitlistStatus === "loading"}
                  className="w-full bg-brand-canvas text-brand-ink font-normal text-sm border-b border-brand-hairline-soft focus:border-brand-ink focus:outline-none py-3 px-0 transition-all placeholder:text-brand-stone"
                />
              </div>

              <div className="pt-2 text-center">
                <button 
                  type="submit"
                  disabled={waitlistStatus === "loading"}
                  className="w-full bg-brand-primary text-brand-on-primary hover:opacity-95 active:scale-[0.99] disabled:opacity-55 transition-all text-sm font-semibold rounded-full h-10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {waitlistStatus === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Allocating Spot...
                    </>
                  ) : (
                    <>
                      Claim your spot early
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <AnimatePresence>
              {message && (
                <motion.div 
                   className={`mt-6 text-xs font-semibold p-4 rounded-lg border text-left flex items-start gap-3 ${
                    waitlistStatus === "error" 
                      ? 'border-red-100 bg-red-50/50 text-red-900' 
                      : 'border-brand-hairline bg-brand-canvas-warm text-brand-ink-soft'
                  }`}
                >
                  <div className="shrink-0 font-bold mt-0.5 select-none">{waitlistStatus === "error" ? "✕" : "✓"}</div>
                  <p>{message}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-brand-stone text-[11px] leading-relaxed mt-4">
              Help shape the future of independent creation.
            </p>
          </div>

        </div>
      </section>

      {/* ==========================================
          SECTION 6: FAQ ACCORDION (12-column layout)
          ========================================== */}
      <section id="faq" className="py-20 lg:py-28 bg-brand-canvas border-b border-brand-hairline">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            
            {/* Left Col (4 cols) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <span className="text-brand-slate text-xs uppercase tracking-[0.35px] font-semibold block mb-3 letter-tracking-eyebrow">
                04 / INQUIRIES & ANSWERS
              </span>
              <h2 className="text-brand-ink text-3xl sm:text-4xl font-normal leading-[1.0] letter-tracking-heading-md max-w-sm">
                Frequently Asked Questions
              </h2>
            </div>

            {/* Right Accordion List (8 cols) */}
            <div className="lg:col-span-8 lg:pl-10 space-y-4">
              {faqs.map((faq, index) => {
                const isExpanded = activeFaq === index;
                return (
                  <div key={index} className="border-b border-brand-hairline-soft pb-4 transition-all">
                    <button 
                      onClick={() => setActiveFaq(isExpanded ? null : index)}
                      className="w-full text-left py-4 flex items-center justify-between gap-5 group cursor-pointer focus:outline-none"
                    >
                      <h4 className="text-brand-ink text-base md:text-lg font-normal tracking-tight group-hover:text-brand-ink-soft transition-colors leading-tight">
                        {faq.question}
                      </h4>
                      <ChevronDown 
                        size={18} 
                        className={`text-brand-stone shrink-0 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180 text-brand-ink' : ''
                        }`} 
                      />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-brand-graphite text-sm leading-relaxed pb-4 pr-10">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 7: FOOTER (Clean modern layout with centered copyright and bottom massive logo)
          ========================================== */}
      <footer className="bg-[#0A0A0A] text-white pt-24 pb-12 px-6 sm:px-12 select-none border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col justify-end items-center min-h-[300px] relative">
          
          {/* Centered copyright above the huge logo */}
          <div className="text-center mb-12 relative z-10 w-full">
            <p className="text-brand-stone text-xs sm:text-sm tracking-wider font-light">
              © {new Date().getFullYear()} NorthLab, Inc. All rights reserved.
            </p>
          </div>

          {/* Majestic Massive Platform Logo */}
          <div className="w-full pointer-events-none mt-auto flex justify-center items-end">
            <div className="w-full max-w-5xl px-4">
              <NorthLabLockup className="w-full h-auto text-white/15 select-none" />
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
