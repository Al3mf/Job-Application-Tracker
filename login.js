// Start screen: log in / sign up.

// Already logged in? Go straight to the dashboard.
if (getCurrentUser()) window.location.replace("dashboard.html");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const tabs = document.querySelectorAll(".auth-tab");

function showTab(name) {
  tabs.forEach((tab) => {
    const active = tab.dataset.tab === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", active);
  });
  loginForm.hidden = name !== "login";
  signupForm.hidden = name !== "signup";
  setError(loginForm, "");
  setError(signupForm, "");
  (name === "login" ? loginForm : signupForm).querySelector("input").focus();
}

tabs.forEach((tab) => tab.addEventListener("click", () => showTab(tab.dataset.tab)));
document.querySelectorAll("[data-go]").forEach((btn) =>
  btn.addEventListener("click", () => showTab(btn.dataset.go)));

function setError(form, message) {
  form.querySelector(".form-error").textContent = message;
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  if (!isEmail(email)) return setError(loginForm, "Enter a valid email.");
  if (!password) return setError(loginForm, "Enter your password.");

  try {
    await logIn(email, password);
    window.location.replace("dashboard.html");
  } catch (err) {
    setError(loginForm, err.message);
  }
});

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { name, email, password, confirm } = signupForm;

  if (!name.value.trim()) return setError(signupForm, "Enter your name.");
  if (!isEmail(email.value)) return setError(signupForm, "Enter a valid email.");
  if (password.value.length < 6) return setError(signupForm, "Password must be at least 6 characters.");
  if (password.value !== confirm.value) return setError(signupForm, "Passwords don't match.");

  try {
    await signUp(name.value, email.value, password.value);
    window.location.replace("dashboard.html");
  } catch (err) {
    setError(signupForm, err.message);
  }
});
