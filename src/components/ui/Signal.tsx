import { Box, Text } from "@chakra-ui/react";

export function Signal({ label, value }: { label: string; value: string }) {
  return (
    <Box borderTop="1px solid" borderColor="rgba(255,255,255,0.2)" pt="3">
      <Text fontSize="xs" textTransform="uppercase" color="rgba(255,255,255,0.6)">
        {label}
      </Text>
      <Text mt="1" fontWeight="medium">
        {value}
      </Text>
    </Box>
  );
}
