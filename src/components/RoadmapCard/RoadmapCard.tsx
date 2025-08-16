import React, { useState } from 'react';
import { PhaseItem } from '../PhaseItem/PhaseItem';
import styles from './RoadmapCard.module.scss';

interface RoadmapCardProps {
  phaseNowRef: React.RefObject<HTMLDivElement>;
  phaseNextRef: React.RefObject<HTMLDivElement>;
  phaseLaterRef: React.RefObject<HTMLDivElement>;
}

export const RoadmapCard: React.FC<RoadmapCardProps> = ({
  phaseNowRef,
  phaseNextRef,
  phaseLaterRef
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(0);
  const [glowY, setGlowY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / rect.height) * -2;
    const rotateYValue = (mouseX / rect.width) * 2;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    
    setGlowX(mouseX * 0.005);
    setGlowY(mouseY * 0.005);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlowX(0);
    setGlowY(0);
  };

  return (
    <div 
      className={`${styles.cardContainer} perspective-1000`}
      id="roadmap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic glow effect */}
      <div 
        className={styles.glow}
        style={{
          transform: `scale(1.05) translate(${glowX * 0.01}px, ${glowY * 0.01}px)`,
          opacity: 0.3 + Math.abs(glowX + glowY) * 0.0002
        }}
      />
      
      {/* Main card */}
      <div 
        className={styles.card}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        <div className={styles.pattern} />
        
        <div 
          className={styles.content}
          style={{
            transform: `translateZ(5px)`,
          }}
        >
          <div ref={phaseNowRef} className={styles.phase}>
            <div className={`${styles.phaseTitle} typography-overline`}>Now</div>
            <div className={styles.phaseItems}>
              <PhaseItem dotColor="indigo">
                Closed alpha with core creative memory and brief engine
              </PhaseItem>
              <PhaseItem dotColor="indigo">
                Email waitlist and community invites
              </PhaseItem>
            </div>
          </div>
          
          <div ref={phaseNextRef} className={styles.phase}>
            <div className={`${styles.phaseTitle} typography-overline`}>Next</div>
            <div className={styles.phaseItems}>
              <PhaseItem dotColor="sky">
                Bias resistant reviews and skill leveling
              </PhaseItem>
              <PhaseItem dotColor="sky">
                Team spaces and project delivery boards
              </PhaseItem>
            </div>
          </div>
          
          <div ref={phaseLaterRef} className={styles.phase}>
            <div className={`${styles.phaseTitle} typography-overline`}>Later</div>
            <div className={`${styles.phaseItems} ${styles.phaseItemsLater}`}>
              <PhaseItem dotColor="neutral">
                Marketplace with verified talent tiers
              </PhaseItem>
              <PhaseItem dotColor="neutral">
                API and plugin ecosystem
              </PhaseItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};