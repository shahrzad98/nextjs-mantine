import { useBreakpoint } from "@/hooks";
import {
  Container,
  Flex,
  Grid,
  Group,
  Menu,
  rem,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconChevronUp,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";

import { socialMediaLinks, regions } from "./assets/constants";
import LogoAlt from "./assets/logo-alt.svg";
import Logo from "./assets/logo.svg";
import { useStyles } from "./assets/useStyles";
import { FooterGroup } from "./FooterGroup";
import { IFooter } from "./types";

export function Footer({ groups, activeLink, copyrightOnly = false }: IFooter) {
  const { classes } = useStyles();
  const { isMobile } = useBreakpoint();
  const theme = useMantineTheme();

  const [regionOpened, setRegionOpened] = useState(false);

  return copyrightOnly ? (
    <Flex align={"center"} gap={8}>
      <ReactCountryFlag svg countryCode={process.env.NEXT_PUBLIC_REGION as string} />
      <Text c="rgba(255, 255, 255, 0.50)" size={isMobile ? "xs" : "sm"} align="center" lh={rem(42)}>
        Copyright {new Date().getFullYear()} .{" "}
        <Link href="/" className={classes.brandName}>
          novelT
        </Link>{" "}
        Inc. All rights reserved.
      </Text>
    </Flex>
  ) : (
    <footer className={classes.footer}>
      <Container className={classes.mobileLogo}>
        <Image src={Logo} alt="novelT Logo" />
      </Container>
      <Container className={classes.inner}>
        <Grid w="100%" sx={{ flex: 1 }}>
          {groups?.map((group) => (
            <FooterGroup
              key={group.title}
              title={group.title}
              links={group.links}
              activeLink={activeLink}
            />
          ))}
          <Grid.Col span={6} md={3}>
            <Text className={classes.title}>Connect</Text>
            <Group spacing={rem(8)} position="left">
              <Link href={socialMediaLinks.linkedin} target="_blank">
                <IconBrandLinkedin size={28} stroke={1.5} className={classes.socialIcon} />
              </Link>
              <Link href={socialMediaLinks.instagram} target="_blank">
                <IconBrandInstagram size={28} stroke={1.5} className={classes.socialIcon} />
              </Link>
              <Link href={socialMediaLinks.twitter} target="_blank">
                <IconBrandTwitter size={28} stroke={1.5} className={classes.socialIcon} />
              </Link>
              <Link href={socialMediaLinks.facebook} target="_blank">
                <IconBrandFacebook size={28} stroke={1.5} className={classes.socialIcon} />
              </Link>
            </Group>
          </Grid.Col>
        </Grid>
        <Stack className={classes.logo}>
          <Image src={LogoAlt} alt="novelT Logo" width={94} />
          <Text c="rgba(255, 255, 255, 0.50)" className={classes.description}>
            An Immutable Ticketing Platform
          </Text>
        </Stack>
      </Container>
      <Container className={classes.afterFooter} py={20}>
        <Menu
          shadow="md"
          width={214}
          position={isMobile ? "top" : "top-start"}
          opened={regionOpened}
          onChange={setRegionOpened}
        >
          <Menu.Target>
            <Flex gap={rem(10)} align="center" sx={{ cursor: "pointer" }}>
              <ReactCountryFlag svg countryCode={process.env.NEXT_PUBLIC_REGION as string} />
              <Text size={rem(12)} c="rgba(255, 255, 255, 0.80)">
                {regions.find((region) => region.abbr === process.env.NEXT_PUBLIC_REGION)?.label}
              </Text>
              <IconChevronUp
                size={15}
                color={regionOpened ? theme.colors.nvtPrimary[2] : "rgba(255, 255, 255, 0.50)"}
              />
            </Flex>
          </Menu.Target>

          <Menu.Dropdown>
            {regions
              .filter((region) => region.abbr !== process.env.NEXT_PUBLIC_REGION)
              .map((region) => (
                <Menu.Item
                  key={region.abbr}
                  icon={<ReactCountryFlag svg countryCode={region.abbr} />}
                  component={Link}
                  href={region.url}
                >
                  {region.label}
                </Menu.Item>
              ))}
          </Menu.Dropdown>
        </Menu>
        <Text
          c={isMobile ? "rgba(255, 255, 255, 0.30)" : "rgba(255, 255, 255, 0.50)"}
          size="xs"
          align="center"
          fw={isMobile ? 500 : 300}
          lh={rem(42)}
          sx={{ letterSpacing: isMobile ? -0.5 : 0.5 }}
        >
          Copyright {new Date().getFullYear()} .{" "}
          <Link href="/" className={classes.brandName}>
            novelT
          </Link>{" "}
          Inc. All rights reserved.
        </Text>
      </Container>
    </footer>
  );
}
