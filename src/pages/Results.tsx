
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { ChevronRight } from "lucide-react";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get the answers from the location state
  const answers = location.state?.answers || {};
  
  // Calculate score - this is a placeholder function since we don't have actual answers to compare against
  const calculateScore = () => {
    // In a real app, you would compare the user's answers to the correct answers
    return {
      totalQuestions: 25,
      correctAnswers: 20,
      percentageScore: 80,
      sectionScores: {
        "Full-Stack Developer": 85,
        "Cloud Engineer": 75,
        "Data Analyst": 90,
        "DevOps Engineer": 80,
        "Machine Learning Engineer": 70
      }
    };
  };
  
  const score = calculateScore();
  
  const handleDownloadReport = () => {
    toast({
      title: "Report Generated",
      description: "Your personalized security report has been downloaded.",
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logo */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Student Assignment Portal</h1>
          <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </header>
      
      {/* Progress steps - all completed */}
      <div className="bg-white py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {["Full-Stack Developer", "Cloud Engineer", "Data Analyst", "DevOps Engineer", "Machine Learning Engineer", "Complete"].map((section, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className="rounded-full w-8 h-8 flex items-center justify-center bg-quiz-primary text-white">
                    {index < 5 ? (index + 1) : "✓"}
                  </div>
                  <span className="text-xs mt-1 max-w-[80px] text-center">{section}</span>
                </div>
                {index < 5 && <div className="h-1 flex-1 bg-quiz-primary mx-2"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
      {/* Results content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Your Quiz Results</h2>
          
          {/* Overall score card */}
          <Card className="mb-8">
            <CardHeader className="pb-2">
              <CardTitle>Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">
                  {score.correctAnswers} of {score.totalQuestions} correct answers
                </span>
                <span className="text-2xl font-bold">{score.percentageScore}%</span>
              </div>
              <Progress value={score.percentageScore} className="h-2" />
              
              <div className="mt-8 text-center">
                <Button 
                  size="lg" 
                  className="bg-quiz-primary hover:bg-quiz-primary/90"
                  onClick={handleDownloadReport}
                >
                  Download Your Personalized Report
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Section scores */}
          <h3 className="text-xl font-bold mb-4">Section Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(score.sectionScores).map(([section, sectionScore]) => (
              <Card key={section}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{section}</span>
                    <span className="font-bold">{sectionScore}%</span>
                  </div>
                  <Progress value={sectionScore as number} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Recommendations */}
          <h3 className="text-xl font-bold mt-8 mb-4">Recommendations</h3>
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-yellow-100">
                    <ChevronRight className="text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Improve Your Machine Learning Knowledge</h4>
                    <p className="text-gray-600 mt-1">
                      Your score in this section was lower than others. Consider reviewing machine learning algorithms and fundamental concepts.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-yellow-100">
                    <ChevronRight className="text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Enhance Cloud Engineer Skills</h4>
                    <p className="text-gray-600 mt-1">
                      Focus more on cloud infrastructure and scalability concepts to improve in this area.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-green-100">
                    <ChevronRight className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Strong Data Analysis Skills</h4>
                    <p className="text-gray-600 mt-1">
                      You demonstrated excellent knowledge in data analysis. Keep up with the latest data visualization and SQL techniques.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-green-100">
                    <ChevronRight className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Solid Full-Stack Development Foundation</h4>
                    <p className="text-gray-600 mt-1">
                      Your full-stack development skills are strong. Continue building projects to reinforce these skills.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Button variant="outline" onClick={() => navigate("/")}>
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Results;
