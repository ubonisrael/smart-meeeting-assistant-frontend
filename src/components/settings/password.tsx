import {
  Box,
  Button,
  Field,
  Fieldset,
  IconButton,
  Input,
  InputGroup,
  VStack,
} from "@chakra-ui/react";
import { Eye, EyeClosed, Lock } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePassword } from "@/hooks/useProfile";
import { useForm } from "react-hook-form";
import { useState } from "react";

const passwordSchema = z.object({
  currentPassword: z.string().trim(),
  newPassword: z.string().min(8),
});
type PasswordForm = z.infer<typeof passwordSchema>;

export function PasswordSection() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { mutate: changePassword, isPending: changingPassword } =
    useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "", currentPassword: "" },
  });

  async function updatePassword(data: PasswordForm) {
    changePassword(data);
  }

  return (
    <Box maxW="7xl" p={{ base: "4", md: "6" }} rounded={"md"} borderWidth="1px">
      <form onSubmit={handleSubmit(updatePassword)}>
        <Fieldset.Root>
          <Fieldset.Legend fontSize="md" fontWeight="semibold">
            Change Password
          </Fieldset.Legend>
          <Fieldset.Content>
            {/* maxW="md" on desktop, full width on mobile */}
            <VStack gap="4" width="full" maxW={{ md: "md" }} align="start">
              {/* <Fieldset.Root maxW="md" mt={6}> */}
              <Field.Root invalid={"currentPassword" in errors}>
                <Field.Label>
                  Current password
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
                    {...register("currentPassword")}
                  />
                </InputGroup>
                <Field.ErrorText>
                  {errors["currentPassword"]?.message}
                </Field.ErrorText>
              </Field.Root>
              <Field.Root invalid={"newPassword" in errors}>
                <Field.Label>
                  New password
                  <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup
                  startElement={<Lock size={16} color="gray" />}
                  endElement={
                    <IconButton
                      variant={"plain"}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeClosed /> : <Eye />}
                    </IconButton>
                  }
                >
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    {...register("newPassword")}
                  />
                </InputGroup>
                <Field.ErrorText>
                  {errors["newPassword"]?.message}
                </Field.ErrorText>
              </Field.Root>

              <Button
                colorPalette="blue"
                size="md"
                mt="2"
                width={{ base: "full", md: "auto" }}
                type="submit"
                loading={changingPassword}
                disabled={!isDirty}
              >
                Update Password
              </Button>
            </VStack>
          </Fieldset.Content>
        </Fieldset.Root>
      </form>
    </Box>
  );
}
