import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { useFeedbackDialog } from "./useFeedbackDialog";
import { getErrorMessage } from "@/utils/error";
import { useNavigate } from "react-router-dom";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => api.me(),
    staleTime: Infinity,
    retry: false,
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
    onError: (error: Error) => {
      showError({
        title: "Profile update failed",
        description: getErrorMessage(
          error,
          "Unable to update profile. Please try again.",
        ),
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
    onError: (error: Error) => {
      showError({
        title: "Password update failed",
        description: getErrorMessage(
          error,
          "Unable to update password. Please try again.",
        ),
      });
    },
  });
}

export function useLogOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showError, showSuccess } = useFeedbackDialog();

  return useMutation({
    mutationFn: () => api.logout(),
    onSuccess: () => {
      showSuccess({
        title: "Logged out",
        description: "User successfully logged out.",
      });
      queryClient.clear();
      navigate("/login", { replace: true });
    },
    onError: (error: Error) => {
      showError({
        title: "Sign out failed",
        description: getErrorMessage(
          error,
          "Unable to log out. Please try again.",
        ),
      });
    },
  });
}

export function useRegister() {
  const { showError } = useFeedbackDialog();

  return useMutation({
    mutationFn: (input: { name: string; email: string; password: string }) =>
      api.register(input),
    onError: (error: Error) => {
      showError({
        title: "Registration failed",
        description: getErrorMessage(
          error,
          "Unable to create account. Please try again.",
        ),
      });
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useFeedbackDialog();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.login({ email, password }),
    onSuccess: (data) => {
      if ("twoFactorRequired" in data) return;
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccess({
        title: "User Logged In",
        description: "User successfully logged in.",
      });
    },
    onError: (error: Error) => {
      showError({
        title: "Login failed",
        description: getErrorMessage(
          error,
          "Unable to log in. Please try again.",
        ),
      });
    },
  });
}

export function useVerifyTwoFactorLogin() {
  const queryClient = useQueryClient();
  const { showError } = useFeedbackDialog();

  return useMutation({
    mutationFn: ({
      challengeToken,
      code,
    }: {
      challengeToken: string;
      code: string;
    }) => api.verifyTwoFactorLogin({ challengeToken, code }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: Error) => {
      showError({
        title: "Two-factor verification failed",
        description: getErrorMessage(
          error,
          "Unable to verify two-factor code. Please try again.",
        ),
      });
    },
  });
}

export function use2FASetup() {
  const { showError } = useFeedbackDialog();
  return useMutation({
    mutationFn: ({ password }: { password: string }) =>
      api.setupTwoFactor({ password }),
    onSuccess: (data: { qrCodeUrl: string }) => {
      return data;
    },
    onError: (error: Error) => {
      showError({
        title: "2FA Setup failed",
        description: getErrorMessage(error, "Could not start two-factor setup"),
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
    onError: (error: Error) => {
      showError({
        title: "2FA activation failed",
        description: getErrorMessage(
          error,
          "Could not enable two-factor authentication",
        ),
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
    onError: (error: Error) => {
      showError({
        title: "2FA deactivation failed",
        description: getErrorMessage(
          error,
          "Could not disable two-factor authentication",
        ),
      });
    },
  });
}
