// Simple approach: record when a tracked domain becomes active,
// and when it stops being active, add the elapsed seconds.

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

// Flush time: calculate elapsed since _startedAt and add to matching tracked tabs
async function flushTime() {
  const data = await chrome.storage.local.get([
    "trackedTabs",
    "_activeDomain",
    "_startedAt",
  ]);
  const { _activeDomain, _startedAt, trackedTabs } = data;
  if (!_activeDomain || !_startedAt) return;

  const elapsed = Math.round((Date.now() - _startedAt) / 1000);
  if (elapsed < 1) return;

  const tabs = trackedTabs || [];
  let changed = false;
  for (const tab of tabs) {
    if (
      _activeDomain === tab.domain ||
      _activeDomain.endsWith("." + tab.domain)
    ) {
      tab.totalSeconds = (tab.totalSeconds || 0) + elapsed;
      changed = true;
    }
  }
  if (changed) {
    await chrome.storage.local.set({
      trackedTabs: tabs,
      _startedAt: Date.now(),
    });
  } else {
    await chrome.storage.local.set({ _startedAt: Date.now() });
  }
}

async function setActiveDomain() {
  // Flush time for the previous domain first
  await flushTime();

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab && tab.url) {
      await chrome.storage.local.set({
        _activeDomain: getDomain(tab.url),
        _startedAt: Date.now(),
      });
    } else {
      await chrome.storage.local.set({
        _activeDomain: null,
        _startedAt: null,
      });
    }
  } catch {
    await chrome.storage.local.set({ _activeDomain: null, _startedAt: null });
  }
}

// Flush periodically so time is saved even if user never switches tabs
chrome.alarms.create("flush", { periodInMinutes: 0.5 });
chrome.alarms.onAlarm.addListener(() => flushTime());

chrome.tabs.onActivated.addListener(() => setActiveDomain());
chrome.tabs.onUpdated.addListener((_id, info) => {
  if (info.url || info.status === "complete") setActiveDomain();
});
chrome.windows.onFocusChanged.addListener((wid) => {
  if (wid === chrome.windows.WINDOW_ID_NONE) {
    flushTime().then(() =>
      chrome.storage.local.set({ _activeDomain: null, _startedAt: null }),
    );
  } else {
    setActiveDomain();
  }
});

setActiveDomain();
