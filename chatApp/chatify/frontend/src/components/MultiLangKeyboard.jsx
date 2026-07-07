import { useEffect, useState } from "react";
import Keyboard from "simple-keyboard";
import layouts from "simple-keyboard-layouts";
import "simple-keyboard/build/css/index.css";

const MultiLangKeyboard = ({ language, text, onTextChange }) => {
  const [keyboard, setKeyboard] = useState(null);

  useEffect(() => {
    const selectedLayout = layouts[language.toLowerCase()] || layouts.english;

    const kb = new Keyboard({
      layout: selectedLayout,
      onChange: (input) => onTextChange(input),
      theme: "hg-theme-default myKeyboard",
    });

    setKeyboard(kb);
  }, [language]);

  useEffect(() => {
    if (keyboard) keyboard.setInput(text);
  }, [text]);

  return <div className="mt-2"></div>;
};

export default MultiLangKeyboard;
