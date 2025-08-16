import React from 'react';
import styles from './Input.module.scss';

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = '',
  ...props
}) => {
  return <input className={`${styles.input} ${className}`} {...props} />;
};
