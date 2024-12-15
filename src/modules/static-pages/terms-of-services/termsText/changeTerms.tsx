import { Flex, Text } from "@mantine/core";
import React from "react";

const ChangeTerms = () => {
  return (
    <Flex gap="lg" direction="column">
      <Text>{`Changes to These Terms`}</Text>
      <Text>
        {`3.1 NOVELT INC reserves the right to modify these Terms at any time, in its sole discretion.
        If we make changes to these Terms, we will post the revised Terms on our website and update
        the "Last Updated" date at the top of these Terms. Your continued use of our Services after
        such changes have been made constitutes your acceptance of the new Terms.`}
      </Text>
      <Text>
        {`4.1 To use some of our Services, you may be required to register an account with us.`}
      </Text>
    </Flex>
  );
};

export default ChangeTerms;
