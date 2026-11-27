import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "dangerGhost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const baseClassName =
  "inline-flex items-center justify-center gap-2 rounded-md border px-3.5 py-2 text-body-sm font-semibold transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700 disabled:cursor-not-allowed disabled:opacity-50";

const variantClassNames: Record<ButtonVariant, string> = {
  primary: "border-cyan-700 bg-cyan-700 text-neutral-0 hover:border-cyan-900 hover:bg-cyan-900",
  secondary: "border-neutral-300 bg-neutral-0 text-neutral-900 hover:bg-neutral-100",
  ghost: "border-transparent bg-transparent text-cyan-700 hover:bg-cyan-50",
  danger: "border-closed-700 bg-closed-700 text-neutral-0 hover:opacity-90",
  dangerGhost: "border-transparent bg-transparent text-closed-700 hover:bg-closed-50",
};

export const getButtonClassName = (variant: ButtonVariant = "primary", className = "") =>
  `${baseClassName} ${variantClassNames[variant]} ${className}`;

export function Button({ variant = "primary", type = "button", className = "", ...props }: ButtonProps) {
  return <button type={type} className={getButtonClassName(variant, className)} {...props} />;
}
