import { Grid, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

import { useStyles } from "./assets/useStyles";
import { IFooterGroup, IFooterLink } from "./types";

const FooterLink = (link: IFooterLink) => {
  const { label, href, props, isActive, target } = link;

  const { classes, cx } = useStyles();

  return (
    <Link
      className={cx(classes.link, {
        [classes.linkActive]: isActive,
      })}
      href={href}
      target={target}
    >
      <Text {...props} fz={12} fw={400}>
        {label}
      </Text>
    </Link>
  );
};

export const FooterGroup = ({ title, links, activeLink }: IFooterGroup) => {
  const { classes } = useStyles();
  const router = useRouter();

  const routeIsActive = (href: string) => {
    if (
      ![
        "https://support.novelt.io",
        "https://support.novelt.io/hc/en-us/articles/17317554772503-Terms-Conditions",
      ].includes(href)
    ) {
      const routePrefix = href.split("/")[1];

      return router?.route?.startsWith(`/${routePrefix}`);
    } else return false;
  };

  return (
    <Grid.Col span={6} md={3} sx={{ a: { width: "fit-content" } }}>
      <Text className={classes.title}>{title}</Text>
      {links.map((link) => (
        <FooterLink
          key={link.label}
          label={link.label}
          href={link.href}
          props={link?.props || {}}
          target={link?.target}
          isActive={activeLink === link.href || routeIsActive(link.href)}
        />
      ))}
    </Grid.Col>
  );
};
