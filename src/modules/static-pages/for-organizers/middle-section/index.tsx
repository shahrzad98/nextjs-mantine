import { Container, Flex, Text, createStyles, rem } from "@mantine/core";
import React from "react";

import GuranteeData from "../assets/data/guranteeData";
import TicketSaleData from "../assets/data/ticketSaleData";
import Advantages from "./Advantages";
import WhyNovelt from "./whyNovelt";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: rem(140),
    maxWidth: rem(1038),
    margin: "40px auto",
    marginBottom: rem(70),
    [theme.fn.smallerThan("sm")]: {
      gap: rem(70),
      padding: `0 ${rem(27)}`,
    },
  },
  title: {
    fontSize: rem(40),
    fontWeight: 600,
    color: "#E981FA",
    textAlign: "center",
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(28),
    },
  },
}));

export const ForOrganizersMiddleSection = () => {
  const { classes } = useStyles();

  return (
    <Container fluid maw={rem(1042)} className={classes.container}>
      <Advantages data={TicketSaleData} />
      <WhyNovelt />
      <Flex direction="column" gap={rem(50)}>
        <Text className={classes.title}>OUR GUARANTEE</Text>
        <Advantages data={GuranteeData} />
      </Flex>
    </Container>
  );
};

export default ForOrganizersMiddleSection;
