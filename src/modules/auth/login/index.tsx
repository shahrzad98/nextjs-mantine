// import { facebookSSO, googleSSO, userLogin } from "@/api/handler/auth";
import { googleSSO, userLogin } from "@/api/handler/auth";
import { useBreakpoint } from "@/hooks";
import checkoutStore from "@/stores/cartStore";
import userStore from "@/stores/userStore";
import { ICheckoutStore } from "@/types";
import {
  IUserSignInRequest,
  IUserSignInResponse,
  IUserStore,
  IOrganizationUser,
  UserType,
  IPromoterUser,
} from "@/types/user";
import { emailRegex, errorNotification } from "@/utils";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  PasswordInput,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { KeyboardEvent } from "react";

import { AuthenticationLayout, BackgroundGradients, NovelTHead } from "@/components";

// import FacebookLogo from "./assets/facebookLogo.svg";
import GoogleLogo from "./assets/googleLogo.svg";

interface ILoginProps {
  variant: UserType;
  isCheckout?: boolean;
}

type LoginVariant = "attendee" | "organization" | "admin";

const submitText: { [key in UserType]?: string } = {
  [UserType.Attendee]: "Attendee",
  [UserType.Organizer]: "Organizer",
  [UserType.Operator]: "Operator",
  [UserType.Admin]: "Admin",
  [UserType.Promoter]: "Promoter",
};

const forgotPasswordLink: { [key in UserType]?: string } = {
  [UserType.Attendee]: "/auth/forgot-password",
  [UserType.Organizer]: "/organization/auth/forgot-password",
  [UserType.Operator]: "/operator/auth/forgot-password",
  [UserType.Promoter]: "/promoter/auth/forgot-password",
};

const loginRequestVariant: {
  [key in UserType]?: "attendee" | "organization" | "admin" | "promoter";
} = {
  [UserType.Attendee]: "attendee",
  [UserType.Organizer]: "organization",
  [UserType.Operator]: "organization",
  [UserType.Admin]: "admin",
  [UserType.Promoter]: "promoter",
};

const description: { [key in UserType]?: string } = {
  [UserType.Attendee]: "As an Attendee",
  [UserType.Organizer]: "As an Organizer",
  [UserType.Operator]: "As an Operator",
  [UserType.Admin]: "As an Admin",
};

const layoutBackground: { [key in UserType]?: string } = {
  [UserType.Attendee]: "/img/login-bg.png",
  [UserType.Organizer]: "/img/login-organizer-bg.png",
  [UserType.Operator]: "/img/operator-bg.png",
  [UserType.Admin]: "/img/login-admin-bg.png",
  [UserType.Promoter]: "/img/login-promoter-bg.png",
};

