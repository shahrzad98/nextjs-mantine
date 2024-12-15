import { separateByThousands } from "@/utils";
import { ActionIcon, Card, Flex, Text, Title, createStyles, Group, rem } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";

import PencilSvg from "./assets/pencil-icon.svg";

const PencilIcon = () => <Image src={PencilSvg} alt="edit" />;

export interface IOrganizerTicketTierCardProps {
  title: string;
  ticketsSold: number;
  totalTickets: number;
  price: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

const useStyles = createStyles((theme) => ({
  body: {
    borderRadius: rem(12),
    border: "1px solid #852B89",
    background: "linear-gradient(159deg, rgba(33, 37, 60, 1) 0%, rgba(25, 13, 27, 1) 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  price: {
    padding: `${rem(4)} ${rem(8)}`,
    borderRadius: rem(2),
    background: "#000000",
  },
  title: {
    color: theme.colors.indigo[4],
    overflowWrap: "anywhere",
  },
}));

export const OrganizerTicketTierCard = ({
  title,
  ticketsSold,
  totalTickets,
  price,
  onEdit,
  onDelete,
}: IOrganizerTicketTierCardProps) => {
  const { classes } = useStyles();

  return (
    <Card px="lg" py="xl" radius="md" h={rem(157)} className={classes.body}>
      <Flex justify="space-between">
        <Text className={classes.price} size={rem(20)} lh={1} weight={700}>
          $ {separateByThousands(price.toFixed(2))}{" "}
          <Text component="span" color="dimmed" size="sm" weight={400}>
            {process.env.NEXT_PUBLIC_REGION === "US" ? "USD" : "CAD"}
          </Text>
        </Text>
        <Group spacing={rem(10)}>
          {onEdit && (
            <ActionIcon c="blue" onClick={onEdit}>
              <PencilIcon />
            </ActionIcon>
          )}
          {onDelete && (
            <ActionIcon c="#FF6464" onClick={onDelete}>
              <IconTrash />
            </ActionIcon>
          )}
        </Group>
      </Flex>
      <Title order={4} size="h3" className={classes.title}>
        {title.toUpperCase()}
      </Title>
      <Text size="sm">
        {ticketsSold} Sold
        <Text component="span" color="dimmed">
          {" "}
          | {totalTickets} Total Tickets
        </Text>
      </Text>
    </Card>
  );
};
