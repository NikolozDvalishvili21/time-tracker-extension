import "./App.css";
import Header from "./popup/components/Header/Header";
import CurrentTab from "./popup/components/currentTab/CurrentTab";
import TrackedTabList from "./popup/components/TrackedTabList/TrackedTabList";
import { useTrackedTabs } from "./hooks/useTrackedTabs";

function App() {
  const { trackedTabs, currentTab, addTab, removeTab, isDuplicate } =
    useTrackedTabs();

  return (
    <div className="app">
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
