import { ChangeEvent, FormEvent, InputHTMLAttributes, ReactNode, useEffect, useState } from "react";
import {
  CheckCircle2,
  FileAudio,
  ListChecks,
  LogOut,
  MessageSquareText,
  RefreshCw,
  Search,
  Upload,
  UserRound
} from "lucide-react";
import { api, ApiError } from "./api";
import { clearSession, loadSession, saveSession } from "./session";
import type { ActionItem, AskSource, AuthSession, Meeting, Summary, TranscriptSegment } from "./types";

type View = "dashboard" | "upload" | "ask";

export function App() {
  const [session, setSession] = useState<AuthSession | null>(() => loadSession());
  const [view, setView] = useState<View>("dashboard");

  if (!session) {
    return <AuthScreen onAuthenticated={setSession} />;
  }

  return (
    <div className="min-h-screen bg-[#f8faf7] text-ink">
      <header className="border-b border-stone-200 bg-white/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">Smart Meeting Assistant</h1>
            <p className="text-sm text-stone-500">{session.user.name}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <NavButton active={view === "dashboard"} icon={<ListChecks size={18} />} label="Meetings" onClick={() => setView("dashboard")} />
            <NavButton active={view === "upload"} icon={<Upload size={18} />} label="Upload" onClick={() => setView("upload")} />
            <NavButton active={view === "ask"} icon={<MessageSquareText size={18} />} label="Ask" onClick={() => setView("ask")} />
            <button
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
              onClick={() => {
                clearSession();
                setSession(null);
              }}
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {view === "dashboard" && <Dashboard token={session.accessToken} />}
        {view === "upload" && <UploadMeeting token={session.accessToken} onUploaded={() => setView("dashboard")} />}
        {view === "ask" && <AskMeetings token={session.accessToken} />}
      </main>
    </div>
  );
}

