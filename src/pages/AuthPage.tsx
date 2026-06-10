import { useState, type FormEvent } from "react";
import { FileAudio } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../hooks/useAuth";
import { LabeledInput } from "../components/ui/LabeledInput";
import { getErrorMessage } from "../utils/error";

export function AuthPage() {
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/meetings" replace />;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const session =
        mode === "register"
          ? await api.register({ name, email, password })
          : await api.login({ email, password });
      signIn(session);
      navigate("/meetings", { replace: true });
    } catch (caught) {
      setError(getErrorMessage(caught, "Authentication failed"));
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

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/20 pt-3">
      <p className="text-xs uppercase text-white/60">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
