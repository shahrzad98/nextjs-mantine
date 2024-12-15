import { invalidateTicket } from "@/api/handler/operator";
import { useBreakpoint } from "@/hooks";
import { CustomErrorResponse, isHttpError } from "@/types/http";
import { IMyEvent } from "@/types/organization";
import {
  errorNotification,
  successNotification,
  warningNotification,
  getEventDateTimeInfo,
} from "@/utils";
import { Box, Flex, Grid, rem, Text, ThemeIcon } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Html5QrcodeResult } from "html5-qrcode";
import { FC, useEffect, useRef, useState } from "react";

import { OperatorEventCard } from "@/components";

import Html5QrcodePlugin from "./Html5QrcodePlugin";

interface IAttendeeCardProps {
  tier: string;
  firstName: string;
  lastName: string;
  email: string;
}

type status = "success" | "fail" | "duplicate" | undefined;

interface IOperatorScannerModuleProps {
  eventData: IMyEvent;
  isEventDataSuccess: boolean;
  isEventDataLoading: boolean;
  eventDataError: CustomErrorResponse | null;
}

export const OperatorScannerModule: FC<IOperatorScannerModuleProps> = ({
  eventDataError,
  isEventDataSuccess,
  isEventDataLoading,
  eventData,
}) => {
  const { isMobile } = useBreakpoint();
  const [activeCamera, setActiveCamera] = useState<boolean>(false);
  const bottomRef = useRef<null | HTMLDivElement>(null);
  const [status, setStatus] = useState<status>(undefined);
  const [attendeeData, setAttendeeData] = useState<IAttendeeCardProps | undefined>(undefined);

  const DEBOUNCER_TIMEOUT = 5000;

  dayjs.extend(utc);
  dayjs.extend(timezone);

  const cardData = (event: IMyEvent) => {
    const { weekday, date, startTime, endTime } = getEventDateTimeInfo(
      event.start_at,
      event.end_at,
      event.time_zone?.utc_offset
    );

    return {
      id: event.id,
      ticketsLeft: event.available_tickets || 0,
      image: event.primary_image,
      date: `${weekday}, ${date}`,
      time: `${startTime} - ${endTime} ${event.time_zone.abbr}`,
      title: event.name,
      address: event.address,
      city: event.city,
      province_state: event.province_state,
      country: event.country,
    };
  };

  useEffect(() => {
    if (isHttpError(eventDataError)) {
      errorNotification(eventDataError);
    }
  }, [eventDataError]);

  // Using mutation observer to detect scanner's status
  const callback = (mutationList: MutationRecord[]) => {
    if (
      !activeCamera &&
      mutationList.find(
        (item: MutationRecord) =>
          (item?.target as HTMLElement)?.id === "html5-qrcode-button-camera-start"
      )
    ) {
      setActiveCamera(true);
    }
    if (
      mutationList.find(
        (item: MutationRecord) =>
          (item?.target as HTMLElement)?.id === "html5-qrcode-anchor-scan-type-change"
      )
    ) {
      setStatus(undefined);
    }
  };

  // Initializing mutation observer
  useEffect(() => {
    const targetNode = document.getElementById("html5qr-code-full-region");

    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode as HTMLElement, config);

    return () => {
      observer.disconnect();
    };
  }, [callback]);

  let debouncerActive = false;

  const onNewScanResult = (decodedText: string, _result: Html5QrcodeResult) => {
    if (!debouncerActive) {
      onInvalidateTicket({ code: decodedText });
      debouncerActive = true;
      setTimeout(() => {
        debouncerActive = false;
      }, DEBOUNCER_TIMEOUT);
    }
  };

  const { mutate: onInvalidateTicket } = useMutation(
    ({ code }: { code: string }) => invalidateTicket(code, eventData?.id),
    {
      onSuccess: ({ data }) => {
        setStatus("success");
        successNotification({ title: "Success!", message: "Valid ticket." });

        setAttendeeData({
          tier: data?.ticket_tier?.name,
          firstName: data?.first_name || data?.attendee?.first_name,
          lastName: data?.last_name || data?.attendee?.last_name,
          email: data?.email || data?.attendee?.email,
        });

        if (isMobile) {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      },
      onError: (error: AxiosError<CustomErrorResponse>) => {
        if (error?.response?.status === 404) {
          setStatus("fail");
          errorNotification({
            title: "Failure",
            message: "Invalid ticket.",
          });
        }

        if (error?.response?.status === 422) {
          setStatus("duplicate");
          warningNotification({
            title: "Already Validated!",
            message: "Ticket has been scanned before.",
          });
        }
      },
    }
  );

  const EventCard = () => (
    <Grid.Col xs={12} md={3} key={"event-card"} p={isMobile ? 0 : undefined}>
      {!isEventDataLoading && isEventDataSuccess && <OperatorEventCard {...cardData(eventData)} />}
      {status === "success" && attendeeData && (
        <Flex
          direction={"column"}
          mt={rem(36)}
          px={rem(16)}
          py={rem(24)}
          bg={"#25262B"}
          sx={{ borderRadius: rem(4) }}
        >
          <Text
            mb={rem(10)}
            color="rgba(255, 255, 255, 0.50)"
            size={rem(14)}
            fw={400}
            tt={"uppercase"}
          >
            {attendeeData.tier}
          </Text>
          <Text size={rem(20)} weight={500} color="#fff">
            {attendeeData.firstName}
          </Text>
          <Text size={rem(20)} weight={500} color="#fff">
            {attendeeData.lastName}
          </Text>
          <Text size={rem(20)} weight={500} color="#fff">
            {attendeeData.email}
          </Text>
        </Flex>
      )}
    </Grid.Col>
  );

  return (
    <Grid gutter={rem(25)} p={rem(24)} m={0}>
      {(!isMobile || (isMobile && !activeCamera)) && <EventCard />}

      <Grid.Col
        md={9}
        xs={12}
        key={"qr-scanner"}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          w={isMobile ? 320 : 400}
          pos={"relative"}
          sx={{
            video: {
              borderRadius: rem(30),
              marginBottom: rem(24),
            },
            "& #qr-shaded-region": {
              borderRadius: rem(30),
            },
            "& #html5qr-code-full-region": {
              border: "0 !important",
              button: {
                height: rem(44),
                padding: "0 18px",
                borderRadius: rem(4),
                backgroundColor: "transparent",
                color: "#3077F3",
                border: "1px solid #3077F3",
                cursor: "pointer",
              },
              "& #html5-qrcode-button-file-selection": {
                marginBottom: rem(20),
                height: "auto",
                paddingTop: rem(12),
                paddingBottom: rem(12),
                lineHeight: "1.6",
              },
              "& > div:first-of-type": {
                display: "none",
              },
              "& #html5qr-code-full-region__scan_region": {
                img: {
                  filter: "invert(1)",
                  marginTop: rem(24),
                  marginBottom: rem(32),
                },
              },
              "& #html5qr-code-full-region__dashboard_section > div > div:nth-of-type(2)": {
                padding: `${isMobile ? `${rem(30)} ${rem(10)}` : rem(30)} !important`,
                border: "1px dashed #E981FA !important",
                borderRadius: rem(4),
                marginBottom: `${rem(40)} !important`,
                minWidth: rem(238),
              },
              "& #html5qr-code-full-region__dashboard_section_csr": {
                marginBottom: rem(30),
              },
              "& #html5-qrcode-anchor-scan-type-change": {
                color: "#3077F3",
              },
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9,
            }}
            mt={rem(72)}
          >
            {status === "success" && (
              <ThemeIcon color="green" radius={"50%"} size={rem(42)}>
                <IconCheck size="1.75rem" />
              </ThemeIcon>
            )}
            {status === "fail" && (
              <ThemeIcon color="red" radius={"50%"} size={rem(42)}>
                <IconX size="1.75rem" />
              </ThemeIcon>
            )}
          </Box>
          <Html5QrcodePlugin
            config={{
              fps: 30,
              aspectRatio: 1,
              qrbox: 250,
              disableFlip: false,
            }}
            elementId="html5qr-code-full-region"
            qrCodeSuccessCallback={onNewScanResult}
            qrCodeErrorCallback={() =>
              !document.getElementById("qr-shaded-region") &&
              errorNotification({ message: "QR Code could not be detected in the image" })
            }
            key={`qr-code`}
          />
        </Box>
      </Grid.Col>

      {isMobile && activeCamera && <EventCard />}

      <Box ref={bottomRef} />
    </Grid>
  );
};
