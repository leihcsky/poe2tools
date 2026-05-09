import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({
  variant = "primary",
  className,
  ...props
}: Props) {
  const base =
    "inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950"
      : "border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50";
  const merged = [base, styles, className].filter(Boolean).join(" ");

  return <button className={merged} {...props} />;
}

