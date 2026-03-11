import type { TrackedTab } from "../../../types";
import { formatTime } from "../../../utils";
import "./TrackedTabItem.css";

interface TrackedTabItemProps {
  tab: TrackedTab;
  onRemove: (id: string) => void;
}

export default function TrackedTabItem({ tab, onRemove }: TrackedTabItemProps) {
  return (
    <div className="tracked-tab-item">
      <div className="tracked-tab-left">
        {tab.favicon ? (
          <img src={tab.favicon} alt="" className="tracked-tab-icon" />
        ) : (
          <div className="tracked-tab-icon-placeholder">🌐</div>
        )}
        <div className="tracked-tab-details">
          <span className="tracked-tab-name">{tab.label}</span>
          <span className="tracked-tab-domain">{tab.domain}</span>
        </div>
      </div>
      <div className="tracked-tab-right">
        <span className="tracked-tab-time">{formatTime(tab.totalSeconds)}</span>
        <button
          className="tracked-tab-delete"
          onClick={() => onRemove(tab.id)}
          title="Remove"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
