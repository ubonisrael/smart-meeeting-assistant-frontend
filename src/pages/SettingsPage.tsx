import { ProfileSection } from "@/components/settings/profile";
import { PasswordSection } from "@/components/settings/password";
import { Manage2FA } from "@/components/settings/manage-2fa";

export function SettingsPage() {
  return (
    <div className="grid gap-6">
      <ProfileSection />
      <PasswordSection />
      <Manage2FA />
    </div>
  );
}
