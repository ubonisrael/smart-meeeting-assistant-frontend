import { Box, Heading, Text } from "@chakra-ui/react";
import { SummaryList } from "../ui/SummaryList";

export function SummaryView({ summary }: { summary: Summary | null }) {
  if (!summary) {
    return (
      <Text fontSize="sm" color="stone.500">
        Summary will appear after processing completes.
      </Text>
    );
  }

  return (
    <Box display="flex" flexDir="column" gap="5">
      <Box as="section">
        <Heading as="h3" size="sm" fontWeight="semibold" mb="2">
          Overview
        </Heading>
        <Text lineHeight="7" color="stone.700">
          {summary.overview}
        </Text>
      </Box>
      <SummaryList title="Decisions" items={summary.decisions} />
      <SummaryList title="Risks" items={summary.risks} />
      <SummaryList title="Next steps" items={summary.nextSteps} />
    </Box>
  );
}
