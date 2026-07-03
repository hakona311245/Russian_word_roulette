import type { PracticeMode } from "../types";
import { PaperPanel } from "./PaperPanel";

type PracticeModeSwitchProps = {
  mode: PracticeMode;
  onChange: (mode: PracticeMode) => void;
};

const modeOptions: Array<{
  description: string;
  label: string;
  mode: PracticeMode;
}> = [
  {
    description: "Type your translation before revealing the reference.",
    label: "Typing",
    mode: "typing",
  },
  {
    description: "Say the translation out loud, then reveal the reference.",
    label: "Speaking",
    mode: "speaking",
  },
];

export function PracticeModeSwitch({
  mode,
  onChange,
}: PracticeModeSwitchProps) {
  return (
    <PaperPanel className="practice-mode-switch" aria-label="Practice mode">
      <span className="practice-mode-switch__label">Mode</span>
      <div className="practice-mode-switch__options" role="group">
        {modeOptions.map((option) => {
          const isActive = option.mode === mode;

          return (
            <button
              aria-pressed={isActive}
              className={`practice-mode-switch__button ${
                isActive ? "practice-mode-switch__button--active" : ""
              }`}
              key={option.mode}
              onClick={() => onChange(option.mode)}
              title={option.description}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </PaperPanel>
  );
}
