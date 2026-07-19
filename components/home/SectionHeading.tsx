export function SectionHeading({
  title,
  subtitle,
}: {
  title?: string | null;
  subtitle?: string | null;
}) {
  if (!title && !subtitle) return null;

  return (
    <div className="mb-4">
      {title && <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>}
      {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
    </div>
  );
}
