import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { FileAudio, ListChecks, LogOut, MessageSquareText, Settings, Upload } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLogOut } from "@/hooks/useProfile";
import { useMeetingEvents } from "@/hooks/useMeetingEvents";

export function AppLayout() {
  const { session } = useAuth();
  const { mutate: logOut } = useLogOut();
  useMeetingEvents();

  return (
    <Box minH="100vh" bg="brand.bg" color="ink">
      <Box as="header" borderBottom="1px solid" borderColor="stone.200" bg="rgba(255,255,255,0.9)">
        <Flex
          mx="auto"
          maxW="7xl"
          flexDir={{ base: "column", md: "row" }}
          gap="4"
          px="4"
          py="4"
          align={{ md: "center" }}
          justify={{ md: "space-between" }}
        >
          <NavLink to="/meetings" style={{ textDecoration: "none" }}>
            <Flex align="center" gap="3">
              <Flex h="10" w="10" align="center" justify="center" rounded="md" bg="moss" color="white">
                <FileAudio size={22} />
              </Flex>
              <Box>
                <Text fontSize="2xl" fontWeight="semibold" lineHeight="1.2">
                  Smart Meeting Assistant
                </Text>
                <Text fontSize="sm" color="stone.500">
                  {session?.user.name}
                </Text>
              </Box>
            </Flex>
          </NavLink>

          <Flex flexWrap="wrap" align="center" gap="2">
            <NavItem to="/meetings" icon={<ListChecks size={18} />} label="Meetings" />
            <NavItem to="/upload" icon={<Upload size={18} />} label="Upload" />
            <NavItem to="/ask" icon={<MessageSquareText size={18} />} label="Ask" />
            <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
            <Button
              variant="outline"
              size="md"
              h="10"
              px="3"
              rounded="md"
              borderColor="stone.300"
              color="stone.700"
              bg="white"
              _hover={{ bg: "stone.50" }}
              onClick={() => logOut()}
            >
              <LogOut size={18} />
              Sign out
            </Button>
          </Flex>
        </Flex>
      </Box>

      <Box as="main" mx="auto" maxW="7xl" px="4" py="6">
        <Outlet />
      </Box>
    </Box>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <NavLink to={to} style={{ textDecoration: "none" }}>
      {({ isActive }) => (
        <Flex
          as="span"
          display="inline-flex"
          h="10"
          align="center"
          gap="2"
          px="3"
          rounded="md"
          fontSize="sm"
          fontWeight="medium"
          bg={isActive ? "ink" : "white"}
          color={isActive ? "white" : "stone.700"}
          borderWidth={isActive ? 0 : "1px"}
          borderColor="stone.300"
          _hover={isActive ? { bg: "ink" } : { bg: "stone.50" }}
          cursor="pointer"
        >
          {icon}
          {label}
        </Flex>
      )}
    </NavLink>
  );
}
