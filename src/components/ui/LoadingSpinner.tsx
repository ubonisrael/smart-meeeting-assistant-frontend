import { Box, Grid } from "@chakra-ui/react";

export function LoadingSpinner() {
  return (
    <Grid minH="100vh" placeItems="center" bg="brand.bg">
      <Box
        h="10"
        w="10"
        rounded="full"
        borderWidth="4px"
        borderColor="stone.200"
        borderTopColor="moss"
        className="animate-spin"
      />
    </Grid>
  );
}
