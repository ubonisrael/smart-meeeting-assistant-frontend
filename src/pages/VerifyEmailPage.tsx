import { useEffect, useState, type ReactNode } from "react";
import { CheckCircle2, MailCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/error";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || status !== "idle") {
      return;
    }

    async function verify() {
      setStatus("working");
      try {
        const session = await api.verifyEmail(token);
        signIn(session);
        setStatus("done");
        setMessage("Email verified. Redirecting...");
        window.setTimeout(() => navigate("/meetings", { replace: true }), 900);
      } catch (caught) {
        setStatus("error");
        setMessage(getErrorMessage(caught, "Email verification failed"));
      }
    }

    void verify();
  }, [navigate, signIn, status, token]);

  return (
    <AuthPanel icon={<MailCheck size={24} />} title="Verify email">
      {!token && <p className="text-sm text-stone-600">The verification link is missing a token.</p>}
      {token && status === "working" && <p className="text-sm text-stone-600">Verifying your email...</p>}
      {message && (
        <p className={`rounded-md px-3 py-2 text-sm ${status === "error" ? "border border-coral/30 bg-coral/10 text-coral" : "border border-moss/20 bg-moss/10 text-moss"}`}>
          {message}
        </p>
      )}
      {status === "done" && <CheckCircle2 className="text-moss" size={28} />}
      <Link className="text-sm font-medium text-moss hover:underline" to="/login">Back to login</Link>
    </AuthPanel>
  );
}

function AuthPanel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f8faf7] px-4 text-ink">
      <section className="w-full max-w-md rounded-md border border-stone-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-moss/10 text-moss">{icon}</div>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="space-y-4">{children}</div>
      </section>
    </div>
  );
}
