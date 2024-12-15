import Link from "next/link";
import { useRouter } from "next/router";

import { useStyles } from "./assets/useStyles";
import { INavbarLink } from "./types";

interface ILinkSet {
  linkSet: INavbarLink[];
  activeLink: string;
  isMobile: boolean;
  activeLinkHasBackground: boolean;
}

export const LinkSet = ({ linkSet, activeLink, isMobile, activeLinkHasBackground }: ILinkSet) => {
  const router = useRouter();
  const routeIsActive = (href: string) => {
    if (!["https://support.novelt.io", "/"].includes(href)) {
      const routePrefix = href.split("/")[1];
      if (routePrefix === "organization") {
        return router?.route === href;
      }

      if (router?.route?.startsWith("/organization")) {
        return false;
      }

      if (router?.route?.startsWith("/promoter")) {
        return false;
      }

      return router?.route?.startsWith(`/${routePrefix}`);
    } else return false;
  };

  const { classes, cx } = useStyles();

  return (
    <>
      {linkSet.map((link) => {
        const isActive = link.link === activeLink || routeIsActive(link.link);

        const linkClassName = cx(classes.link, {
          [classes.linkWithIcon]: link.hasDesktopIcon || isMobile,
          [classes.linkActive]: isActive,
          [classes.linkActiveWithBackground]: isActive && activeLinkHasBackground,
        });

        return (
          <Link key={link.label} href={link.link} className={linkClassName}>
            {link.icon}
            {link.label}
          </Link>
        );
      })}
    </>
  );
};
