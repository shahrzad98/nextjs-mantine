export enum BadgeColor {
  Draft = "#F3821A",
  Published = "#2CCF47",
  Canceled = "#9DA1A4",
  Rescheduled = "#852B89",
  Default = "",
}

export const getBadgeColor = (
  status: "draft" | "published" | "canceled" | "done" | "rescheduled" | string
): BadgeColor => {
  switch (status) {
    case "draft":
      return BadgeColor.Draft;
    case "published":
      return BadgeColor.Published;
    case "canceled":
      return BadgeColor.Canceled;
    case "rescheduled":
      return BadgeColor.Rescheduled;
    default:
      return BadgeColor.Default;
  }
};
