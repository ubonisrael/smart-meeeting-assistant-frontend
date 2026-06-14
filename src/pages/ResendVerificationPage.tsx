import { useState, type FormEvent, type ReactNode } from "react";
import { Box, Button, Field, Flex, Heading, Input, Link as ChakraLink, Text } from "@chakra-ui/react";
import { MailPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { getErrorMessage } from "../utils/error";

export function ResendVerificationPage() {
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
      await api.resendVerification(email);
      setStatus("If the email is registered and unverified, a new verification link has been sent.");
    } catch (caught) {
      setError(getErrorMessage(caught, "Could not resend verification email"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPanel icon={<MailPlus size={24} />} title="Resend verification">
      <Box as="form" display="flex" flexDir="column" gap="4" onSubmit={submit}>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
        <Button type="submit" h="11" w="full" rounded="md" bg="moss" color="white" fontWeight="medium" _hover={{ bg: "mossHover" }} disabled={loading}>
          {loading ? "Sending..." : "Send verification email"}
        </Button>
      </Box>
      <ChakraLink as={Link} href="/login" fontSize="sm" fontWeight="medium" color="moss" _hover={{ textDecoration: "underline" }}>
        Back to login
      </ChakraLink>
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
