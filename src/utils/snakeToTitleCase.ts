export const snakeToTitleCase = (snakeCaseString: string) =>
  snakeCaseString
    .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
    .replace(/[-_]+(.)/g, (_, c) => " " + c.toUpperCase());
