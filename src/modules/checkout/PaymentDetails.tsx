import { useBreakpoint } from "@/hooks";
import { separateByThousands } from "@/utils";
import { Box, Divider, Flex, Text, Tooltip, rem } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";

interface IPaymentDetails {
  quantity: number;
  subtotal: number;
  fees: number;
  amount: number;
  taxAmount: number;
  taxPercentage: number;
  conversionFee: number;
  hasTax: boolean;
  hasConversion: boolean;
  rate: number;
}

export const PaymentDetails = ({
  quantity,
  subtotal,
  fees,
  amount,
  taxAmount,
  taxPercentage,
  hasTax,
  hasConversion,
  conversionFee,
  rate,
}: IPaymentDetails) => {
  const { isTablet } = useBreakpoint();

  const billingAddressCountry =
    process.env.NEXT_PUBLIC_REGION === "US" ? "Canada" : "the United States";

  return (
    <Box bg={isTablet ? "none" : "nvtPrimary.4"} sx={{ borderRadius: rem(4) }}>
      <Flex
        justify={"space-between"}
        align={"center"}
        w={290}
        px={rem(isTablet ? 0 : 20)}
        py={rem(12)}
        mt={rem(9)}
      >
        <Text size={rem(14)} lh={rem(20)} fw={"400"}>
          Subtotal Qty {quantity}
        </Text>
        <Text size={rem(14)} lh={rem(20)} fw={"400"}>
          ${" "}
          {separateByThousands(hasConversion ? (subtotal / rate).toFixed(2) : subtotal.toFixed(2))}
        </Text>
      </Flex>

      <Flex
        justify={"space-between"}
        align={"center"}
        w={290}
        px={rem(isTablet ? 0 : 20)}
        py={rem(12)}
      >
        <Text size={rem(14)} lh={rem(20)} fw={"400"}>
          novelT Fee
        </Text>
        <Text size={rem(14)} lh={rem(20)} fw={"400"}>
          $ {separateByThousands(hasConversion ? (fees / rate).toFixed(2) : fees.toFixed(2))}
        </Text>
      </Flex>

      {hasTax && (
        <Flex
          justify={"space-between"}
          align={"center"}
          w={290}
          px={rem(isTablet ? 0 : 20)}
          py={rem(12)}
        >
          <Text size={rem(14)} lh={rem(20)} fw={"400"}>
            Sales tax ({taxPercentage}%)
          </Text>
          <Text size={rem(14)} lh={rem(20)} fw={"400"}>
            $ {separateByThousands(taxAmount.toFixed(2))}
          </Text>
        </Flex>
      )}

      {hasConversion && (
        <Flex
          justify={"space-between"}
          align={"center"}
          w={290}
          px={rem(isTablet ? 0 : 20)}
          py={rem(12)}
        >
          <Text
            size={rem(14)}
            lh={rem(20)}
            fw={"400"}
            sx={{ display: "flex", alignItems: "center" }}
          >
            Conversion Fee
            <Tooltip
              multiline
              w={rem(207)}
              label={`Since your billing address is in ${billingAddressCountry} and our prices are listed in ${
                process.env.NEXT_PUBLIC_REGION === "US" ? "USD" : "CAD"
              }, an approximate conversion fee will be applied to the total amount due.`}
              styles={{
                tooltip: {
                  backgroundColor: "#282B3D",
                  color: "#fff",
                  padding: rem(12),
                },
              }}
              position="bottom-start"
              transitionProps={{ transition: "pop-bottom-right" }}
              events={{ hover: true, focus: true, touch: true }}
            >
              <IconExclamationCircle
                size={rem(14)}
                style={{
                  cursor: "pointer",
                  marginLeft: 3,
                }}
              />
            </Tooltip>
          </Text>
          <Text size={rem(14)} lh={rem(20)} fw={"400"}>
            ${" "}
            {separateByThousands(
              hasConversion ? (conversionFee / rate).toFixed(2) : conversionFee.toFixed(2)
            )}
          </Text>
        </Flex>
      )}

      <Divider w={"100%"} maw={328} />

      <Flex
        justify={"space-between"}
        align={"center"}
        w={290}
        px={rem(isTablet ? 0 : 20)}
        py={rem(12)}
      >
        <Text size={rem(14)} lh={rem(20)} fw={"500"}>
          Total Amount Due
        </Text>
        <Text size={rem(14)} lh={rem(20)} fw={"500"}>
          $ {separateByThousands(hasConversion ? (amount / rate).toFixed(2) : amount.toFixed(2))}
        </Text>
      </Flex>
    </Box>
  );
};
