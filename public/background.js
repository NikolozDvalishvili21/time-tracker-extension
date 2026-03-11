const ALARM_NAME = "time-tracker-tick";

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

async function updateActiveTab() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab && tab.url) {
      const domain = getDomain(tab.url);
      const data = await chrome.storage.local.get("_activeDomain");
      if (data._activeDomain !== domain) {
        // Domain changed — flush elapsed time for old domain first
        await tickTracking();
        await chrome.storage.local.set({
          _activeDomain: domain,
          _lastTick: Date.now(),
        });
      }
    } else {
      await tickTracking();
      await chrome.storage.local.set({ _activeDomain: null });
    }
  } catch {
    await chrome.storage.local.set({ _activeDomain: null });
  }
}

async function tickTracking() {
  const data = await chrome.storage.local.get([
    "trackedTabs",
    "_activeDomain",
    "_lastTick",
  ]);
  const activeDomain = data._activeDomain;
  if (!activeDomain) return;

  const now = Date.now();
  const lastTick = data._lastTick || now;
  const elapsed = Math.min(Math.round((now - lastTick) / 1000), 300);
  if (elapsed < 1) return;

  const trackedTabs = data.trackedTabs || [];
  let updated = false;

  for (const tab of trackedTabs) {
    if (
      activeDomain === tab.domain ||
      activeDomain.endsWith("." + tab.domain)
    ) {
      tab.totalSeconds = (tab.totalSeconds || 0) + elapsed;
      updated = true;
    }
  }

  if (updated) {
    await chrome.storage.local.set({ trackedTabs, _lastTick: now });
  } else {
    await chrome.storage.local.set({ _lastTick: now });
  }
}

// Chrome clamps alarm minimum to ~30s, but elapsed calculation catches up
chrome.alarms.create(ALARM_NAME, { periodInMinutes: 0.5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    tickTracking();
  }
});

chrome.tabs.onActivated.addListener(updateActiveTab);
chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
  if (changeInfo.url || changeInfo.status === "complete") {
    updateActiveTab();
  }
});
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    tickTracking().then(() => {
      chrome.storage.local.set({ _activeDomain: null });
    });
  } else {
    updateActiveTab();
  }
});

updateActiveTab();
chrome.storage.local.get("_lastTick", (data) => {
  if (!data._lastTick) {
    chrome.storage.local.set({ _lastTick: Date.now() });
  }
});
