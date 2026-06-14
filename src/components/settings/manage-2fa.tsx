import {
  Badge,
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  HStack,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { TwoFactorAuth } from "./2FA";
import { useAuth } from "@/hooks/useAuth";

export function Manage2FA() {
  const { session } = useAuth();
  const [showDialog, setShowDialog] = useState(false);

  const user = session!.user;

  return (
    <Box maxW="7xl" p={{ base: "4", md: "6" }} rounded={"md"} borderWidth="1px">
      <Flex
        justify="space-between"
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap="4"
      >
        <VStack align="start" gap="1">
          <HStack>
            <Text fontWeight="semibold">Two-Factor Authentication</Text>
            <Badge
              colorPalette={user.twoFactorEnabled ? "green" : "red"}
              variant="subtle"
              size="sm"
            >
              {user.twoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </HStack>
          <Text color="fg.muted" fontSize="sm">
            Add an extra layer of security to your account
          </Text>
        </VStack>
        <Dialog.Root
          placement={"center"}
          motionPreset="slide-in-bottom"
          open={showDialog}
          onOpenChange={({ open }) => setShowDialog(open)}
        >
          <Dialog.Trigger asChild>
            <Button
              variant="outline"
              size="sm"
              width={{ base: "full", md: "auto" }}
            >
              Manage 2FA Settings
            </Button>
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop backdropFilter="blur(1.5px)" />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Manage 2FA Settings</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <TwoFactorAuth onDone={() => setShowDialog(false)} />
                </Dialog.Body>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Flex>
    </Box>
  );
}
