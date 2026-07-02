import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type PaperButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary";
  }
>;

export function PaperButton({
  children,
  className = "",
  variant = "primary",
  ...buttonProps
}: PaperButtonProps) {
  return (
    <button
      className={`paper-button paper-button--${variant} ${className}`}
      type="button"
      {...buttonProps}
    >
      {children}
    </button>
  );
}