export const LoginForm = ({ variant, isCheckout = false }: ILoginProps) => {
  const { isMobile } = useBreakpoint();

  const router = useRouter();
  const setUser = userStore((state: IUserStore) => state.setUser);
  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const token = currentUser?.token;

  const checkoutData = checkoutStore((state: ICheckoutStore) => state.checkout);
  const eventCart = checkoutData?.cart;
  const cartToken = eventCart?.token;

  const isAttendee = variant === UserType.Attendee;

  if (isAttendee && token) {
    if (isCheckout) {
      router.push("/checkout/pay");
    } else {
      if (router.query.mytickets) {
        router.push("/my-tickets");
      } else {
        router.push("/");
      }
    }
  }

  if (variant === UserType.Organizer && token) {
    const user = currentUser.data as IOrganizationUser;
    if (user.role === "operator") {
      router.push("/operator");
    } else if ((user.role === "admin" || user.role === "owner") && !user?.organization?.name) {
      router.push("/organization/auth/onboarding/setup");
    } else if (
      user.organization?.description ||
      user.organization?.address ||
      user.organization?.cover_photo
    ) {
      router.push("/organization");
    } else if (user.role) {
      router.push("/organization/auth/onboarding/account-setup");
    }
  }

  if (variant === UserType.Operator && token) {
    const user = currentUser.data as IOrganizationUser;
    if (user.role === "operator") {
      router.push("/operator");
    } else if (user.role === "admin" || user.role === "owner") {
      router.push("/organization");
    } else {
      router.push("/");
    }
  }

  if (variant === UserType.Admin && token) {
    router.push("/admin");
  }

  if (variant === UserType.Promoter && token) {
    const user = currentUser.data as IPromoterUser;
    if (!user?.username) {
      router.push("/promoter/auth/onboarding/setup");
    } else {
      router.push("/promoter");
    }
  }

  const expireAfterSixHours = new Date().getTime() + 1000 * 60 * 60 * 6;
  const expireAfterThirtyDays = new Date().getTime() + 1000 * 60 * 60 * 24 * 30;

  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },

    validate: {
      email: (value) => (emailRegex.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 8 ? null : "Password should be longer than 8 characters",
    },
  });

  const detectRole = (response: IUserSignInResponse) => {
    let role;
    if (variant === UserType.Attendee) {
      role = UserType.Attendee;
    } else if (variant === UserType.Admin) {
      role = UserType.Admin;
    } else if (variant === UserType.Promoter) {
      role = UserType.Promoter;
    } else {
      switch ((response.data as IOrganizationUser).role) {
        case "owner":
          role = UserType.Organizer;
          break;

        case "operator":
          role = UserType.Operator;
          break;

        default:
          role = UserType.Organizer;
      }
    }

    return role;
  };

  const { mutate: handleLogin, isLoading: loginLoading } = useMutation(
    ({ email, password }: IUserSignInRequest) =>
      userLogin({
        email,
        password,
        variant: loginRequestVariant[variant] as LoginVariant,
        cart_token: cartToken,
      }),
    {
      onSuccess: (res) => {
        if (res.errors || res.message) {
          loginForm.setFieldError("password", res.message);
          loginForm.setFieldError("email", " ");
        } else if (res?.data) {
          setUser({
            data: res?.data,
            role: detectRole(res),
            token: res?.data?.current_access_token?.token,
            expiry: loginForm.values.remember ? expireAfterThirtyDays : expireAfterSixHours,
            refreshToken: res?.data?.current_access_token?.refresh_token,
            apiTokenExpiry: res?.data?.current_access_token?.expires_at,
          });
        }
      },
      onError: (e: AxiosError<IUserSignInResponse>) => {
        if (e?.response?.status === 401) {
          loginForm.setFieldError("password", e?.response?.data?.message);
          loginForm.setFieldError("email", " ");
        } else {
          errorNotification({
            title: "Error!",
            message: e?.message || "Something went wrong!",
          });
        }
      },
    }
  );

  const { mutate: handleGoogle } = useMutation(
    () => googleSSO(isCheckout ? "checkout" : router.query.mytickets ? "mytickets" : "false"),
    {
      onSuccess: (res) => {
        window.location.href = res?.data?.redirect_url;
      },
      onError: (e: AxiosError<{ redirect_url: string }>) => {
        errorNotification({
          title: "Error!",
          message: e?.message || "Something went wrong!",
        });
      },
    }
  );

  // const { mutate: handleFacebook } = useMutation(
  //   () => facebookSSO(isCheckout ? "checkout" : router.query.mytickets ? "mytickets" : "false"),
  //   {
  //     onSuccess: (res) => {
  //       window.location.href = res?.data?.redirect_url;
  //     },
  //     onError: (e: AxiosError<{ redirect_url: string }>) => {
  //       errorNotification({
  //         title: "Error!",
  //         message: e?.message || "Something went wrong!",
  //       });
  //     },
  //   }
  // );

  const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loginForm.validate();
      if (loginForm.isValid()) {
        handleLogin(loginForm.values);
      }
    }
  };

  return (
    <form
      onSubmit={loginForm.onSubmit((values) => handleLogin(values))}
      onKeyDown={(e) => checkKeyDown(e)}
    >
      <Flex
        direction={"column"}
        mt={
          isMobile && variant !== UserType.Attendee
            ? rem(122)
            : isMobile && variant === UserType.Attendee
            ? rem(60)
            : isCheckout
            ? 0
            : rem(86)
        }
        px={isMobile ? 0 : rem(27)}
        mb={rem(100)}
        pos={"relative"}
        sx={{ zIndex: 1 }}
      >
        <TextInput
          label="Email"
          placeholder="email@address.com"
          size="sm"
          required
          mb={25}
          {...loginForm.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="enter your password"
          size="sm"
          required
          {...loginForm.getInputProps("password")}
        />
        <Button
          type="submit"
          fullWidth
          mt="xl"
          size="md"
          fw={400}
          sx={{
            fontSize: 15,
            "&[data-disabled]": { backgroundColor: "#FFFFFF4D", color: "#9DA1A4" },
          }}
          disabled={!loginForm.isDirty()}
          variant="gradient"
          gradient={{ from: "#3077F3", to: "#15AABF", deg: 45 }}
          loading={loginLoading}
        >
          Log In as an {submitText[variant]}
        </Button>
        <Flex justify={"space-between"} my="xl">
          <Checkbox
            label="Remember me"
            size="xs"
            fw={300}
            styles={{
              input: {
                borderRadius: 2,
                borderColor: "#CED4DA",
              },
            }}
            {...loginForm.getInputProps("remember")}
          />
          {variant !== UserType.Admin && (
            <Link
              href={forgotPasswordLink[variant] as string}
              style={{
                fontSize: rem(12),
                color: "rgba(255, 255, 255, 0.8)",
                textDecoration: "underline",
                fontWeight: "200",
              }}
            >
              Forgot password?
            </Link>
          )}
        </Flex>
        {isAttendee && (
          <>
            <Divider />

            {/* <Button
              fullWidth
              mt="xl"
              size="md"
              fw={400}
              leftIcon={<Image src={FacebookLogo} alt="facebook-logo" />}
              bg={"#25262B"}
              sx={{ border: "1px solid #4167B2", fontSize: 12 }}
              onClick={() => handleFacebook()}
            >
              Log In with Facebook
            </Button> */}

            <Button
              fullWidth
              mt="xl"
              size="md"
              fw={400}
              leftIcon={<Image src={GoogleLogo} alt="google-logo" />}
              bg={"#25262B"}
              sx={{ border: "1px solid #666666", fontSize: 12 }}
              onClick={() => handleGoogle()}
            >
              Log In with Google
            </Button>
            <Text ta={"center"} mt="xl" size={"sm"} weight={500}>
              Don’t you have an account?{" "}
              <Link
                href={isCheckout ? "/checkout/auth/signup" : "/auth/signup"}
                style={{ fontWeight: "600", color: "#3077F3", textDecoration: "none" }}
              >
                Sign Up
              </Link>
            </Text>
          </>
        )}
      </Flex>
    </form>
  );
};

export const LoginModule = ({ variant }: ILoginProps) => {
  const { isDesktop } = useBreakpoint();

  return (
    <>
      <AuthenticationLayout
        title="Log In"
        description={description[variant]}
        image={layoutBackground[variant] as string}
      >
        <NovelTHead title="Login" />

        <LoginForm variant={variant} />
      </AuthenticationLayout>
      <BackgroundGradients variant={variant === "operator" && isDesktop ? 12 : 2} />
    </>
  );
};
