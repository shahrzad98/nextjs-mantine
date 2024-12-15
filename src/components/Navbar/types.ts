import { UserType } from "@/types";
import { ReactNode } from "react";

export interface INavbarLink {
  link: string;
  label: string;
  icon?: ReactNode;
  hasDesktopIcon?: boolean;
}

enum BasicVariant {
  Basic = "basic",
}

type NavbarVariant = BasicVariant | UserType;

export const NavbarVariant = { ...BasicVariant, ...UserType };

export interface INavbar {
  variant: NavbarVariant;
  height?: number;
  containerHeight?: number;
  links?: INavbarLink[];
  mobileLinks?: INavbarLink[];
  activeLink?: string;
  background?: "filled" | "none";
  sticky?: boolean;
  currentPageTitle?: string;
  rightSideActions?: ReactNode;
  handleBackButton?: () => void;
  emailConfirmationBanner?: "default" | "myAccount";
}

export interface INavbarOptional {
  variant?: NavbarVariant;
  height?: number;
  containerHeight?: number;
  onLogout?: () => void;
  links?: INavbarLink[];
  mobileLinks?: INavbarLink[];
  activeLink?: string;
  background?: "filled" | "none";
  sticky?: boolean;
  currentPageTitle?: string;
  rightSideActions?: ReactNode;
  handleBackButton?: () => void;
  emailConfirmationBanner?: "default" | "myAccount";
}
