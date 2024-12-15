export const kFormatter = (tickets: number): string => {
  if (!Number.isFinite(tickets)) return "";

  const absTickets = Math.abs(tickets);
  const sign = Math.sign(tickets);

  return absTickets > 999 ? `${sign * (Math.round((absTickets / 1000) * 10) / 10)}K` : `${tickets}`;
};
