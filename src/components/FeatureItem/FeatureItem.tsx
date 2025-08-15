import React from 'react';
import styles from './FeatureItem.module.scss';

interface FeatureItemProps {
  children: React.ReactNode;
  className?: string;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ children, className = '' }) => {
  return (
    <div className={`${styles.featureItem} group feature-item ${className}`}>
      <div className={styles.dot} />
      <span className={styles.text}>{children}</span>
    </div>
  );
};