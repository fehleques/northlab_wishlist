import React from 'react';
import { Container } from '../Container/Container';
import { FeatureItem } from '../FeatureItem/FeatureItem';
import { WaitlistForm } from '../WaitlistForm/WaitlistForm';
import { heroContent } from '../../data/content';
import styles from './HeroSection.module.scss';

interface HeroSectionProps {
  isLoaded: boolean;
  globalRotateX: number;
  globalRotateY: number;
  heroRef: React.RefObject<HTMLDivElement>;
  headlineRef: React.RefObject<HTMLHeadingElement>;
  descriptionRef: React.RefObject<HTMLParagraphElement>;
  featuresRef: React.RefObject<HTMLDivElement>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isLoaded,
  globalRotateX,
  globalRotateY,
  heroRef,
  headlineRef,
  descriptionRef,
  featuresRef
}) => {
  return (
    <section ref={heroRef} className={styles.hero}>
      <Container>
        <div className={`${styles.heroContent} ${isLoaded ? styles.loaded : ''}`}>
            <h1
              ref={headlineRef}
              className={`${styles.headline} typography-h1`}
              style={{
                transform: `rotateX(${globalRotateX * -0.3}deg) rotateY(${globalRotateY * -0.3}deg) translateZ(20px)`,
              }}
            >
              The future of independent creators has a new North. Yours.
            </h1>
            
            <p
              ref={descriptionRef}
              className={`${styles.description} typography-body-lg`}
              style={{
                transform: `rotateX(${globalRotateX * -0.2}deg) rotateY(${globalRotateY * -0.2}deg) translateZ(10px)`,
              }}
            >
              <span className="line">NorthLab is a place where your craft, your ideas, and your ambition</span>{' '}
              <span className="line">get the clarity they deserve. Built for people who choose their own path,</span>{' '}
              <span className="line">not the one handed to them.</span>
            </p>
            
            <div 
              ref={featuresRef}
              className={styles.features}
              style={{
                transform: `rotateX(${globalRotateX * -0.1}deg) rotateY(${globalRotateY * -0.1}deg) translateZ(5px)`,
              }}
            >
              {heroContent.features.map((feature, index) => (
                <FeatureItem key={index}>
                  {feature}
                </FeatureItem>
              ))}
            </div>

            <WaitlistForm />
        </div>
      </Container>
    </section>
  );
};