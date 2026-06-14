import { Box, Grid, Text } from "@chakra-ui/react";
import { formatTime } from "../../utils/format";

export function TranscriptView({ segments }: { segments: TranscriptSegment[] }) {
  if (!segments.length) {
    return (
      <Text fontSize="sm" color="stone.500">
        Transcript segments will appear after processing completes.
      </Text>
    );
  }

  return (
    <Box maxH="560px" display="flex" flexDir="column" gap="3" overflowY="auto" pr="2">
      {segments.map((segment) => (
        <Grid
          key={segment.id}
          gap="2"
          borderBottom="1px solid"
          borderColor="stone.100"
          pb="3"
          gridTemplateColumns={{ base: "1fr", md: "120px 1fr" }}
        >
          <Text fontSize="sm" fontWeight="medium" color="moss">
            {formatTime(segment.start)} - {formatTime(segment.end)}
          </Text>
          <Text lineHeight="7" color="stone.700">
            {segment.text}
          </Text>
        </Grid>
      ))}
    </Box>
  );
}
