export type User = {
  id: string;
  email: string;
  name: string;
};

export type AuthSession = {
  user: User;
};

export type Meeting = {
  id: string;
  title: string;
  status: string;
  failedReason?: string | null;
  meetingDate: string;
  createdAt: string;
  updatedAt: string;
};

export type TranscriptSegment = {
  id: string;
  start: string | number;
  end: string | number;
  text: string;
};

export type Summary = {
  id: string;
  overview: string;
  decisions: string[];
  risks: string[];
  nextSteps: string[];
  createdAt: string;
};

export type ActionItem = {
  id: string;
  assignee?: string | null;
  task: string;
  deadline?: string | null;
  sourceText?: string | null;
  confidence?: string | number | null;
  completedAt?: string | null;
};

export type AskSource = {
  meetingId: string;
  title: string;
  segmentStart?: string | number | null;
  segmentEnd?: string | number | null;
  text: string;
};
