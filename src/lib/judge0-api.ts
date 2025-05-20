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
  // The API key should be stored securely, not directly in the code like this.
  // In a production environment, this would come from environment variables or a secure store
  apiKey: '' // We'll have users input this in the UI for security
};

export const setApiKey = (key: string) => {
  API_CONFIG.apiKey = key;
};

export const getApiKey = () => {
  return API_CONFIG.apiKey;
};

// This is a mock implementation of the Judge0 API client
// In a real application, you would integrate with the actual Judge0 API
export const submitCodeToJudge0 = async (
  code: string,
  language: string,
  testCases: TestCase[]
): Promise<SubmissionResult> => {
  console.log("Submitting code to external API:", { code, language });
  
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
    // For now we'll keep the mock implementation but make it ready for real API integration
    // The implementation assumes the API key is valid and properly set
    
    // In a real implementation, you would make a fetch call to the actual API
    // Example:
    /*
    const response = await fetch('https://api.example.com/submissions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_code: code,
        language_id: mapLanguageToId(language),
        test_cases: testCases
      }),
    });
    
    const data = await response.json();
    return {
      passed: data.status === 'success',
      message: data.message,
      details: data
    };
    */
    
    // Simulation for demo purposes:
    return new Promise((resolve) => {
      setTimeout(() => {
        // Use a better check for valid code than just length
        if (code.length > 50 || Math.random() > 0.2) {
          resolve({
            passed: true,
            message: "All test cases passed successfully.",
            details: {
              executionTime: "0.023s",
              memoryUsed: "12.4 MB"
            }
          });
        } else {
          resolve({
            passed: false,
            message: "Code failed to pass all test cases. Please review your solution.",
            details: {
              failedTest: testCases[0],
              error: "Expected output did not match actual output."
            }
          });
        }
      }, 1500);
    });
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

// Helper function to map language names to API-specific IDs
const mapLanguageToId = (language: string): number => {
  const languageMap: {[key: string]: number} = {
    'javascript': 63,  // Node.js
    'python': 71,      // Python 3
    'java': 62,        // Java
    'c': 50,           // C (GCC)
    'cpp': 54,         // C++ (GCC)
    'csharp': 51,      // C#
    'php': 68,         // PHP
    'ruby': 72,        // Ruby
    'go': 60,          // Go
    'rust': 73,        // Rust
    'sql': 82,         // SQL (SQLite)
    'bash': 46,        // Bash
    'html': 43,        // HTML
  };
  
  return languageMap[language.toLowerCase()] || 63; // Default to JavaScript/Node.js
};

// In a real implementation, you would have more functions to handle different aspects of the Judge0 API
// For example: getSubmissionStatus, getLanguages, etc.

/**
 * Implementation notes for real Judge0 API integration:
 * 
 * 1. Judge0 API requires setting up proper authentication
 * 2. The typical flow is:
 *    a. Create a submission with source code and language ID
 *    b. Poll for the submission status until it's processed
 *    c. Get the results (stdout, stderr, compile output, etc.)
 * 3. You'll need to handle rate limiting and token management
 * 4. For multiple test cases, you would need to create multiple submissions
 *    or use a custom approach to run all tests in one submission
 * 
 * Example real API endpoint: https://judge0-ce.p.rapidapi.com/submissions
 */
