import { useBreakpoint } from "@/hooks";
import { IOrganization, IMyEvent } from "@/types";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Flex,
  Group,
  Input,
  Popover,
  rem,
  Text,
} from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

import { HomeEventCard } from "@/components";
import HomeEventCardSkeleton from "@/components/HomeEventCard/Skeleton/Skeleton";

import { useStyles } from "./styles";

interface ISearchArtistProps {
  src: string;
  text: string;
  alt?: string;
  isMobile?: boolean;
  onClick: () => void;
}

interface IEventSearchInputProps {
  variant?: "list" | "basic";
  artists: IOrganization[];
  events: IMyEvent[];
  isLoading: boolean;
  phrase: string;
  setPhrase: (phrase: string) => void;
  onSubmit: () => void;
  closeModal?: () => void;
  transparentInput?: boolean;
}

export const SearchResultItem = ({ src, text, alt, isMobile, onClick }: ISearchArtistProps) => {
  return (
    <Flex
      align="center"
      px="md"
      py="0.5rem"
      w={isMobile ? "calc(100% - 2px)" : 331}
      h={64}
      mr={isMobile ? 0 : 10}
      mb={10}
      sx={(theme) => ({
        background: "#25262B",
        border: "1px solid #373A3F",
        borderRadius: theme.radius.sm,
        cursor: "pointer",
      })}
      onClick={onClick}
    >
      <Avatar size="md" sx={{ borderRadius: "50%" }} src={src} alt={alt} />
      <Text ml={"0.5rem"}>{text}</Text>
    </Flex>
  );
};

