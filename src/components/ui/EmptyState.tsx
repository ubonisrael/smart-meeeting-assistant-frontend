import { Box, Grid, Text } from "@chakra-ui/react";
import { UserRound } from "lucide-react";

export function EmptyState() {
  return (
    <Grid minH="520px" placeItems="center" px="6" textAlign="center">
      <Box>
        <Box as={UserRound} mx="auto" color="stone.400" boxSize="8" />
        <Text mt="3" fontSize="sm" color="stone.500">
          Select a meeting to inspect its transcript, summary, and action items.
        </Text>
      </Box>
    </Grid>
  );
}
