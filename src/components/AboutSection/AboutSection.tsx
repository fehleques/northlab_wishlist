import React from 'react';
import { Users, Shield, Zap, ArrowUpRight } from 'lucide-react';
import { Container } from '../Container/Container';
import { aboutContent } from '../../data/content';
import styles from './AboutSection.module.scss';

// Icon mapping for dynamic icon rendering
const iconMap = {
  Users,
  Shield,
  Zap
};

interface AboutSectionProps {
  aboutRef: React.RefObject<HTMLElement>;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ aboutRef }) => {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent size={24} /> : null;
  };

  return (
    <section ref={aboutRef} id="about" className={styles.about}>
      <Container>
        <div className={styles.aboutContent}>
          <h2 className={`${styles.aboutTitle} animate-element`}>
            You've been building in the wild
          </h2>
          <p className={`${styles.aboutDescription} animate-element`}>
            If you're a freelancer or creator, you know the grind isn't just the work. It's finding direction, the right opportunities, and the people who truly get what you do.
          </p>
          <p className={`${styles.aboutDescription} animate-element`}>
            NorthLab exists to make that part effortless. We're building a platform that's both your creative workspace and your source of direction, helping you test ideas, get trusted feedback, and see your next move before it's obvious.
          </p>
          <p className={`${styles.aboutDescriptionFinal} animate-element`}>
            All in one place, designed for people who want more control over their creative journey.
          </p>
        </div>
        
        <div className={styles.aboutBenefits}>
          {aboutContent.benefits.map((benefit, index) => (
            <div key={index} className={`${styles.benefitItem} animate-element`}>
              <div className={styles.benefitIcon}>
                {getIcon(benefit.icon)}
              </div>
              <h3 className={styles.benefitTitle}>{benefit.title}</h3>
              <p className={styles.benefitDescription}>{benefit.description}</p>
              <div className={styles.benefitArrow}>
                <ArrowUpRight size={20} />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};