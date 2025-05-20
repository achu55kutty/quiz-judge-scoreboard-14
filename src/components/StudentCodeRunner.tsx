
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import CodeEditor from "@/components/CodeEditor";
import { submitCodeToJudge0, getAvailableLanguages } from "@/lib/judge0-api";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRightIcon, CheckIcon, XIcon } from "lucide-react";

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface StudentCodeRunnerProps {
  question?: string;
  defaultLanguage?: string;
  starterCode?: string;
  testCases?: TestCase[];
  onPassedTestCase?: () => void;
}

const StudentCodeRunner: React.FC<StudentCodeRunnerProps> = ({
  question = "Write a program to solve this problem:",
  defaultLanguage = "javascript",
  starterCode = "// Your code here",
  testCases = [{ input: "", expectedOutput: "" }],
  onPassedTestCase
}) => {
  const [code, setCode] = useState(starterCode);
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const { toast } = useToast();
  const languages = getAvailableLanguages();

  useEffect(() => {
    // Reset code when language changes
    setCode(starterCode);
  }, [selectedLanguage, starterCode]);

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No Code",
        description: "Please write some code before running.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setCustomOutput("");

    try {
      const result = await submitCodeToJudge0(
        code,
        selectedLanguage,
        [{ input: customInput, expectedOutput: "" }]
      );

      setCustomOutput(result.details?.results?.[0]?.stdout || 
                    result.details?.results?.[0]?.stderr || 
                    result.details?.results?.[0]?.compile_output || 
                    "No output");
    } catch (error) {
      console.error("Error running code:", error);
      setCustomOutput("Error running code: " + String(error));
    }

    setIsRunning(false);
  };

  const handleTestCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No Code",
        description: "Please write some code before testing.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setTestResults([]);

    try {
      const result = await submitCodeToJudge0(
        code,
        selectedLanguage,
        testCases
      );

      setTestResults(result.details?.results || []);

      if (result.passed) {
        toast({
          title: "Success!",
          description: "Your code passed all test cases.",
          variant: "default",
        });
        
        if (onPassedTestCase) {
          onPassedTestCase();
        }
      } else {
        toast({
          title: "Test Failed",
          description: result.message || "Your code didn't pass all test cases.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error testing code:", error);
      toast({
        title: "Error",
        description: "An error occurred while testing your code.",
        variant: "destructive",
      });
    }

    setIsRunning(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Student Coding Exercise</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-lg font-medium mb-3">{question}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex-grow sm:max-w-[200px]">
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.id} value={lang.name.toLowerCase()}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="editor">Code Editor</TabsTrigger>
            <TabsTrigger value="custom">Custom Input</TabsTrigger>
            <TabsTrigger value="testcases">Test Cases</TabsTrigger>
            {testResults.length > 0 && (
              <TabsTrigger value="results">Test Results</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="editor" className="border-none p-0">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={selectedLanguage}
            />
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                variant="outline"
                onClick={handleRunCode}
                disabled={isRunning || !code.trim()}
              >
                Run Code
              </Button>
              <Button
                onClick={handleTestCode}
                disabled={isRunning || !code.trim()}
              >
                {isRunning ? "Running..." : "Submit & Test"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="border-none p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Input</h3>
                <Textarea
                  placeholder="Enter your input here..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Output</h3>
                <div className="min-h-[200px] p-3 bg-gray-50 border rounded-md font-mono text-sm overflow-auto">
                  {customOutput || "No output yet. Run your code first."}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleRunCode}
                disabled={isRunning || !code.trim()}
              >
                {isRunning ? "Running..." : "Run with Input"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="testcases" className="border-none p-0">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Your code will be tested against these test cases when you submit:
              </p>
              {testCases.map((testCase, index) => (
                <div key={index} className="border p-4 rounded-md bg-gray-50">
                  <div className="text-sm font-medium">Test Case {index + 1}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <h4 className="text-xs font-medium mb-1">Input:</h4>
                      <pre className="p-2 bg-white border rounded text-xs overflow-auto">
                        {testCase.input || "(empty)"}
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium mb-1">Expected Output:</h4>
                      <pre className="p-2 bg-white border rounded text-xs overflow-auto">
                        {testCase.expectedOutput || "(empty)"}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleTestCode}
                  disabled={isRunning || !code.trim()}
                >
                  {isRunning ? "Testing..." : "Run Tests"}
                </Button>
              </div>
            </div>
          </TabsContent>

          {testResults.length > 0 && (
            <TabsContent value="results" className="border-none p-0">
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`border p-4 rounded-md ${
                      result.passed ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {result.passed ? (
                        <CheckIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <XIcon className="h-5 w-5 text-red-600" />
                      )}
                      <div className="font-medium">
                        Test Case {index + 1} - {result.passed ? "Passed" : "Failed"}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <h4 className="text-xs font-medium mb-1">Your Output:</h4>
                        <pre className="p-2 bg-white border rounded text-xs overflow-auto">
                          {result.stdout || result.stderr || "(no output)"}
                        </pre>
                      </div>
                      {!result.passed && (
                        <div>
                          <h4 className="text-xs font-medium mb-1">Expected:</h4>
                          <pre className="p-2 bg-white border rounded text-xs overflow-auto">
                            {result.expected || testCases[index]?.expectedOutput || "(unknown)"}
                          </pre>
                        </div>
                      )}
                    </div>
                    {result.compile_output && (
                      <div className="mt-2">
                        <h4 className="text-xs font-medium mb-1">Compiler Output:</h4>
                        <pre className="p-2 bg-white border rounded text-xs overflow-auto text-red-600">
                          {result.compile_output}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StudentCodeRunner;
