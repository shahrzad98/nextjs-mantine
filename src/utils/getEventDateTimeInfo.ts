import dayjs, { ManipulateType } from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

export const getEventDateTimeInfo = (
  startAt: string,
  endAt?: string,
  offset?: number,
  offsetUnit?: ManipulateType
) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(relativeTime);
  dayjs.extend(advancedFormat);
  const eventDate = dayjs.utc(startAt).add(offset || 0, offsetUnit || "second");
  const now = dayjs.utc();
  const weekday = eventDate.format("ddd");
  const date = eventDate.format("MMM Do YYYY");
  const startTime = eventDate.format("h:mm A");
  const remainingDays = eventDate.fromNow();
  const eventEndDate = dayjs.utc(endAt).add(offset || 0, offsetUnit || "second");
  const isBefore = eventEndDate.isBefore(now, "second");

  if (endAt) {
    const endTime = dayjs
      .utc(endAt)
      .add(offset || 0, offsetUnit || "second")
      .format("h:mm A");

    return { date, weekday, remainingDays, isBefore, startTime, endTime };
  }

  return { date, weekday, remainingDays, isBefore, startTime };
};
