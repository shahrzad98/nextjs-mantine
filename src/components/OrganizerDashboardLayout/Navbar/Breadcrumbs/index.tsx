import { Anchor, Breadcrumbs as MantineBreadcrumbs } from "@mantine/core";
import { useRouter } from "next/router";
import React, { FC } from "react";

type BreadcrumbsProps = {
  items: Array<{ title: string; href: string }>;
};

const Breadcrumbs: FC<BreadcrumbsProps> = ({ items }) => {
  const {
    query: { id },
  } = useRouter();

  return (
    <MantineBreadcrumbs sx={{ overflow: "hidden" }}>
      {items.map((item, index) => {
        return (
          <Anchor
            underline={false}
            key={index}
            color={index !== items.length - 1 ? "gray.5" : "gray.0"}
            href={index !== items.length - 1 ? item.href.replace("[id]", id as string) : undefined}
            sx={{
              cursor: index !== items.length - 1 ? "pointer" : "default",
              overflow: item.title.length > 15 ? "hidden" : "unset",
              textOverflow: "ellipsis",
              fontSize: "0.875rem",
              lineHeight: 1.5,
            }}
          >
            {item.title}
          </Anchor>
        );
      })}
    </MantineBreadcrumbs>
  );
};

export default Breadcrumbs;
