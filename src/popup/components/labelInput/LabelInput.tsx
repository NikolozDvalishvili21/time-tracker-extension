import { useState } from "react";
import "./LabelInput.css";

interface LabelInputProps {
  onAdd: (label: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export default function LabelInput({
  onAdd,
  disabled,
  placeholder,
}: LabelInputProps) {
  const [label, setLabel] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (label.trim() && !disabled) {
      onAdd(label.trim());
      setLabel("");
    }
  };

  return (
    <form className="label-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder={placeholder || "Enter a label..."}
        className="label-input-field"
        disabled={disabled}
        maxLength={30}
      />
      <button
        type="submit"
        className="label-input-btn"
        disabled={disabled || !label.trim()}
      >
        + Add
      </button>
    </form>
  );
}
