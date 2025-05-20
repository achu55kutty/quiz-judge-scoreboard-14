
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiKey, setApiKey } from "@/lib/judge0-api";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Key, CheckCircle } from "lucide-react";

interface ApiKeyConfigProps {
  onKeyConfigured: () => void;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ onKeyConfigured }) => {
  const [apiKey, setApiKeyState] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is already configured
    const existingKey = getApiKey();
    if (existingKey) {
      setIsConfigured(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (demoMode) {
      setApiKey('demo');
      setIsConfigured(true);
      toast({
        title: "Demo Mode Activated",
        description: "Running in demo mode with simulated responses. Some features will be limited.",
      });
      onKeyConfigured();
      return;
    }

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
    setDemoMode(false);
  };

  if (isConfigured) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600 font-medium flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              {getApiKey() === 'demo' ? 'Demo Mode Active' : 'API Key configured'}
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
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Configure API Key
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            <p>Enter your Judge0 API key to enable code evaluation and test case checking.</p>
            <p className="mt-2">
              <Button 
                variant="link" 
                className="h-auto p-0 text-sm" 
                asChild
              >
                <a 
                  href="https://rapidapi.com/judge0-official/api/judge0-ce" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  Get an API key from RapidAPI
                  <ExternalLink className="ml-1 w-3 h-3" />
                </a>
              </Button>
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Input
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                className="flex-1"
                disabled={demoMode}
              />
              
              <Select 
                value={demoMode ? "demo" : "key"} 
                onValueChange={(value) => setDemoMode(value === "demo")}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="key">Use API Key</SelectItem>
                  <SelectItem value="demo">Demo Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {demoMode && (
              <p className="text-xs text-amber-600">
                Demo mode uses simulated responses. For full functionality, please use a real API key.
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveKey}>
          {demoMode ? 'Enable Demo Mode' : 'Save API Key'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyConfig;
