import { useBreakpoint } from "@/hooks";
import { Box, Card, Flex, Skeleton } from "@mantine/core";

export const TicketInsightSkeleton = () => {
  const { isTablet } = useBreakpoint();

  return (
    <Card w={isTablet ? "auto" : 615} ml={20} mr={isTablet ? 20 : 0} h={396}>
      <Skeleton m={30} w="60%" h={20} radius="sm" />
      <Flex>
        <Skeleton circle width={185} height={185} my={50} />
        <Box w="20%" mt={100}>
          <Skeleton height={10} my="xl" mx={50} />
          <Skeleton height={10} my="xl" mx={50} />
          <Skeleton height={10} my="xl" mx={50} />
        </Box>
      </Flex>
    </Card>
  );
};
