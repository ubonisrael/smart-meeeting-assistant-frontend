type TabButtonProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

export function TabButton({ active, label, onClick }: TabButtonProps) {
  return (
    <button className={`rounded px-3 py-2 text-sm font-medium ${active ? "bg-ink text-white" : "text-stone-600"}`} onClick={onClick}>
      {label}
    </button>
  );
}
