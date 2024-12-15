import { useBreakpoint } from "@/hooks";
import { Button, Card, Flex, Skeleton, Space } from "@mantine/core";
import { FC } from "react";

interface HomeEventCardSkeletonProps {
  isSmall?: boolean;
}

const HomeEventCardSkeleton: FC<HomeEventCardSkeletonProps> = ({ isSmall }) => {
  const { isTablet } = useBreakpoint();

  return isTablet || isSmall ? (
    <Card w={330} h={128} p={0} my="md">
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
      <Card p={0} w={324} h={450}>
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
          <Skeleton>
            <Button />
          </Skeleton>
        </Card>
      </Card>
    </>
  );
};

export default HomeEventCardSkeleton;
