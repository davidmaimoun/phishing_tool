import React from "react";

const TemplateViewer: React.FC<{ template: string }> = ({ template }) => {
  return (
      <div >
        <div >
          <iframe
            srcDoc={template}
            className="iframe"
          />
        </div>
      </div>
  );
};

export default TemplateViewer;
