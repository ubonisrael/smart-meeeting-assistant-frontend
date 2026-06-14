import { Box, Heading, List, Text } from "@chakra-ui/react";

type SummaryListProps = {
  title: string;
  items: string[];
};

export function SummaryList({ title, items }: SummaryListProps) {
  if (!items.length) return null;

  return (
    <Box as="section">
      <Heading as="h3" size="sm" fontWeight="semibold" mb="2">
        {title}
      </Heading>
      <List.Root gap="2" listStyle="none" p="0">
        {items.map((item) => (
          <List.Item
            key={item}
            rounded="md"
            borderWidth="1px"
            borderColor="stone.200"
            px="3"
            py="2"
            color="stone.700"
          >
            {item}
          </List.Item>
        ))}
      </List.Root>
    </Box>
  );
}
