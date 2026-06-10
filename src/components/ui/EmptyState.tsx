import { UserRound } from "lucide-react";

export function EmptyState() {
  return (
    <div className="grid min-h-[520px] place-items-center px-6 text-center">
      <div>
        <UserRound className="mx-auto text-stone-400" size={32} />
        <p className="mt-3 text-sm text-stone-500">Select a meeting to inspect its transcript, summary, and action items.</p>
      </div>
    </div>
  );
}
