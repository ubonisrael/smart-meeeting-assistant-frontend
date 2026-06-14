import { Box, Grid } from "@chakra-ui/react";
import { Navigate, useParams } from "react-router-dom";
import { MeetingDetail } from "../components/meetings/MeetingDetail";
import { MeetingList } from "../components/meetings/MeetingList";
import { EmptyState } from "../components/ui/EmptyState";
import { useMeeting, useMeetings } from "../hooks/useMeetings";
import { getErrorMessage } from "../utils/error";

export function MeetingsPage() {
  const { meetingId } = useParams();
  const meetingsQuery = useMeetings();
  const meetingQuery = useMeeting(meetingId);
  const meetings = meetingsQuery.data?.meetings ?? [];
  const listMeeting = meetings.find((meeting) => meeting.id === meetingId) ?? null;
  const selectedMeeting = meetingQuery.data?.meeting ?? listMeeting;

  if (!meetingId && meetings.length) {
    return <Navigate to={`/meetings/${meetings[0].id}`} replace />;
  }

  return (
    <Grid gap="6" gridTemplateColumns={{ base: "1fr", lg: "360px 1fr" }}>
      <MeetingList
        meetings={meetings}
        isLoading={meetingsQuery.isLoading}
        error={meetingsQuery.error ? getErrorMessage(meetingsQuery.error, "Could not load meetings") : ""}
        onRefresh={() => void meetingsQuery.refetch()}
        isRefreshing={meetingsQuery.isFetching}
      />
      <Box
        as="section"
        minH="520px"
        rounded="md"
        borderWidth="1px"
        borderColor="stone.200"
        bg="white"
      >
        {selectedMeeting ? <MeetingDetail meeting={selectedMeeting} /> : <EmptyState />}
      </Box>
    </Grid>
  );
}
