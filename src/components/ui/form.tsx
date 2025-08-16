import * as React from "react";
import styles from "./form.module.scss";

export type FormProps = React.FormHTMLAttributes<HTMLFormElement>;

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className = "", ...props }, ref) => (
    <form ref={ref} className={`${styles.form} ${className}`} {...props} />
  )
);
Form.displayName = "Form";
