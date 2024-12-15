import { useBreakpoint } from "@/hooks";
import { Box, Card, Skeleton, Space } from "@mantine/core";

export const TopEventsSkeleton = () => {
  const { isMobile, isTablet } = useBreakpoint();

  return (
    <Box p={0} ml={isMobile ? 0 : isTablet ? 20 : 0} mt={isMobile ? 30 : 0}>
      <Card p={0} w={320} h={396} mb={isTablet ? 30 : 0} mx="auto">
        <Skeleton height={250} mb="sm" />
        <Space my={30} />
        <Card p="sm">
          <Skeleton height={8} mb="sm" radius="xl" />
          <Skeleton height={8} mb="sm" radius="xl" />
          <Skeleton height={8} mb="sm" radius="xl" />
          <Skeleton height={8} mb="sm" width="70%" radius="xl" />
          <Space h={50} />
        </Card>
      </Card>
    </Box>
  );
};
