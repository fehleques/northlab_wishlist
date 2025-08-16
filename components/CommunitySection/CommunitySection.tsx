import React from 'react';
import { Container } from '../Container/Container';
import styles from './CommunitySection.module.scss';

interface CommunitySectionProps {
  communityRef: React.RefObject<HTMLElement>;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({ communityRef }) => {
  return (
    <section ref={communityRef} id="community" className={styles.community}>
      <Container>
        <h2 className={`${styles.communityTitle} animate-element`}>
          This isn't just a launch. It's a starting line.
        </h2>
        <p className={`${styles.communityDescription} animate-element`}>
          Join now and help shape what NorthLab becomes. Early members will get first access, behind-the-scenes updates, and the chance to co-create features that make a difference for real working creators.
        </p>
      </Container>
    </section>
  );
};