
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartQuiz = () => {
    toast({
      title: "Quiz Starting",
      description: "Preparing your assessment...",
    });
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logo */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Student Assignment Portal</h1>
          <nav>
            <Button variant="outline">Login</Button>
          </nav>
        </div>
      </header>

      {/* Progress steps - not active on the home page */}
      <div className="bg-white py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="rounded-full w-8 h-8 flex items-center justify-center bg-quiz-primary text-white">1</div>
              <span className="text-xs mt-1">Password & Authentication</span>
            </div>
            <div className="h-1 flex-1 bg-gray-200 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-300 text-white">2</div>
              <span className="text-xs mt-1">Software Security</span>
            </div>
            <div className="h-1 flex-1 bg-gray-200 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-300 text-white">3</div>
              <span className="text-xs mt-1">Data Protection</span>
            </div>
            <div className="h-1 flex-1 bg-gray-200 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-300 text-white">4</div>
              <span className="text-xs mt-1">Network Security</span>
            </div>
            <div className="h-1 flex-1 bg-gray-200 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-300 text-white">5</div>
              <span className="text-xs mt-1">Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          {/* Left section */}
          <div className="flex-1 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-4xl font-bold mb-6">Find security issues before attackers do!</h2>
            <p className="text-lg mb-4">
              Uncover hidden vulnerabilities, assess your risk exposure, and strengthen defenses before cybercriminals exploit weaknesses.
            </p>
            <p className="text-lg mb-8">Are you prepared?</p>
          </div>

          {/* Right section */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-quiz-primary text-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">
                Take the 4 minute risk assessment quiz, and get a personalized report of your cyber security situation!
              </h3>
              <Button 
                onClick={handleStartQuiz} 
                size="lg" 
                className="mt-4 bg-white text-quiz-primary hover:bg-gray-100"
              >
                Start the quiz
              </Button>
            </div>

            <div className="bg-gray-800 text-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Over 5,000 executives have taken the quiz!</h3>
              <div className="flex -space-x-2 mt-4">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gray-600 border-2 border-gray-800" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
