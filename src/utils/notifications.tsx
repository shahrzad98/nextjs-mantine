import { CustomErrorResponse } from "@/types/http";
import { snakeToTitleCase } from "@/utils/snakeToTitleCase";
import { rem } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { isArray } from "is-what";

interface NotificationProps {
  id?: string;
  title?: string;
  message?: string;
}

const generateNotificationStyles = (backgroundColor: string) => ({
  root: {
    backgroundColor: backgroundColor,
    borderColor: backgroundColor,
    padding: "14.5px 10px",
  },

  title: {
    color: "#FFF",
    fontSize: rem(15),
    fontWeight: 600,
    lineHeight: "155%",
    marginBottom: 0,
  },
  description: { color: "#FFF", fontSize: rem(14), fontWeight: 400, lineHeight: "155%" },
  closeButton: {
    color: "#FFF",
    "&:hover": { backgroundColor: backgroundColor },
  },
  icon: {
    marginRight: rem(10),
  },
});

export function errorNotification(props: NotificationProps | AxiosError) {
  const { title, message } = props as NotificationProps;
  const axiosError = props as AxiosError<CustomErrorResponse>;
  const errors = axiosError?.response?.data.errors;
  const errorMessage = axiosError?.response?.data.message;
  if (errors && !isArray(errors)) {
    for (const item of Object.entries(errors)) {
      notifications.show({
        title: errorMessage,
        message: snakeToTitleCase(item[0]) + " " + item[1],
        withCloseButton: true,
        icon: (
          <svg
            width="28"
            height="29"
            viewBox="0 0 28 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="14" cy="14.5" r="14" fill="white" />
            <path
              d="M19.4336 9.43359L8.93359 19.9336"
              stroke="#E03130"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.93359 9.43359L19.4336 19.9336"
              stroke="#E03130"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        color: "red",
        styles: generateNotificationStyles("#E03130"),
      });
    }
  } else {
    notifications.show({
      title: title || "ERROR",
      message: errorMessage || message || "Something went wrong!",
      withCloseButton: true,
      icon: (
        <svg
          width="28"
          height="29"
          viewBox="0 0 28 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="14" cy="14.5" r="14" fill="white" />
          <path
            d="M19.4336 9.43359L8.93359 19.9336"
            stroke="#E03130"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.93359 9.43359L19.4336 19.9336"
            stroke="#E03130"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: "red",
      styles: generateNotificationStyles("#E03130"),
    });
  }
}

export function successNotification({ id, title, message }: NotificationProps) {
  notifications.show({
    id: id || randomId(),
    title: title ?? "SUCCESSFUL!",
    message: message,
    withCloseButton: true,
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="14" cy="14" r="14" fill="white" />
        <rect width="17" height="17" transform="translate(6 6)" fill="white" />
        <path
          d="M20.1673 10.25L12.3757 18.0417L8.83398 14.5"
          stroke="#43C559"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: "green",
    styles: generateNotificationStyles("#43C559"),
  });
}

export function warningNotification(props: NotificationProps | AxiosError) {
  const { title, message } = props as NotificationProps;
  const error = props as AxiosError<CustomErrorResponse>;
  const errors = error?.response?.data?.errors;
  notifications.show({
    title:
      (errors ? (isArray(errors) ? errors.toString() : Object.values(errors).toString()) : title) ??
      null,
    message: error ? error.message : message ? message : "Something went wrong!",
    withCloseButton: true,
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1164_97079)">
          <path
            d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z"
            fill="white"
          />
          <path
            d="M14 8.40039V14.0004"
            stroke="#F3821A"
            strokeWidth="2.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 19.6016H14.0135"
            stroke="#F3821A"
            strokeWidth="2.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_1164_97079">
            <rect width="28" height="28" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    color: "orange",
    styles: generateNotificationStyles("#F3821A"),
  });
}
