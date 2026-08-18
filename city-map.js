/* ═══════════════════════════════════════════════════════════════════
   BAILAMOS! — city coverage map modal
   Opens from any [data-citymap] trigger. Fetches the SAME launch-city
   config the iOS app reads (public GET /config) and draws each live
   city's coverage circle (lat/lng + radiusMiles) on a Leaflet map, so
   visitors can see for themselves whether their floor is covered.

   Single source of truth: the API's /config launchCities. No hardcoded
   radius that can drift from the app — the FALLBACK below is used only
   if that fetch fails (e.g. a file:// preview blocked by CORS, or the
   API being unreachable) so the popup still renders something sensible.
   ═══════════════════════════════════════════════════════════════════ */

const CONFIG_ENDPOINT = "https://api.getbailamos.app/v1/config";

// Used ONLY if the live /config fetch fails. Approximate — the deployed
// site (getbailamos.app / *.pages.dev) fetches the real values instead.
const FALLBACK_CITIES = [
  { name: "Los Angeles, CA", lat: 34.17892, lng: -117.87617, radiusMiles: 60 },
  { name: "San Diego, CA",   lat: 32.93493, lng: -117.07578, radiusMiles: 30 },
];

const MILES_TO_METERS = 1609.34;

(function () {
  const overlay = document.getElementById("cmOverlay");
  if (!overlay) return;
  const mapEl   = document.getElementById("cmMap");
  const statusEl= document.getElementById("cmStatus");

  let map = null;        // Leaflet instance, created on first open
  let loaded = false;    // circles drawn?
  let lastTrigger = null;

  function open() {
    lastTrigger = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      overlay.classList.add("open");
      // Leaflet must size itself only once the container is visible.
      initMap();
      if (map) setTimeout(() => map.invalidateSize(), 260);
    });
  }

  function close() {
    overlay.classList.remove("open");
    // The "Join the waitlist" button also carries data-waitlist, so the
    // waitlist modal opens on the same click (waitlist.js runs first and
    // re-locks scroll). Only unlock scroll if it isn't taking over.
    const wl = document.getElementById("wlOverlay");
    if (!wl || wl.hidden) document.body.style.overflow = "";
    setTimeout(() => { overlay.hidden = true; }, 240);
    if (lastTrigger && typeof lastTrigger.focus === "function" && (!wl || wl.hidden)) {
      lastTrigger.focus();
    }
  }

  function initMap() {
    if (map || typeof L === "undefined") return;
    map = L.map(mapEl, {
      scrollWheelZoom: false,
      attributionControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 16,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    map.setView([34.0522, -118.2437], 8); // temp view until data loads
    loadCities();
  }

  async function loadCities() {
    if (loaded) return;
    let cities = null;
    try {
      const res = await fetch(CONFIG_ENDPOINT, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("config " + res.status);
      const cfg = await res.json();
      // /config wraps everything under `flags`; tolerate a flat shape too.
      const flags = cfg.flags ?? cfg;
      if (Array.isArray(flags.launchCities) && flags.launchCities.length) {
        cities = flags.launchCities;
      }
    } catch (err) {
      console.warn("[city-map] live config unavailable, using fallback:", err);
    }
    if (!cities) {
      cities = FALLBACK_CITIES;
      showStatus("Showing approximate areas — open the app for exact coverage.");
    }
    drawCities(cities);
    loaded = true;
  }

  function drawCities(cities) {
    const layers = [];
    cities.forEach((c) => {
      if (typeof c.lat !== "number" || typeof c.lng !== "number") return;
      const miles = c.radiusMiles || 40;
      const circle = L.circle([c.lat, c.lng], {
        radius: miles * MILES_TO_METERS,
        color: "#D8623C",
        weight: 2,
        fillColor: "#D8623C",
        fillOpacity: 0.14,
      }).addTo(map);
      L.circleMarker([c.lat, c.lng], {
        radius: 5,
        color: "#4A1620",
        weight: 2,
        fillColor: "#D8623C",
        fillOpacity: 1,
      })
        .addTo(map)
        .bindTooltip(c.name, { permanent: true, direction: "top", className: "cm-tip", offset: [0, -6] });
      layers.push(circle);
    });
    if (layers.length) {
      const group = L.featureGroup(layers);
      map.fitBounds(group.getBounds().pad(0.15));
    }
  }

  function showStatus(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.hidden = false;
  }

  // open triggers
  document.querySelectorAll("[data-citymap]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      open();
    });
  });

  // close triggers (backdrop, X, and the "join waitlist" button which
  // also carries data-waitlist so waitlist.js opens its modal after).
  overlay.querySelectorAll("[data-cm-close]").forEach((el) =>
    el.addEventListener("click", close)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) close();
  });
})();
