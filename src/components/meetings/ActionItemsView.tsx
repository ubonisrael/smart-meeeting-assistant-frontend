import { Box, Flex, Text } from "@chakra-ui/react";
import { CheckCircle2 } from "lucide-react";

export function ActionItemsView({ actionItems }: { actionItems: ActionItem[] }) {
  if (!actionItems.length) {
    return (
      <Text fontSize="sm" color="stone.500">
        Action items will appear after processing completes.
      </Text>
    );
  }

  return (
    <Box display="flex" flexDir="column" gap="3">
      {actionItems.map((item) => (
        <Box key={item.id} rounded="md" borderWidth="1px" borderColor="stone.200" p="4">
          <Flex align="flex-start" gap="3">
            <Box as={CheckCircle2} mt="0.5" color="moss" boxSize="5" flexShrink={0} />
            <Box>
              <Text fontWeight="medium">{item.task}</Text>
              <Text mt="1" fontSize="sm" color="stone.500">
                {item.assignee || "Unassigned"} {item.deadline ? `- ${item.deadline}` : ""}
              </Text>
              {item.sourceText && (
                <Text mt="3" fontSize="sm" lineHeight="6" color="stone.600">
                  {item.sourceText}
                </Text>
              )}
            </Box>
          </Flex>
        </Box>
      ))}
    </Box>
  );
}
