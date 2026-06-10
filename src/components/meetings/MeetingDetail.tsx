import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { ActionItemsView } from "./ActionItemsView";
import { SummaryView } from "./SummaryView";
import { TranscriptView } from "./TranscriptView";
import { useMeetingActionItems, useMeetingSummary, useMeetingTranscript, useRefreshMeetingDetails } from "../../hooks/useMeetings";
import { StatusDot } from "../ui/StatusDot";
import { TabButton } from "../ui/TabButton";
import type { Meeting } from "../../types";

type MeetingDetailProps = {
  meeting: Meeting;
};

export function MeetingDetail({ meeting }: MeetingDetailProps) {
  const [tab, setTab] = useState<"summary" | "transcript" | "actions">("summary");
  const transcriptQuery = useMeetingTranscript(meeting.id);
  const summaryQuery = useMeetingSummary(meeting.id);
  const actionItemsQuery = useMeetingActionItems(meeting.id);
  const refreshMeetingDetails = useRefreshMeetingDetails(meeting.id);
  const isRefreshing = transcriptQuery.isFetching || summaryQuery.isFetching || actionItemsQuery.isFetching;

  return (
    <div>
      <div className="border-b border-stone-200 px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">{meeting.title}</h2>
            <p className="mt-1 text-sm text-stone-500">{new Date(meeting.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="focus-ring inline-flex h-9 items-center gap-2 rounded-md border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
              onClick={() => void refreshMeetingDetails()}
              title="Refresh meeting details"
            >
              <RefreshCw className={isRefreshing ? "animate-spin" : ""} size={16} />
              Refresh
            </button>
            <span className="inline-flex w-fit items-center gap-2 rounded-md border border-stone-200 px-3 py-1 text-sm">
              <StatusDot status={meeting.status} />
              {meeting.status}
            </span>
          </div>
        </div>
        {meeting.failedReason && <p className="mt-3 rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">{meeting.failedReason}</p>}
      </div>

      <div className="border-b border-stone-200 px-5 py-3">
        <div className="inline-flex rounded-md border border-stone-300 bg-white p-1">
          <TabButton active={tab === "summary"} label="Summary" onClick={() => setTab("summary")} />
          <TabButton active={tab === "transcript"} label="Transcript" onClick={() => setTab("transcript")} />
          <TabButton active={tab === "actions"} label="Actions" onClick={() => setTab("actions")} />
        </div>
      </div>

      <div className="p-5">
        {tab === "summary" && <SummaryView summary={summaryQuery.data?.summary ?? null} />}
        {tab === "transcript" && <TranscriptView segments={transcriptQuery.data?.segments ?? []} />}
        {tab === "actions" && <ActionItemsView actionItems={actionItemsQuery.data?.actionItems ?? []} />}
      </div>
    </div>
  );
}
