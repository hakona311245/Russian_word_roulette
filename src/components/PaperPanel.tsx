import type { PropsWithChildren } from "react";

type PaperPanelProps = PropsWithChildren<{
  className?: string;
}>;

export function PaperPanel({ children, className = "" }: PaperPanelProps) {
  return <section className={`paper-panel ${className}`}>{children}</section>;
}
