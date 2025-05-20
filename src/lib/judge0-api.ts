
interface TestCase {
  input: string;
  expectedOutput: string;
}

interface SubmissionResult {
  passed: boolean;
  message?: string;
  details?: any;
}

// Configuration object for the API
const API_CONFIG = {
  apiKey: '', // We'll have users input this in the UI for security
  endpoint: 'https://ce.judge0.com'
};

// Language mapping for Judge0 API
const LANGUAGE_MAP: { [key: string]: number } = {
  "javascript": 63,
  "typescript": 74,
  "python": 71, 
  "cpp": 54,
  "java": 62,
  "c": 50,
  "csharp": 51,
  "php": 68,
  "ruby": 72,
  "go": 60,
  "rust": 73,
  "sql": 82,
  "bash": 46,
  "html": 43,
};

export const setApiKey = (key: string) => {
  API_CONFIG.apiKey = key;
};

export const getApiKey = () => {
  return API_CONFIG.apiKey;
};

export const getLanguageId = (language: string): number => {
  return LANGUAGE_MAP[language.toLowerCase()] || 63; // Default to JavaScript
};

export const getAvailableLanguages = () => {
  return Object.keys(LANGUAGE_MAP).map(lang => ({
    id: LANGUAGE_MAP[lang],
    name: lang.charAt(0).toUpperCase() + lang.slice(1)
  }));
};

// Define the expected structure for the Judge0 API response
interface JudgeResult {
  passed: boolean;
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  status?: any;
  time?: string;  // Add these properties to match the usage below
  memory?: string; // Add these properties to match the usage below
}

// Submit code to Judge0 API
export const submitCodeToJudge0 = async (
  code: string,
  language: string,
  testCases: TestCase[]
): Promise<SubmissionResult> => {
  console.log("Submitting code to Judge0 API:", { code, language });
  
  if (!API_CONFIG.apiKey) {
    console.error("API key not set");
    return {
      passed: false,
      message: "API key not configured. Please set up API credentials to check code.",
      details: {
        error: "Missing API configuration"
      }
    };
  }
  
  try {
    // For real API integration with Judge0
    if (testCases.length === 0) {
      return {
        passed: false,
        message: "No test cases provided.",
        details: { error: "Missing test cases" }
      };
    }
    
    // If we're in development mode without a real API key, use simulation
    if (API_CONFIG.apiKey === 'development' || API_CONFIG.apiKey === 'demo') {
      return simulateSubmission(code, testCases);
    }
    
    // Process each test case
    const results = await Promise.all(testCases.map(async (testCase) => {
      const payload = {
        source_code: code,
        language_id: getLanguageId(language),
        stdin: testCase.input
      };
      
      const response = await fetch(`${API_CONFIG.endpoint}/submissions/?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': API_CONFIG.apiKey
        },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      // Check if the output matches expected output
      const passed = result.stdout?.trim() === testCase.expectedOutput.trim();
      
      return {
        passed,
        stdout: result.stdout,
        stderr: result.stderr,
        compile_output: result.compile_output,
        message: result.message,
        status: result.status,
        time: result.time,  // Include time property
        memory: result.memory  // Include memory property
      } as JudgeResult;
    }));
    
    // Check if all test cases passed
    const allPassed = results.every(result => result.passed);
    
    return {
      passed: allPassed,
      message: allPassed 
        ? "All test cases passed successfully." 
        : "Some test cases failed. Please review your solution.",
      details: {
        results,
        executionTime: results[0]?.time || "0s",
        memoryUsed: results[0]?.memory || "0 KB"
      }
    };
  } catch (error) {
    console.error("Error submitting code:", error);
    return {
      passed: false,
      message: "An error occurred while submitting your code for evaluation.",
      details: {
        error: String(error)
      }
    };
  }
};

// Simulation function for development/demo purposes
const simulateSubmission = (code: string, testCases: TestCase[]): Promise<SubmissionResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple heuristic to check if code might be valid
      const hasLogicCode = code.length > 50 && 
                          (code.includes('for') || 
                           code.includes('if') || 
                           code.includes('function') || 
                           code.includes('return'));
      
      if (hasLogicCode || Math.random() > 0.2) {
        resolve({
          passed: true,
          message: "All test cases passed successfully.",
          details: {
            executionTime: "0.023s",
            memoryUsed: "12.4 MB",
            results: testCases.map(() => ({ 
              passed: true, 
              stdout: "Success",
              time: "0.023s",  // Add these properties to match the usage
              memory: "12.4 MB" // Add these properties to match the usage
            }))
          }
        });
      } else {
        resolve({
          passed: false,
          message: "Code failed to pass all test cases. Please review your solution.",
          details: {
            results: [{
              passed: false,
              stdout: "Incorrect output",
              expected: testCases[0].expectedOutput,
              testCase: testCases[0],
              time: "0.015s",  // Add these properties to match the usage
              memory: "10.2 MB" // Add these properties to match the usage
            }]
          }
        });
      }
    }, 1500);
  });
};
