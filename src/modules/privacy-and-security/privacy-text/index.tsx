import { Box, Flex, Text, createStyles, rem } from "@mantine/core";
import React from "react";

const useStyles = createStyles((theme) => ({
  TextWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: rem(30),
    padding: "10px 150px",
    fontSize: rem(16),
    marginBottom: rem(146),
    [theme.fn.smallerThan("sm")]: {
      padding: "8px 37px",
      fontSize: rem(16),
      gap: rem(20),
    },
  },
}));

const PrivacySecurityText = () => {
  const { classes } = useStyles();

  return (
    <Flex className={classes.TextWrapper}>
      <Text>{`NOVELT INC ("us", "we", or "our") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and disclose information when you use our ticketing platform and related services (the "Services").`}</Text>
      <Box>
        <Text>{`Collection of Information`}</Text>
        <Text>
          {`We collect information you provide directly to us, such as your name, email address, phone number, and payment information when you create an account, purchase tickets, or communicate with us. We also collect information about the events you attend or are interested in, and any content you upload or share through the Services. We may automatically collect certain information when you access or use our Services, such as your IP address, browser type, operating system, and device information. We may also collect information about your use of our Services, such as the pages you view, the links you click, and the searches you conduct.`}
        </Text>
      </Box>
      <Box>
        <Text>{`Use of Information`}</Text>
        <Text>
          {`We may use the information we collect to provide and improve our Services, communicate with you about your account and events, send you promotional emails and newsletters, and personalize your experience. We may also use the information for research and analytics purposes, and to comply with legal obligations.`}
        </Text>
      </Box>
      <Box>
        <Text>{`Sharing of Information`}</Text>
        <Text>
          {`We may share your information with event organizers and venues, payment processors, service providers, and other third parties as necessary to provide the Services. We may also share your information in response to legal requests, to protect our rights or the rights of others, or in connection with a business transaction such as a merger or acquisition.`}
        </Text>
      </Box>
      <Text>
        {`We may aggregate and de-identify information collected through the Services and use it for
        any purpose.`}
      </Text>
      <Box>
        <Text>{`Your Choices`}</Text>
        <Text>
          {`You may update or correct your account information at any time by logging into your account. You may also unsubscribe from promotional emails by following the instructions in the email or contacting us directly.`}
        </Text>
      </Box>
      <Box>
        <Text>{`Security`}</Text>
        <Text>
          {`We take reasonable measures to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.`}
        </Text>
      </Box>
      <Box>
        <Text>{`Children’s Privacy`}</Text>
        <Text>
          {`Our Services are not intended for use by children under the age of 13, and we do not knowingly collect personal information from children under the age of 13. If we become aware that we have collected personal information from a child under the age of 13, we will take steps to delete the information as soon as possible.`}
        </Text>
      </Box>
      <Box>
        <Text>{`Changes to this Policy`}</Text>
        <Text>
          {`We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our website prior to the change becoming effective. Your continued use of our Services after the effective date of the revised Privacy Policy constitutes your acceptance of the terms.`}
        </Text>
      </Box>
      <Box>
        <Text>{`Contact Us`}</Text>
        <Text>
          {`If you have any questions or concerns about this Privacy Policy, please contact us at [insert contact information].`}
        </Text>
      </Box>
    </Flex>
  );
};

export default PrivacySecurityText;
