// import { attendeeSignup, facebookSSO, googleSSO } from "@/api/handler/auth";
import { attendeeSignup, googleSSO } from "@/api/handler/auth";
import { useBreakpoint } from "@/hooks";
import checkoutStore from "@/stores/cartStore";
import userStore from "@/stores/userStore";
import { ICheckoutStore } from "@/types";
import { IUserSignupRequest, IUserSignupResponse, IUserStore, UserType } from "@/types/user";
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
import React, { KeyboardEvent } from "react";

import { AuthenticationLayout, BackgroundGradients, NovelTHead } from "@/components";

// import FacebookLogo from "./assets/facebookLogo.svg";
import GoogleLogo from "./assets/googleLogo.svg";

export const SignupForm = ({ isCheckout = false }: { isCheckout?: boolean }) => {
  const { isMobile } = useBreakpoint();

  const router = useRouter();
  const setUser = userStore((state: IUserStore) => state.setUser);

  const checkoutData = checkoutStore((state: ICheckoutStore) => state.checkout);
  const eventCart = checkoutData?.cart;
  const cartToken = eventCart?.token;

  const expireAfterSixHours = new Date().getTime() + 1000 * 60 * 60 * 6;

  const signupForm = useForm({
    initialValues: {
      email: "",
      password: "",
      password_confirmation: "",
      terms: true,
    },
    validate: {
      email: (value) => (emailRegex.test(value) ? null : "Invalid email format"),
      password: (value) =>
        value.length >= 8 ? null : "Password should be longer than 8 characters",
      password_confirmation: (value, values) =>
        value !== values.password
          ? "The password you have chosen does not match, please try again."
          : null,
      terms: (value) => (!value ? "You have to agree with the terms and conditions" : null),
    },
  });

  const { mutate: handleSignup, isLoading: signupLoading } = useMutation(
    ({ email, password, password_confirmation }: IUserSignupRequest) =>
      attendeeSignup({ email, password, password_confirmation, cart_token: cartToken }),
    {
      onSuccess: (res) => {
        if (res.errors || res.message) {
          signupForm.setFieldError("password", res.message);
          signupForm.setFieldError("email", " ");
        } else if (res?.data) {
          setUser({
            token: res?.data?.access_token,
            expiry: expireAfterSixHours,
            role: UserType.Attendee,
            data: {},
          });
          if (isCheckout) {
            router.push("/checkout/auth/step-2");
          } else {
            router.push("/auth/signup/step-2");
          }
        }
      },
      onError: (e: AxiosError<IUserSignupResponse>) => {
        if (e?.response?.status === 401) {
          signupForm.setFieldError("password", e?.response?.data?.message);
          signupForm.setFieldError("email", " ");
        } else {
          errorNotification(e);
        }
      },
    }
  );

  const { mutate: handleGoogle } = useMutation(() => googleSSO(isCheckout ? "checkout" : "false"), {
    onSuccess: (res) => {
      window.location.href = res?.data?.redirect_url;
    },
    onError: (e: AxiosError<{ redirect_url: string }>) => {
      errorNotification({
        title: "Error!",
        message: e?.message || "Something went wrong!",
      });
    },
  });

  // const { mutate: handleFacebook } = useMutation(
  //   () => facebookSSO(isCheckout ? "checkout" : "false"),
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
      signupForm.validate();
      if (signupForm.isValid()) {
        handleSignup(signupForm.values);
      }
    }
  };

  return (
    <form
      onSubmit={signupForm.onSubmit((values) => handleSignup(values))}
      onKeyDown={(e) => checkKeyDown(e)}
    >
      <Flex
        direction={"column"}
        mt={isMobile ? rem(37) : isCheckout ? 0 : rem(40)}
        mb={rem(63)}
        px={isMobile ? 0 : rem(27)}
        sx={{ zIndex: 1 }}
        pos={"relative"}
      >
        <TextInput
          label="Email"
          placeholder="Your email"
          size="sm"
          required
          mb={rem(25)}
          {...signupForm.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          size="sm"
          required
          mb={rem(25)}
          styles={{
            visibilityToggle: {
              strokeWidth: "1px",
              color: "#5C5F65",
            },
          }}
          {...signupForm.getInputProps("password")}
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Your password repeated"
          size="sm"
          required
          styles={{
            visibilityToggle: {
              strokeWidth: "1px",
              color: "#5C5F65",
            },
          }}
          {...signupForm.getInputProps("password_confirmation")}
        />

        <Button
          fullWidth
          mt="xl"
          size="md"
          fw={400}
          sx={{
            fontSize: 15,
            "&[data-disabled]": { backgroundColor: "#FFFFFF4D", color: "#9DA1A4" },
          }}
          type="submit"
          loading={signupLoading}
          variant="gradient"
          gradient={{ from: "#3077F3", to: "#15AABF", deg: 45 }}
          disabled={!signupForm.isDirty()}
        >
          Sign up as an Attendee
        </Button>

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
          Sign up with Facebook
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
          Sign up with Google
        </Button>
        <Checkbox
          defaultChecked
          label={
            <>
              By signing up you agree to our{" "}
              <Link href={"/terms-of-service"} target="_blank" style={{ color: "#FFFFFFCC" }}>
                Terms & Conditions
              </Link>
            </>
          }
          size="xs"
          fw={300}
          my={"2rem"}
          mx={"auto"}
          styles={{
            label: {
              fontSize: rem(11),
            },
            input: {
              borderRadius: 2,
              borderColor: "#CED4DA",
            },
          }}
          {...signupForm.getInputProps("terms")}
        />
        <Divider />
        <Text ta={"center"} mt="xl" size={"sm"} weight={500}>
          Already a Member?{" "}
          <Link
            href={isCheckout ? "/checkout/auth/signin" : "/auth/login"}
            style={{ fontWeight: "600", color: "#3077F3", textDecoration: "none" }}
          >
            Sign In
          </Link>
        </Text>
      </Flex>
    </form>
  );
};

export const SignupModule = () => (
  <>
    <AuthenticationLayout
      title={"Sign Up"}
      description={"As an Attendee"}
      image={"/img/signup-bg.png"}
    >
      <NovelTHead title="Sign Up" />
      <SignupForm />
    </AuthenticationLayout>
    <BackgroundGradients variant={4} />
  </>
);
