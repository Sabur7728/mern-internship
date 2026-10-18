const KEY = 'recentlyViewed', MAX = 4;
export const getRecent = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
export const pushRecent = (id) => localStorage.setItem(KEY, JSON.stringify([id, ...getRecent().filter((x) => x !== id)].slice(0, MAX)));
