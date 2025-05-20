
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

// A simple code editor component
// In a real application, you might want to use a library like Monaco Editor or CodeMirror
const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language = "javascript" }) => {
  return (
    <div className="border rounded-md bg-gray-50">
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
        <span className="text-sm font-medium">{language.charAt(0).toUpperCase() + language.slice(1)} Editor</span>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono text-sm min-h-[300px] bg-gray-50 p-4 border-0 focus-visible:ring-0"
        placeholder={`Write your ${language} code here...`}
      />
    </div>
  );
};

export default CodeEditor;
