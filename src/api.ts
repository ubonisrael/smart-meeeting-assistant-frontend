import axios from "axios";
import type { ActionItem, AskSource, AuthSession, Meeting, Summary, TranscriptSegment } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

async function request<T>(path: string, options: { method?: string; data?: unknown } = {}): Promise<T> {
  try {
    const response = await client.request<T>({
      url: path,
      method: options.method ?? "GET",
      data: options.data
    });

    return response.data;
  } catch (caught) {
    if (axios.isAxiosError(caught)) {
      const status = caught.response?.status ?? 0;
      const responseData = caught.response?.data;
      const message =
        typeof responseData === "object" && responseData && "error" in responseData
          ? String(responseData.error)
          : typeof responseData === "string" && responseData
            ? responseData
            : caught.message || "Request failed";

      throw new ApiError(message, status);
    }

    throw caught;
  }
}

export const api = {
  register(input: { name: string; email: string; password: string }) {
    return request<AuthSession>("/auth/register", {
      method: "POST",
      data: input
    });
  },
  login(input: { email: string; password: string }) {
    return request<AuthSession>("/auth/login", {
      method: "POST",
      data: input
    });
  },
  me() {
    return request<AuthSession>("/auth/me");
  },
  logout() {
    return request<void>("/auth/logout", {
      method: "POST"
    });
  },
  listMeetings() {
    return request<{ meetings: Meeting[] }>("/meetings");
  },
  uploadMeeting(input: { title: string; file: File }) {
    const form = new FormData();
    form.append("title", input.title);
    form.append("recording", input.file);
    return request<{ meetingId: string; status: string }>("/meetings/upload", {
      method: "POST",
      data: form
    });
  },
  getMeeting(meetingId: string) {
    return request<{ meeting: Meeting }>(`/meetings/${meetingId}`);
  },
  getTranscript(meetingId: string) {
    return request<{ transcript: { id: string; text: string; language?: string } | null; segments: TranscriptSegment[] }>(
      `/meetings/${meetingId}/transcript`
    );
  },
  getSummary(meetingId: string) {
    return request<{ summary: Summary | null }>(`/meetings/${meetingId}/summary`);
  },
  getActionItems(meetingId: string) {
    return request<{ actionItems: ActionItem[] }>(`/meetings/${meetingId}/action-items`);
  },
  search(query: string) {
    return request<{ results: AskSource[] }>("/meetings/search", {
      method: "POST",
      data: { query }
    });
  },
  ask(question: string) {
    return request<{ answer: string; sources: AskSource[] }>("/meetings/ask", {
      method: "POST",
      data: { question }
    });
  }
};
