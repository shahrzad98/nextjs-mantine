import { useBreakpoint } from "@/hooks";
import { ActionIcon, Box, Group, Input, Modal, Popover, rem, Text } from "@mantine/core";
import { DatePicker, DatesRangeValue } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { IconCalendar, IconChevronDown, IconX } from "@tabler/icons-react";
import { useState } from "react";

import { useStyles } from "./styles";

interface IEventDateInputProps {
  setDateRange: (dateRange: [Date | null, Date | null]) => void;
  dateRange: [Date | null, Date | null];
  transparentInput?: boolean;
}

export const EventDateInput = ({
  setDateRange,
  dateRange,
  transparentInput = false,
}: IEventDateInputProps) => {
  const { classes } = useStyles();
  const { isMobile, isTablet } = useBreakpoint();

  const [datePopoverOpened, setDatePopoverOpened] = useState(false);

  const [dateDropdownOpened, setDateDropdownOpened] = useState(false);

  const [dateModalOpened, { open: dateModalOpen, close: dateModalClose }] = useDisclosure(false);
  const handleDateChange = (e: DatesRangeValue) => {
    setDateRange([
      e[0]
        ? new Date((e[0]?.getTime() as number) - (e[0]?.getTimezoneOffset() as number) * 60000)
        : null,
      e[1]
        ? new Date((e[1]?.getTime() as number) - (e[1]?.getTimezoneOffset() as number) * 60000)
        : null,
    ]);
  };

  return (
    <>
      <Popover
        width="target"
        position="bottom-start"
        shadow="sm"
        transitionProps={{ transition: "pop" }}
        offset={3}
        opened={dateDropdownOpened}
        onChange={setDateDropdownOpened}
      >
        <Popover.Target>
          <Box
            w={isMobile ? "100%" : isTablet ? 500 : 306}
            onClick={() => setDateDropdownOpened(true)}
          >
            <Input
              component="button"
              icon={
                <IconCalendar
                  size={isMobile ? rem(16) : rem(26)}
                  style={{ left: 6, position: "relative" }}
                />
              }
              rightSection={
                dateRange[0] && dateRange[1] ? (
                  <ActionIcon
                    variant="transparent"
                    onClick={() => {
                      setDateRange([null, null]);
                      setDateDropdownOpened(false);
                    }}
                  >
                    <IconX color="rgba(255, 255, 255, 0.8)" size={isMobile ? rem(16) : rem(24)} />
                  </ActionIcon>
                ) : !isTablet ? (
                  <IconChevronDown size={22} stroke={2} cursor="pointer" />
                ) : null
              }
              rightSectionWidth="2.75rem"
              placeholder="Choose a Date"
              sx={(theme) => ({
                button: {
                  fontSize: isMobile ? rem(14) : rem(16),
                  paddingLeft: "44px!important",
                  background: transparentInput ? theme.colors.nvtPrimary[4] : "",
                  borderColor: transparentInput ? theme.colors.nvtPrimary[6] : "",
                  height: isMobile ? 40 : 59,
                  textWrap: "nowrap",
                },
              })}
            >
              {dateRange[0] && dateRange[1]
                ? `${dateRange[0]?.toLocaleDateString()} - ${dateRange[1]?.toLocaleDateString()}`
                : "All Dates"}
            </Input>
          </Box>
        </Popover.Target>
        <Popover.Dropdown
          sx={(theme) => ({
            padding: 0,
            background: transparentInput ? theme.colors.nvtPrimary[4] : "",
            borderColor: transparentInput ? theme.colors.nvtPrimary[6] : "",
          })}
        >
          <Box style={{ padding: "3px" }}>
            <Text
              className={classes.dateItems}
              size="sm"
              onClick={() => {
                setDateRange([null, null]);
                setDateDropdownOpened(false);
              }}
              color={
                dateRange[0] && dateRange[1]
                  ? "rgba(255, 255, 255, 0.70)"
                  : "rgba(255, 255, 255, 0.30)"
              }
            >
              All Dates
            </Text>
            <Popover
              position="bottom-start"
              shadow="sm"
              transitionProps={{ transition: "pop" }}
              trapFocus
              opened={datePopoverOpened}
              onChange={setDatePopoverOpened}
            >
              <Popover.Target>
                <Group
                  className={classes.dateItems}
                  position="apart"
                  noWrap
                  onClick={() => setDatePopoverOpened(true)}
                >
                  <Text
                    size="sm"
                    onClick={() => {
                      if (isMobile) {
                        dateModalOpen();
                      }
                    }}
                    sx={(theme) => ({
                      flexGrow: 1,
                      color:
                        dateRange[0] && dateRange[1]
                          ? theme.colors.nvtPrimary[0]
                          : "rgba(255, 255, 255, 0.70)",
                    })}
                  >
                    Date Range
                  </Text>
                  <Text
                    className={classes.resetButton}
                    onClick={() => {
                      setDateRange([null, null]);
                      setDatePopoverOpened(false);
                      setDateDropdownOpened(false);
                    }}
                  >
                    Reset
                  </Text>
                </Group>
              </Popover.Target>
              {!isMobile && (
                <Popover.Dropdown bg={"dark.7"} sx={{ border: 0 }}>
                  <Group position="center">
                    <DatePicker
                      value={dateRange}
                      onChange={(e) => {
                        handleDateChange(e);
                        if (e[0] && e[1]) {
                          setDatePopoverOpened(false);
                          setDateDropdownOpened(false);
                        }
                      }}
                      type="range"
                      numberOfColumns={2}
                    />
                  </Group>
                </Popover.Dropdown>
              )}
            </Popover>
          </Box>
        </Popover.Dropdown>
      </Popover>
      {isMobile ? (
        <Modal
          zIndex={999}
          opened={dateModalOpened}
          onClose={dateModalClose}
          withCloseButton={false}
          centered
          size={290}
        >
          <DatePicker
            value={dateRange}
            onChange={(e) => {
              handleDateChange(e);
              if (e[0] && e[1]) {
                dateModalClose();
              }
            }}
            type="range"
          />
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
};
