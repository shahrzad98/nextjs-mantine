export const separateByThousands = (number: string | number | undefined) => {
  if (!number) {
    return "";
  }

  const stringifiedNumber = number.toString();

  if (stringifiedNumber.includes(".")) {
    return (
      stringifiedNumber.split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      "." +
      stringifiedNumber.split(".")[1]
    );
  }

  return stringifiedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
