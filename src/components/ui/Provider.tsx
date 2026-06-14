"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ColorModeProvider, type ColorModeProviderProps } from "./ColorMode";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";

const queryClient = new QueryClient();

export function Provider(props: ColorModeProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
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
