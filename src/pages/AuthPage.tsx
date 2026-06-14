import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FileAudio } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../hooks/useAuth";
import { LabeledInput } from "../components/ui/LabeledInput";
import { getErrorMessage } from "../utils/error";
import { useVerifyTwoFactorLogin } from "@/hooks/useProfile";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const { mutateAsync: verifyTwoFactor } = useVerifyTwoFactorLogin();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorChallenge, setTwoFactorChallenge] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/meetings" replace />;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setStatus("");
    setLoading(true);

    try {
      if (mode === "register") {
        await api.register({ name, email, password });
        setStatus("Account created. Check your email for a verification link before signing in.");
        setMode("login");
        setPassword("");
        return;
      }

      const response = await api.login({ email, password });
      if (isTwoFactorResponse(response)) {
        setTwoFactorChallenge(response.challengeToken);
        setPassword("");
        return;
      }

      await queryClient.refetchQueries({ queryKey: ["profile"] });
      navigate("/meetings", { replace: true });
    } catch (caught) {
      setError(getErrorMessage(caught, "Authentication failed"));
    } finally {
      setLoading(false);
    }
  }

  async function submitTwoFactor(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyTwoFactor({ challengeToken: twoFactorChallenge, code: twoFactorCode });
      await queryClient.refetchQueries({ queryKey: ["profile"] });
      navigate("/meetings", { replace: true });
    } catch (caught) {
      setError(getErrorMessage(caught, "Two-factor verification failed"));
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
        <form onSubmit={twoFactorChallenge ? submitTwoFactor : submit} className="w-full">
          <div className="mb-6 inline-flex rounded-md border border-stone-300 bg-white p-1">
            <button
              type="button"
              className={`rounded px-3 py-2 text-sm font-medium ${mode === "login" ? "bg-ink text-white" : "text-stone-600"}`}
              onClick={() => {
                setMode("login");
                setTwoFactorChallenge("");
                setError("");
              }}
            >
              Login
            </button>
            <button
              type="button"
              className={`rounded px-3 py-2 text-sm font-medium ${mode === "register" ? "bg-ink text-white" : "text-stone-600"}`}
              onClick={() => {
                setMode("register");
                setTwoFactorChallenge("");
                setError("");
              }}
            >
              Register
            </button>
          </div>

          <h1 className="text-2xl font-semibold">{twoFactorChallenge ? "Enter two-factor code" : mode === "login" ? "Welcome back" : "Create account"}</h1>
          {twoFactorChallenge ? (
            <div className="mt-6 space-y-4">
              <LabeledInput
                label="Authenticator code"
                value={twoFactorCode}
                onChange={(event) => setTwoFactorCode(event.target.value)}
                autoComplete="one-time-code"
                inputMode="numeric"
              />
            </div>
          ) : (
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
          )}

          {error && <p className="mt-4 rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>}
          {status && <p className="mt-4 rounded-md border border-moss/20 bg-moss/10 px-3 py-2 text-sm text-moss">{status}</p>}

          <button className="focus-ring mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-moss px-4 font-medium text-white hover:bg-[#1f5c4f]" disabled={loading}>
            {loading ? "Working..." : twoFactorChallenge ? "Verify code" : mode === "login" ? "Login" : "Register"}
          </button>
          {!twoFactorChallenge && (
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-stone-600">
              <Link className="font-medium text-moss hover:underline" to="/forgot-password">Forgot password?</Link>
              <Link className="font-medium text-moss hover:underline" to="/resend-verification">Resend verification email</Link>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

function isTwoFactorResponse(response: LoginResponse): response is { twoFactorRequired: true; challengeToken: string } {
  return "twoFactorRequired" in response;
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/20 pt-3">
      <p className="text-xs uppercase text-white/60">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
