// user-tracker.js
const USER_ID = `user-${Math.random().toString(36).slice(2, 8)}`;
const HEARTBEAT_INTERVAL = 10000; // 10 seconds

function updatePresence() {
  const now = Date.now();
  const presence = JSON.parse(localStorage.getItem("activeUsers") || "{}");
  presence[USER_ID] = now;
  localStorage.setItem("activeUsers", JSON.stringify(presence));
}

function cleanupPresence() {
  const now = Date.now();
  const presence = JSON.parse(localStorage.getItem("activeUsers") || "{}");
  for (const id in presence) {
    if (now - presence[id] > 30000) delete presence[id]; // 30s timeout
  }
  localStorage.setItem("activeUsers", JSON.stringify(presence));
}

function getActiveUserCount() {
  const presence = JSON.parse(localStorage.getItem("activeUsers") || "{}");
  return Object.keys(presence).length;
}

// Start tracking
setInterval(() => {
  updatePresence();
  cleanupPresence();
}, HEARTBEAT_INTERVAL);

// Expose count
window.getActiveUserCount = getActiveUserCount;
