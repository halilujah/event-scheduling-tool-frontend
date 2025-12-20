import React from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';
type Language = 'en' | 'tr';

interface UtilityControlsProps {
  theme: Theme;
  language: Language;
  onThemeToggle: () => void;
  onLanguageToggle: () => void;
}

const UtilityControls: React.FC<UtilityControlsProps> = ({
  theme,
  language,
  onThemeToggle,
  onLanguageToggle,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
      <button
        className="utility-button"
        aria-label="Toggle theme"
        onClick={onThemeToggle}
      >
        {theme === 'dark' ? (
          <Sun size={18} strokeWidth={2} />
        ) : (
          <Moon size={18} strokeWidth={2} />
        )}
      </button>

      <button
        className="utility-button utility-button-lang"
        aria-label="Toggle language"
        onClick={onLanguageToggle}
      >
        {language.toUpperCase()}
      </button>
    </div>
  );
};

export default UtilityControls;
