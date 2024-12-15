import { useBreakpoint } from "@/hooks";
import { Card, Skeleton, Space } from "@mantine/core";
import { FC } from "react";

interface ITicketsTablesSkeletonProps {
  containerHeight?: number;
}
export const TicketsTablesSkeleton: FC<ITicketsTablesSkeletonProps> = ({
  containerHeight = 396,
}) => {
  const { isTablet } = useBreakpoint();

  return (
    <>
      <Card p={0} w={isTablet ? "auto" : 959} h={containerHeight} mx={isTablet ? 20 : 0} my={30}>
        <Skeleton height={250} mb="sm" />
        <Space my={10} />
        <Card p="sm" sx={{ position: "relative", top: "10%" }}>
          <Skeleton height={8} mb="lg" radius="xl" />
          <Skeleton height={8} mb="lg" radius="xl" />
          <Skeleton height={8} mb="lg" radius="xl" />
          <Skeleton height={8} mb="lg" radius="xl" />
          <Space h={50} />
        </Card>
      </Card>
    </>
  );
};
