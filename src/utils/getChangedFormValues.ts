export const getChangedFormValues = <T extends Record<string, unknown>>(
  values: T,
  isDirty: (fieldName: string) => boolean
): Partial<T> =>
  Object.fromEntries(Object.entries(values).filter(([key]) => isDirty(key))) as Partial<T>;
