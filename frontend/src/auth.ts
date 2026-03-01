const TOKEN_KEY = "token";
const USER_KEY = "username";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getUsername = () => localStorage.getItem(USER_KEY);
export const setUsername = (u: string) => localStorage.setItem(USER_KEY, u);
export const clearUsername = () => localStorage.removeItem(USER_KEY);

export const logout = () => {
  clearToken();
  clearUsername();
};