import Head from "next/head";
import React, { PropsWithChildren } from "react";

export const NovelTHead = ({ title, children }: PropsWithChildren<{ title: string }>) => {
  const headTitle = `novelT${title && ` | ${title}`}`;

  return (
    <Head>
      <title>{headTitle}</title>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      {children}
    </Head>
  );
};
