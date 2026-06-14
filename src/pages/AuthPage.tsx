import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, Input } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { FileAudio } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useLogin, useRegister, useVerifyTwoFactorLogin } from "@/hooks/useProfile";
import { Signal } from "@/components/ui/Signal";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const twoFactorSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type TwoFactorValues = z.infer<typeof twoFactorSchema>;

function isTwoFactorResponse(response: LoginResponse): response is { twoFactorRequired: true; challengeToken: string } {
  return "twoFactorRequired" in response;
}

export function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [twoFactorChallenge, setTwoFactorChallenge] = useState("");
  const [registrationMessage, setRegistrationMessage] = useState("");

  const { mutateAsync: login, isPending: isLoginPending } = useLogin();
  const { mutateAsync: register, isPending: isRegisterPending } = useRegister();
  const { mutateAsync: verifyTwoFactor, isPending: isTwoFactorPending } = useVerifyTwoFactorLogin();

  const loginForm = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });
  const twoFactorForm = useForm<TwoFactorValues>({ resolver: zodResolver(twoFactorSchema) });

  if (isLoading) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to="/meetings" replace />;

  async function handleLogin({ email, password }: LoginValues) {
    try {
      const response = await login({ email, password });
      if (isTwoFactorResponse(response)) {
        setTwoFactorChallenge(response.challengeToken);
        loginForm.resetField("password");
        return;
      }
      await queryClient.refetchQueries({ queryKey: ["profile"] });
      navigate("/meetings", { replace: true });
    } catch {
      // hook's onError shows the toast
    }
  }

  async function handleRegister(values: RegisterValues) {
    try {
      await register(values);
      setRegistrationMessage("Account created. Check your email for a verification link before signing in.");
      setMode("login");
      registerForm.reset();
    } catch {
      // hook's onError shows the toast
    }
  }

  async function handleTwoFactor({ code }: TwoFactorValues) {
    try {
      await verifyTwoFactor({ challengeToken: twoFactorChallenge, code });
      await queryClient.refetchQueries({ queryKey: ["profile"] });
      navigate("/meetings", { replace: true });
    } catch {
      // hook's onError shows the toast
    }
  }

  function switchMode(newMode: "login" | "register") {
    setMode(newMode);
    setTwoFactorChallenge("");
    loginForm.clearErrors();
    registerForm.clearErrors();
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
        <div className="w-full">
          {!twoFactorChallenge && (
            <div className="mb-6 inline-flex rounded-md border border-stone-300 bg-white p-1">
              <button
                type="button"
                className={`rounded px-3 py-2 text-sm font-medium ${mode === "login" ? "bg-ink text-white" : "text-stone-600"}`}
                onClick={() => switchMode("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={`rounded px-3 py-2 text-sm font-medium ${mode === "register" ? "bg-ink text-white" : "text-stone-600"}`}
                onClick={() => switchMode("register")}
              >
                Register
              </button>
            </div>
          )}

          <h1 className="text-2xl font-semibold">
            {twoFactorChallenge ? "Enter two-factor code" : mode === "login" ? "Welcome back" : "Create account"}
          </h1>

          {twoFactorChallenge ? (
            <form onSubmit={twoFactorForm.handleSubmit(handleTwoFactor)} className="mt-6">
              <div className="space-y-4">
                <Field.Root invalid={!!twoFactorForm.formState.errors.code}>
                  <Field.Label className="mb-1.5 text-sm font-medium text-stone-700">Authenticator code</Field.Label>
                  <Input
                    {...twoFactorForm.register("code")}
                    autoComplete="one-time-code"
                    inputMode="numeric"
                  />
                  <Field.ErrorText className="mt-1 text-xs text-coral">
                    {twoFactorForm.formState.errors.code?.message}
                  </Field.ErrorText>
                </Field.Root>
              </div>
              <button
                type="submit"
                disabled={isTwoFactorPending}
                className="focus-ring mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-moss px-4 font-medium text-white hover:bg-[#1f5c4f] disabled:opacity-60"
              >
                {isTwoFactorPending ? "Verifying..." : "Verify code"}
              </button>
            </form>
          ) : mode === "login" ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="mt-6">
              <div className="space-y-4">
                <Field.Root invalid={!!loginForm.formState.errors.email}>
                  <Field.Label className="mb-1.5 text-sm font-medium text-stone-700">Email</Field.Label>
                  <Input
                    {...loginForm.register("email")}
                    type="email"
                    autoComplete="email"
                  />
                  <Field.ErrorText className="mt-1 text-xs text-coral">
                    {loginForm.formState.errors.email?.message}
                  </Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!!loginForm.formState.errors.password}>
                  <Field.Label className="mb-1.5 text-sm font-medium text-stone-700">Password</Field.Label>
                  <Input
                    {...loginForm.register("password")}
                    type="password"
                    autoComplete="current-password"
                  />
                  <Field.ErrorText className="mt-1 text-xs text-coral">
                    {loginForm.formState.errors.password?.message}
                  </Field.ErrorText>
                </Field.Root>
              </div>
              {registrationMessage && (
                <p className="mt-4 rounded-md border border-moss/20 bg-moss/10 px-3 py-2 text-sm text-moss">
                  {registrationMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={isLoginPending}
                className="focus-ring mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-moss px-4 font-medium text-white hover:bg-[#1f5c4f] disabled:opacity-60"
              >
                {isLoginPending ? "Working..." : "Login"}
              </button>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-stone-600">
                <Link className="font-medium text-moss hover:underline" to="/forgot-password">Forgot password?</Link>
                <Link className="font-medium text-moss hover:underline" to="/resend-verification">Resend verification email</Link>
              </div>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="mt-6">
              <div className="space-y-4">
                <Field.Root invalid={!!registerForm.formState.errors.name}>
                  <Field.Label className="mb-1.5 text-sm font-medium text-stone-700">Name</Field.Label>
                  <Input
                    {...registerForm.register("name")}
                    autoComplete="name"
                  />
                  <Field.ErrorText className="mt-1 text-xs text-coral">
                    {registerForm.formState.errors.name?.message}
                  </Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!!registerForm.formState.errors.email}>
                  <Field.Label className="mb-1.5 text-sm font-medium text-stone-700">Email</Field.Label>
                  <Input
                    {...registerForm.register("email")}
                    type="email"
                    autoComplete="email"
                  />
                  <Field.ErrorText className="mt-1 text-xs text-coral">
                    {registerForm.formState.errors.email?.message}
                  </Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!!registerForm.formState.errors.password}>
                  <Field.Label className="mb-1.5 text-sm font-medium text-stone-700">Password</Field.Label>
                  <Input
                    {...registerForm.register("password")}
                    type="password"
                    autoComplete="new-password"
                  />
                  <Field.ErrorText className="mt-1 text-xs text-coral">
                    {registerForm.formState.errors.password?.message}
                  </Field.ErrorText>
                </Field.Root>
              </div>
              <button
                type="submit"
                disabled={isRegisterPending}
                className="focus-ring mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-moss px-4 font-medium text-white hover:bg-[#1f5c4f] disabled:opacity-60"
              >
                {isRegisterPending ? "Working..." : "Register"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
