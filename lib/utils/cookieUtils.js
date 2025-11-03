// Cookie utility functions for secure token storage
export const setCookie = (name, value, days = 7) => {
  if (typeof document === 'undefined') return; // Server-side check
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
};

export const getCookie = (name) => {
  if (typeof document === 'undefined') return null; // Server-side check
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
};

export const deleteCookie = (name) => {
  if (typeof document === 'undefined') return; // Server-side check
  
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const deleteAllAuthCookies = () => {
  deleteCookie('lsg_access_token');
  deleteCookie('lsg_refresh_token');
  deleteCookie('lsg_user_data');
};