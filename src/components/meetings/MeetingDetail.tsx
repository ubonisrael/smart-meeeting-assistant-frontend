import { useState } from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { RefreshCw } from "lucide-react";
import { ActionItemsView } from "./ActionItemsView";
import { SummaryView } from "./SummaryView";
import { TranscriptView } from "./TranscriptView";
import { useMeetingActionItems, useMeetingSummary, useMeetingTranscript, useRefreshMeetingDetails } from "../../hooks/useMeetings";
import { StatusDot } from "../ui/StatusDot";
import { TabButton } from "../ui/TabButton";

type MeetingDetailProps = {
  meeting: Meeting;
};

export function MeetingDetail({ meeting }: MeetingDetailProps) {
  const [tab, setTab] = useState<"summary" | "transcript" | "actions">("summary");
  const transcriptQuery = useMeetingTranscript(meeting.id);
  const summaryQuery = useMeetingSummary(meeting.id);
  const actionItemsQuery = useMeetingActionItems(meeting.id);
  const refreshMeetingDetails = useRefreshMeetingDetails(meeting.id);
  const isRefreshing = transcriptQuery.isFetching || summaryQuery.isFetching || actionItemsQuery.isFetching;

  return (
    <Box>
      <Box borderBottom="1px solid" borderColor="stone.200" px="5" py="4">
        <Flex
          flexDir={{ base: "column", md: "row" }}
          align={{ md: "flex-start" }}
          justify={{ md: "space-between" }}
          gap="3"
        >
          <Box>
            <Heading as="h2" size="lg" fontWeight="semibold">
              {meeting.title}
            </Heading>
            <Text mt="1" fontSize="sm" color="stone.500">
              {new Date(meeting.createdAt).toLocaleString()}
            </Text>
          </Box>
          <Flex flexWrap="wrap" align="center" gap="2">
            <Button
              variant="outline"
              size="sm"
              rounded="md"
              borderColor="stone.300"
              color="stone.700"
              _hover={{ bg: "stone.50" }}
              onClick={() => void refreshMeetingDetails()}
            >
              <RefreshCw className={isRefreshing ? "animate-spin" : ""} size={16} />
              Refresh
            </Button>
            <Flex
              display="inline-flex"
              align="center"
              gap="2"
              rounded="md"
              borderWidth="1px"
              borderColor="stone.200"
              px="3"
              py="1"
              fontSize="sm"
            >
              <StatusDot status={meeting.status} />
              {meeting.status}
            </Flex>
          </Flex>
        </Flex>
        {meeting.failedReason && (
          <Text mt="3" rounded="md" borderWidth="1px" borderColor="rgba(198,95,74,0.3)" bg="rgba(198,95,74,0.1)" px="3" py="2" fontSize="sm" color="coral">
            {meeting.failedReason}
          </Text>
        )}
      </Box>

      <Box borderBottom="1px solid" borderColor="stone.200" px="5" py="3">
        <Flex display="inline-flex" rounded="md" borderWidth="1px" borderColor="stone.300" bg="white" p="1">
          <TabButton active={tab === "summary"} label="Summary" onClick={() => setTab("summary")} />
          <TabButton active={tab === "transcript"} label="Transcript" onClick={() => setTab("transcript")} />
          <TabButton active={tab === "actions"} label="Actions" onClick={() => setTab("actions")} />
        </Flex>
      </Box>

      <Box p="5">
        {tab === "summary" && <SummaryView summary={summaryQuery.data?.summary ?? null} />}
        {tab === "transcript" && <TranscriptView segments={transcriptQuery.data?.segments ?? []} />}
        {tab === "actions" && <ActionItemsView actionItems={actionItemsQuery.data?.actionItems ?? []} />}
      </Box>
    </Box>
  );
}
