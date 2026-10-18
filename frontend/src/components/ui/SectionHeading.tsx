export function SectionHeading({
  eyebrow,
  title,
  body
}: {
  eyebrow?: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-amber-700">{eyebrow}</p> : null}
      <h2 className="text-2xl font-bold text-warm-900 md:text-3xl">{title}</h2>
      {body ? <p className="mt-3 text-base leading-7 text-warm-700">{body}</p> : null}
    </div>
  );
}
