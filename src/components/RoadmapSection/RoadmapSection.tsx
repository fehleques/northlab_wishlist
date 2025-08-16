import React from 'react';
import { Container } from '../Container/Container';
import { RoadmapCard } from '../RoadmapCard/RoadmapCard';
import styles from './RoadmapSection.module.scss';

interface RoadmapSectionProps {
  roadmapRef: React.RefObject<HTMLDivElement>;
  phaseNowRef: React.RefObject<HTMLDivElement>;
  phaseNextRef: React.RefObject<HTMLDivElement>;
  phaseLaterRef: React.RefObject<HTMLDivElement>;
}

export const RoadmapSection: React.FC<RoadmapSectionProps> = ({
  roadmapRef,
  phaseNowRef,
  phaseNextRef,
  phaseLaterRef
}) => (
  <section className={styles.roadmap} ref={roadmapRef}>
    <Container>
      <div className={styles.cardWrapper}>
        <RoadmapCard
          phaseNowRef={phaseNowRef}
          phaseNextRef={phaseNextRef}
          phaseLaterRef={phaseLaterRef}
        />
      </div>
    </Container>
  </section>
);
