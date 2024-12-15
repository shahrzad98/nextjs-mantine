import { ReactNode, useEffect, useState } from "react";

type NoSsrProps = {
  children: ReactNode;
};

function NoSsr({ children }: NoSsrProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <>{children}</> : null;
}

export default NoSsr;
