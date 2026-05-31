import Link from "next/link";

export function EmptyState({
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="soft-panel texture max-w-xl p-8 text-center">
      <h1 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>{title}</h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-cream-700">{description}</p>
      <div className="mt-7">
        <Link href={ctaHref} className="glass-btn-dark">
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
