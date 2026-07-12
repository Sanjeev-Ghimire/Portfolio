// =============================================
// POETRY DIARY — OWNER (ADMIN) ACCESS
// Everyone can open and read the book. Only the
// person who knows the owner password can add,
// edit, or delete poems.
// =============================================

(function () {
  const STORAGE_KEY = "poetryAdminKey";

  function getKey() {
    return sessionStorage.getItem(STORAGE_KEY) || "";
  }

  function isAdmin() {
    return !!getKey();
  }

  // Headers to attach to any fetch() that creates/updates/deletes a poem.
  function getAuthHeaders() {
    return isAdmin() ? { "x-admin-key": getKey() } : {};
  }

  function setKey(key) {
    sessionStorage.setItem(STORAGE_KEY, key);
  }

  function clearKey() {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  // Show/hide anything marked admin-only and refresh the lock icon.
  function applyAdminUI() {
    document.body.classList.toggle("is-admin", isAdmin());

    const toggleBtn = document.getElementById("adminToggleBtn");
    if (toggleBtn) {
      toggleBtn.textContent = isAdmin() ? "🔓" : "🔒";
      toggleBtn.title = isAdmin() ? "Log out of owner mode" : "Owner login";
    }

    if (typeof window.refreshBookIfOpen === "function") {
      window.refreshBookIfOpen();
    }
  }

  function openModal(modal) {
    if (modal) modal.classList.add("open");
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove("open");
  }

  async function login(password) {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Incorrect password");
      }

      setKey(password);
      applyAdminUI();
      return true;
    } catch (error) {
      if (typeof showNotification === "function") {
        showNotification("❌ " + error.message, "error");
      }
      return false;
    }
  }

  function logout() {
    clearKey();
    applyAdminUI();
    if (typeof showNotification === "function") {
      showNotification("🔒 Logged out of owner mode");
    }
  }

  // Exposed for poetry.js / book.js to use in their fetch() calls.
  window.PoetryAdmin = { isAdmin, getAuthHeaders, login, logout };

  document.addEventListener("DOMContentLoaded", () => {
    applyAdminUI();

    const toggleBtn = document.getElementById("adminToggleBtn");
    const loginModal = document.getElementById("adminLoginModal");
    const loginBackdrop = document.getElementById("adminLoginBackdrop");
    const loginForm = document.getElementById("adminLoginForm");
    const cancelLoginBtn = document.getElementById("cancelAdminLoginBtn");
    const passwordInput = document.getElementById("adminPassword");

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        if (isAdmin()) {
          if (confirm("Log out of owner mode?")) logout();
        } else {
          openModal(loginModal);
          if (passwordInput) setTimeout(() => passwordInput.focus(), 50);
        }
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const password = passwordInput ? passwordInput.value : "";
        const ok = await login(password);
        if (ok) {
          if (passwordInput) passwordInput.value = "";
          closeModal(loginModal);
          if (typeof showNotification === "function") {
            showNotification("🔓 Owner mode enabled");
          }
        }
      });
    }

    if (cancelLoginBtn) {
      cancelLoginBtn.addEventListener("click", () => closeModal(loginModal));
    }
    if (loginBackdrop) {
      loginBackdrop.addEventListener("click", () => closeModal(loginModal));
    }

    // Add Poem modal open/close (the form submit itself is handled in poetry.js)
    const addPoemModal = document.getElementById("addPoemModal");
    const addPoemBackdrop = document.getElementById("addPoemBackdrop");
    const openAddPoemBtn = document.getElementById("openAddPoemBtn");
    const cancelAddPoemBtn = document.getElementById("cancelAddPoemBtn");

    if (openAddPoemBtn) {
      openAddPoemBtn.addEventListener("click", () => {
        if (!isAdmin()) return;
        openModal(addPoemModal);
      });
    }
    if (cancelAddPoemBtn) {
      cancelAddPoemBtn.addEventListener("click", () =>
        closeModal(addPoemModal),
      );
    }
    if (addPoemBackdrop) {
      addPoemBackdrop.addEventListener("click", () => closeModal(addPoemModal));
    }

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (loginModal && loginModal.classList.contains("open"))
        closeModal(loginModal);
      if (addPoemModal && addPoemModal.classList.contains("open"))
        closeModal(addPoemModal);
    });
  });
})();
