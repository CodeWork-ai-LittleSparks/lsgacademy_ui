export async function signIn(email, password) { return { ok: true, user: { email } }; }

export function validateMockCredentials(email, password, role) {
  const superOk = role === "super-admin" && email === "admin@lsg.com" && password === "password";
  const schoolOk = role === "school-admin" && email === "school@lsg.com" && password === "password";
  return superOk || schoolOk;
}

export function createMockJWT(payload) {
  const header = { alg: "none", typ: "JWT" };
  const b64 = (obj) => btoa(JSON.stringify(obj));
  return `${b64(header)}.${b64(payload)}.mock`;
}

export function parseMockJWT(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const json = atob(parts[1]);
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}