export const EventSearchInput = ({
  variant = "list",
  artists,
  events,
  phrase,
  setPhrase,
  onSubmit,
  isLoading,
  closeModal,
  transparentInput = false,
}: IEventSearchInputProps) => {
  const { classes } = useStyles();
  const router = useRouter();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const [opened, setOpened] = useState(false);

  return variant === "list" ? (
    <Box w={isMobile ? "100%" : isTablet ? 500 : 624}>
      <Popover
        width={!isDesktop ? "target" : undefined}
        position="bottom-start"
        shadow="sm"
        transitionProps={{ transition: "pop" }}
        opened={(phrase && phrase.length > 2 && opened) as boolean}
        onChange={setOpened}
        styles={{
          dropdown: {
            zIndex: 9999,
          },
        }}
      >
        <Popover.Target>
          <Input
            icon={
              <IconSearch
                size={isMobile ? rem(16) : rem(26)}
                onClick={onSubmit}
                cursor="pointer"
                pointerEvents="all"
                style={{ left: 6, position: "relative" }}
              />
            }
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            sx={(theme) => ({
              input: {
                height: isMobile ? 40 : 58,
                fontSize: isMobile ? rem(14) : rem(16),
                paddingLeft: "44px!important",
                background: transparentInput ? theme.colors.nvtPrimary[4] : "",
                borderColor: transparentInput ? theme.colors.nvtPrimary[6] : "",
              },
            })}
            placeholder={`Search Events & Artists ${isDesktop ? "or Teams" : ""}`}
            rightSectionWidth={isMobile ? 48 : 135}
            rightSectionProps={{
              style: {
                justifyContent: "flex-end",
              },
            }}
            rightSection={
              <Flex gap="sm" align="center" direction="row" wrap="wrap" mx={4}>
                {phrase && (
                  <ActionIcon variant="transparent" onClick={() => setPhrase("")}>
                    <IconX color="rgba(255, 255, 255, 0.8)" size={isMobile ? rem(16) : rem(24)} />
                  </ActionIcon>
                )}
                {!isMobile && (
                  <Button
                    className={classes.searchButton}
                    onClick={onSubmit}
                    w={77}
                    sx={{ fontSize: 15 }}
                  >
                    Search
                  </Button>
                )}
              </Flex>
            }
            value={(phrase && decodeURIComponent(phrase)) || ""}
            onChange={(e) => {
              if (e.target.value?.length > 2) {
                setOpened(true);
              }
              setPhrase(encodeURIComponent(e.target.value));
            }}
          />
        </Popover.Target>
        <Popover.Dropdown
          style={{ padding: 0 }}
          sx={(theme) => ({
            background: transparentInput ? theme.colors.nvtPrimary[4] : "",
            borderColor: transparentInput ? theme.colors.nvtPrimary[5] : "",
          })}
        >
          {(artists?.length > 0 || !isMobile) && (
            <Group
              className={classes.resultSection}
              position="left"
              sx={(theme) => ({
                borderColor: transparentInput ? theme.colors.nvtPrimary[5] : "",
              })}
              maw={526}
            >
              <Text className={classes.resultSectionTitle}>
                Artists, Teams and Organizations{" "}
                {!isMobile && (
                  <>
                    -{" "}
                    <span>
                      {artists?.length} Result{artists?.length > 1 && "s"}
                    </span>
                  </>
                )}
              </Text>
              <Flex
                w="100%"
                wrap="nowrap"
                direction="column"
                sx={{ overflow: "auto", img: { borderRadius: "50%" } }}
                mah={160}
                className={classes.customScrollbar}
              >
                {isLoading ? (
                  <HomeEventCardSkeleton isSmall />
                ) : (
                  artists?.map((item) => (
                    <SearchResultItem
                      key={item.id}
                      src={item.cover_photo ?? ""} // item.cover_photo as string
                      text={item.name}
                      alt={item.name}
                      isMobile={isMobile}
                      onClick={() => {
                        router.push(`/marketplace/${item.slug}`);
                        closeModal && closeModal();
                      }}
                    />
                  ))
                )}
              </Flex>
            </Group>
          )}
          {(events?.length > 0 || !isMobile) && (
            <Group className={classes.resultSection} position="left" maw={526}>
              <Text className={classes.resultSectionTitle}>
                Events{" "}
                {!isMobile && (
                  <>
                    -{" "}
                    <span>
                      {events?.length} Result{events?.length > 1 && "s"}
                    </span>
                  </>
                )}
              </Text>
              <Flex
                w="100%"
                mah={160}
                wrap="nowrap"
                direction="column"
                sx={{ overflow: "auto" }}
                className={classes.customScrollbar}
              >
                {isLoading ? (
                  <HomeEventCardSkeleton isSmall />
                ) : (
                  events?.map((event, i) => (
                    <HomeEventCard
                      key={i}
                      variant={isMobile ? "xs" : "sm"}
                      address={event.address}
                      city={event.city}
                      country={event.country}
                      province_state={event.province_state}
                      primary_image={event.primary_image}
                      name={event.name}
                      organization={event.organization}
                      available_tickets={event.available_tickets}
                      start_at={event.start_at}
                      end_at={event.end_at}
                      time_zone={event.time_zone}
                      onClick={() => {
                        router.push(`/event/${event.slug}`);
                        closeModal && closeModal();
                      }}
                    />
                  ))
                )}
              </Flex>
            </Group>
          )}
        </Popover.Dropdown>
      </Popover>
      {isMobile && (
        <Button
          w="100%"
          mt={8}
          h={40}
          radius="sm"
          sx={(theme) => ({
            background: `linear-gradient(45deg, ${theme.colors.nvtPrimary[2]} 0%, ${theme.colors.nvtPrimary[1]} 100%)`,
            fontSize: rem(15),
            fontWeight: 400,
          })}
          onClick={onSubmit}
        >
          Search
        </Button>
      )}
    </Box>
  ) : (
    <>
      <Input
        size="lg"
        icon={<IconSearch size="1.5rem" onClick={onSubmit} cursor="pointer" pointerEvents="all" />}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        sx={(theme) => ({ input: { fontSize: theme.fontSizes.md } })}
        placeholder="Search Events"
        rightSectionWidth={isMobile ? 48 : 132}
        rightSectionProps={{
          style: {
            justifyContent: "flex-end",
          },
        }}
        rightSection={
          <Flex gap="sm" align="center" direction="row" wrap="wrap" mx="0.5rem">
            {phrase && (
              <ActionIcon variant="transparent" onClick={() => setPhrase("")}>
                <IconX color="rgba(255, 255, 255, 0.8)" />
              </ActionIcon>
            )}
            {!isMobile && (
              <Button className={classes.searchButton} onClick={onSubmit}>
                Search
              </Button>
            )}
          </Flex>
        }
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
      />
      <Button
        w="100%"
        mt={5}
        h={40}
        radius="sm"
        sx={{
          background: "linear-gradient(45deg, #3077F3 0%, #15AABF 100%)",
        }}
        onClick={onSubmit}
      >
        Search
      </Button>
    </>
  );
};
