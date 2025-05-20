
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface SectionScores {
  [key: string]: number;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get the answers from the location state
  const answers = location.state?.answers || {};
  const sectionScores = location.state?.sectionScores || {};
  
  // Calculate overall score based on section scores
  const calculateOverallScore = () => {
    const totalSections = Object.keys(sectionScores).length;
    if (totalSections === 0) return 0;
    
    // Ensure we're working with numbers by explicitly converting
    const totalScore = Object.values(sectionScores).reduce<number>(
      (sum: number, score: unknown) => {
        const numericScore = typeof score === 'number' ? score : 0;
        return sum + numericScore;
      }, 
      0
    );
    
    // Ensure division is between numbers
    return Math.round(totalScore / totalSections);
  };
  
  const overallScore = calculateOverallScore();
  
  const handleDownloadReport = () => {
    toast({
      title: "Report Generated",
      description: "Your personalized quiz report has been downloaded.",
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
                  Your overall performance
                </span>
                <span className="text-2xl font-bold">{overallScore}%</span>
              </div>
              <Progress value={overallScore} className="h-2" />
              
              <div className="mt-8 text-center">
                <Button 
                  size="lg" 
                  className="bg-quiz-primary hover:bg-quiz-primary/90"
                  onClick={handleDownloadReport}
                >
                  Download Your Report
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Section scores */}
          <h3 className="text-xl font-bold mb-4">Section Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(sectionScores).map(([section, sectionScore]) => (
              <Card key={section}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{section}</span>
                    <span className="font-bold">{typeof sectionScore === 'number' ? sectionScore : 0}%</span>
                  </div>
                  <Progress 
                    value={typeof sectionScore === 'number' ? sectionScore : 0} 
                    className="h-2" 
                  />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
