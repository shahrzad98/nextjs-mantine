import { Flex, Text, createStyles, rem } from "@mantine/core";
import React from "react";

import FaqData from "../faq-data";

const useStyles = createStyles((theme) => ({
  TextWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: rem(36),
    padding: "10px 150px",
    fontSize: rem(16),
    marginBottom: rem(66),
    color: "#FFFFFFCC",
    [theme.fn.smallerThan("sm")]: {
      padding: "8px 37px",
      fontSize: rem(14),
      gap: rem(20),
    },
  },
}));

const FaqText = () => {
  const { classes } = useStyles();

  return (
    <Flex className={classes.TextWrapper}>
      <Text>{`Here are some frequently asked questions about NOVELT INC`}</Text>
      {FaqData.map((item, i) => (
        <Flex direction="column" gap={rem(6)} key={i}>
          <Text key={item.id} color="#7791F9">
            {item.question}
          </Text>
          <Text key={item.id}>{item.answer}</Text>
        </Flex>
      ))}
      <Flex direction={"column"} gap={rem(22)}>
        <Text>{`In general, our policy is as follows:`}</Text>
        <Text>{`If the event is canceled, postponed, or rescheduled, you will be eligible for a full refund. We will work with event organizers to issue refunds as quickly as possible.`}</Text>
        <Text>{`If you are unable to attend an event due to personal circumstances, we will evaluate each request on a case-by-case basis. Please contact our customer support team as soon as possible to request a refund.`}</Text>
        <Text>{`If a refund is approved, the amount refunded will be returned to the original form of payment. Please note that it may take several business days for the refund to appear in your account.`}</Text>
        <Text>{`As novelT is partnered with Stripe, our payment processor, refunds may be subject to Stripe's policies and procedures. This may impact the timing of the refund or the method of payment. We will work closely with Stripe to ensure that refunds are issued promptly and accurately.`}</Text>
        <Text>{`If you have any questions or concerns about our refund policy, please do not hesitate to contact our customer support team. We are committed to ensuring that you have a positive experience with novelT, and we will do everything we can to assist you with your refund request.`}</Text>
      </Flex>
    </Flex>
  );
};

export default FaqText;
