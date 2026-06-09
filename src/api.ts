import type { ActionItem, AskSource, AuthSession, Meeting, Summary, TranscriptSegment } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const body = await response.json();
      message = body.error ?? message;
    } catch {
      message = await response.text();
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  register(input: { name: string; email: string; password: string }) {
    return request<AuthSession>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },
  login(input: { email: string; password: string }) {
    return request<AuthSession>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },
  listMeetings(token: string) {
    return request<{ meetings: Meeting[] }>("/meetings", {}, token);
  },
  uploadMeeting(token: string, input: { title: string; file: File }) {
    const form = new FormData();
    form.append("title", input.title);
    form.append("recording", input.file);
    return request<{ meetingId: string; status: string }>(
      "/meetings/upload",
      {
        method: "POST",
        body: form
      },
      token
    );
  },
  getMeeting(token: string, meetingId: string) {
    return request<{ meeting: Meeting }>(`/meetings/${meetingId}`, {}, token);
  },
  getTranscript(token: string, meetingId: string) {
    return request<{ transcript: { id: string; text: string; language?: string } | null; segments: TranscriptSegment[] }>(
      `/meetings/${meetingId}/transcript`,
      {},
      token
    );
  },
  getSummary(token: string, meetingId: string) {
    return request<{ summary: Summary | null }>(`/meetings/${meetingId}/summary`, {}, token);
  },
  getActionItems(token: string, meetingId: string) {
    return request<{ actionItems: ActionItem[] }>(`/meetings/${meetingId}/action-items`, {}, token);
  },
  search(token: string, query: string) {
    return request<{ results: AskSource[] }>(
      "/meetings/search",
      {
        method: "POST",
        body: JSON.stringify({ query })
      },
      token
    );
  },
  ask(token: string, question: string) {
    return request<{ answer: string; sources: AskSource[] }>(
      "/meetings/ask",
      {
        method: "POST",
        body: JSON.stringify({ question })
      },
      token
    );
  }
};

