import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { useFeedbackDialog } from "./useFeedbackDialog";
import { getErrorMessage } from "@/utils/error";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => api.me(),
    staleTime: Infinity,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useFeedbackDialog();

  return useMutation({
    mutationFn: ({ name }: { name: string }) => api.updateProfile({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccess({
        title: "Profile Updated",
        description: "User profile has been updated successfully.",
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      showError({
        title: "Profile update failed",
        description:
          error.response?.data?.message ||
          "Unable to update profile. Please try again.",
      });
    },
  });
}

export function useChangePassword() {
  const { showError, showSuccess } = useFeedbackDialog();

  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => api.updatePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      showSuccess({
        title: "Password Updated",
        description: "User's password has been updated successfully.",
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      showError({
        title: "Password update failed",
        description:
          error.response?.data?.message ||
          "Unable to update password. Please try again.",
      });
    },
  });
}

export function useLogOut() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useFeedbackDialog();

  return useMutation({
    mutationFn: () => api.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccess({
        title: "Logged out",
        description: "User successfully logged out.",
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      showError({
        title: "Sign out failed",
        description:
          error.response?.data?.message ||
          "Unable to log out. Please try again.",
      });
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useFeedbackDialog();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => api.login({ email, password }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccess({
        title: "User Logged In",
        description: "User successfully logged in.",
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      showError({
        title: "Login failed",
        description:
          error.response?.data?.message ||
          "Unable to log in. Please try again.",
      });
    },
  });
}

export function useVerifyTwoFactorLogin() {
  const queryClient = useQueryClient();
  const { showError } = useFeedbackDialog();

  return useMutation({
    mutationFn: ({ challengeToken, code }: { challengeToken: string; code: string }) =>
      api.verifyTwoFactorLogin({ challengeToken, code }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      showError({
        title: "Two-factor verification failed",
        description:
          error.response?.data?.message ||
          "Unable to verify two-factor code. Please try again.",
      });
    },
  });
}

export function use2FASetup() {
  const { showError } = useFeedbackDialog();
  return useMutation({
    mutationFn: () => api.setupTwoFactor(),
    onSuccess: (data: { qrCodeUrl: string }) => {
      return data;
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      showError({
        title: "2FA Setup failed",
        description:
          error.response?.data?.message ||
          getErrorMessage(error, "Could not start two-factor setup"),
      });
    },
  });
}

export function useEnable2FA() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useFeedbackDialog();
  return useMutation({
    mutationFn: (code: string) => api.enableTwoFactor(code),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccess({
        title: "2FA enabled",
        description: "Two-factor authentication enabled.",
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      showError({
        title: "2FA activation failed",
        description:
          error.response?.data?.message ||
          getErrorMessage(error, "Could not enable two-factor authentication"),
      });
    },
  });
}

export function useDisable2FA() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useFeedbackDialog();
  return useMutation({
    mutationFn: ({ password, code }: { password: string; code: string }) =>
      api.disableTwoFactor({
        password,
        code,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccess({
        title: "2FA disabled",
        description: "Two-factor authentication disabled.",
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      showError({
        title: "2FA deactivation failed",
        description:
          error.response?.data?.message ||
          getErrorMessage(error, "Could not disable two-factor authentication"),
      });
    },
  });
}
