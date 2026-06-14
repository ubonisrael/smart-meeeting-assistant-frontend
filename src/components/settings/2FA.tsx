import {
  Box,
  Button,
  Field,
  Fieldset,
  IconButton,
  Input,
  InputGroup,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { use2FASetup, useDisable2FA } from "@/hooks/useProfile";
import { QRCodeVerify } from "./qr-code-verify";

export const twoFactorAuthSchema = z.object({
  password: z.string().min(1).trim(),
  code: z.string().length(6).trim(),
});

type TwoFactorAuthForm = z.infer<typeof twoFactorAuthSchema>;

export function TwoFactorAuth({ onDone }: { onDone: () => void }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const { session } = useAuth();

  const user = session!.user;
  const isEnabled = user.twoFactorEnabled;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<TwoFactorAuthForm>({
    resolver: zodResolver(twoFactorAuthSchema),
    defaultValues: { password: "", code: "" },
  });

  const {
    mutate: setup2FA,
    isPending: settingUp2FA,
    data: twoFactorData,
    reset: resetTwoFactorData,
  } = use2FASetup();
  const { mutate: disableTwoFactorAuth, isPending: isDisablingTwoFactor } =
    useDisable2FA();

  async function handleDisableTwoFactorAuth(data: TwoFactorAuthForm) {
    console.log("clicked");
    disableTwoFactorAuth(data, {
      onSuccess: () => {
        reset();
        onDone();
      },
    });
  }

  async function handleSetup2FA() {
    console.log("clicked");
    setup2FA();
  }

  if (twoFactorData != null) {
    return (
      <QRCodeVerify
        totpURI={twoFactorData.qrCodeUrl}
        backupCodes={[]}
        onDone={() => {
          resetTwoFactorData();
          onDone();
        }}
      />
    );
  }

  if (isEnabled) {
    return (
      <form onSubmit={handleSubmit(handleDisableTwoFactorAuth)}>
        <Box mb={4} color="fg.muted">
          <Text>
            Disabling this will remove the extra security layer from your
            account. You will only be able to access your account with your
            password.
          </Text>
        </Box>
        <Fieldset.Root>
          <Fieldset.Content>
            {/* maxW="md" on desktop, full width on mobile */}
            <VStack gap="4" width="full" maxW={{ md: "md" }} align="start">
              {/* <Fieldset.Root maxW="md" mt={6}> */}
              <Field.Root invalid={"password" in errors}>
                <Field.Label>
                  Password
                  <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup
                  startElement={<Lock size={16} color="gray" />}
                  endElement={
                    <IconButton
                      variant={"plain"}
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? <EyeClosed /> : <Eye />}
                    </IconButton>
                  }
                >
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    {...register("password")}
                  />
                </InputGroup>
                <Field.ErrorText>{errors["password"]?.message}</Field.ErrorText>
              </Field.Root>

              <Button
                colorPalette="blue"
                size="md"
                mt="2"
                width={{ base: "full", md: "auto" }}
                type="submit"
                loading={isDisablingTwoFactor}
                disabled={!isDirty}
              >
                Disable Two-Factor Authentication
              </Button>
            </VStack>
          </Fieldset.Content>
        </Fieldset.Root>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleSetup2FA)}>
      <Box mb={4} color="fg.muted">
        <Text>
          Enabling this will provide an extra security layer to your account.
          When logging in, we will ask for special authentication code from your
          device.
          <br />
          <br />
          First, download Google Authenticator from{" "}
          <Link
            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&p"
            colorPalette={"blue"}
            variant={"underline"}
            target={"_blank"}
          >
            Google Play Store
          </Link>{" "}
          the or the{" "}
          <Link
            href="https://apps.apple.com/ng/app/google-authenticator/id388497605"
            colorPalette={"blue"}
            variant={"underline"}
            target={"_blank"}
          >
            iOS App Store
          </Link>
          . Then, scan the QR code that will be shown in the next step.
        </Text>
      </Box>
      <Fieldset.Root>
        <Fieldset.Content>
          {/* maxW="md" on desktop, full width on mobile */}
          <VStack gap="4" width="full" maxW={{ md: "md" }} align="start">
            {/* <Fieldset.Root maxW="md" mt={6}> */}
            <Field.Root invalid={"password" in errors}>
              <Field.Label>
                Password
                <Field.RequiredIndicator />
              </Field.Label>
              <InputGroup
                startElement={<Lock size={16} color="gray" />}
                endElement={
                  <IconButton
                    variant={"plain"}
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeClosed /> : <Eye />}
                  </IconButton>
                }
              >
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  {...register("password")}
                />
              </InputGroup>
              <Field.ErrorText>{errors["password"]?.message}</Field.ErrorText>
            </Field.Root>

            <Button
              colorPalette="blue"
              size="md"
              mt="2"
              width={{ base: "full", md: "auto" }}
              type="submit"
              loading={settingUp2FA }
              disabled={!isDirty}
            >
              Enable Two-Factor Authentication
            </Button>
          </VStack>
        </Fieldset.Content>
      </Fieldset.Root>
    </form>
  );
}
