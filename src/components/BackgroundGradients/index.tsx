import { Box, BoxProps } from "@mantine/core";

import {
  BackgroundGradientOne,
  BackgroundGradientTwo,
  BackgroundGradientThree,
  BackgroundGradientFour,
  BackgroundGradientFive,
  BackgroundGradientSix,
  BackgroundGradientSeven,
  BackgroundGradientEight,
  BackgroundGradientNine,
  BackgroundGradientTen,
  BackgroundGradientEleven,
  BackgroundGradientTwelve,
  BackgroundGradientThirteen,
} from "./gradients";

interface IBackgroundGradients extends BoxProps {
  variant?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
}

export const BackgroundGradients = ({ variant = 1, ...props }: IBackgroundGradients) => {
  // 1: main page
  // 2: login
  // 3: onboarding
  // 4: signup
  // 5: static pages (not for organizers)
  // 6: for organizers
  // 7: event
  // 8: 404
  // 9: checkout
  // 10: search
  // 11: my tickets
  // 12: organization onboarding
  // 13: organization pages
  // 14: search results, no results

  const gradient = {
    1: <BackgroundGradientOne />,
    2: <BackgroundGradientTwo />,
    3: <BackgroundGradientThree />,
    4: <BackgroundGradientFour />,
    5: <BackgroundGradientFive />,
    6: <BackgroundGradientSix />,
    7: <BackgroundGradientSeven />,
    8: <BackgroundGradientEight />,
    9: <BackgroundGradientNine />,
    10: <BackgroundGradientTen />,
    11: <BackgroundGradientEleven />,
    12: <BackgroundGradientTwelve />,
    13: <BackgroundGradientThirteen />,
  };

  return variant === 14 ? (
    <Box
      w="100%"
      pos="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      sx={{ overflow: "hidden", zIndex: -1, pointerEvents: "none" }}
      bg={'url("/img/search/emptySearchBg.png")'}
      bgr="no-repeat"
      bgsz="cover"
      bga="fixed"
      bgp="center"
      {...props}
    />
  ) : (
    <Box
      w="100%"
      pos="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      sx={{ overflow: "hidden", zIndex: -1, pointerEvents: "none" }}
      {...props}
    >
      {gradient[`${variant}`]}
    </Box>
  );
};
