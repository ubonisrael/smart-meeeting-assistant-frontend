import { useState, type ChangeEvent, type FormEvent } from "react";
import { Box, Button, Field, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUploadMeeting } from "../hooks/useMeetings";
import { getErrorMessage } from "../utils/error";

export function UploadPage() {
  const navigate = useNavigate();
  const uploadMeeting = useUploadMeeting();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      setError("Choose a recording file first");
      return;
    }
    setError("");
    setStatus("");
    try {
      const response = await uploadMeeting.mutateAsync({ title: title || file.name, file });
      setStatus(`Upload accepted. Meeting ${response.meetingId} is ${response.status}.`);
      window.setTimeout(() => navigate(`/meetings/${response.meetingId}`), 900);
    } catch (caught) {
      setError(getErrorMessage(caught, "Upload failed"));
    }
  }

  return (
    <Box as="section" rounded="md" borderWidth="1px" borderColor="stone.200" bg="white" p="5">
      <Flex align="center" gap="3" mb="5">
        <Flex h="10" w="10" align="center" justify="center" rounded="md" bg="rgba(36,107,91,0.1)" color="moss">
          <Upload size={20} />
        </Flex>
        <Box>
          <Heading as="h2" size="sm" fontWeight="semibold">
            Upload recording
          </Heading>
          <Text fontSize="sm" color="stone.500">
            mp3, wav, m4a, and mp4 files are supported.
          </Text>
        </Box>
      </Flex>

      <Box as="form" onSubmit={submit} display="flex" flexDir="column" gap="4">
        <Field.Root>
          <Field.Label>Meeting title</Field.Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Payments sync"
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Recording</Field.Label>
          <Input
            as="input"
            type="file"
            accept=".mp3,.wav,.m4a,.mp4,audio/*,video/mp4"
            onChange={(event: ChangeEvent<HTMLInputElement>) => setFile(event.target.files?.[0] ?? null)}
            p="2"
          />
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

        <Button
          type="submit"
          h="11"
          px="4"
          rounded="md"
          bg="moss"
          color="white"
          fontWeight="medium"
          alignSelf="flex-start"
          _hover={{ bg: "mossHover" }}
          disabled={uploadMeeting.isPending}
        >
          <Upload size={18} />
          {uploadMeeting.isPending ? "Uploading..." : "Upload and process"}
        </Button>
      </Box>
    </Box>
  );
}
