import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { meetingKeys } from "./useMeetings";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export function useMeetingEvents() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const es = new EventSource(`${API_BASE_URL}/meetings/events`, {
      withCredentials: true,
    });

    es.addEventListener("meeting-updated", (e) => {
      const { meetingId } = JSON.parse(e.data) as { meetingId: string; status: string };
      void queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) });
      void queryClient.invalidateQueries({ queryKey: meetingKeys.transcript(meetingId) });
      void queryClient.invalidateQueries({ queryKey: meetingKeys.summary(meetingId) });
      void queryClient.invalidateQueries({ queryKey: meetingKeys.actionItems(meetingId) });
    });

    return () => {
      es.close();
    };
  }, [queryClient]);
}
