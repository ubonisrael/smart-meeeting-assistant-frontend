import { useState, type FormEvent, type ReactNode } from "react";
import { Box, Button, Field, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { LockKeyhole } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api";
import { getErrorMessage } from "../utils/error";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setStatus("");
    setLoading(true);
    try {
      await api.resetPassword({ token, password });
      alert("Password reset. You can now sign in.");
      setPassword("");
      navigate("/login");
    } catch (caught) {
      setError(getErrorMessage(caught, "Could not reset password"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPanel icon={<LockKeyhole size={24} />} title="Reset password">
      {!token && (
        <Text rounded="md" borderWidth="1px" borderColor="rgba(198,95,74,0.3)" bg="rgba(198,95,74,0.1)" px="3" py="2" fontSize="sm" color="coral">
          The reset link is missing a token.
        </Text>
      )}
      <Box as="form" display="flex" flexDir="column" gap="4" onSubmit={submit}>
        <Field.Root>
          <Field.Label>New password</Field.Label>
          <Input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field.Root>
        {error && (
          <Text rounded="md" borderWidth="1px" borderColor="rgba(198,95,74,0.3)" bg="rgba(198,95,74,0.1)" px="3" py="2" fontSize="sm" color="coral">
            {error}
          </Text>
        )}
        {status && (
          <Text rounded="md" borderWidth="1px" borderColor="rgba(36,107,91,0.2)" bg="rgba(36,107,91,0.1)" px="3" py="2" fontSize="sm" color="moss">
            {status}
          </Text>
        )}
        <Button type="submit" h="11" w="full" rounded="md" bg="moss" color="white" fontWeight="medium" _hover={{ bg: "mossHover" }} disabled={loading || !token}>
          {loading ? "Saving..." : "Reset password"}
        </Button>
      </Box>
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
