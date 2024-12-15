import { userRefreshToken } from "@/api/axiosInstance";
import getLocalStorageValue from "@/helpers/getLocalStorageValue";
import userStore from "@/stores/userStore";
import { ICurrentUserStorage, UserType } from "@/types";
import { refreshTokenKey } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { ComponentType, useEffect, useState } from "react";

const protectedRoutes = ["/organization", "/operator", "/admin", "/promoter"];

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthenticatedComponent = (props: P) => {
    const [storageToken] = useState<string | null>(
      getLocalStorageValue<ICurrentUserStorage>("nvt-user-storage")?.state?.currentUser?.data
        ?.current_access_token?.token ||
        getLocalStorageValue<ICurrentUserStorage>("nvt-user-storage")?.state?.currentUser?.data
          ?.current_access_token?.token ||
        null
    );
    const [expiry] = useState<number | null>(
      getLocalStorageValue<ICurrentUserStorage>("nvt-user-storage")?.state?.currentUser?.expiry ||
        null
    );
    const router = useRouter();
    const currentUser = userStore((state) => state.currentUser);

    const stateToken = currentUser?.data?.current_access_token?.token;

    const { isInitialLoading } = useQuery(
      [refreshTokenKey, currentUser?.expiry],
      () => userRefreshToken(),
      {
        enabled:
          !!currentUser?.apiTokenExpiry &&
          new Date(currentUser?.apiTokenExpiry).getTime() < new Date().getTime(),
      }
    );

    const redirectToLogin = () => router.push(`/${router.route.split("/")[1]}/auth/login`);

    useEffect(() => {
      if (router.isReady) {
        if (!stateToken || !storageToken) {
          if (
            currentUser?.token &&
            currentUser?.role === UserType.Attendee &&
            (currentUser?.data?.email_confirmed_at || !currentUser?.data?.first_name)
          ) {
            if (router.pathname.includes("checkout")) {
              router.push("/checkout/auth/step-2");
            } else {
              router.push("/auth/signup/step-2");
            }
          } else if (protectedRoutes.some((route) => router.route.includes(route))) {
            redirectToLogin();
          } else {
            if (router.query.mytickets) {
              router.push("/auth/login?mytickets=true");
            } else {
              router.push("/auth/login");
            }
          }
        }
      }
    }, [stateToken, router, storageToken]);

    // if (
    //   (stateToken || storageToken) &&
    //   currentUser?.token &&
    //   currentUser?.role === UserType.Attendee &&
    //   !currentUser?.data?.mobile_confirmed_at
    // ) {
    //   router.push("/auth/signup/step-2");

    //   return;
    // }

    if (
      (stateToken || storageToken) &&
      currentUser?.token &&
      currentUser?.role === UserType.Attendee &&
      !currentUser?.data?.first_name
    ) {
      router.push("/auth/signup/step-2");

      return;
    }

    // Check user's token expiration
    if (expiry && new Date().getTime() > expiry) {
      localStorage.removeItem("nvt-user-storage");
      window.location.replace("/auth/login");

      return;
    }

    // Preventing operator from accessing organization routes
    const isAdmin = currentUser?.role === UserType.Admin;
    const isAttendee = currentUser?.role === UserType.Attendee;
    const isOrganizationUser = currentUser?.role === UserType.Organizer;
    const isPromoter = currentUser?.role === UserType.Promoter;
    const isOperator =
      currentUser?.role === UserType.Operator && currentUser?.data?.role === "operator";

    if (
      router.isReady &&
      isAttendee &&
      (router.pathname.includes("organization") ||
        router.pathname.includes("admin") ||
        router.pathname.includes("operator") ||
        router.pathname.includes("promoter"))
    ) {
      router.push("/");

      return;
    }

    if (
      router.isReady &&
      isOperator &&
      (router.pathname.includes("organization") ||
        router.pathname.includes("admin") ||
        router.pathname.includes("promoter"))
    ) {
      router.push("/operator");

      return;
    }

    if (
      router.isReady &&
      isAdmin &&
      (router.pathname.includes("organization") ||
        router.pathname.includes("operator") ||
        router.pathname.includes("promoter"))
    ) {
      router.push("/admin");

      return;
    }

    // Preventing none organization from organization routes

    if (router.isReady && !isOrganizationUser && router.pathname.includes("organization")) {
      router.push("/organization/auth/login");

      return;
    }

    // Preventing organizer or owner from accessing operator routes
    if (
      router.isReady &&
      isOrganizationUser &&
      (router.pathname.includes("operator") || router.pathname.includes("admin"))
    ) {
      router.push("/organization");

      return;
    }
    // Preventing organizer or owner from accessing operator routes
    if (
      router.isReady &&
      isPromoter &&
      (router.pathname.includes("operator") || router.pathname.includes("admin"))
    ) {
      router.push("/promoter");

      return;
    }

    if (!stateToken || !storageToken) {
      return null;
    }

    return !isInitialLoading && router.isReady && <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
