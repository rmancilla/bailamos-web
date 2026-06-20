/* ═══════════════════════════════════════════════════════════════════
   BAILAMOS! — waitlist modal
   Opens from any [data-waitlist] trigger. Collects email, city, role
   and POSTs JSON to your REST endpoint.

   ┌─────────────────────────────────────────────────────────────────┐
   │  1. Paste your endpoint URL below.                                │
   │  2. If your API expects different field names, edit buildPayload. │
   └─────────────────────────────────────────────────────────────────┘
   ═══════════════════════════════════════════════════════════════════ */

const WAITLIST_ENDPOINT = "https://api.getbailamos.app/v1/waitlist";

// Shape the body sent to your API. role is "attendee" or "creator".
function buildPayload({ email, city, role }) {
  return { email, city, role };   // ← rename keys here if your API differs
}

(function () {
  const overlay = document.getElementById("wlOverlay");
  if (!overlay) return;
  const form     = document.getElementById("wlForm");
  const formWrap = document.getElementById("wlFormWrap");
  const success  = document.getElementById("wlSuccess");
  const errEl    = document.getElementById("wlError");
  const submitBtn= form.querySelector(".wl-submit");
  let lastTrigger = null;

  function open(role) {
    errEl.hidden = true;
    formWrap.hidden = false;
    success.hidden = true;
    if (role === "creator" || role === "attendee") {
      const r = form.querySelector(`input[name="role"][value="${role}"]`);
      if (r) r.checked = true;
    }
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      overlay.classList.add("open");
      const first = form.querySelector('input[name="email"]');
      if (first) first.focus();
    });
  }

  function close() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => { overlay.hidden = true; }, 240);
    if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
  }

  // open triggers
  document.querySelectorAll("[data-waitlist]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      lastTrigger = el;
      open(el.getAttribute("data-waitlist"));
    });
  });

  // close triggers
  overlay.querySelectorAll("[data-wl-close]").forEach((el) =>
    el.addEventListener("click", close)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) close();
  });

  // submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errEl.hidden = true;

    const data = new FormData(form);
    const email = (data.get("email") || "").toString().trim();
    const city  = (data.get("city")  || "").toString().trim();
    const role  = (data.get("role")  || "attendee").toString();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return showError("Please enter a valid email.");
    }
    if (!city) return showError("Let us know your city.");

    submitBtn.disabled = true;
    submitBtn.textContent = "Joining…";

    try {
      if (WAITLIST_ENDPOINT) {
        const res = await fetch(WAITLIST_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload({ email, city, role })),
        });
        if (!res.ok) throw new Error("Request failed: " + res.status);
      } else {
        // No endpoint set yet — simulate so the flow is demoable.
        console.log("[waitlist] would POST:", buildPayload({ email, city, role }));
        await new Promise((r) => setTimeout(r, 700));
      }
      showSuccess(email, city);
    } catch (err) {
      console.error(err);
      showError("Something went wrong. Please try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Join the waitlist";
    }
  });

  function showError(msg) {
    errEl.textContent = msg;
    errEl.hidden = false;
  }

  function showSuccess(email, city) {
    success.querySelector(".wl-r-email").textContent = email;
    success.querySelector(".wl-r-city").textContent = city;
    formWrap.hidden = true;
    success.hidden = false;
    form.reset();
  }
})();
