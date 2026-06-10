import { formatTime } from "../../utils/format";
import type { TranscriptSegment } from "../../types";

export function TranscriptView({ segments }: { segments: TranscriptSegment[] }) {
  if (!segments.length) {
    return <p className="text-sm text-stone-500">Transcript segments will appear after processing completes.</p>;
  }

  return (
    <div className="max-h-[560px] space-y-3 overflow-auto pr-2">
      {segments.map((segment) => (
        <div key={segment.id} className="grid gap-2 border-b border-stone-100 pb-3 md:grid-cols-[120px_1fr]">
          <span className="text-sm font-medium text-moss">
            {formatTime(segment.start)} - {formatTime(segment.end)}
          </span>
          <p className="leading-7 text-stone-700">{segment.text}</p>
        </div>
      ))}
    </div>
  );
}
