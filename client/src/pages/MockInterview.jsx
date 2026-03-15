import { useState } from "react";
import InterviewSetup from "../components/interview/InterviewSetup";
import InterviewRoom from "../components/interview/InterviewRoom";
import InterviewReport from "../components/interview/InterviewReport";

export default function MockInterview() {
  const [screen, setScreen] = useState("setup"); // 'setup' | 'interview' | 'report'
  const [config, setConfig] = useState(null);
  const [reportData, setReportData] = useState(null);

  const handleStart = (interviewConfig) => {
    setConfig(interviewConfig);
    setScreen("interview");
  };

  const handleComplete = (answers) => {
    // Mock report data — Part 2 will replace with real OpenAI evaluation
    const mockReport = {
      company: config.company,
      round: config.round,
      difficulty: config.difficulty,
      scores: {
        communication: 78,
        technical: 65,
        confidence: 72,
        overall: 71,
      },
      decision: "HOLD",
      strongPoints: [
        "Communication was clear and structured",
        "Good understanding of OS fundamentals",
        "Answered confidently under pressure",
      ],
      weakPoints: [
        "DBMS indexing explanation was incomplete",
        "Could not explain normalization beyond 3NF",
        "System design depth needs improvement",
      ],
      nextSteps: [
        "Revise DBMS indexing and query optimization",
        "Practice 2 mock interviews this week",
        "Build one project using proper DB design",
      ],
      detailedFeedback:
        "You showed good communication skills and a solid grasp of OS concepts. However, DBMS knowledge needs strengthening — especially indexing strategies and normalization. With focused preparation over 2 weeks, you could clear this round.",
      answers,
    };
    setReportData(mockReport);
    setScreen("report");
  };

  const handleRetake = () => {
    setScreen("setup");
    setConfig(null);
    setReportData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {screen === "setup" && <InterviewSetup onStart={handleStart} />}
      {screen === "interview" && config && (
        <InterviewRoom config={config} onComplete={handleComplete} />
      )}
      {screen === "report" && reportData && (
        <InterviewReport reportData={reportData} onRetake={handleRetake} />
      )}
    </div>
  );
}