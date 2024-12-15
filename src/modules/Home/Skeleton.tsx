import { useBreakpoint } from "@/hooks";
import { Box, Button, Card, Flex, Grid, Skeleton } from "@mantine/core";

const EventListSkeleton = () => {
  const { isMobile } = useBreakpoint();
  const SkeletonItem = () =>
    isMobile ? (
      <Grid.Col sm={12} maw={330}>
        <Card h={136} p={0}>
          <Flex justify="space-between">
            <Box bg="black" w={113} h={138} />
            <Flex direction="column" align="start" p={20} w={217}>
              <Skeleton h={10} width={160} mb={20} animate={false} />
              <Skeleton h={10} width={160} mb={20} animate={false} />
              <Skeleton h={10} width={100} mb={20} animate={false} />
            </Flex>
          </Flex>
        </Card>
      </Grid.Col>
    ) : (
      <Grid.Col sm={4} mb={isMobile ? 50 : 0} maw={324}>
        <Box>
          <Box bg="black" w={"100%"} h={196} />
          <Card h={285}>
            <Skeleton h={10} width="70%" mb={20} animate={false} />
            <Skeleton h={20} animate={false} mb={50} />
            <Skeleton h={10} mb={10} animate={false} />
            <Skeleton h={10} width="70%" mb={40} animate={false} />
            <Skeleton h={10} width="30%" animate={false} />
            <Skeleton bottom={-30} animate={false}>
              <Button />
            </Skeleton>
          </Card>
        </Box>
      </Grid.Col>
    );

  return (
    <Grid w="100%" sx={{ placeContent: "center" }}>
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <SkeletonItem key={i} />
        ))}
    </Grid>
  );
};

export default EventListSkeleton;
