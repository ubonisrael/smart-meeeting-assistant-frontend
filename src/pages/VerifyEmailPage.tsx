import { useEffect, useState, type ReactNode } from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { CheckCircle2, MailCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { getErrorMessage } from "../utils/error";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || status !== "idle") return;

    async function verify() {
      setStatus("working");
      try {
        await api.verifyEmail(token);
        await queryClient.refetchQueries({ queryKey: ["profile"] });
        setStatus("done");
        setMessage("Email verified. Redirecting...");
        window.setTimeout(() => navigate("/meetings", { replace: true }), 900);
      } catch (caught) {
        setStatus("error");
        setMessage(getErrorMessage(caught, "Email verification failed"));
      }
    }

    void verify();
  }, [navigate, queryClient, status, token]);

  return (
    <AuthPanel icon={<MailCheck size={24} />} title="Verify email">
      {!token && <Text fontSize="sm" color="stone.600">The verification link is missing a token.</Text>}
      {token && status === "working" && <Text fontSize="sm" color="stone.600">Verifying your email...</Text>}
      {message && (
        <Text
          rounded="md"
          borderWidth="1px"
          borderColor={status === "error" ? "rgba(198,95,74,0.3)" : "rgba(36,107,91,0.2)"}
          bg={status === "error" ? "rgba(198,95,74,0.1)" : "rgba(36,107,91,0.1)"}
          px="3"
          py="2"
          fontSize="sm"
          color={status === "error" ? "coral" : "moss"}
        >
          {message}
        </Text>
      )}
      {status === "done" && <Box as={CheckCircle2} color="moss" boxSize="7" />}
      <Text as={Link} to="/login" fontSize="sm" fontWeight="medium" color="moss" _hover={{ textDecoration: "underline" }}>
        Back to login
      </Text>
    </AuthPanel>
  );
}

function AuthPanel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <Flex minH="100vh" align="center" justify="center" bg="brand.bg" px="4" color="ink">
      <Box as="section" w="full" maxW="md" rounded="md" borderWidth="1px" borderColor="stone.200" bg="white" p="6">
        <Flex align="center" gap="3" mb="5">
          <Flex h="11" w="11" align="center" justify="center" rounded="md" bg="rgba(36,107,91,0.1)" color="moss">
            {icon}
          </Flex>
          <Heading as="h1" size="lg" fontWeight="semibold">
            {title}
          </Heading>
        </Flex>
        <Box display="flex" flexDir="column" gap="4">
          {children}
        </Box>
      </Box>
    </Flex>
  );
}
