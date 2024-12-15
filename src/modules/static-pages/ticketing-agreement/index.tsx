import { Box, Flex, Text, createStyles, rem } from "@mantine/core";
import React from "react";

const useStyles = createStyles((theme) => ({
  TextWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: rem(30),
    padding: "10px 150px",
    fontSize: rem(16),
    marginBottom: rem(66),
    [theme.fn.smallerThan("sm")]: {
      padding: "8px 37px",
      fontSize: rem(14),
      gap: rem(20),
    },
  },
}));

export const TicketingAgreementContent = () => {
  const { classes } = useStyles();

  return (
    <Flex className={classes.TextWrapper}>
      <Text>
        {`THIS TICKETING SERVICES AGREEMENT ("Agreement") is made by and between NOVELT INC., a ticketing platform ("Company," "NOVELT," "We," "Us," or "Our" ), and you, a person, organization or other entity (an "EVA," or "You" or "Your"). NOVELT INC. is in the business of providing reservations, tickets, memberships, certificates, admissions, and/or confirmations that allow the ticket holder or purchaser (each, a "Patron") attendance at, access to, or participation in, events (including streamed events), venues and other activities (each, an "Event"). You, as an Event organizer, are authorized to provide access to such Events. The parties, intending to be legally bound, hereby agree as follows:`}
      </Text>
      <Text>{`BY CLICKING THE "CREATE AN ACCOUNT" BUTTON, YOU REPRESENT THAT YOU HAVE READ AND UNDERSTAND THIS AGREEMENT, THE TERMS OF SERVICE ("TOS"), AND THE PRIVACY POLICY, EACH HEREBY INCORPORATED BY REFERENCE, AND EXPRESSLY AGREE TO, AND CONSENT TO BE BOUND BY, ALL OF THE TERMS AND CONDITIONS CONTAINED THEREIN. THIS AGREEMENT SHALL HAVE THE SAME LEGAL EFFECT AND FORCE AS A WRITTEN AND SIGNED DOCUMENT. IF YOU DO NOT AGREE TO ALL OF THE TERMS AND CONDITIONS, WE WILL PROMPTLY CANCEL THIS TRANSACTION AND YOU WILL BE UNABLE TO ACCESS THE NOVELT.COM WEBSITE (THE "Site") AND THE SERVICES THAT IT OFFERS. WE RESERVE THE RIGHT TO DECLINE YOUR REQUEST FOR SERVICES FOR ANY REASON AND WITHOUT NOTICE.`}</Text>
      <Text>{`This Ticketing Service Agreement (“Agreement”) is made and entered into as of [Date] by and between NOVELT INC. (“NOVELT”), a web 3 ticketing platform, and the client (“Client”) who has requested NOVELT to provide ticketing services (“Services”).`}</Text>
      <Box>
        <Text>{`Services`}</Text>
        <Text>{`NOVELT agrees to provide Client with the Services requested, which may include, but are not limited to, ticket sales, ticket distribution, event management, and customer service. NOVELT will provide the Services through its website or other digital platforms.`}</Text>
      </Box>
      <Box>
        <Text>{`Fees and Payment`}</Text>
        <Text>{`Attendees agree to pay NOVELT the fees specified in the invoice provided by NOVELT. NOVELT reserves the right to change the fees at any time with reasonable notice to the Client. Client will be responsible for any taxes or other charges associated with the Services. Payment will be due upon receipt of the invoice.`}</Text>
      </Box>
      <Box>
        <Text>{`Ticket Sales and Distribution`}</Text>
        <Text>{`NOVELT will be responsible for ticket sales and distribution. NOVELT will use its best efforts to ensure that the tickets are delivered to the customers in a timely and efficient manner.`}</Text>
      </Box>
      <Box>
        <Text>{`Event Management`}</Text>
        <Text>{`NOVELT will assist in managing the event, including but not limited to, the creation of event pages, the processing of refunds, and the management of customer inquiries.`}</Text>
      </Box>
      <Box>
        <Text>{`Customer Service`}</Text>
        <Text>{`NOVELT will provide customer service to the customers purchasing the tickets through NOVELT's website or other digital platforms. NOVELT will use its best efforts to respond to customer inquiries within a reasonable time frame.`}</Text>
      </Box>
      <Box>
        <Text>{`Limitation of Liability`}</Text>
        <Text>{`NOVELT shall not be liable for any direct, indirect, special, incidental, or consequential damages arising out of or in connection with this Agreement, even if NOVELT has been advised of the possibility of such damages.`}</Text>
      </Box>
      <Box>
        <Text>{`Confidentiality`}</Text>
        <Text>{`NOVELT and Client agree to keep all information related to this Agreement confidential, except as required by law.`}</Text>
      </Box>
      <Box>
        <Text>{`Governing Law`}</Text>
        <Text>{`This Agreement shall be governed by and construed in accordance with the laws of the state of [Michiagan], without giving effect to its conflicts of law principles.`}</Text>
      </Box>
      <Box>
        <Text>{`Entire Agreement`}</Text>
        <Text>{`This Agreement constitutes the entire agreement between NOVELT and Client with respect to the Services and supersedes all prior negotiations, understandings, and agreements between the parties.`}</Text>
      </Box>
    </Flex>
  );
};
