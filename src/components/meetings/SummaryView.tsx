import { SummaryList } from "../ui/SummaryList";
import type { Summary } from "../../types";

export function SummaryView({ summary }: { summary: Summary | null }) {
  if (!summary) {
    return <p className="text-sm text-stone-500">Summary will appear after processing completes.</p>;
  }

  return (
    <div className="space-y-5">
      <section>
        <h3 className="mb-2 font-semibold">Overview</h3>
        <p className="leading-7 text-stone-700">{summary.overview}</p>
      </section>
      <SummaryList title="Decisions" items={summary.decisions} />
      <SummaryList title="Risks" items={summary.risks} />
      <SummaryList title="Next steps" items={summary.nextSteps} />
    </div>
  );
}
