const getLocalStorageValue = <T>(key: string): T | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window?.localStorage?.getItem(key);

    if (value) {
      return JSON.parse(value) as T;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(`Failed to retrieve ${key}'s value from local storage:`);
  }
};

export default getLocalStorageValue;
