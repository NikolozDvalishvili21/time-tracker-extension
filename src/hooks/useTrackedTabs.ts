import { useState, useEffect, useCallback, useRef } from "react";
import type { TrackedTab } from "../types";
import { getDomain, generateId } from "../utils";

interface CurrentTabInfo {
  url: string;
  domain: string;
  favicon: string;
  title: string;
}

export function useTrackedTabs() {
  const [trackedTabs, setTrackedTabs] = useState<TrackedTab[]>([]);
  const [currentTab, setCurrentTab] = useState<CurrentTabInfo | null>(null);
  const tabsRef = useRef<TrackedTab[]>([]);

  // Load tracked tabs from storage and poll every second for live display
  useEffect(() => {
    function loadTabs() {
      chrome.storage.local.get(
        ["trackedTabs", "_activeDomain", "_lastTick"],
        (data: {
          trackedTabs?: TrackedTab[];
          _activeDomain?: string;
          _lastTick?: number;
        }) => {
          const tabs = data.trackedTabs || [];
          const activeDomain = data._activeDomain;
          const lastTick = data._lastTick || Date.now();
          const elapsed = Math.round((Date.now() - lastTick) / 1000);

          // Show interpolated time for tabs matching active domain
          const display = tabs.map((t) => {
            if (
              activeDomain &&
              (activeDomain === t.domain ||
                activeDomain.endsWith("." + t.domain))
            ) {
              return { ...t, totalSeconds: t.totalSeconds + elapsed };
            }
            return t;
          });
          tabsRef.current = tabs;
          setTrackedTabs(display);
        },
      );
    }

    loadTabs();
    const interval = setInterval(loadTabs, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get current active tab
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab?.url) {
        setCurrentTab({
          url: tab.url,
          domain: getDomain(tab.url),
          favicon: tab.favIconUrl || "",
          title: tab.title || "",
        });
      }
    });
  }, []);

  const addTab = useCallback(
    (label: string) => {
      if (!currentTab || !currentTab.domain) return;

      // Don't add duplicate domains
      if (tabsRef.current.some((t) => t.domain === currentTab.domain)) return;

      const newTab: TrackedTab = {
        id: generateId(),
        domain: currentTab.domain,
        label: label.trim(),
        favicon: currentTab.favicon,
        totalSeconds: 0,
        addedAt: Date.now(),
      };

      const updated = [...tabsRef.current, newTab];
      chrome.storage.local.set({ trackedTabs: updated });
    },
    [currentTab],
  );

  const removeTab = useCallback((id: string) => {
    const updated = tabsRef.current.filter((t) => t.id !== id);
    chrome.storage.local.set({ trackedTabs: updated });
  }, []);

  const isDuplicate = currentTab
    ? trackedTabs.some((t) => t.domain === currentTab.domain)
    : false;

  return { trackedTabs, currentTab, addTab, removeTab, isDuplicate };
}
