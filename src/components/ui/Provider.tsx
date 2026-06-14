"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ColorModeProvider, type ColorModeProviderProps } from "./ColorMode";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

const queryClient = new QueryClient();

export function Provider(props: ColorModeProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={defaultSystem}>
        <BrowserRouter>
          <AuthProvider>
            <ColorModeProvider {...props} />
          </AuthProvider>
        </BrowserRouter>
      </ChakraProvider>
      <Toaster richColors />
    </QueryClientProvider>
  );
}
