import React from 'react';
import styles from './PhaseItem.module.scss';

interface PhaseItemProps {
  children: React.ReactNode;
  dotColor?: 'indigo' | 'sky' | 'neutral';
}

export const PhaseItem: React.FC<PhaseItemProps> = ({ children, dotColor = 'indigo' }) => {
  return (
    <div className={`${styles.phaseItem} phase-item`}>
      <div className={`${styles.dot} ${styles[`dot${dotColor.charAt(0).toUpperCase() + dotColor.slice(1)}`]}`} />
      <span className={styles.text}>{children}</span>
    </div>
  );
};