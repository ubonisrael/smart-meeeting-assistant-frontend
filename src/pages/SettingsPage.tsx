import { Box } from "@chakra-ui/react";
import { ProfileSection } from "@/components/settings/profile";
import { PasswordSection } from "@/components/settings/password";
import { Manage2FA } from "@/components/settings/manage-2fa";

export function SettingsPage() {
  return (
    <Box display="flex" flexDir="column" gap="6">
      <ProfileSection />
      <PasswordSection />
      <Manage2FA />
    </Box>
  );
}
