import { Flex, Text } from "@mantine/core";
import React from "react";

const ProhibitedTerms = () => {
  return (
    <Flex gap="lg" direction="column">
      <Text>{`5.1. Prohibited Activities.`}</Text>
      <Text>
        {`You agree that you will not engage in any activity that interferes with or disrupts the
        Services (or the servers and networks which are connected to the Services).`}
      </Text>
      <Text>
        {`Without limiting the foregoing, you agree not to use the Services for any of the following
        activities:`}
      </Text>
      <Text>
        {`(a) To engage in any fraudulent or deceptive activity, including but not limited to
        impersonating any person or entity, or forging any email communication or header
        information;`}
      </Text>
      <Text>
        {`(b) To engage in any conduct that is unlawful, harassing, defamatory, abusive, threatening,
        obscene, hateful, harmful, or otherwise objectionable;`}
      </Text>
      <Text>
        {`(c) To distribute any material that contains viruses, Trojan horses, worms, time bombs,
        cancelbots, or any other harmful or deleterious programs;`}
      </Text>
      <Text>
        {`(e) To create, distribute or use any bots, spiders, or other automated methods of accessing,
        scraping, or indexing the Services, unless we have given you permission to do so in writing;`}
      </Text>
      <Text>
        {`(f) To use the Services in any way that could damage, disable, overburden, or impair the
        Services or interfere with any other party's use and enjoyment of the Services;`}
      </Text>
      <Text>
        {`(g) To use any data mining, robots, or similar data gathering or extraction methods in
        connection with the Services;`}
      </Text>
      <Text>
        {`(h) To attempt to gain unauthorized access to any portion of the Services or any related
        systems or networks;`}
      </Text>
      <Text>
        {`(i) To use any manual or automatic process to monitor or copy any of the material on the
        Services or for any other unauthorized purpose without our prior written consent; or`}
      </Text>
      <Text>
        {`(j) To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the
        Services, or which, as determined by us, may harm NOVELT INC or Users of the Services or
        expose them to liability.`}
      </Text>
    </Flex>
  );
};

export default ProhibitedTerms;
