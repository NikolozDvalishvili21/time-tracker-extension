import { useState, useEffect } from "react";
import "./App.css";
import Header from "./popup/components/Header/Header";
import CurrentTab from "./popup/components/currentTab/CurrentTab";
import TrackedTabList from "./popup/components/TrackedTabList/TrackedTabList";
import Welcome from "./popup/components/Welcome/Welcome";
import { useTrackedTabs } from "./hooks/useTrackedTabs";

function App() {
  const { trackedTabs, currentTab, addTab, removeTab, isDuplicate } =
    useTrackedTabs();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("_onboardingDone", (data) => {
      if (!data._onboardingDone) {
        setShowWelcome(true);
      }
    });
  }, []);

  const dismissWelcome = () => {
    setShowWelcome(false);
    chrome.storage.local.set({ _onboardingDone: true });
  };

  return (
    <div className="app">
      {showWelcome && <Welcome onDismiss={dismissWelcome} />}
      <Header />
      {currentTab && (
        <CurrentTab
          domain={currentTab.domain}
          favicon={currentTab.favicon}
          onAdd={addTab}
          isDuplicate={isDuplicate}
        />
      )}
      <TrackedTabList tabs={trackedTabs} onRemove={removeTab} />
    </div>
  );
}

export default App;
