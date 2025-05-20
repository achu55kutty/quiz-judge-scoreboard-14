import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import CodeEditor from "@/components/CodeEditor";
import { submitCodeToJudge0 } from "@/lib/judge0-api";

interface QuizQuestion {
  id: number;
  section: string;
  type: "multiple-choice" | "coding";
  question: string;
  options?: string[];
  testCases?: {
    input: string;
    expectedOutput: string;
  }[];
  language?: string;
  starterCode?: string;
}

// Sample questions data
const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    section: "Password & Authentication",
    type: "multiple-choice",
    question: "Which of the following is the most secure password policy?",
    options: [
      "Requiring at least 8 characters with mixed case and symbols",
      "Requiring password changes every 30 days",
      "Using biometric authentication only",
      "Implementing multi-factor authentication with app-based tokens"
    ]
  },
  {
    id: 2,
    section: "Password & Authentication",
    type: "coding",
    question: "Write a function that validates a password based on these rules: at least 8 characters, contains uppercase, lowercase, number and special character.",
    language: "javascript",
    starterCode: `function validatePassword(password) {
  // Your code here
  
  // Return true if valid, false otherwise
}`,
    testCases: [
      {
        input: "Password123!",
        expectedOutput: "true"
      },
      {
        input: "password",
        expectedOutput: "false"
      },
      {
        input: "PASSWORD123",
        expectedOutput: "false"
      }
    ]
  },
  {
    id: 3,
    section: "Software Security",
    type: "multiple-choice",
    question: "Which of the following is NOT an effective way to prevent SQL injection attacks?",
    options: [
      "Using prepared statements with parameterized queries",
      "Input validation and sanitization",
      "Using stored procedures",
      "Encrypting all database data"
    ]
  },
  {
    id: 4,
    section: "Software Security",
    type: "coding",
    question: "Write a function that sanitizes user input to prevent XSS attacks by escaping HTML special characters.",
    language: "javascript",
    starterCode: `function sanitizeInput(userInput) {
  // Your code here
  
  // Return sanitized input
}`,
    testCases: [
      {
        input: "<script>alert('XSS')</script>",
        expectedOutput: "&lt;script&gt;alert('XSS')&lt;/script&gt;"
      }
    ]
  },
  {
    id: 5,
    section: "Data Protection",
    type: "multiple-choice",
    question: "What is the primary purpose of data encryption?",
    options: [
      "To make data transfer faster",
      "To reduce storage requirements",
      "To ensure data integrity and confidentiality",
      "To comply with GDPR requirements only"
    ]
  }
];

const sectionOrder = [
  "Password & Authentication",
  "Software Security",
  "Data Protection",
  "Network Security",
  "Email & Communication",
  "Device Security",
  "Complete"
];

const Quiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: any}>({});
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const totalQuestions = quizQuestions.length;
  
  // Set initial code from starter code if available
  useEffect(() => {
    if (currentQuestion.type === "coding" && currentQuestion.starterCode) {
      setCode(currentQuestion.starterCode);
    }
  }, [currentQuestionIndex, currentQuestion]);
  
  // Calculate progress
  useEffect(() => {
    setProgressPercent(((currentQuestionIndex) / totalQuestions) * 100);
  }, [currentQuestionIndex, totalQuestions]);
  
  const handleMultipleChoiceSelect = (option: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: option });
  };
  
  const handleCodeChange = (value: string) => {
    setCode(value);
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };
  
  const handleNext = async () => {
    // If it's a coding question, we need to submit to Judge0 API
    if (currentQuestion.type === "coding") {
      setIsSubmitting(true);
      try {
        // This is a placeholder for actual Judge0 API integration
        const result = await submitCodeToJudge0(
          code,
          currentQuestion.language || "javascript",
          currentQuestion.testCases || []
        );
        
        if (result.passed) {
          toast({
            title: "Test passed!",
            description: "Your code passed all test cases.",
            variant: "default",
          });
        } else {
          toast({
            title: "Test failed",
            description: result.message || "Your code didn't pass all test cases.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return; // Don't proceed if test failed
        }
      } catch (error) {
        console.error("Error submitting code:", error);
        toast({
          title: "Submission Error",
          description: "There was a problem submitting your code.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return; // Don't proceed if error
      }
      setIsSubmitting(false);
    }
    
    // If we're at the last question, navigate to results page
    if (currentQuestionIndex === totalQuestions - 1) {
      navigate("/results", { state: { answers } });
      return;
    }
    
    // Otherwise, move to next question
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };
  
  // Get the current section index for progress display
  const getCurrentSectionIndex = () => {
    const currentSection = currentQuestion.section;
    return sectionOrder.indexOf(currentSection);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logo */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Student Assignment Portal</h1>
          <div className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </div>
      </header>
      
      {/* Progress steps */}
      <div className="bg-white py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {sectionOrder.slice(0, 5).map((section, index) => {
              const isActive = index <= getCurrentSectionIndex();
              const isCurrentSection = index === getCurrentSectionIndex();
              
              return (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                      isActive ? 'bg-quiz-primary' : 'bg-gray-300'} text-white`}>
                      {index + 1}
                    </div>
                    <span className="text-xs mt-1 max-w-[80px] text-center">{section}</span>
                  </div>
                  {index < sectionOrder.length - 2 && (
                    <div className={`h-1 flex-1 ${isActive && index < getCurrentSectionIndex() ? 'bg-quiz-primary' : 'bg-gray-200'} mx-2`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="container mx-auto px-4 py-4">
        <Progress value={progressPercent} className="h-2" />
      </div>
      
      {/* Main quiz content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>
            
            {currentQuestion.type === "multiple-choice" && (
              <div className="space-y-4">
                {currentQuestion.options?.map((option, index) => (
                  <div 
                    key={index}
                    className={`p-4 border rounded-md cursor-pointer ${
                      answers[currentQuestion.id] === option ? 'border-quiz-primary bg-quiz-primary bg-opacity-10' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleMultipleChoiceSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
            
            {currentQuestion.type === "coding" && (
              <div className="space-y-4">
                <Tabs defaultValue="editor">
                  <TabsList className="mb-2">
                    <TabsTrigger value="editor">Code Editor</TabsTrigger>
                    <TabsTrigger value="testcases">Test Cases</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="editor" className="border-none p-0">
                    <CodeEditor 
                      value={code} 
                      onChange={handleCodeChange} 
                      language={currentQuestion.language || "javascript"} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="testcases" className="border-none p-0">
                    <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                      <h3 className="font-medium">Test Cases</h3>
                      {currentQuestion.testCases?.map((testCase, index) => (
                        <div key={index} className="border p-4 rounded-md bg-white">
                          <div className="mb-2">
                            <span className="font-medium">Input:</span> <code>{testCase.input}</code>
                          </div>
                          <div>
                            <span className="font-medium">Expected Output:</span> <code>{testCase.expectedOutput}</code>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0 || isSubmitting}
              >
                Previous
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!answers[currentQuestion.id] || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Quiz;
