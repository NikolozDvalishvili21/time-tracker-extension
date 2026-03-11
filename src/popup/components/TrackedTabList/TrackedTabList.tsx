import type { TrackedTab } from "../../../types";
import TrackedTabItem from "./TrackedTabItem";
import "./TrackedTabList.css";

interface TrackedTabListProps {
  tabs: TrackedTab[];
  onRemove: (id: string) => void;
}

export default function TrackedTabList({
  tabs,
  onRemove,
}: TrackedTabListProps) {
  if (tabs.length === 0) {
    return (
      <div className="tracked-tab-list-empty">
        <div className="empty-icon">📋</div>
        <p>No tabs tracked yet</p>
        <span>Add a tab above to start tracking</span>
      </div>
    );
  }

  return (
    <div className="tracked-tab-list">
      <div className="tracked-tab-list-header">
        <span>Tracked Tabs</span>
        <span className="tracked-tab-count">{tabs.length}</span>
      </div>
      <div className="tracked-tab-items">
        {tabs.map((tab) => (
          <TrackedTabItem key={tab.id} tab={tab} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
}
