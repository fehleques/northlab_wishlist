import React from 'react';
import styles from './Container.module.scss';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow';
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '', 
  size = 'default' 
}) => {
  const containerClass = size === 'narrow' ? styles.containerNarrow : styles.container;
  
  return (
    <div className={`${containerClass} ${className}`}>
      {children}
    </div>
  );
};