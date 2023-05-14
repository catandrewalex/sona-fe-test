/**
 * Store value into local storage.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @param {string} name the name (key) that hold the value
 * @param {string} value value that will be stored in local storage
 */
export const setLocalStorage = (name: string, value: string): void => {
  window.localStorage.setItem(name, value);
};

/**
 * Get a value from local storage.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @param {string} name the name (key) that hold the value
 * @returns {(string|undefined)} the value stored in local storage
 */
export const getLocalStorage = (name: string): string | null => {
  return window.localStorage.getItem(name);
};

/**
 * Get a browser cookie.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @param {string} name the name (key) of the cookie
 * @returns {(string|undefined)} the cookie's value
 */
export const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

/**
 * Set browser cookie.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @param {string} name the name (key) of the cookie
 * @param {string} value the cookie's value
 * @param {string} expired the cookie's expiration timestamp
 * @param {string} path the URL path that must exist in the requested URL in order to send the Cookie header.
 */
export const setCookie = (name: string, value: string, expired: string, path: string): void => {
  document.cookie = `${name}=${value}; expires=${expired}; path=/${path}`;
};

export const deleteCookie = (name: string): void => {
  document.cookie = `${name}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
};
