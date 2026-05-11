import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none";
  
  const sizeStyles = size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-5 text-sm";
  
  const variantStyles =
    variant === "primary"
      ? "bg-[#F2BF43] text-black hover:bg-[#e5b23d] active:bg-[#d4a436]"
      : "border border-zinc-200 bg-white/80 text-zinc-950 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-white dark:hover:bg-zinc-900/30";
  
  const merged = [base, sizeStyles, variantStyles, className].filter(Boolean).join(" ");

  return <button className={merged} {...props} />;
}
