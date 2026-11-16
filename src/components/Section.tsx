import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-16 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted">
      {children}
    </span>
  );
}
