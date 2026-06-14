import { Box } from "@chakra-ui/react";

export function StatusDot({ status }: { status: string }) {
  const bg =
    status === "completed" ? "moss" : status === "failed" ? "coral" : "wheat";
  return <Box as="span" display="inline-block" h="2.5" w="2.5" rounded="full" bg={bg} />;
}
