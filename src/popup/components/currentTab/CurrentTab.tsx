import LabelInput from "../labelInput/LabelInput";
import "./CurrentTab.css";

interface CurrentTabProps {
  domain: string;
  favicon: string;
  onAdd: (label: string) => void;
  isDuplicate: boolean;
}

export default function CurrentTab({
  domain,
  favicon,
  onAdd,
  isDuplicate,
}: CurrentTabProps) {
  return (
    <div className="current-tab">
      <div className="current-tab-header">
        <span className="current-tab-label">Current Tab</span>
      </div>
      <div className="current-tab-info">
        {favicon ? (
          <img src={favicon} alt="" className="current-tab-icon" />
        ) : (
          <div className="current-tab-icon-placeholder">🌐</div>
        )}
        <span className="current-tab-domain">{domain}</span>
      </div>
      {isDuplicate ? (
        <div className="current-tab-duplicate">Already tracking this site</div>
      ) : (
        <LabelInput
          onAdd={onAdd}
          disabled={!domain}
          placeholder="Label (e.g. Coding)"
        />
      )}
    </div>
  );
}
