import React from 'react';
import styles from './Card.module.scss';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...props
}) => {
  return <div className={`${styles.card} ${className}`} {...props} />;
};
