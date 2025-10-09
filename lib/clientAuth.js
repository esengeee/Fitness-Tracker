// lib/clientAuth.js
export function setToken(token) {
  try {
    localStorage.setItem("token", token);
  } catch (e) {
    console.error("setToken error", e);
  }
}

export function getToken() {
  try {
    return localStorage.getItem("token");
  } catch (e) {
    return null;
  }
}

export function clearToken() {
  try {
    localStorage.removeItem("token");
  } catch (e) {
    console.error("clearToken error", e);
  }
}

/**
 * authFetch - wrapper that adds Authorization header if token exists.
 * Returns the raw Response for the caller to handle.
 */
export async function authFetch(input, init = {}) {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(input, { ...init, headers });
  return res;
}
