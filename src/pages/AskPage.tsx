import { useState, type FormEvent } from "react";
import { Box, Button, Flex, Grid, Heading, Text, Textarea } from "@chakra-ui/react";
import { MessageSquareText, Search } from "lucide-react";
import { useAskMeetings } from "../hooks/useMeetings";
import { formatTime } from "../utils/format";
import { getErrorMessage } from "../utils/error";

export function AskPage() {
  const askMeetings = useAskMeetings();
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    askMeetings.reset();
    try {
      await askMeetings.mutateAsync(question);
    } catch (caught) {
      setError(getErrorMessage(caught, "Question failed"));
    }
  }

  const answer = askMeetings.data?.answer ?? "";
  const sources = askMeetings.data?.sources ?? [];

  return (
    <Grid gap="6" gridTemplateColumns={{ base: "1fr", lg: "minmax(0,1fr) 420px" }}>
      <Box as="section" rounded="md" borderWidth="1px" borderColor="stone.200" bg="white" p="5">
        <Flex align="center" gap="3" mb="4">
          <Flex h="10" w="10" align="center" justify="center" rounded="md" bg="rgba(198,95,74,0.1)" color="coral">
            <Search size={20} />
          </Flex>
          <Heading as="h2" size="sm" fontWeight="semibold">
            Ask across meetings
          </Heading>
        </Flex>
        <Box as="form" onSubmit={submit}>
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            minH="32"
            resize="vertical"
            rounded="md"
            borderColor="stone.300"
            px="3"
            py="3"
            lineHeight="7"
          />
          {error && (
            <Text mt="3" rounded="md" borderWidth="1px" borderColor="rgba(198,95,74,0.3)" bg="rgba(198,95,74,0.1)" px="3" py="2" fontSize="sm" color="coral">
              {error}
            </Text>
          )}
          <Button
            type="submit"
            mt="4"
            h="11"
            px="4"
            rounded="md"
            bg="ink"
            color="white"
            fontWeight="medium"
            _hover={{ bg: "black" }}
            disabled={askMeetings.isPending}
          >
            <MessageSquareText size={18} />
            {askMeetings.isPending ? "Searching..." : "Ask"}
          </Button>
        </Box>
        {answer && (
          <Box mt="6" borderTop="1px solid" borderColor="stone.200" pt="5">
            <Heading as="h3" size="sm" fontWeight="semibold" mb="2">
              Answer
            </Heading>
            <Text lineHeight="7" color="stone.700">
              {answer}
            </Text>
          </Box>
        )}
      </Box>

      <Box as="section" rounded="md" borderWidth="1px" borderColor="stone.200" bg="white" p="5">
        <Heading as="h3" size="sm" fontWeight="semibold">
          Sources
        </Heading>
        {!sources.length && (
          <Text mt="3" fontSize="sm" color="stone.500">
            Matching source segments will appear here.
          </Text>
        )}
        <Box mt="4" display="flex" flexDir="column" gap="3">
          {sources.map((source, index) => (
            <Box key={`${source.meetingId}-${index}`} borderBottom="1px solid" borderColor="stone.100" pb="3">
              <Text fontWeight="medium">{source.title}</Text>
              {source.segmentStart != null && (
                <Text mt="1" fontSize="xs" color="moss">
                  {formatTime(source.segmentStart)} - {formatTime(source.segmentEnd ?? source.segmentStart)}
                </Text>
              )}
              <Text mt="2" fontSize="sm" lineHeight="6" color="stone.600">
                {source.text}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Grid>
  );
}
