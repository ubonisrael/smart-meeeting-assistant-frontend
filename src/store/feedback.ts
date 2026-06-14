import { create } from "zustand";
import { toast } from "sonner";

type FeedbackState = {
  isOpen: boolean;
  variant: "success" | "error";
  title: string;
  description: string;
};

type FeedbackActions = {
  showSuccess: (options?: FeedbackDialogOptions) => void;
  showError: (options?: FeedbackDialogOptions) => void;
  close: () => void;
};

const DEFAULT_SUCCESS_TITLE = "Changes saved";
const DEFAULT_SUCCESS_DESCRIPTION =
  "Your updates have been saved successfully.";
const DEFAULT_ERROR_TITLE = "Something went wrong";
const DEFAULT_ERROR_DESCRIPTION = "Please try again.";

export const useFeedbackStore = create<FeedbackState & FeedbackActions>()(
  (set) => ({
    isOpen: false,
    variant: "success",
    title: DEFAULT_SUCCESS_TITLE,
    description: DEFAULT_SUCCESS_DESCRIPTION,
    showSuccess: (options) => {
      const title = options?.title || DEFAULT_SUCCESS_TITLE;
      const description = options?.description || DEFAULT_SUCCESS_DESCRIPTION;
      toast.success(title, { description });
      set({ isOpen: true, variant: "success", title, description });
    },
    showError: (options) => {
      const title = options?.title || DEFAULT_ERROR_TITLE;
      const description = options?.description || DEFAULT_ERROR_DESCRIPTION;
      toast.error(title, { description });
      set({ isOpen: true, variant: "error", title, description });
    },
    close: () => set({ isOpen: false }),
  }),
);
