import { useState, type FormEvent, type ReactNode } from "react";
import { KeyRound, ShieldCheck, UserRound } from "lucide-react";
import { api } from "../api";
import { LabeledInput } from "../components/ui/LabeledInput";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/error";

export function SettingsPage() {
  const { session, signIn } = useAuth();
  const user = session!.user;
  const [name, setName] = useState(user.name);
  const [profileStatus, setProfileStatus] = useState("");
  const [profileError, setProfileError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [twoFactorSetup, setTwoFactorSetup] = useState<{ secret: string; otpauthUrl: string } | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorPassword, setTwoFactorPassword] = useState("");
  const [twoFactorStatus, setTwoFactorStatus] = useState("");
  const [twoFactorError, setTwoFactorError] = useState("");
  const [loadingAction, setLoadingAction] = useState("");

  async function submitProfile(event: FormEvent) {
    event.preventDefault();
    setProfileError("");
    setProfileStatus("");
    setLoadingAction("profile");
    try {
      const sessionResponse = await api.updateProfile({ name });
      signIn(sessionResponse);
      setProfileStatus("Profile updated.");
    } catch (caught) {
      setProfileError(getErrorMessage(caught, "Could not update profile"));
    } finally {
      setLoadingAction("");
    }
  }

  async function submitPassword(event: FormEvent) {
    event.preventDefault();
    setPasswordError("");
    setPasswordStatus("");
    setLoadingAction("password");
    try {
      await api.updatePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setPasswordStatus("Password updated.");
    } catch (caught) {
      setPasswordError(getErrorMessage(caught, "Could not update password"));
    } finally {
      setLoadingAction("");
    }
  }

  async function startTwoFactorSetup() {
    setTwoFactorError("");
    setTwoFactorStatus("");
    setLoadingAction("2fa-setup");
    try {
      const setup = await api.setupTwoFactor();
      setTwoFactorSetup(setup);
      setTwoFactorStatus("Add this secret to your authenticator app, then enter a code to enable 2FA.");
    } catch (caught) {
      setTwoFactorError(getErrorMessage(caught, "Could not start two-factor setup"));
    } finally {
      setLoadingAction("");
    }
  }

  async function enableTwoFactor(event: FormEvent) {
    event.preventDefault();
    setTwoFactorError("");
    setTwoFactorStatus("");
    setLoadingAction("2fa-enable");
    try {
      const sessionResponse = await api.enableTwoFactor(twoFactorCode);
      signIn(sessionResponse);
      setTwoFactorSetup(null);
      setTwoFactorCode("");
      setTwoFactorStatus("Two-factor authentication enabled.");
    } catch (caught) {
      setTwoFactorError(getErrorMessage(caught, "Could not enable two-factor authentication"));
    } finally {
      setLoadingAction("");
    }
  }

  async function disableTwoFactor(event: FormEvent) {
    event.preventDefault();
    setTwoFactorError("");
    setTwoFactorStatus("");
    setLoadingAction("2fa-disable");
    try {
      const sessionResponse = await api.disableTwoFactor({
        password: twoFactorPassword,
        code: twoFactorCode
      });
      signIn(sessionResponse);
      setTwoFactorPassword("");
      setTwoFactorCode("");
      setTwoFactorStatus("Two-factor authentication disabled.");
    } catch (caught) {
      setTwoFactorError(getErrorMessage(caught, "Could not disable two-factor authentication"));
    } finally {
      setLoadingAction("");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="space-y-6">
        <Panel icon={<UserRound size={20} />} title="Profile">
          <form className="grid gap-4" onSubmit={submitProfile}>
            <LabeledInput label="Email" value={user.email} disabled />
            <LabeledInput label="Name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
            <StatusMessage error={profileError} status={profileStatus} />
            <button className="focus-ring h-11 rounded-md bg-moss px-4 font-medium text-white hover:bg-[#1f5c4f]" disabled={loadingAction === "profile"}>
              {loadingAction === "profile" ? "Saving..." : "Save profile"}
            </button>
          </form>
        </Panel>

        <Panel icon={<KeyRound size={20} />} title="Password">
          <form className="grid gap-4" onSubmit={submitPassword}>
            <LabeledInput label="Current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} type="password" autoComplete="current-password" />
            <LabeledInput label="New password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" autoComplete="new-password" />
            <StatusMessage error={passwordError} status={passwordStatus} />
            <button className="focus-ring h-11 rounded-md bg-ink px-4 font-medium text-white hover:bg-black" disabled={loadingAction === "password"}>
              {loadingAction === "password" ? "Saving..." : "Change password"}
            </button>
          </form>
        </Panel>
      </section>

      <Panel icon={<ShieldCheck size={20} />} title="Two-factor authentication">
        <div className="space-y-4">
          <p className="rounded-md border border-stone-200 px-3 py-2 text-sm text-stone-600">
            Status: <span className="font-medium text-ink">{user.twoFactorEnabled ? "Enabled" : "Disabled"}</span>
          </p>

          {!user.twoFactorEnabled && !twoFactorSetup && (
            <button className="focus-ring h-11 w-full rounded-md bg-moss px-4 font-medium text-white hover:bg-[#1f5c4f]" onClick={() => void startTwoFactorSetup()} disabled={loadingAction === "2fa-setup"}>
              {loadingAction === "2fa-setup" ? "Starting..." : "Set up authenticator app"}
            </button>
          )}

          {!user.twoFactorEnabled && twoFactorSetup && (
            <form className="space-y-4" onSubmit={enableTwoFactor}>
              <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
                <p className="text-xs font-medium uppercase text-stone-500">Secret</p>
                <p className="mt-1 break-all font-mono text-sm text-ink">{twoFactorSetup.secret}</p>
                <p className="mt-3 text-xs font-medium uppercase text-stone-500">Authenticator URI</p>
                <p className="mt-1 break-all text-xs text-stone-600">{twoFactorSetup.otpauthUrl}</p>
              </div>
              <LabeledInput label="Authenticator code" value={twoFactorCode} onChange={(event) => setTwoFactorCode(event.target.value)} inputMode="numeric" autoComplete="one-time-code" />
              <button className="focus-ring h-11 w-full rounded-md bg-moss px-4 font-medium text-white hover:bg-[#1f5c4f]" disabled={loadingAction === "2fa-enable"}>
                {loadingAction === "2fa-enable" ? "Enabling..." : "Enable 2FA"}
              </button>
            </form>
          )}

          {user.twoFactorEnabled && (
            <form className="space-y-4" onSubmit={disableTwoFactor}>
              <LabeledInput label="Password" value={twoFactorPassword} onChange={(event) => setTwoFactorPassword(event.target.value)} type="password" autoComplete="current-password" />
              <LabeledInput label="Authenticator code" value={twoFactorCode} onChange={(event) => setTwoFactorCode(event.target.value)} inputMode="numeric" autoComplete="one-time-code" />
              <button className="focus-ring h-11 w-full rounded-md border border-coral/30 bg-white px-4 font-medium text-coral hover:bg-coral/10" disabled={loadingAction === "2fa-disable"}>
                {loadingAction === "2fa-disable" ? "Disabling..." : "Disable 2FA"}
              </button>
            </form>
          )}

          <StatusMessage error={twoFactorError} status={twoFactorStatus} />
        </div>
      </Panel>
    </div>
  );
}

function Panel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="rounded-md border border-stone-200 bg-white p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-moss/10 text-moss">{icon}</div>
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function StatusMessage({ error, status }: { error: string; status: string }) {
  if (error) {
    return <p className="rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>;
  }
  if (status) {
    return <p className="rounded-md border border-moss/20 bg-moss/10 px-3 py-2 text-sm text-moss">{status}</p>;
  }
  return null;
}
