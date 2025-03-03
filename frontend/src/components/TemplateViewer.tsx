import React from "react";
import { Templates } from "../types/types";

const TemplateViewer: React.FC<{ templates: Templates[] }> = ({ templates }) => {
  return (
    <div className="grid-container">
      {templates.map((template, index) => (
        <div key={index}>
          <h3>📄 {template.name}</h3>
          <div  className="card">
            <iframe
              srcDoc={template.template}
              className="iframe"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateViewer;
