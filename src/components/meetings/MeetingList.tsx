import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { RefreshCw } from "lucide-react";
import { NavLink } from "react-router-dom";
import { StatusDot } from "../ui/StatusDot";

type MeetingListProps = {
  meetings: Meeting[];
  isLoading: boolean;
  error?: string;
  onRefresh: () => void;
  isRefreshing: boolean;
};

export function MeetingList({ meetings, isLoading, error, onRefresh, isRefreshing }: MeetingListProps) {
  return (
    <Box as="section" rounded="md" borderWidth="1px" borderColor="stone.200" bg="white">
      <Flex align="center" justify="space-between" borderBottom="1px solid" borderColor="stone.200" px="4" py="3">
        <Text fontWeight="semibold">Meetings</Text>
        <IconButton
          aria-label="Refresh"
          variant="ghost"
          size="sm"
          rounded="md"
          color="stone.600"
          _hover={{ bg: "stone.100" }}
          onClick={onRefresh}
        >
          <RefreshCw className={isRefreshing ? "animate-spin" : ""} size={18} />
        </IconButton>
      </Flex>

      {error && (
        <Text m="4" rounded="md" borderWidth="1px" borderColor="rgba(198,95,74,0.3)" bg="rgba(198,95,74,0.1)" px="3" py="2" fontSize="sm" color="coral">
          {error}
        </Text>
      )}
      {isLoading && <Text p="4" fontSize="sm" color="stone.500">Loading meetings...</Text>}
      {!isLoading && !meetings.length && <Text p="4" fontSize="sm" color="stone.500">No meetings yet.</Text>}

      <Box>
        {meetings.map((meeting) => (
          <NavLink key={meeting.id} to={`/meetings/${meeting.id}`} style={{ display: "block", textDecoration: "none" }}>
            {({ isActive }) => (
              <Box
                px="4"
                py="3"
                borderBottom="1px solid"
                borderColor="stone.100"
                bg={isActive ? "rgba(242,216,167,0.3)" : "transparent"}
                _hover={{ bg: isActive ? "rgba(242,216,167,0.3)" : "stone.50" }}
                cursor="pointer"
              >
                <Text fontWeight="medium" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                  {meeting.title}
                </Text>
                <Flex mt="1" align="center" gap="2" fontSize="xs" color="stone.500">
                  <StatusDot status={meeting.status} />
                  {meeting.status}
                </Flex>
              </Box>
            )}
          </NavLink>
        ))}
      </Box>
    </Box>
  );
}
