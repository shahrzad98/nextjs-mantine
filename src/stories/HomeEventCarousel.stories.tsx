import type { Meta, StoryObj } from "@storybook/react";

import { HomeEventCarousel } from "@/components";

const meta: Meta<typeof HomeEventCarousel> = {
  title: "Home Event Carousel ",
  component: HomeEventCarousel,
  tags: ["autodocs"],
  argTypes: {},
};
export default meta;

type story = StoryObj<typeof HomeEventCarousel>;

// const data = [
//   {
//     eventImage: "https://mui.com/static/images/cards/contemplative-reptile.jpg",
//     imageAlt: "Sample Image Alt...",
//     leftTickets: 2,
//     eventTitle: "Taylor Swift",
//     address:
//       "The Theatre at Madison Square Garden, Floor Arena-Terrace Level - Madison Square Garden, 4 Pennsylvania Plaza, New York, NY 10001, United States",
//     organization: "Coldplay Group",
//     orgAvatar: "https://mui.com/static/images/cards/contemplative-reptile.jpg",
//     avatarAlt: "coldPlay",
//     date: "Feb 22nd 2023",
//     weekday: "Mon",
//     startTime: " 4:00 PM",
//     endTime: " 8:00 PM  ",
//     timeZone: " EST",
//   },

//   {
//     eventImage: "https://mui.com/static/images/cards/contemplative-reptile.jpg",
//     imageAlt: "Sample Image Alt...",
//     leftTickets: 1000,
//     eventTitle: "Coldplay Canada Tour",
//     address:
//       "The Theatre at Madison Square Garden, Floor Arena-Terrace Level - Madison Square Garden, 4 Pennsylvania Plaza, New York, NY 10001, United States",
//     organization: "Coldplay Group",
//     orgAvatar: "https://mui.com/static/images/cards/contemplative-reptile.jpg",
//     avatarAlt: "coldPlay",
//     date: "Feb 22nd 2023",
//     weekday: "Mon",
//     startTime: " 4:00 PM",
//     endTime: " 8:00 PM  ",
//     timeZone: " EST",
//   },
// ];

export const HomeEventCardCarousel: story = {
  args: {
    // events: data,
  },
};
