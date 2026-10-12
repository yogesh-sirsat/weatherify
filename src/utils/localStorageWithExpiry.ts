interface StorageItem<T> {
  value: T;
  expiry: number;
}

export const setLocalStorageWithExpiry = <T>(key: string, value: T, ttlMinutes: number): void => {
  const now = new Date();
  const item: StorageItem<T> = {
    value: value,
    expiry: now.getTime() + ttlMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getLocalStorageWithExpiry = <T>(key: string): T | null => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item: StorageItem<T> = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch (e) {
    console.error("Error parsing localStorage item:", e);
    return null;
  }
};

const localStorageWithExpiry = {
  setItem: setLocalStorageWithExpiry,
  getItem: getLocalStorageWithExpiry,
};

export default localStorageWithExpiry;
