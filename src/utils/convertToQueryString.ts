export function convertToQueryString(object: Record<string, string | number | undefined>) {
  let str = "";
  for (const key in object) {
    if (str != "" && object?.[key]) {
      str += "&";
    }
    if (object?.[key]) {
      str += key + "=" + encodeURIComponent(object[key] as string);
    }
  }

  return str;
}
