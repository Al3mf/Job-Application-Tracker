// Accounts and session - PROTOTYPE ONLY.
// Everything lives in this browser's localStorage. There is no server, so this
// is not real security: it only separates the data of people using the same
// browser. A real version needs a backend that stores accounts and passwords.

const USERS_KEY = "jt-users";
const SESSION_KEY = "jt-session";

function readJSON(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
}

function getUsers() {
  return readJSON(USERS_KEY, {});
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// Passwords are never stored as plain text, only as a SHA-256 hash.
async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function signUp(name, email, password) {
  const users = getUsers();
  const key = normalizeEmail(email);
  if (users[key]) throw new Error("An account with this email already exists.");
  users[key] = { name: name.trim(), email: key, passwordHash: await hashPassword(password) };
  writeJSON(USERS_KEY, users);
  startSession(key);
}

async function logIn(email, password) {
  const user = getUsers()[normalizeEmail(email)];
  if (!user || user.passwordHash !== (await hashPassword(password))) {
    throw new Error("Incorrect email or password.");
  }
  startSession(user.email);
}

function startSession(email) {
  writeJSON(SESSION_KEY, { email });
}

function logOut() {
  try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
}

function getCurrentUser() {
  const session = readJSON(SESSION_KEY, null);
  if (!session) return null;
  return getUsers()[session.email] || null;
}
