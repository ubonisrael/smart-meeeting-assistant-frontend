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

const setup2FASchema = z.object({
  password: z.string().min(1).trim(),
});

const twoFactorAuthSchema = z.object({
  password: z.string().min(1).trim(),
  code: z.string().length(6).trim(),
});

type Setup2FAForm = z.infer<typeof setup2FASchema>;
type TwoFactorAuthForm = z.infer<typeof twoFactorAuthSchema>;

export function TwoFactorAuth({ onDone }: { onDone: () => void }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const { session } = useAuth();

  const user = session!.user;
  const isEnabled = user.twoFactorEnabled;

  const {
    register: setup2FARegister,
    handleSubmit: handle2FASetup,
    formState: setup2FAFormState,
    reset: handle2FASetupReset,
  } = useForm<Setup2FAForm>({
    resolver: zodResolver(setup2FASchema),
    defaultValues: { password: "" },
  });

  const {
    register: disable2FARegister,
    handleSubmit: handle2FADisable,
    formState: disable2FAFormState,
    reset: disable2FAReset,
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
    disableTwoFactorAuth(data, {
      onSuccess: () => {
        disable2FAReset();
        onDone();
      },
    });
  }

  async function handleSetup2FA(data: Setup2FAForm) {
    setup2FA(data, {
      onSuccess: function () {
        handle2FASetupReset();
      },
    });
  }

  if (twoFactorData != null) {
    return (
      <QRCodeVerify
        totpURI={twoFactorData.qrCodeUri}
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
      <form onSubmit={handle2FADisable(handleDisableTwoFactorAuth)}>
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
              <Field.Root invalid={"password" in disable2FAFormState.errors}>
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
                    {...disable2FARegister("password")}
                  />
                </InputGroup>
                <Field.ErrorText>
                  {disable2FAFormState.errors["password"]?.message}
                </Field.ErrorText>
              </Field.Root>
              <Field.Root invalid={!!disable2FAFormState.errors.code}>
                <Field.Label>Authenticator code</Field.Label>
                <Input
                  {...disable2FARegister("code")}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                />
                <Field.ErrorText>
                  {disable2FAFormState.errors.code?.message}
                </Field.ErrorText>
              </Field.Root>

              <Button
                colorPalette="blue"
                size="md"
                mt="2"
                width={{ base: "full", md: "auto" }}
                type="submit"
                loading={isDisablingTwoFactor}
                disabled={!disable2FAFormState.isDirty}
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
    <form onSubmit={handle2FASetup(handleSetup2FA)}>
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
            <Field.Root invalid={"password" in setup2FAFormState.errors}>
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
                  {...setup2FARegister("password")}
                />
              </InputGroup>
              <Field.ErrorText>
                {setup2FAFormState.errors["password"]?.message}
              </Field.ErrorText>
            </Field.Root>

            <Button
              colorPalette="blue"
              size="md"
              mt="2"
              width={{ base: "full", md: "auto" }}
              type="submit"
              loading={settingUp2FA}
              disabled={!setup2FAFormState.isDirty}
            >
              Enable Two-Factor Authentication
            </Button>
          </VStack>
        </Fieldset.Content>
      </Fieldset.Root>
    </form>
  );
}
