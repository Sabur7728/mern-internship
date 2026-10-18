const KEY = 'theme';
export const getTheme = () => localStorage.getItem(KEY) || (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
export const applyTheme = (t) => { document.documentElement.dataset.theme = t; localStorage.setItem(KEY, t); };
