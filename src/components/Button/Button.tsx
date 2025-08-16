import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className = '',
  isLoading = false,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${isLoading ? styles.loading : ''} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
