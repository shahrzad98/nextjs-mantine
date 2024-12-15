import { sendOrganizationContactRequest } from "@/api/handler/organization";
import { CustomErrorResponse } from "@/types";
import { IOrganizationContactForm } from "@/types/organization";
import {
  emailRegex,
  errorNotification,
  normalizeMaskedNumber,
  specialCharacterRegex,
  phoneNubmerRegex,
  successNotification,
} from "@/utils";
import { Button, TextInput, createStyles, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useState } from "react";

import { PhoneNumberInput } from "@/components";

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    width: "33.333%",
    gap: rem(20),
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },
  text: {
    color: "#FFFFFFB2",
  },
  button: {
    fontSize: rem(15),
    fontWeight: 400,
    width: rem(120),
    height: rem(44),
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },
}));

const ForOrganizerForm = () => {
  const { classes } = useStyles();

  const [countryCode, setCountryCode] = useState<string>("1");

  const form = useForm({
    initialValues: { name: "", email: "", phone: "", organization: "" },

    validate: {
      name: (value) =>
        value.replace(/\s/g, "").length < 2
          ? "Name must have at least 2 letters"
          : specialCharacterRegex.test(value)
          ? "Name should not contain any special characters!"
          : null,
      email: (value) => (emailRegex.test(value) ? null : "Invalid email"),
      phone: (value) =>
        phoneNubmerRegex.test(normalizeMaskedNumber(value)) || !normalizeMaskedNumber(value)
          ? null
          : "Invalid Phone Number",
      organization: (value) =>
        value.replace(/\s/g, "").length < 2
          ? "Organization name must have at least 2 letters"
          : specialCharacterRegex.test(value)
          ? "Organization name should not contain any special characters!"
          : null,
    },

    transformValues: (values) => ({
      ...values,
      phone: `${countryCode}-${normalizeMaskedNumber(values.phone)}`,
    }),
  });

  const { mutate: handleSubmit } = useMutation(
    (data: IOrganizationContactForm) =>
      sendOrganizationContactRequest(data).then((res) => res.data),
    {
      onSuccess: () => {
        successNotification({
          title: "Successful",
          message: `Your request has been submitted. We will contact you shortly.`,
        });
      },
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
    }
  );

  return (
    <form className={classes.wrapper} onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <TextInput label="Name" withAsterisk {...form.getInputProps("name")} />
      <TextInput label="Email" withAsterisk {...form.getInputProps("email")} />
      <PhoneNumberInput
        label="Phone"
        placeholder="(506) 234-5678"
        inputProps={{ ...form.getInputProps("phone") }}
        setCountryCode={setCountryCode}
        withAsterisk={false}
      />
      <TextInput label="Organization" withAsterisk {...form.getInputProps("organization")} />
      <Button
        variant="gradient"
        gradient={{ from: "#3077F3", to: "#15AABF" }}
        type="submit"
        className={classes.button}
      >
        Let’s Talk
      </Button>
    </form>
  );
};

export default ForOrganizerForm;
