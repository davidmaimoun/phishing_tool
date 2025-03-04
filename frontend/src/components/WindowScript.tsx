import { useState } from "react";
import MyButton from "./all/Button";

interface WindowScriptProps {
  title: string;
  scriptContent: string;
  onClose: () => void;
}

const WindowScript: React.FC<WindowScriptProps> = ({ title, scriptContent, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <div className="overlay">
      <div className="window">
        <h2 className="title">{title}</h2>
        <pre className="code-block">{scriptContent}</pre>
        <div className="buttons">
    
          <MyButton 
            label={copied ? "Copied!" : "Copy Script"} 
            color="success"
            onClick={handleCopy}/>
          <button className="btn-close-window" onClick={onClose}>X</button>
        </div>
      </div>
    </div>
  );
};

export default WindowScript;
