import { getPromoterMyAccount, updatePromoterMyAccount } from "@/api/handler/promoter";
import { useBreakpoint } from "@/hooks";
import { SettingsSection } from "@/modules";
import userStore from "@/stores/userStore";
import { IPromoterAccountRequest, isHttpError } from "@/types";
import { errorNotification, getChangedFormValues, successNotification } from "@/utils";
import { promoterMyAccountKey } from "@/utils/queryKeys";
import { Button, Container, Grid, rem, TextInput, Title, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const PromoterSettings = () => {
  const theme = useMantineTheme();

  const { isTablet } = useBreakpoint();

  const currentUser = userStore((state) => state.currentUser);
  const setUser = userStore((state) => state.setUser);

  const { getInputProps, setValues, onSubmit, isDirty, resetDirty } = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
  });

  const queryClient = useQueryClient();

  const { data, isSuccess, error } = useQuery(
    [promoterMyAccountKey],
    () => getPromoterMyAccount().then((res) => res.data),
    {
      initialData: queryClient.getQueryData([promoterMyAccountKey]),
    }
  );

  useEffect(() => {
    isHttpError(error) && errorNotification(error);
  }, [error]);

  useEffect(() => {
    if (!currentUser) return;

    if (isSuccess) {
      setUser({
        token: currentUser?.token,
        expiry: currentUser?.expiry as number,
        role: currentUser?.role,
        data: { ...currentUser?.data, ...data },
      });

      setValues(data);
      resetDirty(data);
    }
  }, [data, isSuccess]);

  const { mutate: updateMyAccount, isLoading: updateLoading } = useMutation(
    (data: Partial<IPromoterAccountRequest>) =>
      updatePromoterMyAccount(data).then((res) => res.data),
    {
      onSuccess: (data) => {
        successNotification({ message: "Your Account Has Been Updated." });

        if (!currentUser) return;

        setUser({
          token: currentUser?.token,
          expiry: currentUser?.expiry as number,
          role: currentUser?.role,
          data: { ...currentUser?.data, ...data },
        });

        resetDirty({ first_name: data.first_name, last_name: data.last_name, email: data.email });
        queryClient.setQueryData([promoterMyAccountKey], data);
      },
      onError: (error) => {
        isHttpError(error) && errorNotification(error);
      },
    }
  );

  return (
    <Container
      maw={rem(1186)}
      my={rem(24)}
      pt={!isTablet ? 0 : rem(55)}
      px={rem(isTablet ? 27 : 16)}
    >
      {!isTablet && (
        <Title
          order={3}
          fz={24}
          fw={500}
          color="rgba(255, 255, 255, 0.80)"
          mt={rem(20)}
          mb={rem(35)}
        >
          My Account
        </Title>
      )}
      <form onSubmit={onSubmit((data) => updateMyAccount(getChangedFormValues(data, isDirty)))}>
        <Grid gutter={rem(22)} gutterLg={rem(80)}>
          <Grid.Col span={12} md={4}>
            <SettingsSection title="Promoter Details">
              <TextInput
                label="Email"
                icon={<IconCheck size={rem(18)} color={theme.colors.green[7]} />}
                variant="filled"
                readOnly
                sx={{
                  input: {
                    background: "#282B3D",
                    color: "rgba(255, 255, 255, 0.70)",
                  },
                }}
                {...getInputProps("email")}
              />
              <TextInput
                label="Username"
                variant="filled"
                readOnly
                sx={{
                  input: {
                    background: "#282B3D",
                    color: "rgba(255, 255, 255, 0.70)",
                  },
                }}
                value={currentUser?.data?.username}
              />
              {!isTablet && (
                <Button
                  size="md"
                  variant="gradient"
                  gradient={{ from: "#3077F3", to: "#15AABF", deg: 45 }}
                  fz={rem(15)}
                  py={rem(8.5)}
                  px={rem(18)}
                  sx={{ fontWeight: 400 }}
                  mt={rem(20)}
                  w="max-content"
                  type="submit"
                  disabled={!isDirty()}
                  loading={updateLoading}
                >
                  Save
                </Button>
              )}
            </SettingsSection>
          </Grid.Col>
          <Grid.Col span={12} md={4}>
            <SettingsSection title="Personal Information">
              <TextInput
                label="First Name"
                sx={{
                  input: { color: "rgba(255, 255, 255, 0.70)" },
                  label: { color: "rgba(255, 255, 255, 0.70)" },
                }}
                {...getInputProps("first_name")}
              />
              <TextInput
                label="Last Name"
                sx={{
                  input: { color: "rgba(255, 255, 255, 0.70)" },
                  label: { color: "rgba(255, 255, 255, 0.70)" },
                }}
                {...getInputProps("last_name")}
              />
              {isTablet && (
                <Button
                  size="md"
                  variant="gradient"
                  gradient={{ from: "#3077F3", to: "#15AABF", deg: 45 }}
                  fz={rem(15)}
                  sx={{ fontWeight: 400 }}
                  mt={rem(36)}
                  type="submit"
                  disabled={!isDirty()}
                  loading={updateLoading}
                >
                  Save
                </Button>
              )}
            </SettingsSection>
          </Grid.Col>
        </Grid>
      </form>
    </Container>
  );
};
