import { CheckCircle2 } from "lucide-react";

export function ActionItemsView({ actionItems }: { actionItems: ActionItem[] }) {
  if (!actionItems.length) {
    return <p className="text-sm text-stone-500">Action items will appear after processing completes.</p>;
  }

  return (
    <div className="space-y-3">
      {actionItems.map((item) => (
        <div key={item.id} className="rounded-md border border-stone-200 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 text-moss" size={20} />
            <div>
              <p className="font-medium">{item.task}</p>
              <p className="mt-1 text-sm text-stone-500">
                {item.assignee || "Unassigned"} {item.deadline ? `- ${item.deadline}` : ""}
              </p>
              {item.sourceText && <p className="mt-3 text-sm leading-6 text-stone-600">{item.sourceText}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
