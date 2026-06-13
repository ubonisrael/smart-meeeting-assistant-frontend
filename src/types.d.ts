type User = {
  id: string;
  email: string;
  name: string;
  emailVerifiedAt: string | null;
  twoFactorEnabled: boolean;
};

type AuthSession = {
  user: User;
};

type RegisterResponse = AuthSession & {
  emailVerificationRequired: boolean;
};

type LoginResponse =
  | AuthSession
  | {
      twoFactorRequired: true;
      challengeToken: string;
    };

type Meeting = {
  id: string;
  title: string;
  status: string;
  failedReason?: string | null;
  meetingDate: string;
  createdAt: string;
  updatedAt: string;
};

type TranscriptSegment = {
  id: string;
  start: string | number;
  end: string | number;
  text: string;
};

type Summary = {
  id: string;
  overview: string;
  decisions: string[];
  risks: string[];
  nextSteps: string[];
  createdAt: string;
};

type ActionItem = {
  id: string;
  assignee?: string | null;
  task: string;
  deadline?: string | null;
  sourceText?: string | null;
  confidence?: string | number | null;
  completedAt?: string | null;
};

type AskSource = {
  meetingId: string;
  title: string;
  segmentStart?: string | number | null;
  segmentEnd?: string | number | null;
  text: string;
};