function AuthScreen({ onAuthenticated }: { onAuthenticated: (session: AuthSession) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session =
        mode === "register"
          ? await api.register({ name, email, password })
          : await api.login({ email, password });
      saveSession(session);
      onAuthenticated(session);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-[#f8faf7] text-ink lg:grid-cols-[1fr_440px]">
      <section className="flex min-h-[42vh] flex-col justify-between border-b border-stone-200 bg-moss px-6 py-8 text-white lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-white/15">
            <FileAudio size={24} />
          </div>
          <span className="text-lg font-semibold">Smart Meeting Assistant</span>
        </div>
        <div className="max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-normal md:text-5xl">Meeting memory that stays searchable.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/80">
            Upload recordings, process transcripts in the background, extract the work that matters, and ask direct questions across past conversations.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-white/80 md:grid-cols-3">
          <Signal label="Transcription" value="Queued" />
          <Signal label="Summary" value="Structured" />
          <Signal label="Search" value="Contextual" />
        </div>
      </section>

      <section className="flex items-center px-6 py-10">
        <form onSubmit={submit} className="w-full">
          <div className="mb-6 inline-flex rounded-md border border-stone-300 bg-white p-1">
            <button
              type="button"
              className={`rounded px-3 py-2 text-sm font-medium ${mode === "login" ? "bg-ink text-white" : "text-stone-600"}`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={`rounded px-3 py-2 text-sm font-medium ${mode === "register" ? "bg-ink text-white" : "text-stone-600"}`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          <h1 className="text-2xl font-semibold">{mode === "login" ? "Welcome back" : "Create account"}</h1>
          <div className="mt-6 space-y-4">
            {mode === "register" && (
              <LabeledInput label="Name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
            )}
            <LabeledInput label="Email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" type="email" />
            <LabeledInput
              label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              type="password"
            />
          </div>

          {error && <p className="mt-4 rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>}

          <button className="focus-ring mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-moss px-4 font-medium text-white hover:bg-[#1f5c4f]" disabled={loading}>
            {loading ? "Working..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>
      </section>
    </div>
  );
}

function Dashboard({ token }: { token: string }) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const response = await api.listMeetings(token);
      setMeetings(response.meetings);
      setSelectedId((current) => current ?? response.meetings[0]?.id ?? null);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Could not load meetings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => void load(), 8000);
    return () => window.clearInterval(interval);
  }, [token]);

  const selected = meetings.find((meeting) => meeting.id === selectedId) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <section className="rounded-md border border-stone-200 bg-white">
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
          <h2 className="font-semibold">Meetings</h2>
          <button className="focus-ring rounded-md p-2 text-stone-600 hover:bg-stone-100" onClick={() => void load()} title="Refresh">
            <RefreshCw size={18} />
          </button>
        </div>
        {error && <p className="m-4 rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>}
        {loading && <p className="p-4 text-sm text-stone-500">Loading meetings...</p>}
        {!loading && !meetings.length && <p className="p-4 text-sm text-stone-500">No meetings yet.</p>}
        <div className="divide-y divide-stone-100">
          {meetings.map((meeting) => (
            <button
              key={meeting.id}
              className={`block w-full px-4 py-3 text-left hover:bg-stone-50 ${selectedId === meeting.id ? "bg-wheat/30" : ""}`}
              onClick={() => setSelectedId(meeting.id)}
            >
              <span className="block truncate font-medium">{meeting.title}</span>
              <span className="mt-1 flex items-center gap-2 text-xs text-stone-500">
                <StatusDot status={meeting.status} />
                {meeting.status}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="min-h-[520px] rounded-md border border-stone-200 bg-white">
        {selected ? <MeetingDetail token={token} meeting={selected} /> : <EmptyState />}
      </section>
    </div>
  );
}

function UploadMeeting({ token, onUploaded }: { token: string; onUploaded: () => void }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      setError("Choose a recording file first");
      return;
    }

    setError("");
    setStatus("");
    setLoading(true);
    try {
      const response = await api.uploadMeeting(token, { title: title || file.name, file });
      setStatus(`Upload accepted. Meeting ${response.meetingId} is ${response.status}.`);
      window.setTimeout(onUploaded, 900);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-md border border-stone-200 bg-white p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-moss/10 text-moss">
          <Upload size={20} />
        </div>
        <div>
          <h2 className="font-semibold">Upload recording</h2>
          <p className="text-sm text-stone-500">mp3, wav, m4a, and mp4 files are supported.</p>
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-4">
        <LabeledInput label="Meeting title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Payments sync" />
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-stone-700">Recording</span>
          <input
            className="focus-ring block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
            type="file"
            accept=".mp3,.wav,.m4a,.mp4,audio/*,video/mp4"
            onChange={(event: ChangeEvent<HTMLInputElement>) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>

        {error && <p className="rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>}
        {status && <p className="rounded-md border border-moss/20 bg-moss/10 px-3 py-2 text-sm text-moss">{status}</p>}

        <button className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md bg-moss px-4 font-medium text-white hover:bg-[#1f5c4f]" disabled={loading}>
          <Upload size={18} />
          {loading ? "Uploading..." : "Upload and process"}
        </button>
      </form>
    </section>
  );
}

function MeetingDetail({ token, meeting }: { token: string; meeting: Meeting }) {
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [tab, setTab] = useState<"summary" | "transcript" | "actions">("summary");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [transcriptResponse, summaryResponse, actionResponse] = await Promise.all([
        api.getTranscript(token, meeting.id),
        api.getSummary(token, meeting.id),
        api.getActionItems(token, meeting.id)
      ]);
      if (!cancelled) {
        setSegments(transcriptResponse.segments);
        setSummary(summaryResponse.summary);
        setActionItems(actionResponse.actionItems);
      }
    }
    void load().catch(() => {
      if (!cancelled) {
        setSegments([]);
        setSummary(null);
        setActionItems([]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [meeting.id, token]);

  return (
    <div>
      <div className="border-b border-stone-200 px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">{meeting.title}</h2>
            <p className="mt-1 text-sm text-stone-500">{new Date(meeting.createdAt).toLocaleString()}</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-md border border-stone-200 px-3 py-1 text-sm">
            <StatusDot status={meeting.status} />
            {meeting.status}
          </span>
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
        {tab === "summary" && <SummaryView summary={summary} />}
        {tab === "transcript" && <TranscriptView segments={segments} />}
        {tab === "actions" && <ActionItemsView actionItems={actionItems} />}
      </div>
    </div>
  );
}

function SummaryView({ summary }: { summary: Summary | null }) {
  if (!summary) {
    return <p className="text-sm text-stone-500">Summary will appear after processing completes.</p>;
  }

  return (
    <div className="space-y-5">
      <section>
        <h3 className="mb-2 font-semibold">Overview</h3>
        <p className="leading-7 text-stone-700">{summary.overview}</p>
      </section>
      <SummaryList title="Decisions" items={summary.decisions} />
      <SummaryList title="Risks" items={summary.risks} />
      <SummaryList title="Next steps" items={summary.nextSteps} />
    </div>
  );
}

function TranscriptView({ segments }: { segments: TranscriptSegment[] }) {
  if (!segments.length) {
    return <p className="text-sm text-stone-500">Transcript segments will appear after processing completes.</p>;
  }

  return (
    <div className="max-h-[560px] space-y-3 overflow-auto pr-2">
      {segments.map((segment) => (
        <div key={segment.id} className="grid gap-2 border-b border-stone-100 pb-3 md:grid-cols-[120px_1fr]">
          <span className="text-sm font-medium text-moss">{formatTime(segment.start)} - {formatTime(segment.end)}</span>
          <p className="leading-7 text-stone-700">{segment.text}</p>
        </div>
      ))}
    </div>
  );
}

function ActionItemsView({ actionItems }: { actionItems: ActionItem[] }) {
  if (!actionItems.length) {
    return <p className="text-sm text-stone-500">Action items will appear after processing completes.</p>;
  }

  return (
    <div className="space-y-3">
      {actionItems.map((item) => (
        <div key={item.id} className="rounded-md border border-stone-200 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 text-moss" size={20} />
            <div>
              <p className="font-medium">{item.task}</p>
              <p className="mt-1 text-sm text-stone-500">
                {item.assignee || "Unassigned"} {item.deadline ? `· ${item.deadline}` : ""}
              </p>
              {item.sourceText && <p className="mt-3 text-sm leading-6 text-stone-600">{item.sourceText}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AskMeetings({ token }: { token: string }) {
  const [question, setQuestion] = useState("What did John say about payment processing last month?");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<AskSource[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setAnswer("");
    setSources([]);
    try {
      const response = await api.ask(token, question);
      setAnswer(response.answer);
      setSources(response.sources);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Question failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="rounded-md border border-stone-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-coral/10 text-coral">
            <Search size={20} />
          </div>
          <h2 className="font-semibold">Ask across meetings</h2>
        </div>
        <form onSubmit={submit}>
          <textarea
            className="focus-ring min-h-32 w-full resize-y rounded-md border border-stone-300 px-3 py-3 leading-7"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />
          {error && <p className="mt-3 rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>}
          <button className="focus-ring mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-ink px-4 font-medium text-white hover:bg-black" disabled={loading}>
            <MessageSquareText size={18} />
            {loading ? "Searching..." : "Ask"}
          </button>
        </form>
        {answer && (
          <div className="mt-6 border-t border-stone-200 pt-5">
            <h3 className="mb-2 font-semibold">Answer</h3>
            <p className="leading-7 text-stone-700">{answer}</p>
          </div>
        )}
      </section>

      <section className="rounded-md border border-stone-200 bg-white p-5">
        <h3 className="font-semibold">Sources</h3>
        {!sources.length && <p className="mt-3 text-sm text-stone-500">Matching source segments will appear here.</p>}
        <div className="mt-4 space-y-3">
          {sources.map((source, index) => (
            <div key={`${source.meetingId}-${index}`} className="border-b border-stone-100 pb-3">
              <p className="font-medium">{source.title}</p>
              {source.segmentStart != null && (
                <p className="mt-1 text-xs text-moss">{formatTime(source.segmentStart)} - {formatTime(source.segmentEnd ?? source.segmentStart)}</p>
              )}
              <p className="mt-2 text-sm leading-6 text-stone-600">{source.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function LabeledInput({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-stone-700">{label}</span>
      <input className="focus-ring h-11 w-full rounded-md border border-stone-300 bg-white px-3" {...props} />
    </label>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      className={`focus-ring inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium ${
        active ? "bg-ink text-white" : "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button className={`rounded px-3 py-2 text-sm font-medium ${active ? "bg-ink text-white" : "text-stone-600"}`} onClick={onClick}>
      {label}
    </button>
  );
}

function StatusDot({ status }: { status: string }) {
  const color = status === "completed" ? "bg-moss" : status === "failed" ? "bg-coral" : "bg-wheat";
  return <span className={`h-2.5 w-2.5 rounded-full ${color}`} />;
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/20 pt-3">
      <p className="text-xs uppercase text-white/60">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function SummaryList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <section>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-md border border-stone-200 px-3 py-2 text-stone-700">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="grid min-h-[520px] place-items-center px-6 text-center">
      <div>
        <UserRound className="mx-auto text-stone-400" size={32} />
        <p className="mt-3 text-sm text-stone-500">Select a meeting to inspect its transcript, summary, and action items.</p>
      </div>
    </div>
  );
}

function formatTime(value: string | number): string {
  const seconds = Number(value);
  if (!Number.isFinite(seconds)) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
}
