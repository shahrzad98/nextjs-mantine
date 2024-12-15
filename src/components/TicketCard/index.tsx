import { separateByThousands } from "@/utils";
import { Flex, Modal, Text, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import QRCode from "react-qr-code";

import { AppImage } from "@/components";

const cardBackgroundOriginal =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='324' height='294' viewBox='0 0 324 294'%3E%3Cdefs%3E%3ClinearGradient id='linear-gradient' x1='0.512' x2='0.512' y2='1' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%237816ae'/%3E%3Cstop offset='1' stop-color='%233e63e5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath id='Path_5' data-name='Path 5' d='M323,0H-1V234a9,9,0,0,1,9,9,9,9,0,0,1-9,9v32a10,10,0,0,0,8.951,9.946L7.945,294h306.11l-.006-.054A10,10,0,0,0,323,284V252a9,9,0,0,1,0-18Z' transform='translate(1)' fill-rule='evenodd' fill='url(%23linear-gradient)'/%3E%3Cline id='Line_4' data-name='Line 4' x2='298' transform='translate(13 242.5)' fill='none' stroke='rgba(255,255,255,0.8)' stroke-width='1' stroke-dasharray='3 5' opacity='0.4'/%3E%3C/svg%3E%0A";

const cardBackgroundLong =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='324' height='403.974' viewBox='0 0 324 403.974'%3E%3Cdefs%3E%3ClinearGradient id='linear-gradient' x1='-0.052' y1='1.211' x2='0.647' y2='0.109' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0.07' stop-color='%233077f3'/%3E%3Cstop offset='1' stop-color='%2388009e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg id='Group_5' data-name='Group 5' transform='translate(-1498 -170)'%3E%3Cpath id='Path_6' data-name='Path 6' d='M-1,0H323V234a9,9,0,0,0,0,18v32a9,9,0,0,0,0,18s-.016,90.747-.016,92.422a10.04,10.04,0,0,1-2.925,6.543,9.9,9.9,0,0,1-6.449,3c-1.444.014-251.849,0-304.438,0-3.688,0-5.508-1.255-7.8-3.567S-.99,394.535-.99,393.942-1,302-1,302a9,9,0,0,0,9-9,9,9,0,0,0-9-9V252a9,9,0,0,0,9-9,9,9,0,0,0-9-9Z' transform='translate(1499 170)' fill-rule='evenodd' fill='url(%23linear-gradient)'/%3E%3Cline id='Line_6' data-name='Line 6' x2='298' transform='translate(1511 413.5)' fill='none' stroke='rgba(255,255,255,0.8)' stroke-width='1' stroke-dasharray='3 5' opacity='0.4'/%3E%3Cline id='Line_7' data-name='Line 7' x2='298' transform='translate(1511 463.5)' fill='none' stroke='rgba(255,255,255,0.8)' stroke-width='1' stroke-dasharray='3 5' opacity='0.4'/%3E%3C/g%3E%3C/svg%3E%0A";

export interface ITicketCardProps {
  type: "original" | "long";
  currency?: "USD" | "CAD";
  thumbnail: string;
  title: string;
  cadPrice?: number;
  date: string;
  time: string;
  location: string;
  tier?: string;
  admission?: string;
  qrCode?: string;
  seats?: number;
  quantity?: number;
}

export const TicketCard = ({
  type = "original",
  currency = "CAD",
  title,
  thumbnail,
  cadPrice,
  date,
  time,
  location,
  tier,
  admission,
  qrCode,
  seats,
  quantity,
}: ITicketCardProps) => {
  const [qrModalOpened, { open: openQRModal, close: closeQRModal }] = useDisclosure(false);
  const hasQRCode = type === "long";

  return (
    <Flex
      w={324}
      h={hasQRCode ? 544 : 434}
      direction="column"
      onClick={(e) => e.stopPropagation()}
      pos="relative"
    >
      <AppImage
        src={thumbnail}
        height={140}
        width={324}
        alt="Some Image..."
        backgroundColor={false}
        style={{
          objectFit: "cover",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      />
      <Flex
        direction="column"
        align="center"
        gap={0}
        px={20}
        pt={currency === "CAD" ? 19 : 16}
        pb={0}
        h={hasQRCode ? 404 : 294}
        bg={`url("${hasQRCode ? cardBackgroundLong : cardBackgroundOriginal}")`}
      >
        <Text
          color="rgba(255,255,255,0.8)"
          size={20}
          weight="400"
          align="center"
          lh="1.5rem"
          mih="48px"
          mt={0}
          lineClamp={2}
        >
          {title}
        </Text>

        <Flex direction="column" align="center" mt={rem(3)} mb="1.35rem">
          <Flex justify="center" align="center">
            <Text color="rgba(255,255,255,0.8)" size={32} weight={500} lh="2.5rem">
              $ {separateByThousands(cadPrice?.toFixed(2))}
            </Text>
            <Text color="#ffffff" size={14} weight={500} lh="1rem" ml={5}>
              {currency}
            </Text>
          </Flex>
        </Flex>

        <Flex direction="column" justify="center" w="100%">
          <Text color="#FFC600" size={16} weight={600} lh="1.25rem" mb="0.5rem">
            {date}
          </Text>
          <Text color="#ffffff" size={16} weight={400} lh="1.25rem" mb="0.5rem">
            {time}
          </Text>
          <Text color="#ffffff" size={16} weight={400} lh="1.25rem" lineClamp={2} h={40}>
            {location}
          </Text>
        </Flex>
        {hasQRCode && qrCode ? (
          <Flex direction="column" align="center">
            <Text color="#ffffff" size={16} weight={600} mt={31} mb={24} lh="1.25rem">
              {tier}
            </Text>
            <Flex
              w={rem(94)}
              h={rem(94)}
              bg="#ffffff"
              align="center"
              justify="center"
              sx={{ svg: { cursor: "pointer" } }}
            >
              <QRCode size={78} value={qrCode} onClick={openQRModal} />
            </Flex>
          </Flex>
        ) : (
          <Flex direction="column" align="center" mt={16} h={42}>
            <Text
              color="#ffffff"
              size={16}
              weight={600}
              mt={quantity && quantity > 1 ? rem(7) : rem(12)}
              lh={rem(18)}
            >
              {admission?.substring(0, 24)}
            </Text>

            <Text
              color="#FFFFFFB2"
              size={12}
              weight={400}
              lh={quantity && quantity > 1 ? rem(14) : rem(16)}
            >
              {seats} seat{seats && seats > 1 ? "s" : ""} per ticket
            </Text>
            {quantity && quantity > 1 ? (
              <Text
                bg="#ffffff"
                color="#000000"
                lts="0.015em"
                size={12}
                weight={500}
                mt={6}
                lh="1.25rem"
                pl={12}
                pr={12}
                h="20px"
                sx={{
                  borderRadius: 100,
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.08), 0px 1px 1px rgba(0, 0, 0, 0.04)",
                }}
              >
                {quantity} Tickets
              </Text>
            ) : (
              <></>
            )}
          </Flex>
        )}
      </Flex>

      {hasQRCode && qrCode && (
        <Modal
          opened={qrModalOpened}
          onClose={closeQRModal}
          withCloseButton={false}
          size="auto"
          centered
          overlayProps={{
            bg: "rgba(24, 24, 24, 0.86)",
          }}
          styles={{
            content: { backgroundColor: "transparent", boxShadow: "none" },
            overlay: { zIndex: 999 },
            inner: { zIndex: 1000 },
          }}
        >
          <Flex
            align="center"
            justify="end"
            gap={11}
            mb={"1rem"}
            onClick={() => closeQRModal()}
            sx={{ cursor: "pointer" }}
            maw={324}
          >
            <Text weight={300} lh="1.25rem" size="1rem" color="#ffffff">
              Close
            </Text>
            <IconX color="#ffffff" size="1rem" />
          </Flex>
          <Flex w={rem(251)} h={rem(251)} bg="#ffffff" align="center" justify="center">
            <QRCode size={227} value={qrCode} />
          </Flex>
        </Modal>
      )}
    </Flex>
  );
};
