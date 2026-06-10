import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { useAuth } from "./useAuth";

export const meetingKeys = {
  all: ["meetings"] as const,
  lists: () => [...meetingKeys.all, "list"] as const,
  detail: (meetingId: string) => [...meetingKeys.all, "detail", meetingId] as const,
  transcript: (meetingId: string) => [...meetingKeys.all, "transcript", meetingId] as const,
  summary: (meetingId: string) => [...meetingKeys.all, "summary", meetingId] as const,
  actionItems: (meetingId: string) => [...meetingKeys.all, "action-items", meetingId] as const
};

export function useMeetings() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: meetingKeys.lists(),
    queryFn: () => api.listMeetings(),
    enabled: isAuthenticated,
    refetchInterval: 8000
  });
}

export function useMeeting(meetingId?: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: meetingKeys.detail(meetingId ?? ""),
    queryFn: () => api.getMeeting(meetingId ?? ""),
    enabled: Boolean(isAuthenticated && meetingId)
  });
}

export function useMeetingTranscript(meetingId?: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: meetingKeys.transcript(meetingId ?? ""),
    queryFn: () => api.getTranscript(meetingId ?? ""),
    enabled: Boolean(isAuthenticated && meetingId)
  });
}

export function useMeetingSummary(meetingId?: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: meetingKeys.summary(meetingId ?? ""),
    queryFn: () => api.getSummary(meetingId ?? ""),
    enabled: Boolean(isAuthenticated && meetingId)
  });
}

export function useMeetingActionItems(meetingId?: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: meetingKeys.actionItems(meetingId ?? ""),
    queryFn: () => api.getActionItems(meetingId ?? ""),
    enabled: Boolean(isAuthenticated && meetingId)
  });
}

export function useUploadMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { title: string; file: File }) => api.uploadMeeting(input),
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    }
  });
}

export function useAskMeetings() {
  return useMutation({
    mutationFn: (question: string) => api.ask(question)
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
