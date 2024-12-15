import {
  Box,
  createStyles,
  Flex,
  Group,
  Input,
  Popover,
  PopoverProps,
  rem,
  Text,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import InputMask from "react-input-mask";

import countryList from "./rawCountries";

const useStyles = createStyles((theme) => ({
  wrapper: {
    height: rem(36),
    width: "100%",
    backgroundColor: "#25262B",
    padding: rem(8),
    border: "1px solid #373A3F",
    display: "flex",
    alignItems: "center",
    borderRadius: rem(4),
  },
  countriesDropdown: {
    maxHeight: rem(200),
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: rem(8),
      borderRadius: rem(16),
      "&:hover": {
        backgroundColor: "#141517",
      },
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      outline: "0",
      borderRadius: rem(16),
    },
  },
  countryItem: {
    height: rem(40),
    display: "flex",
    alignItems: "center",
    borderRadius: rem(4),
    cursor: "pointer",
    padding: "0 12px",
    flexShrink: 0,
    "&:hover": {
      backgroundColor: "rgba(255,255,255, 0.15)",
    },
  },

  empty: {
    height: rem(40),
    display: "flex",
    alignItems: "center",
  },

  error: {
    borderColor: theme.colors.red[8],
  },
}));

interface IPhoneNumberInputProps {
  placeholder?: string;
  label?: string;
  inputProps?: TextInputProps;
  popoverProps?: PopoverProps;
  withAsterisk?: boolean;
  setCountryCode: (code: string) => void;
  initialActiveCode?: string;
}

const countries = countryList.map((item) => ({
  iso: item[2] as string,
  name: item[0] as string,
  code: item[3] as string,
}));

export const PhoneNumberInput = ({
  placeholder,
  label,
  inputProps,
  popoverProps,
  withAsterisk = true,
  setCountryCode,
  initialActiveCode,
}: IPhoneNumberInputProps) => {
  const [opened, setOpened] = useState<boolean>(false);
  const { classes, cx } = useStyles();
  const [active, setActive] = useState<string>("CA");
  const [activeCode, setActiveCode] = useState<string>("1");
  const [filter, setFilter] = useState<string>("");

  const countriesList =
    filter.length > 0
      ? countries.filter(
          (item) =>
            String(item.code)?.includes(filter) ||
            item.name?.toLowerCase().includes(filter?.toLowerCase())
        )
      : countries;

  useEffect(() => {
    if (initialActiveCode) {
      setActive(countries.find((item) => item.code === initialActiveCode)?.iso as string);
    }
  }, [initialActiveCode]);

  const selectCountry = (iso: string) => {
    setOpened(() => {
      setActive(iso);
      setFilter("");
      setCountryCode(countries.find((item) => item.iso === iso)?.code as string);
      setActiveCode(countries.find((item) => item.iso === iso)?.code as string);

      return false;
    });
  };

  return (
    <Input.Wrapper withAsterisk={withAsterisk} label={label}>
      <Box
        className={cx(classes.wrapper, {
          [classes.error]: !!inputProps?.error,
        })}
      >
        <Popover
          trapFocus
          width={rem(280)}
          position="bottom-start"
          shadow="md"
          offset={16}
          opened={opened}
          onChange={setOpened}
          {...popoverProps}
        >
          <Popover.Target>
            <Group
              spacing={rem(6)}
              miw={rem(38)}
              sx={{ cursor: "pointer" }}
              ml={rem(3)}
              onClick={() => setOpened(true)}
            >
              <ReactCountryFlag svg countryCode={active as string} />
              <IconChevronDown size={rem(16)} />
            </Group>
          </Popover.Target>
          <Popover.Dropdown sx={{ transform: "translateX(-10px)" }} p={rem(8)}>
            <Flex direction={"column"} className={classes.countriesDropdown}>
              <TextInput
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search Countries..."
                mb={rem(8)}
              />
              {countriesList.length > 0 &&
                countriesList.map((country) => (
                  <Flex
                    key={country.iso}
                    justify={"space-between"}
                    className={classes.countryItem}
                    onClick={() => selectCountry(country.iso)}
                  >
                    <Group>
                      <ReactCountryFlag svg countryCode={country.iso} />
                      <Text size={rem(14)}>{country.name}</Text>
                    </Group>
                    <Text size={rem(12)} color="#FFFFFFB2">
                      +{country.code}
                    </Text>
                  </Flex>
                ))}

              {countriesList.length === 0 && (
                <Flex justify={"center"} className={classes.empty}>
                  <Text size={rem(12)} color="#FFFFFFB2">
                    No countries found!
                  </Text>
                </Flex>
              )}
            </Flex>
          </Popover.Dropdown>
        </Popover>
        <InputMask
          mask={`+${
            activeCode.replaceAll("9", "\\9") + " ".repeat(4 - activeCode.length)
          } (999) 999-9999`}
          value={inputProps?.value}
          onChange={inputProps?.onChange}
          disabled={false}
          maskChar={null}
        >
          <Input disabled={false} ml={rem(8)} placeholder={placeholder} variant="unstyled" />
        </InputMask>
      </Box>
      {inputProps?.error && <Input.Error mt={rem(5)}>{inputProps.error}</Input.Error>}
    </Input.Wrapper>
  );
};
