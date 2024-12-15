import { Flex, Text } from "@mantine/core";
import React from "react";

const BeginningText = () => {
  return (
    <Flex gap="lg" direction="column">
      <Text>{`Accepting These Terms:`}</Text>
      <Text>{`Terms and Conditions for NOVELT INC`}</Text>
      <Text>
        {`Welcome to NOVELT INC, a ticketing company that provides online platforms for event
        organizers to create, manage and sell tickets to events. These terms and conditions
        ("Terms") govern your use of our website, mobile applications, and other services
        (collectively, the "Services"). By accessing or using our Services, you agree to be bound by
        these Terms. If you do not agree to these Terms, you may not use our Services.`}
      </Text>
    </Flex>
  );
};

export default BeginningText;
