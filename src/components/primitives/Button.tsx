import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  ...props
}) => {
  const variantClass = variant === 'secondary' ? styles.secondary : styles.primary;
  return (
    <button className={`${styles.button} ${variantClass} ${className}`} {...props} />
  );
};
