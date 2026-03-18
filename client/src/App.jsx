import React from "react";
import { Route, Routes } from "react-router-dom";

import Landing from "./pages/Landing";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/DashboardPage";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import ResumeBuilder from "./pages/ResumeBuilder";
import SettingsPage from "./pages/SettingsPage";
import Admin from "./pages/Admin";
import MockInterview from "./pages/MockInterview";
import ConfidenceLens from "./components/confidence/ConfidenceLens";
import ChatBot from "./components/ChatBot";


const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />

          <Route path="resume-engine" element={<ResumeAnalysis />} />

          <Route path="build" element={<ResumeBuilder />} />

          <Route path="settings" element={<SettingsPage />} />

        
              <Route path="off" element={<ConfidenceLens />} />

          <Route path="admin" element={<Admin />} />

          <Route path="prepare" element={<MockInterview />} />

          {/* Broken dashboard routes */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      {/* Chatbot visible globally */}
      <ChatBot />
    </>
  );
};

export default App;