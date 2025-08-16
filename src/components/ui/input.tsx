import * as React from "react";
import styles from "./input.module.scss";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input ref={ref} className={`${styles.input} ${className}`} {...props} />
  )
);
Input.displayName = "Input";
