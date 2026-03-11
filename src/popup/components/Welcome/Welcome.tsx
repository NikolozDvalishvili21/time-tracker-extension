import { useState, useEffect } from "react";
import "./Welcome.css";

interface WelcomeProps {
  onDismiss: () => void;
}

export default function Welcome({ onDismiss }: WelcomeProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // auto-dismiss won't happen, user must click
  }, []);

  if (!visible) return null;

  return (
    <div className="welcome-overlay">
      <div className="welcome-card">
        <div className="welcome-emoji">⏱️</div>
        <h2>Welcome to Time Tracker!</h2>
        <p className="welcome-desc">
          Track how much time you spend on any website.
        </p>
        <ul className="welcome-steps">
          <li>
            <span className="step-num">1</span>
            Go to any website you want to track
          </li>
          <li>
            <span className="step-num">2</span>
            Open this popup and give it a label
          </li>
          <li>
            <span className="step-num">3</span>
            Time counts while the tab is active
          </li>
        </ul>
        <button
          className="welcome-btn"
          onClick={() => {
            setVisible(false);
            onDismiss();
          }}
        >
          Got it, let's go!
        </button>
      </div>
    </div>
  );
}
