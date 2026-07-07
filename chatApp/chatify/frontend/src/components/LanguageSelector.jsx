import { LANGUAGES, LANGUAGE_TO_FLAG } from "../constants/languages";

const LanguageSelector = ({ selectedLanguage, onChange }) => {
  return (
    <div className="p-2 flex items-center gap-2">
      <select
        className="border p-2 rounded bg-base-200"
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value)}
      >
        {LANGUAGES.map((lang) => {
          const flag = LANGUAGE_TO_FLAG[lang.toLowerCase()];
          return (
            <option key={lang} value={lang}>
              {flag ? `(${flag.toUpperCase()})` : ""} {lang}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default LanguageSelector;
