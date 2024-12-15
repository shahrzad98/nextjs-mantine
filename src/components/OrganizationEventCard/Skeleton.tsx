import { useBreakpoint } from "@/hooks";
import { Card, Flex, Skeleton, Space } from "@mantine/core";
import { FC } from "react";

interface HomeEventCardSkeletonProps {
  isSmall?: boolean;
}

export const OrganizerEventCardSkeleton: FC<HomeEventCardSkeletonProps> = ({ isSmall }) => {
  const { isTablet } = useBreakpoint();

  return isTablet || isSmall ? (
    <Card w="100%" h={128} p={0}>
      <Flex justify="space-between">
        <Skeleton width={158} height={128} />
        <Card p={10} m={10} w="100%">
          <Skeleton height={8} radius="xl" mb={10} />
          <Skeleton width={80} height={15} mb={25} />
          <Skeleton height={5} radius="xl" mb={10} />
          <Skeleton height={5} radius="xl" />
        </Card>
      </Flex>
    </Card>
  ) : (
    <>
      <Card p={0} w={370} h={300}>
        <Skeleton height={150} mb="sm" />
        <Card p="sm">
          <Skeleton height={8} mb="sm" radius="xl" />
          <Skeleton height={8} mb="sm" radius="xl" />
          <Skeleton height={8} mb="sm" radius="xl" />
          <Skeleton height={8} mb="sm" width="70%" radius="xl" />
          <Space h={50} />
          <Flex p={2} align="center" justify="flex-start">
            <Skeleton sx={{ alignSelf: "center" }} mt={20} mr={10} height={30} circle mb="xl" />
            <Skeleton width="30%">
              <Skeleton height={10} radius="md" />
            </Skeleton>
          </Flex>
        </Card>
      </Card>
    </>
  );
};
