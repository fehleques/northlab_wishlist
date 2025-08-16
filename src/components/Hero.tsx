import React from "react"
import { Container } from "./Container/Container"
import { FeatureItem } from "./FeatureItem/FeatureItem"
import { WaitlistForm } from "./WaitlistForm/WaitlistForm"
import { heroContent } from "../data/content"

interface HeroProps {
  isLoaded: boolean
  globalRotateX: number
  globalRotateY: number
  heroRef: React.RefObject<HTMLDivElement>
  headlineRef: React.RefObject<HTMLHeadingElement>
  descriptionRef: React.RefObject<HTMLParagraphElement>
  featuresRef: React.RefObject<HTMLDivElement>
}

export const Hero: React.FC<HeroProps> = ({
  isLoaded,
  globalRotateX,
  globalRotateY,
  heroRef,
  headlineRef,
  descriptionRef,
  featuresRef,
}) => {
  return (
    <section
      ref={heroRef}
      style={{
        paddingTop: "var(--spacing-4)",
        paddingBottom: "var(--spacing-5)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Container>
        <div
          style={{
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            willChange: "transform",
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded
              ? "translateY(0)"
              : "translateY(var(--spacing-3))",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            maxWidth: "var(--max-w-3xl)",
            margin: "0 auto",
          }}
        >
          <h1
            ref={headlineRef}
            style={{
              fontSize: "var(--font-size-6)",
              fontWeight: 700,
              letterSpacing: "var(--letter-spacing-tighter)",
              lineHeight: "var(--line-height-tight)",
              transition: "transform 0.2s ease-out",
              willChange: "transform",
              transformStyle: "preserve-3d",
              marginBottom: "var(--spacing-2)",
              overflowWrap: "break-word",
              wordWrap: "break-word",
              maxWidth: "100%",
              background: "var(--gradient-primary)",
              backgroundSize: "200% 200%",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              animation: "gradientMove 8s ease-in-out infinite",
              transform: `rotateX(${globalRotateX * -0.3}deg) rotateY(${globalRotateY * -0.3}deg) translateZ(20px)`,
            }}
          >
            The future of independent creators has a new North. Yours.
          </h1>

          <p
            ref={descriptionRef}
            style={{
              marginTop: "var(--spacing-1)",
              fontSize: "var(--font-size-5)",
              lineHeight: "var(--line-height-relaxed)",
              color: "var(--color-text-secondary)",
              maxWidth: "var(--max-w-2xl)",
              transition: "transform 0.2s ease-out",
              willChange: "transform",
              transformStyle: "preserve-3d",
              overflowWrap: "break-word",
              wordWrap: "break-word",
              transform: `rotateX(${globalRotateX * -0.2}deg) rotateY(${globalRotateY * -0.2}deg) translateZ(10px)`,
            }}
            aria-label="NorthLab is a place where your craft, your ideas, and your ambition get the clarity they deserve. Built for people who choose their own path, not the one handed to them."
          >
            <span className="line" style={{ display: "block" }}>
              NorthLab is a place where your craft, your ideas, and your ambition
            </span>{" "}
            <span className="line" style={{ display: "block" }}>
              get the clarity they deserve. Built for people who choose their own path,
            </span>{" "}
            <span className="line" style={{ display: "block" }}>
              not the one handed to them.
            </span>
          </p>

          <div
            ref={featuresRef}
            style={{
              marginTop: "var(--spacing-3)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-1)",
              alignItems: "center",
              transition: "transform 0.2s ease-out",
              willChange: "transform",
              transformStyle: "preserve-3d",
              transform: `rotateX(${globalRotateX * -0.1}deg) rotateY(${globalRotateY * -0.1}deg) translateZ(5px)`,
            }}
          >
            {heroContent.features.map((feature, index) => (
              <FeatureItem key={index}>{feature}</FeatureItem>
            ))}
          </div>

          <WaitlistForm />
        </div>
      </Container>
    </section>
  )
}

