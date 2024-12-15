import { useBreakpoint } from "@/hooks";
import { Box, Flex, Skeleton } from "@mantine/core";
import React from "react";

export const EventModuleSkeleton = () => {
  const { isTablet } = useBreakpoint();

  return (
    <Box w="70%" m="auto">
      <Skeleton h={isTablet ? 280 : 480} />
      <Flex direction={isTablet ? "column" : "row"} justify="center" align="center" mb={50}>
        <Box w={isTablet ? "90%" : "50%"}>
          <Skeleton height={8} mt={6} radius="xl" my={20} />
          <Skeleton height={8} mt={6} radius="xl" mb={20} />
          <Skeleton height={8} mt={6} radius="xl" mb={20} />
        </Box>
        <Box w={isTablet ? "90%" : "50%"} ml={isTablet ? undefined : 100}>
          <Skeleton height={8} mt={6} radius="xl" my={20} />
          <Skeleton height={8} mt={6} radius="xl" mb={20} />
          <Skeleton height={8} mt={6} radius="xl" mb={20} />
        </Box>
      </Flex>
      <Flex direction={isTablet ? "column" : "row"} justify="center">
        <Box w={324} h={400} mx="auto">
          <Skeleton h={100} mb={30} />
          <Skeleton height={8} mt={6} radius="xl" mb={20} />
          <Skeleton height={8} mt={6} radius="xl" mb={20} />
          <Skeleton height={8} mt={6} radius="xl" mb={20} w="70%" />
          <Skeleton height={44} mt={60} />
        </Box>
        <Box w={324} h={400} mx="auto">
          <Skeleton h={100} mb={30} />
          <Skeleton height={8} mt={6} radius="xl" mb={20} />
          <Skeleton height={8} mt={6} radius="xl" mb={20} />
          <Skeleton height={8} mt={6} radius="xl" mb={20} w="70%" />
          <Skeleton height={44} mt={60} />
        </Box>
        <Box w={324} h={400} mx="auto">
          <Skeleton h={100} mb={30} />
          <Skeleton height={8} mt={6} radius="xl" mb={20} />
          <Skeleton height={8} mt={6} radius="xl" mb={20} />
          <Skeleton height={8} mt={6} radius="xl" mb={20} w="70%" />
          <Skeleton height={44} mt={60} />
        </Box>
      </Flex>
      <Box mx={20} mb={100}>
        <Skeleton h={343} />
      </Box>
    </Box>
  );
};
