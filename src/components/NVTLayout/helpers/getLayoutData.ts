import { UserType } from "@/types";

import { loggedInFooterData, loggedOutFooterData, navbarLinks } from "../assets/data";

export const getLayoutData = (userType?: UserType | null) => {
  const variant = userType || UserType.Guest;
  const links = navbarLinks[variant];
  const footerGroups =
    !userType || userType === UserType.Guest ? loggedOutFooterData : loggedInFooterData;

  return { variant, links, footerGroups };
};
