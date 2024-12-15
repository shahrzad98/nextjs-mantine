import { TextProps } from "@mantine/core";

export interface IFooterLink {
  label: string;
  href: string;
  props?: TextProps;
  isActive?: boolean;
  target?: string;
}

export interface IFooterGroup {
  title: string;
  links: IFooterLink[];
  activeLink?: string;
}

export interface IFooter {
  groups?: IFooterGroup[];
  activeLink?: string;
  copyrightOnly?: boolean;
}
