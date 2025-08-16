import React from 'react';
import styles from './Input.module.scss';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return <input ref={ref} className={`${styles.input} ${className}`} {...props} />;
  }
);

Input.displayName = 'Input';

export default Input;
