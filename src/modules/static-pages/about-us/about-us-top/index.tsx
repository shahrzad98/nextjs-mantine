import { useBreakpoint } from "@/hooks";
import { TopTitle } from "@/modules";
import { BackgroundImage, Center, Container, Text, createStyles, rem } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  mainText: {
    width: rem(761),
    textAlign: "center",
    fontWeight: 800,
    fontSize: rem(48),
    padding: rem(40),
    lineHeight: rem(51),
    letterSpacing: "-0.02em",
    color: "#FFFFFF",
    marginTop: rem(30),

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(24),
      lineHeight: rem(32),
      marginTop: rem(119),
      padding: rem(27),
    },
  },
}));

export const AboutUsTop = () => {
  const { classes } = useStyles();
  const { isMobile } = useBreakpoint();

  return (
    <Container fluid px={0} mt={-78}>
      <BackgroundImage src={"./img/about-us/about-us-bg.png"} h={rem(isMobile ? 629 : 709)}>
        <TopTitle pageName="About Us" />
        <Center>
          <Text className={classes.mainText}>
            Unforgettable moments, shared with the world. Experience it all with novelT!
          </Text>
        </Center>
      </BackgroundImage>
    </Container>
  );
};
