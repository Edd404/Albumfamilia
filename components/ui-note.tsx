import type { ReactNode } from "react";

export function UiNote({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-cream-200 bg-white/70 px-4 py-3 text-sm text-cream-700">{children}</div>;
}
