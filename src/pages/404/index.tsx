import ErrorContent from "@/modules/404";
import React from "react";

import { NovelTHead, NVTLayout } from "@/components";

const ErrorPage404 = () => {
  return (
    <NVTLayout navbarProps={{ background: "none" }} hasFooter={false} backgroundGradientVariant={8}>
      <NovelTHead title="404" />
      <ErrorContent />
    </NVTLayout>
  );
};

export default ErrorPage404;
