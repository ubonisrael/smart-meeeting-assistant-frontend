type SummaryListProps = {
  title: string;
  items: string[];
};

export function SummaryList({ title, items }: SummaryListProps) {
  if (!items.length) {
    return null;
  }

  return (
    <section>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-md border border-stone-200 px-3 py-2 text-stone-700">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
