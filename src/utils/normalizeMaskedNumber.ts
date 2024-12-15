export const normalizeMaskedNumber = (maskedNumber: string) => {
  if (!maskedNumber) {
    return "";
  }

  const numberPostAreaCode = maskedNumber?.split("(")[1];

  return numberPostAreaCode?.replace(/[ )-]/g, "");
};
