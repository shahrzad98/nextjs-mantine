import { useBreakpoint } from "@/hooks";
import { Grid, Text, createStyles, rem } from "@mantine/core";
import Image from "next/image";
import React from "react";

const useStyles = createStyles(() => ({
  advantage: {
    display: "flex",
    flexDirection: "column",
    gap: rem(20),
  },
  title: {
    fontSize: rem(20),
    fontWeight: 600,
    color: "#E981FA",
  },
  text: {
    fontSize: rem(16),
    fontWeight: 400,
    color: "#FFFFFFCC",
  },
}));

export interface IAdvantages {
  data: IAdvantage[];
}

export interface IAdvantage {
  id: number;
  image: string;
  title: string;
  text: string;
}

const Advantages = ({ data }: IAdvantages) => {
  const { classes } = useStyles();
  const { isMobile } = useBreakpoint();

  return (
    <Grid gutter={rem(isMobile ? 30 : 35)}>
      {data.map((eachDiv, i) => (
        <Grid.Col span={12} sm={4} key={i} className={classes.advantage}>
          <Image src={eachDiv.image} width={64} height={64} alt={eachDiv.title} />
          <Text className={classes.title}>{eachDiv.title}</Text>
          <Text className={classes.text}>{eachDiv.text}</Text>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default Advantages;
