import dayjs, { ManipulateType } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const generateISODateTime = (date: string, time: string) => {
  const day = new Date(date).getDate().toString().padStart(2, "0");
  const year = new Date(date).getFullYear();
  const month = Number(new Date(date).getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const hour = Number(time?.split(":")[0] || 0)
    .toString()
    .padStart(2, "0");
  const minute = Number(time?.split(":")[1] || 0)
    .toString()
    .padStart(2, "0");

  const iso = `${year}-${month}-${day}T${hour}:${minute}:00Z`;

  return iso;
};

export const generateDayJsDate = (
  date: string,
  time: string,
  offset?: number,
  offsetUnit?: ManipulateType
) => {
  const day = new Date(date).getDate().toString().padStart(2, "0");
  const year = new Date(date).getFullYear();
  const month = Number(new Date(date).getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const hour = Number(time?.split(":")[0] || 0)
    .toString()
    .padStart(2, "0");
  const minute = Number(time?.split(":")[1] || 0)
    .toString()
    .padStart(2, "0");

  const dayJsDate = dayjs
    .utc(`${year}-${month}-${day} ${hour}:${minute}`, "YYYY-MM-DD HH:mm")
    .subtract(offset || 0, offsetUnit || "second");

  return dayJsDate;
};
