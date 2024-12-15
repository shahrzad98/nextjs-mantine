import { useBreakpoint } from "@/hooks";
import { BackgroundImage, Box, Flex, Group, Text, createStyles, rem } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { socialMediaLinks } from "../assets/constants";

const useStyles = createStyles((theme) => ({
  middleWrapper: {
    display: "flex",
    flexDirection: "row",
    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },
  middleText: {
    width: "40%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: rem(77),
    paddingLeft: rem(29),

    [theme.fn.smallerThan("md")]: {
      paddingRight: rem(29),
    },

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
      margin: `${rem(48)} 0`,
      alignItems: "self-start",
    },
  },
  pictureWrapper: {
    width: "60%",
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
      height: rem(224),
    },
  },
  picture: {
    height: rem(538),
    [theme.fn.smallerThan("sm")]: {
      height: rem(224),
    },
  },
}));

export const ContactUsMiddle = () => {
  const { classes } = useStyles();
  const { isMobile } = useBreakpoint();

  return (
    <Flex className={classes.middleWrapper}>
      <Flex className={classes.middleText}>
        <Flex direction="column">
          <Text color="#E981FA" fz={rem(20)} fw={600} lh={rem(30)} mb={rem(20)}>
            Emails
          </Text>
          <Text
            color="rgba(255, 255, 255, 0.80)"
            fz={rem(16)}
            fw={400}
            lts="-0.32px"
            sx={{ a: { fontWeight: 600, color: "rgba(255, 255, 255, 0.80)" } }}
          >
            General Inquiries: <Link href="mailto:info@novelt.io">info@novelt.io</Link>
          </Text>
          <Text
            color="rgba(255, 255, 255, 0.80)"
            fz={rem(16)}
            fw={400}
            lts="-0.32px"
            sx={{ a: { fontWeight: 600, color: "rgba(255, 255, 255, 0.80)" } }}
            mt={rem(15)}
          >
            Customer Support: <Link href="mailto:support@novelt.io">support@novelt.io</Link>
          </Text>
          <Text color="#E981FA" fz={rem(20)} fw={600} lh={rem(30)} mt={rem(30)} mb={rem(20)}>
            Social Media
          </Text>
          <Group spacing={rem(15)} position="left" noWrap>
            <Link href={socialMediaLinks.linkedin} target="_blank">
              <Image
                src="/img/contact-us/ph_linkedin-logo.png"
                width={isMobile ? 32 : 48}
                height={isMobile ? 32 : 48}
                alt="linkedIn"
              />
            </Link>
            <Link href={socialMediaLinks.instagram} target="_blank">
              <Image
                src="/img/contact-us/ph_instagram-logo.png"
                width={isMobile ? 32 : 48}
                height={isMobile ? 32 : 48}
                alt="instagram"
              />
            </Link>
            <Link href={socialMediaLinks.twitter} target="_blank">
              <Image
                src="/img/contact-us/ph_twitter-logo.png"
                width={isMobile ? 32 : 48}
                height={isMobile ? 32 : 48}
                alt="twitter"
              />
            </Link>
            <Link href={socialMediaLinks.facebook} target="_blank">
              <Image
                src="/img/contact-us/ph_facebook-logo.png"
                width={isMobile ? 32 : 48}
                height={isMobile ? 32 : 48}
                alt="facebook"
              />
            </Link>
          </Group>
        </Flex>
      </Flex>
      <Box className={classes.pictureWrapper}>
        <BackgroundImage
          src={"./img/contact-us/group-people.png"}
          h={538}
          className={classes.picture}
        />
      </Box>
    </Flex>
  );
};
