export function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/20 pt-3">
      <p className="text-xs uppercase text-white/60">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
