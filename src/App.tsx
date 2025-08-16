import { useEffect, useState, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { Header } from "./components/Header/Header";
import { HeroSection } from "./components/HeroSection/HeroSection";
import { RoadmapSection } from "./components/RoadmapSection/RoadmapSection";
import { AboutSection } from "./components/AboutSection/AboutSection";
import { CommunitySection } from "./components/CommunitySection/CommunitySection";
import { FAQSection } from "./components/FAQSection/FAQSection";
import { Footer } from "./components/Footer/Footer";
import { ThreeDBackground } from "./components/ThreeDBackground/ThreeDBackground";
import "./styles/base.css";
import usePrefersReducedMotion from "./hooks/usePrefersReducedMotion";

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function NorthLabComingSoon() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [globalRotateX, setGlobalRotateX] = useState(0);
  const [globalRotateY, setGlobalRotateY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const phaseNowRef = useRef<HTMLDivElement>(null);
  const phaseNextRef = useRef<HTMLDivElement>(null);
  const phaseLaterRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const communityRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const initScrollAnimations = useCallback(() => {
    if (prefersReducedMotion) {
      // For users who prefer reduced motion, just fade in elements without complex animations
      const allAnimatedElements = document.querySelectorAll('.word, .line, .feature-item, .phase-item, .animate-element');
      gsap.set(allAnimatedElements, { opacity: 1 });
      return;
    }

    // Animate headline words
    if (headlineRef.current) {
      gsap.fromTo(headlineRef.current, 
        { 
          opacity: 0, 
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 85%",
            end: "bottom 60%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Animate description lines
    if (descriptionRef.current) {
      const lines = descriptionRef.current.querySelectorAll('.line');
      gsap.fromTo(lines,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Animate features
    if (featuresRef.current) {
      const features = featuresRef.current.querySelectorAll('.feature-item');
      gsap.fromTo(features,
        {
          opacity: 0,
          x: -30,
          scale: 0.95
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Animate roadmap phases with building effect
    const phases = [
      { ref: phaseNowRef, delay: 0 },
      { ref: phaseNextRef, delay: 0.2 },
      { ref: phaseLaterRef, delay: 0.4 }
    ];

    phases.forEach(({ ref, delay }) => {
      if (ref.current) {
        const items = ref.current.querySelectorAll('.phase-item');
        
        gsap.fromTo(ref.current,
          {
            opacity: 0,
            y: 30,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            delay: delay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: roadmapRef.current,
              start: "top 90%",
              end: "bottom 30%",
              toggleActions: "play none none reverse"
            }
          }
        );

        gsap.fromTo(items,
          {
            opacity: 0,
            x: -20
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            delay: delay + 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: roadmapRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // Animate about section
    if (aboutRef.current) {
      const aboutElements = aboutRef.current.querySelectorAll('.animate-element');
      gsap.fromTo(aboutElements,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Animate community section
    if (communityRef.current) {
      const communityElements = communityRef.current.querySelectorAll('.animate-element');
      gsap.fromTo(communityElements,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: communityRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Animate FAQ section
    if (faqRef.current) {
      const faqElements = faqRef.current.querySelectorAll('.animate-element');
      gsap.fromTo(faqElements,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: faqRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.8 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: prefersReducedMotion ? 1.5 : 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Connect Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    setTimeout(() => {
      setIsLoaded(true);
      if (!prefersReducedMotion) {
        initScrollAnimations();
      }
    }, 300);

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [prefersReducedMotion, initScrollAnimations]);


  const handleGlobalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const globalRotateXValue = (mouseY / rect.height) * -3;
    const globalRotateYValue = (mouseX / rect.width) * 3;
    
    setGlobalRotateX(globalRotateXValue);
    setGlobalRotateY(globalRotateYValue);
    
    // Update mouse position for 3D background
    setMousePosition({ x: mouseX, y: mouseY });
  };

  const handleGlobalMouseLeave = () => {
    setGlobalRotateX(0);
    setGlobalRotateY(0);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div 
      className="perspective-1000"
      style={{
        minHeight: '100vh',
      }}
      onMouseMove={handleGlobalMouseMove}
      onMouseLeave={handleGlobalMouseLeave}
    >
      <ThreeDBackground
        mouseX={mousePosition.x}
        mouseY={mousePosition.y}
        prefersReducedMotion={prefersReducedMotion}
      />
      
      <Header isLoaded={isLoaded} />
      
      <HeroSection
        isLoaded={isLoaded}
        globalRotateX={globalRotateX}
        globalRotateY={globalRotateY}
        heroRef={heroRef}
        headlineRef={headlineRef}
        descriptionRef={descriptionRef}
        featuresRef={featuresRef}
      />

      <RoadmapSection
        roadmapRef={roadmapRef}
        phaseNowRef={phaseNowRef}
        phaseNextRef={phaseNextRef}
        phaseLaterRef={phaseLaterRef}
      />

      <AboutSection aboutRef={aboutRef} />
      
      <CommunitySection communityRef={communityRef} />
      
      <FAQSection faqRef={faqRef} />
      
      <Footer />
    </div>
  );
}