import { Box, Container, Flex, Text, createStyles, rem } from "@mantine/core";
import Image from "next/image";
import React from "react";

import ForOrganizerForm from "./form";

const useStyles = createStyles((theme) => ({
  fullContainer: {
    width: "100%",
    backgroundColor: "#1E2130",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    gap: rem(40),
    margin: "30px auto",
    maxWidth: rem(1038),

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
      margin: "50px auto",
      flexDirection: "column",
      alignItems: "center",
      padding: 27,
    },
  },
  textwrapper: {
    width: "33.333%",
    flexDirection: "column",

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },
  text: {
    fontSize: rem(16),
    fontWeight: 400,
    color: "#FFFFFFCC",
    lineHeight: rem(30),
    margin: "20px 0",
    [theme.fn.smallerThan("sm")]: {
      width: "90%",
    },
  },
}));

export const ForOrganizersCreateEvents = () => {
  const { classes } = useStyles();

  return (
    <Flex className={classes.fullContainer} id="formContainer">
      <Container className={classes.container}>
        <Box m="auto">
          <Image
            src={"./img/for-organizer/envelopes.svg"}
            width={258}
            height={218}
            alt="envelopes"
          />
        </Box>
        <Flex className={classes.textwrapper}>
          <Text fz={20} fw={600} color="#E981FA">
            Create events now
          </Text>
          <Text className={classes.text}>
            {`At novelT, we’re committed to providing a user-friendly, ethical platform that helps
            organizers sell tickets to their events with ease. Inspired by innovation and
            technology, our team is constantly working towards updating and improving the efficiency
            of virtual ticket sales.`}
          </Text>
        </Flex>
        <ForOrganizerForm />
      </Container>
    </Flex>
  );
};
