import {
  Box,
  Button,
  Field,
  Fieldset,
  Flex,
  Heading,
  Input,
  InputGroup,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Mail, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProfile } from "@/hooks/useProfile";
import { useForm } from "react-hook-form";

const profileSchema = z.object({
  name: z.string().min(2).trim(),
});
type ProfileForm = z.infer<typeof profileSchema>;

export function ProfileSection() {
  const { session } = useAuth();
  const { mutate: updateProfile, isPending: updatingProfile } =
    useUpdateProfile();

  const user = session!.user;
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "" },
  });

  async function submitProfile(data: ProfileForm) {
    updateProfile(data);
  }

  return (
    <Box maxW="7xl" p={{ base: "4", md: "6" }} rounded={"md"} borderWidth="1px">
      <form onSubmit={handleSubmit(submitProfile)}>
        {/* Header Section */}
        <Flex
          justify="space-between"
          align="flex-start"
          direction={{ base: "column", md: "row" }}
          gap="4"
          mb="10"
        >
          <VStack align="start" gap="1">
            <Heading size="lg" fontWeight="semibold">
              Profile Information
            </Heading>
            <Text color="fg.muted" fontSize="sm">
              Update your personal details and contact information
            </Text>
          </VStack>
          <Button
            colorPalette="blue"
            size="md"
            rounded="md"
            px="6"
            type="submit"
            loading={updatingProfile}
            disabled={!isDirty}
          >
            <Save /> Save Changes
          </Button>
        </Flex>
        {/* Form Fields Grid */}
        <Fieldset.Root>
          <SimpleGrid columns={{ base: 1, md: 2 }} gapX="8" gapY="6">
            <Fieldset.Content>
              <Field.Root invalid={"name" in errors}>
                <Field.Label>
                  Name
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="Olga"
                  variant="subtle"
                  {...register("name")}
                />
                <Field.ErrorText>{errors["name"]?.message}</Field.ErrorText>
              </Field.Root>
            </Fieldset.Content>

            <Fieldset.Content>
              <Field.Root invalid={"email" in errors}>
                <Field.Label>Email Address</Field.Label>
                <InputGroup
                  startElement={
                    <Box color={"fg.subtle"}>
                      <Mail size={16} />
                    </Box>
                  }
                >
                  <Input
                    placeholder="olga.kanaris@oravanti.com"
                    variant="subtle"
                    value={user?.email}
                    disabled
                  />
                </InputGroup>
              </Field.Root>
            </Fieldset.Content>
          </SimpleGrid>
        </Fieldset.Root>
      </form>
    </Box>
  );
}
