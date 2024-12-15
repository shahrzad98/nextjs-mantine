import { Flex, Text } from "@mantine/core";
import React from "react";

const AcceptingText = () => {
  return (
    <Flex gap="lg" direction="column">
      <Text>{`Accepting These Terms`}</Text>
      <Text>
        {`2.1 To help you understand these Terms better, here are some important definitions:`}
      </Text>
      <Text>
        {`By accessing or using our Services, you agree to be bound by these Terms, whether or not you
        have registered for an account with us. If you do not agree to these Terms, you may not use
        our Services.`}
      </Text>
      <Text>
        {`2.2 You may use our Services only if you are 18 years or older and capable of forming a
        binding contract with NOVELT INC. By using our Services, you represent and warrant that you
        are at least 18 years of age and have the legal capacity to enter into these Terms.`}
      </Text>
      <Text>
        {`2.3 If you are using our Services on behalf of a business or organization, you represent and
        warrant that you have the authority to bind that business or organization to these Terms,
        and your agreement to these Terms will be treated as the agreement of that business or
        organization. In that event, "you" and "your" will refer and apply to that business or
        organization.`}
      </Text>
    </Flex>
  );
};

export default AcceptingText;
