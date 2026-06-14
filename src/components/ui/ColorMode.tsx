"use client";
import type { IconButtonProps, SpanProps } from "@chakra-ui/react";
import {
  ClientOnly,
  Flex,
  HStack,
  IconButton,
  Menu,
  Portal,
  RadioCard,
  Skeleton,
  Span,
} from "@chakra-ui/react";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider, useTheme } from "next-themes";
import * as React from "react";
import { SystemModeIcon } from "./icons/SystemModeIcon";
import { LightModeIcon } from "./icons/LightModeIcon";
import { DarkModeIcon } from "./icons/DarkModeIcon";
import { Laptop, Moon, Sun } from "lucide-react";

const colorModes = [
  { value: "system", title: "System", icon: SystemModeIcon },
  { value: "light", title: "Light", icon: LightModeIcon },
  { value: "dark", title: "Dark", icon: DarkModeIcon },
];

export interface ColorModeProviderProps extends ThemeProviderProps {}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  );
}

export type ColorMode = "light" | "dark";

export interface UseColorModeReturn {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme();
  const colorMode = forcedTheme || resolvedTheme;
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };
  return {
    colorMode: colorMode as ColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

export function ColorModeIcon() {
  const { theme } = useTheme();
  return theme === "dark" ? (
    <Moon />
  ) : theme === "system" ? (
    <Laptop />
  ) : (
    <Sun />
  );
}

interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { setTheme, theme } = useTheme();
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <Menu.Root positioning={{ placement: "bottom-end" }}>
        <Menu.Trigger
          asChild
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <IconButton
            variant="outline"
            aria-label="Toggle color mode"
            size="md"
            rounded="full"
            ref={ref}
            {...props}
            css={{
              _icon: {
                width: "5",
                height: "5",
              },
            }}
          >
            <ColorModeIcon />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner onClick={(e) => e.stopPropagation()}>
            <Menu.Content>
              <Menu.Item
                value="copy-link"
                onClick={() => setTheme("light")}
                bg={theme === "light" ? "gray.subtle" : ""}
              >
                <Sun /> Light
              </Menu.Item>
              <Menu.Item
                value="edit-link"
                onClick={() => setTheme("dark")}
                bg={theme === "dark" ? "gray.subtle" : ""}
              >
                <Moon /> Dark
              </Menu.Item>
              <Menu.Item
                value="delete"
                onClick={() => setTheme("system")}
                bg={theme === "system" ? "gray.subtle" : ""}
              >
                <Laptop />
                System
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </ClientOnly>
  );
});

export const ColorModeSwitcher = () => {
  const { setTheme, theme } = useTheme();

  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <RadioCard.Root
        defaultValue={theme}
        size={"sm"}
        onValueChange={({ value }) => setTheme(value as string)}
        maxW={"lg"}
      >
        <HStack align="stretch" mt={4} gap={{ base: 2.5, sm: 4 }}>
          {colorModes.map((mode) => (
            <RadioCard.Item
              key={mode.value}
              value={mode.value}
              colorPalette={"blue"}
              rounded={"sm"}
              overflow={"hidden"}
            >
              <RadioCard.ItemHiddenInput />
              <RadioCard.ItemControl p={0}>
                {<mode.icon />}
              </RadioCard.ItemControl>
              <RadioCard.ItemAddon as={Flex} gap={2} alignItems={"center"}>
                <RadioCard.ItemIndicator />
                {mode.title}
              </RadioCard.ItemAddon>
            </RadioCard.Item>
          ))}
        </HStack>
      </RadioCard.Root>
    </ClientOnly>
  );
};

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    );
  },
);

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme dark"
        colorPalette="gray"
        colorScheme="dark"
        ref={ref}
        {...props}
      />
    );
  },
);
