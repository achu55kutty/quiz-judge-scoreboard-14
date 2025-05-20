
import React, { useState, useEffect } from "react";
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

// Updated questions data from the provided images
const quizQuestions: QuizQuestion[] = [
  // Full-Stack Developer Questions
  {
    id: 1,
    section: "Full-Stack Developer",
    type: "multiple-choice",
    question: "What is the correct syntax to link an external JavaScript file?",
    options: [
      "<script href=\"app.js\">",
      "<script src=\"app.js\"></script>",
      "<js src=\"app.js\">",
      "<script link=\"app.js\">"
    ]
  },
  {
    id: 2,
    section: "Full-Stack Developer",
    type: "multiple-choice",
    question: "Which database is NoSQL?",
    options: [
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Oracle"
    ]
  },
  {
    id: 3,
    section: "Full-Stack Developer",
    type: "multiple-choice",
    question: "What does REST stand for in web development?",
    options: [
      "Ready-to-Serve Transfer",
      "Representational State Transfer",
      "Real-time Exchange System",
      "Responsive Encoding Syntax"
    ]
  },
  {
    id: 4,
    section: "Full-Stack Developer",
    type: "coding",
    question: "Write a function to check if a given number is a prime number.",
    language: "javascript",
    starterCode: `function isPrime(num) {
  // Your code here
  // A prime number is a number greater than 1 that has no positive divisors other than 1 and itself.
  
  // Return true if the number is prime, false otherwise
}`,
    testCases: [
      {
        input: "7",
        expectedOutput: "true"
      },
      {
        input: "10",
        expectedOutput: "false"
      }
    ]
  },
  {
    id: 5,
    section: "Full-Stack Developer",
    type: "coding",
    question: "Create a basic HTML webpage that displays a heading \"My Portfolio\" and a paragraph with your name.",
    language: "html",
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Portfolio</title>
</head>
<body>
  <!-- Your code here -->
  
</body>
</html>`,
    testCases: [
      {
        input: "",
        expectedOutput: "html containing <h1>My Portfolio</h1> and a paragraph with name"
      }
    ]
  },

  // Cloud Engineer Questions
  {
    id: 6,
    section: "Cloud Engineer",
    type: "multiple-choice",
    question: "Which of the following is an example of IaaS (Infrastructure as a Service)?",
    options: [
      "Microsoft Office 365",
      "Amazon EC2",
      "Google BigQuery",
      "Dropbox"
    ]
  },
  {
    id: 7,
    section: "Cloud Engineer",
    type: "multiple-choice",
    question: "Which command is used to create a virtual machine using Terraform?",
    options: [
      "terraform init",
      "terraform start",
      "terraform apply",
      "terraform install"
    ]
  },
  {
    id: 8,
    section: "Cloud Engineer",
    type: "multiple-choice",
    question: "What does \"scalability\" in cloud mean?",
    options: [
      "Making backups",
      "Handling increased load",
      "Encrypting data",
      "Automating tasks"
    ]
  },
  {
    id: 9,
    section: "Cloud Engineer",
    type: "coding",
    question: "Simulate an S3-like behavior by creating a function that takes a list of file names and sorts them by their file extension.",
    language: "python",
    starterCode: `def sort_files_by_extension(files):
    # Your code here
    # Sort the files by their extension in lexicographical order
    
    # Return the sorted list
    return []`,
    testCases: [
      {
        input: '["data.csv", "image.png", "doc.txt", "report.pdf"]',
        expectedOutput: '["data.csv", "report.pdf", "image.png", "doc.txt"]'
      }
    ]
  },
  {
    id: 10,
    section: "Cloud Engineer",
    type: "coding",
    question: "Write a program that calculates the total network bandwidth usage of multiple servers.",
    language: "python",
    starterCode: `def calculate_total_bandwidth(servers):
    # servers is a list of tuples, each containing (download_bandwidth, upload_bandwidth)
    # Calculate the total download and upload bandwidth
    
    # Return a tuple of (total_download, total_upload)
    return (0, 0)`,
    testCases: [
      {
        input: "[(10, 5), (20, 15), (5, 10)]",
        expectedOutput: "(35, 30)"
      }
    ]
  },

  // Data Analyst Questions
  {
    id: 11,
    section: "Data Analyst",
    type: "multiple-choice",
    question: "Which Excel function is used to find values in a table?",
    options: [
      "COUNTIF",
      "VLOOKUP",
      "SUMIF",
      "AVG"
    ]
  },
  {
    id: 12,
    section: "Data Analyst",
    type: "multiple-choice",
    question: "Which of the following is used to retrieve data from a relational database?",
    options: [
      "Excel",
      "SQL",
      "Power BI",
      "Python"
    ]
  },
  {
    id: 13,
    section: "Data Analyst",
    type: "multiple-choice",
    question: "What is the purpose of a dashboard in data analysis?",
    options: [
      "Store data",
      "Perform complex calculations",
      "Display data visually in a simplified way",
      "Encrypt data"
    ]
  },
  {
    id: 14,
    section: "Data Analyst",
    type: "coding",
    question: "Write a SQL query to count the number of students from each city.",
    language: "sql",
    starterCode: `-- Table: students_info (columns: id, name, city)
-- Write your query below`,
    testCases: [
      {
        input: "students_info table with data",
        expectedOutput: "Query that returns city and count of students"
      }
    ]
  },
  {
    id: 15,
    section: "Data Analyst",
    type: "coding",
    question: "Write a Python program to format data into a simple table-like output.",
    language: "python",
    starterCode: `def format_table(data):
    # data is a list of lists, where the first list contains headers
    # and subsequent lists contain row data
    # Format and print the data as a table
    
    # No return value required, just print the formatted table
    pass`,
    testCases: [
      {
        input: '[["Name", "Age", "City"], ["Kavi", 22, "Madurai"], ["Ram", 23, "Erode"]]',
        expectedOutput: "Formatted table output"
      }
    ]
  },

  // DevOps Engineer Questions
  {
    id: 16,
    section: "DevOps Engineer",
    type: "multiple-choice",
    question: "What is the primary goal of DevOps?",
    options: [
      "Isolate development and operations",
      "Increase testing time",
      "Integrate development and operations for faster delivery",
      "Focus only on deployment"
    ]
  },
  {
    id: 17,
    section: "DevOps Engineer",
    type: "multiple-choice",
    question: "What is the use of Docker in DevOps?",
    options: [
      "Code versioning",
      "Cloud service",
      "Containerization",
      "Automation scripting"
    ]
  },
  {
    id: 18,
    section: "DevOps Engineer",
    type: "multiple-choice",
    question: "What is Infrastructure as Code (IaC)?",
    options: [
      "Writing code without infrastructure",
      "Automating infrastructure setup using code",
      "Physical hardware scripting",
      "Network testing"
    ]
  },
  {
    id: 19,
    section: "DevOps Engineer",
    type: "coding",
    question: "Write a Bash script to back up a directory.",
    language: "bash",
    starterCode: `#!/bin/bash
# This script should take two arguments:
# $1: Source directory to back up
# $2: Destination directory for the backup
# It should create a compressed backup with today's date in the filename

# Your code here
`,
    testCases: [
      {
        input: "/home/user/project /home/user/backup",
        expectedOutput: "Backup completed: /home/user/backup/backup-YYYY-MM-DD.tar.gz"
      }
    ]
  },
  {
    id: 20,
    section: "DevOps Engineer",
    type: "coding",
    question: "Write a Bash script to automate Git commit and push.",
    language: "bash",
    starterCode: `#!/bin/bash
# This script should:
# 1. Ask the user for a commit message
# 2. Stage all changed files
# 3. Commit the changes with the entered message
# 4. Push the changes to the current branch

# Your code here
`,
    testCases: [
      {
        input: "Updated the README with new instructions",
        expectedOutput: "Files committed and pushed successfully"
      }
    ]
  },

  // Machine Learning Engineer Questions
  {
    id: 21,
    section: "Machine Learning Engineer",
    type: "multiple-choice",
    question: "What is the goal of supervised learning?",
    options: [
      "Find hidden patterns in data",
      "Predict output from labeled data",
      "Cluster data into groups",
      "Clean the dataset"
    ]
  },
  {
    id: 22,
    section: "Machine Learning Engineer",
    type: "multiple-choice",
    question: "Which library is commonly used for machine learning in Python?",
    options: [
      "NumPy",
      "Matplotlib",
      "Scikit-learn",
      "Pandas"
    ]
  },
  {
    id: 23,
    section: "Machine Learning Engineer",
    type: "multiple-choice",
    question: "Email spam detection is an example of:",
    options: [
      "Regression",
      "Clustering",
      "Classification",
      "Dimensionality Reduction"
    ]
  },
  {
    id: 24,
    section: "Machine Learning Engineer",
    type: "coding",
    question: "Write a Python program to calculate the Mean, Median, and Mode of a given list of numbers.",
    language: "python",
    starterCode: `def calculate_statistics(data):
    # Calculate mean, median, and mode
    
    # Return a tuple of (mean, median, mode)
    return (0, 0, 0)`,
    testCases: [
      {
        input: "[10, 20, 20, 40, 50]",
        expectedOutput: "(28, 20, 20)"
      }
    ]
  },
  {
    id: 25,
    section: "Machine Learning Engineer",
    type: "coding",
    question: "Use Pandas to create and display a DataFrame containing student names and their marks.",
    language: "python",
    starterCode: `import pandas as pd

def create_student_dataframe(names, marks):
    # Create a DataFrame with student names and marks
    
    # Return the DataFrame
    return None`,
    testCases: [
      {
        input: "(['Alice', 'Bob', 'Charlie'], [85, 90, 78])",
        expectedOutput: "DataFrame with names and marks"
      }
    ]
  },
];

const sectionOrder = [
  "Full-Stack Developer",
  "Cloud Engineer",
  "Data Analyst",
  "DevOps Engineer",
  "Machine Learning Engineer",
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
