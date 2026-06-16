import { useEnable2FA } from "@/hooks/useProfile";
import {
  Box,
  Button,
  Clipboard,
  Field,
  Fieldset,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { QRCode } from "react-qr-code";
import z from "zod";

const qrSchema = z.object({
  token: z.string().length(6).trim(),
});

type QrForm = z.infer<typeof qrSchema>;

export function QRCodeVerify({
  totpURI,
  onDone,
}: { totpURI: string; onDone: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QrForm>({
    resolver: zodResolver(qrSchema),
    defaultValues: { token: "" },
  });
  const {
    mutate: verifyQRCode,
    isPending: isVerifyingQRCode,
    isSuccess: successfullyVerified,
    data: enable2FAData,
  } = useEnable2FA();

  const handleQrCode = (data: QrForm) => {
    verifyQRCode(data.token);
  };

  if (successfullyVerified) {
    const backupCodes = enable2FAData?.backupCodes ?? [];
    return (
      <>
        <Text color="fg.muted" pb={2} fontSize={"sm"}>
          Save these backup codes in a safe place. You can use them to access
          your account if your authenticator app is unavailable. Each code can
          only be used once.
        </Text>

        <Clipboard.Root value={backupCodes.join("\n")} mt={4}>
          <Clipboard.Trigger asChild>
            <Button variant="surface" size="xs">
              <Clipboard.Indicator />
              Copy codes
            </Button>
          </Clipboard.Trigger>
        </Clipboard.Root>

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          gap={3}
          my={8}
          width="full"
          maxW="md"
        >
          {backupCodes.map((code, index) => (
            <Text key={index} fontFamily="mono" fontSize="sm">
              {code}
            </Text>
          ))}
        </SimpleGrid>

        <Button variant="outline" onClick={onDone}>
          Done
        </Button>
      </>
    );
  }

  return (
    <VStack gap={4} alignItems={"start"} w={"full"}>
      <Text color="fg.muted">
        Scan this QR code with your authenticator app and enter the code below:
      </Text>

      <form onSubmit={handleSubmit(handleQrCode)}>
        <Fieldset.Root>
          <Fieldset.Content>
            {/* maxW="md" on desktop, full width on mobile */}
            <VStack
              gap="4"
              width="full"
              maxW={{ md: "md" }}
              align="start"
              w={"full"}
            >
              <Field.Root invalid={"token" in errors}>
                <Field.Label>
                  Code
                  <Field.RequiredIndicator />
                </Field.Label>

                <Input {...register("token")} w={"full"} />

                <Field.ErrorText>{errors["token"]?.message}</Field.ErrorText>
              </Field.Root>

              <Button
                colorPalette="blue"
                size="md"
                mt="2"
                width={{ base: "full", md: "auto" }}
                type="submit"
                loading={isVerifyingQRCode}
              >
                Submit Code
              </Button>
            </VStack>
          </Fieldset.Content>
        </Fieldset.Root>
      </form>

      <Box
        p={3}
        bg="white"
        width="fit-content"
        mt={4}
        rounded="md"
        borderWidth={1}
        borderColor="border.muted"
      >
        <QRCode size={256} value={totpURI} />
      </Box>
    </VStack>
  );
}
