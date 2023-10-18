// expires_in - is in minutes
const setLocalStorageWithExpiry = (key, value, expires_in) => {
    const expries_at = new Date(Date.now() + expires_in * 60 * 1000);
    const data = {
        value,
        expries_at
    };
    localStorage.setItem(key, JSON.stringify(data));
}

const getLocalStorageWithExpiry = (key) => {
    console.log("getLocalStorageWithExpiry");
    const item = localStorage.getItem(key);
    if (!item) {
        return null;
    }

    const data = JSON.parse(item);
    const now = new Date(Date.now());

    if (now > data.expries_at) {
        // Data has expired, remove it from LocalStorage
        localStorage.removeItem(key);
        return null;
    }

    return data.value;
}

export {
    setLocalStorageWithExpiry,
    getLocalStorageWithExpiry,
};