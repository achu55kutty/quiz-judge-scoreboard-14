
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface ApiKeyConfigProps {
  onKeyConfigured: () => void;
}

// This is a simplified version of ApiKeyConfig that automatically configures
// without requiring an actual API key
const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ onKeyConfigured }) => {
  // Automatically configure on mount
  React.useEffect(() => {
    // Trigger the callback to indicate configuration is complete
    onKeyConfigured();
  }, [onKeyConfigured]);
  
  // Return null instead of rendering any UI
  return null;
};

export default ApiKeyConfig;
