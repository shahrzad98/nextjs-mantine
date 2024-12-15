import { checkOrganizationName, updateOrganizerSettings } from "@/api/handler/auth";
import { useBreakpoint } from "@/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import userStore from "@/stores/userStore";
import { isHttpError } from "@/types";
import { ICurrentUser, IDefaultRequest, IOrganizatonSettings } from "@/types/user";
import { errorNotification } from "@/utils";
import {
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Loader,
  TextInput,
  Title,
  Text,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { KeyboardEvent, useEffect, useState } from "react";

import { NovelTHead, NVTLayout } from "@/components";

export const OnboardingSetupModule = () => {
  const { isMobile } = useBreakpoint();
  const router = useRouter();

  const [organizationName, setOrganizationName] = useState<string | null>(null);

  const { data } = useQuery(
    ["url", organizationName],
    () => checkOrganizationName(organizationName as string),
    {
      enabled: Boolean(organizationName),
    }
  );

  const onChangeDebounced = async (name: string) => {
    setOrganizationName(name);
  };

  const onNameChangeDebounced = useDebounce(onChangeDebounced);

  const currentUser = userStore((state) => state.currentUser);
  const setUser = userStore((state) => state.setUser);

  const setupForm = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) => (value ? null : "Name should not be empty"),
    },
  });

  useEffect(() => {
    onNameChangeDebounced(setupForm.values.name);
  }, [setupForm.values.name]);

  const { mutate: handleSetup } = useMutation(
    (values: Partial<IOrganizatonSettings>) => updateOrganizerSettings(values),
    {
      onSuccess: () => {
        const updatedUser = {
          ...currentUser,
          data: {
            ...currentUser?.data,
            organization: {
              ...currentUser?.data?.organization,
              name: setupForm.values.name,
              slug: organizationName,
            },
          },
        };
        setUser(updatedUser as ICurrentUser);
        router.push("/organization/auth/onboarding/account-setup");
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
      <NovelTHead title="Organization Info" />
      <Container
        size={!isMobile ? rem(1042) : "xs"}
        mih={"75vh"}
        px={isMobile ? rem(24) : undefined}
      >
        <Title
          size={isMobile ? rem(18) : rem(24)}
          fw={"500"}
          color="rgba(255, 255, 255, 0.8)"
          mt={20}
        >
          Organization Info
        </Title>
        <form
          onSubmit={setupForm.onSubmit((values) => handleSetup(values))}
          onKeyDown={(e) => checkKeyDown(e)}
        >
          <Flex direction={"column"} w={isMobile ? "100%" : rem(306)} mx={"auto"} my={rem(64)}>
            <Divider mb={rem(25)} label="Basic Info" labelProps={{ size: "14px" }} />
            <TextInput
              label="Organization Name"
              placeholder="Organization Name"
              {...setupForm.getInputProps("name")}
            />
            <Text mb={rem(32)} fz={rem(10)} lh={rem(17)} mt={2} fw={300} c={"#FFFFFF80"}>
              This field should contain only alphanumeric characters and spaces
            </Text>
            <TextInput
              label="URL"
              placeholder="URL"
              value={`novelt.io/marketplace/${data?.data || ""}`}
              readOnly
              variant="filled"
              mb={rem(55)}
              rightSection={organizationName && !data ? <Loader size="xs" /> : undefined}
              styles={{
                input: {
                  backgroundColor: "#282B3D",
                },
              }}
            />

            <Group position="center">
              <Button
                size="md"
                variant="gradient"
                gradient={{ from: "#3077F3", to: "#15AABF" }}
                fw={"400"}
                type="submit"
                disabled={!setupForm.isDirty() && !data}
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
