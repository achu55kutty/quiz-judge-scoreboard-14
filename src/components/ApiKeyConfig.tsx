
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiKey, setApiKey } from "@/lib/judge0-api";
import { useToast } from "@/components/ui/use-toast";

interface ApiKeyConfigProps {
  onKeyConfigured: () => void;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ onKeyConfigured }) => {
  const [apiKey, setApiKeyState] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is already configured
    const existingKey = getApiKey();
    if (existingKey) {
      setIsConfigured(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Missing API Key",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
      return;
    }

    setApiKey(apiKey);
    setIsConfigured(true);
    toast({
      title: "API Key Configured",
      description: "The API key has been successfully configured.",
    });
    onKeyConfigured();
  };

  const handleReset = () => {
    setApiKey('');
    setApiKeyState('');
    setIsConfigured(false);
  };

  if (isConfigured) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600 font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              API Key configured
            </span>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Change
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Configure API Key</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Enter your API key to enable code evaluation and test case checking.
          </p>
          <Input
            type="password"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKeyState(e.target.value)}
            className="w-full"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveKey}>Save API Key</Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyConfig;
