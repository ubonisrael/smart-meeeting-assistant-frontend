import { Button } from "@chakra-ui/react";

type TabButtonProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

export function TabButton({ active, label, onClick }: TabButtonProps) {
  return (
    <Button
      size="sm"
      variant="ghost"
      rounded="md"
      px="3"
      py="2"
      fontWeight="medium"
      bg={active ? "ink" : "transparent"}
      color={active ? "white" : "stone.600"}
      _hover={active ? { bg: "ink" } : { bg: "stone.100" }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
