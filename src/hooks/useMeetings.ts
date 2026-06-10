import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { useAccessToken } from "./useAuth";

export const meetingKeys = {
  all: ["meetings"] as const,
  lists: () => [...meetingKeys.all, "list"] as const,
  detail: (meetingId: string) => [...meetingKeys.all, "detail", meetingId] as const,
  transcript: (meetingId: string) => [...meetingKeys.all, "transcript", meetingId] as const,
  summary: (meetingId: string) => [...meetingKeys.all, "summary", meetingId] as const,
  actionItems: (meetingId: string) => [...meetingKeys.all, "action-items", meetingId] as const
};

export function useMeetings() {
  const token = useAccessToken();

  return useQuery({
    queryKey: meetingKeys.lists(),
    queryFn: () => api.listMeetings(token),
    enabled: Boolean(token),
    refetchInterval: 8000
  });
}

export function useMeeting(meetingId?: string) {
  const token = useAccessToken();

  return useQuery({
    queryKey: meetingKeys.detail(meetingId ?? ""),
    queryFn: () => api.getMeeting(token, meetingId ?? ""),
    enabled: Boolean(token && meetingId)
  });
}

export function useMeetingTranscript(meetingId?: string) {
  const token = useAccessToken();

  return useQuery({
    queryKey: meetingKeys.transcript(meetingId ?? ""),
    queryFn: () => api.getTranscript(token, meetingId ?? ""),
    enabled: Boolean(token && meetingId)
  });
}

export function useMeetingSummary(meetingId?: string) {
  const token = useAccessToken();

  return useQuery({
    queryKey: meetingKeys.summary(meetingId ?? ""),
    queryFn: () => api.getSummary(token, meetingId ?? ""),
    enabled: Boolean(token && meetingId)
  });
}

export function useMeetingActionItems(meetingId?: string) {
  const token = useAccessToken();

  return useQuery({
    queryKey: meetingKeys.actionItems(meetingId ?? ""),
    queryFn: () => api.getActionItems(token, meetingId ?? ""),
    enabled: Boolean(token && meetingId)
  });
}

export function useUploadMeeting() {
  const token = useAccessToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { title: string; file: File }) => api.uploadMeeting(token, input),
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    }
  });
}

export function useAskMeetings() {
  const token = useAccessToken();

  return useMutation({
    mutationFn: (question: string) => api.ask(token, question)
  });
}

export function useRefreshMeetingDetails(meetingId: string) {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) }),
      queryClient.invalidateQueries({ queryKey: meetingKeys.transcript(meetingId) }),
      queryClient.invalidateQueries({ queryKey: meetingKeys.summary(meetingId) }),
      queryClient.invalidateQueries({ queryKey: meetingKeys.actionItems(meetingId) })
    ]);
}
