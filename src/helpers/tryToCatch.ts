export const tryToCatch = async <T, E = Error>(
  fn: (...args: unknown[]) => Promise<T>,
  ...args: unknown[]
): Promise<[T | undefined, E | undefined]> => {
  if (typeof fn !== "function") throw new Error(`${fn} should be a function!`);

  try {
    return [await fn(...args), undefined];
  } catch (e: unknown) {
    return [undefined, e as E];
  }
};
