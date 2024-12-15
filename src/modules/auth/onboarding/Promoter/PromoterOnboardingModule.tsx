import { updatePromoterMyAccount } from "@/api/handler";
import { useBreakpoint } from "@/hooks";
import userStore from "@/stores/userStore";
import { isHttpError } from "@/types";
import { ICurrentUser, IDefaultRequest, IPromoterAccountRequest } from "@/types/user";
import { errorNotification } from "@/utils";
import { Button, Container, Divider, Flex, Group, TextInput, Text, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { KeyboardEvent } from "react";

import { NovelTHead, NVTLayout } from "@/components";

export const PromoterOnboardingModule = () => {
  const { isMobile } = useBreakpoint();
  const router = useRouter();

  const currentUser = userStore((state) => state.currentUser);
  const setUser = userStore((state) => state.setUser);

  const setupForm = useForm({
    initialValues: {
      username: "",
      first_name: "",
      last_name: "",
    },
    validate: {
      username: (value) => (value ? null : "Username should not be empty"),
      first_name: (value) =>
        value.replace(/\s/g, "").length === 0
          ? "First Name is required!"
          : !/^[^#%@&*:<>?/{|}]+$/.test(value)
          ? "First Name should not contain any special characters!"
          : null,
      last_name: (value) =>
        value.replace(/\s/g, "").length === 0
          ? "Last Name is required!"
          : !/^[^#%@&*:<>?/{|}]+$/.test(value)
          ? "Last Name should not contain any special characters!"
          : null,
    },
  });

  const { mutate: handleSetup } = useMutation(
    (values: Partial<IPromoterAccountRequest>) => updatePromoterMyAccount(values),
    {
      onSuccess: () => {
        const updatedUser = {
          ...currentUser,
          data: {
            ...currentUser?.data,
            username: setupForm.values.username,
            first_name: setupForm.values.first_name,
            last_name: setupForm.values.last_name,
          },
        };
        setUser(updatedUser as ICurrentUser);
        router.push("/promoter");
      },
      onError: (error: AxiosError<IDefaultRequest>) => {
        isHttpError(error) && errorNotification(error);
      },
    }
  );

  const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <NVTLayout backgroundGradientVariant={12}>
      <NovelTHead title="Promoter Info" />
      <Container
        size={!isMobile ? rem(1042) : "xs"}
        mih={"75vh"}
        px={isMobile ? rem(24) : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form
          onSubmit={setupForm.onSubmit((values) => handleSetup(values))}
          onKeyDown={(e) => checkKeyDown(e)}
        >
          <Flex
            direction={"column"}
            w={isMobile ? "100%" : rem(306)}
            mx={"auto"}
            my={!isMobile ? rem(110) : rem(32)}
          >
            <Divider mb={rem(25)} label="Basic Info" labelProps={{ size: "14px" }} />
            <TextInput
              label="Username"
              placeholder="example2"
              {...setupForm.getInputProps("username")}
            />
            <Text mb={rem(44)} fz={rem(10)} lh={rem(17)} mt={2} fw={300} c={"#FFFFFF80"}>
              This field accepts only alphanumeric characters and is case-insensitive, automatically
              converting any uppercase entries to lowercase.
            </Text>
            <TextInput
              label="First Name"
              placeholder="Name"
              mb={rem(20)}
              {...setupForm.getInputProps("first_name")}
            />

            <TextInput
              label="Last Name"
              placeholder="Last name"
              mb={rem(55)}
              {...setupForm.getInputProps("last_name")}
            />

            <Group position="center">
              <Button
                size="md"
                variant="gradient"
                gradient={{ from: "#3077F3", to: "#15AABF" }}
                fw={"400"}
                type="submit"
                disabled={!setupForm.isDirty()}
                fullWidth={isMobile}
              >
                Continue
              </Button>
            </Group>
          </Flex>
        </form>
      </Container>
    </NVTLayout>
  );
};
