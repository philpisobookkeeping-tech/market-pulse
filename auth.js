// Simple client-side auth stub for Market Pulse demo
// In production this would connect to a real auth backend.

(function () {
  const AUTH_KEY = "mp_user";
  const PLAN_KEY = "mp_plan";

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
    } catch {
      return null;
    }
  }

  function isLoggedIn() {
    return !!getUser();
  }

  function getPlan() {
    return localStorage.getItem(PLAN_KEY) || "none";
  }

  function login(email, name) {
    const user = { email, name: name || email.split("@")[0], loggedInAt: Date.now() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    if (!localStorage.getItem(PLAN_KEY)) {
      localStorage.setItem(PLAN_KEY, "full"); // demo grants full access
    }
    updateUI();
    return user;
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(PLAN_KEY);
    updateUI();
  }

  function updateUI() {
    const user = getUser();
    const plan = getPlan();
    document.querySelectorAll("[data-mp-auth]").forEach((el) => {
      if (user) {
        el.innerHTML = `
          <span class="px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium">
            ${user.name || "User"} · ${plan === "alerts" ? "$19" : "$99"}
          </span>
          <button type="button" data-mp-logout class="px-2.5 py-1.5 rounded-lg bg-white border border-gold-300 hover:border-gold-500 text-xs text-ink-800 font-semibold transition">
            Logout
          </button>
        `;
        el.querySelector("[data-mp-logout]")?.addEventListener("click", logout);
      } else {
        el.innerHTML = `
          <button type="button" data-mp-login class="px-2.5 py-1.5 rounded-lg bg-white border border-gold-300 hover:border-gold-500 text-xs text-ink-800 font-semibold transition flex items-center gap-1.5">
            <i class="fa-solid fa-right-to-bracket text-[10px]"></i> Login
          </button>
        `;
        el.querySelector("[data-mp-login]")?.addEventListener("click", () => {
          const email = prompt("Enter email to login (demo):", "trader@example.com");
          if (email) login(email);
        });
      }
    });
  }

  // Init on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateUI);
  } else {
    updateUI();
  }

  // Expose for debugging
  window.MPAuth = { login, logout, getUser, getPlan, isLoggedIn };
})();
