import { useState, type FormEvent, type ReactNode } from "react";
import { KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { LabeledInput } from "../components/ui/LabeledInput";
import { getErrorMessage } from "../utils/error";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setStatus("");
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setStatus("If the email exists, a password reset link has been sent.");
    } catch (caught) {
      setError(getErrorMessage(caught, "Could not request password reset"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPanel icon={<KeyRound size={24} />} title="Forgot password">
      <form className="space-y-4" onSubmit={submit}>
        <LabeledInput label="Email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" />
        {error && <p className="rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>}
        {status && <p className="rounded-md border border-moss/20 bg-moss/10 px-3 py-2 text-sm text-moss">{status}</p>}
        <button className="focus-ring h-11 w-full rounded-md bg-moss px-4 font-medium text-white hover:bg-[#1f5c4f]" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
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
