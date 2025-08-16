import * as React from "react";
import styles from "./button.module.scss";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => (
    <button ref={ref} className={`${styles.button} ${className}`} {...props} />
  )
);
Button.displayName = "Button";
