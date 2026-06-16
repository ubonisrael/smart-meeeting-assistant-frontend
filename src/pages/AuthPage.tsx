import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, Button, Field, Flex, Grid, Heading, Input, Link as ChakraLink, Text } from "@chakra-ui/react";
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
      // hook's onError shows toast
    }
  }

  async function handleRegister(values: RegisterValues) {
    try {
      await register(values);
      setRegistrationMessage("Account created. Check your email for a verification link before signing in.");
      setMode("login");
      registerForm.reset();
    } catch {
      // hook's onError shows toast
    }
  }

  async function handleTwoFactor({ code }: TwoFactorValues) {
    try {
      await verifyTwoFactor({ challengeToken: twoFactorChallenge, code });
      await queryClient.refetchQueries({ queryKey: ["profile"] });
      navigate("/meetings", { replace: true });
    } catch {
      // hook's onError shows toast
      setTwoFactorChallenge("")
    }
  }

  function switchMode(newMode: "login" | "register") {
    setMode(newMode);
    setTwoFactorChallenge("");
    loginForm.clearErrors();
    registerForm.clearErrors();
  }

  return (
    <Grid minH="100vh" bg="brand.bg" color="ink" gridTemplateColumns={{ base: "1fr", lg: "1fr 440px" }}>
      {/* Left panel */}
      <Flex
        as="section"
        flexDir="column"
        justify="space-between"
        minH={{ base: "42vh", lg: "100vh" }}
        borderBottom={{ base: "1px solid", lg: "none" }}
        borderRight={{ lg: "1px solid" }}
        borderColor="stone.200"
        bg="moss"
        px="6"
        py="8"
        color="white"
      >
        <Flex align="center" gap="3">
          <Flex h="11" w="11" align="center" justify="center" rounded="md" bg="rgba(255,255,255,0.15)">
            <FileAudio size={24} />
          </Flex>
          <Text fontSize="lg" fontWeight="semibold">Smart Meeting Assistant</Text>
        </Flex>

        <Box maxW="2xl">
          <Heading as="h2" fontSize={{ base: "4xl", md: "5xl" }} fontWeight="semibold" lineHeight="1.15">
            Meeting memory that stays searchable.
          </Heading>
          <Text mt="5" maxW="xl" fontSize="md" lineHeight="7" color="rgba(255,255,255,0.8)">
            Upload recordings, process transcripts in the background, extract the work that matters, and ask direct questions across past conversations.
          </Text>
        </Box>

        <Grid gap="3" gridTemplateColumns={{ base: "1fr", md: "repeat(3,1fr)" }} fontSize="sm" color="rgba(255,255,255,0.8)">
          <Signal label="Transcription" value="Queued" />
          <Signal label="Summary" value="Structured" />
          <Signal label="Search" value="Contextual" />
        </Grid>
      </Flex>

      {/* Right panel */}
      <Flex as="section" align="center" px="6" py="10">
        <Box w="full">
          {!twoFactorChallenge && (
            <Flex display="inline-flex" rounded="md" borderWidth="1px" borderColor="stone.300" bg="white" p="1" mb="6">
              <Button
                size="sm"
                variant="ghost"
                rounded="md"
                px="3"
                py="2"
                fontWeight="medium"
                bg={mode === "login" ? "ink" : "transparent"}
                color={mode === "login" ? "white" : "stone.600"}
                _hover={mode === "login" ? { bg: "ink" } : { bg: "stone.100" }}
                onClick={() => switchMode("login")}
              >
                Login
              </Button>
              <Button
                size="sm"
                variant="ghost"
                rounded="md"
                px="3"
                py="2"
                fontWeight="medium"
                bg={mode === "register" ? "ink" : "transparent"}
                color={mode === "register" ? "white" : "stone.600"}
                _hover={mode === "register" ? { bg: "ink" } : { bg: "stone.100" }}
                onClick={() => switchMode("register")}
              >
                Register
              </Button>
            </Flex>
          )}

          <Heading as="h1" size="xl" fontWeight="semibold">
            {twoFactorChallenge ? "Enter two-factor code" : mode === "login" ? "Welcome back" : "Create account"}
          </Heading>

          {twoFactorChallenge ? (
            <Box as="form" onSubmit={twoFactorForm.handleSubmit(handleTwoFactor)} mt="6">
              <Box display="flex" flexDir="column" gap="4">
                <Field.Root invalid={!!twoFactorForm.formState.errors.code}>
                  <Field.Label>Authenticator code</Field.Label>
                  <Input {...twoFactorForm.register("code")} autoComplete="one-time-code" inputMode="numeric" />
                  <Field.ErrorText>{twoFactorForm.formState.errors.code?.message}</Field.ErrorText>
                </Field.Root>
              </Box>
              <Button type="submit" mt="6" h="11" w="full" rounded="md" bg="moss" color="white" fontWeight="medium" _hover={{ bg: "mossHover" }} disabled={isTwoFactorPending}>
                {isTwoFactorPending ? "Verifying..." : "Verify code"}
              </Button>
            </Box>
          ) : mode === "login" ? (
            <Box as="form" onSubmit={loginForm.handleSubmit(handleLogin)} mt="6">
              <Box display="flex" flexDir="column" gap="4">
                <Field.Root invalid={!!loginForm.formState.errors.email}>
                  <Field.Label>Email</Field.Label>
                  <Input {...loginForm.register("email")} type="email" autoComplete="email" />
                  <Field.ErrorText>{loginForm.formState.errors.email?.message}</Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!!loginForm.formState.errors.password}>
                  <Field.Label>Password</Field.Label>
                  <Input {...loginForm.register("password")} type="password" autoComplete="current-password" />
                  <Field.ErrorText>{loginForm.formState.errors.password?.message}</Field.ErrorText>
                </Field.Root>
              </Box>
              {registrationMessage && (
                <Text mt="4" rounded="md" borderWidth="1px" borderColor="rgba(36,107,91,0.2)" bg="rgba(36,107,91,0.1)" px="3" py="2" fontSize="sm" color="moss">
                  {registrationMessage}
                </Text>
              )}
              <Button type="submit" mt="6" h="11" w="full" rounded="md" bg="moss" color="white" fontWeight="medium" _hover={{ bg: "mossHover" }} disabled={isLoginPending}>
                {isLoginPending ? "Working..." : "Login"}
              </Button>
              <Flex mt="4" flexWrap="wrap" gap="4" fontSize="sm" color="stone.600">
                <ChakraLink as={Link} href="/forgot-password" fontWeight="medium" color="moss" _hover={{ textDecoration: "underline" }}>
                  Forgot password?
                </ChakraLink>
                <ChakraLink as={Link} href="/resend-verification" fontWeight="medium" color="moss" _hover={{ textDecoration: "underline" }}>
                  Resend verification email
                </ChakraLink>
              </Flex>
            </Box>
          ) : (
            <Box as="form" onSubmit={registerForm.handleSubmit(handleRegister)} mt="6">
              <Box display="flex" flexDir="column" gap="4">
                <Field.Root invalid={!!registerForm.formState.errors.name}>
                  <Field.Label>Name</Field.Label>
                  <Input {...registerForm.register("name")} autoComplete="name" />
                  <Field.ErrorText>{registerForm.formState.errors.name?.message}</Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!!registerForm.formState.errors.email}>
                  <Field.Label>Email</Field.Label>
                  <Input {...registerForm.register("email")} type="email" autoComplete="email" />
                  <Field.ErrorText>{registerForm.formState.errors.email?.message}</Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!!registerForm.formState.errors.password}>
                  <Field.Label>Password</Field.Label>
                  <Input {...registerForm.register("password")} type="password" autoComplete="new-password" />
                  <Field.ErrorText>{registerForm.formState.errors.password?.message}</Field.ErrorText>
                </Field.Root>
              </Box>
              <Button type="submit" mt="6" h="11" w="full" rounded="md" bg="moss" color="white" fontWeight="medium" _hover={{ bg: "mossHover" }} disabled={isRegisterPending}>
                {isRegisterPending ? "Working..." : "Register"}
              </Button>
            </Box>
          )}
        </Box>
      </Flex>
    </Grid>
  );
}
