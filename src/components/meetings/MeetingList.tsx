import { RefreshCw } from "lucide-react";
import { NavLink } from "react-router-dom";
import { StatusDot } from "../ui/StatusDot";

type MeetingListProps = {
  meetings: Meeting[];
  isLoading: boolean;
  error?: string;
  onRefresh: () => void;
  isRefreshing: boolean;
};

export function MeetingList({ meetings, isLoading, error, onRefresh, isRefreshing }: MeetingListProps) {
  return (
    <section className="rounded-md border border-stone-200 bg-white">
      <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
        <h2 className="font-semibold">Meetings</h2>
        <button className="focus-ring rounded-md p-2 text-stone-600 hover:bg-stone-100" onClick={onRefresh} title="Refresh">
          <RefreshCw className={isRefreshing ? "animate-spin" : ""} size={18} />
        </button>
      </div>
      {error && <p className="m-4 rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>}
      {isLoading && <p className="p-4 text-sm text-stone-500">Loading meetings...</p>}
      {!isLoading && !meetings.length && <p className="p-4 text-sm text-stone-500">No meetings yet.</p>}
      <div className="divide-y divide-stone-100">
        {meetings.map((meeting) => (
          <NavLink
            key={meeting.id}
            className={({ isActive }) => `block w-full px-4 py-3 text-left hover:bg-stone-50 ${isActive ? "bg-wheat/30" : ""}`}
            to={`/meetings/${meeting.id}`}
          >
            <span className="block truncate font-medium">{meeting.title}</span>
            <span className="mt-1 flex items-center gap-2 text-xs text-stone-500">
              <StatusDot status={meeting.status} />
              {meeting.status}
            </span>
          </NavLink>
        ))}
      </div>
    </section>
  );
}
