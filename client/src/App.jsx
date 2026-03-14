import React from "react";
import { Route, Routes } from "react-router-dom";

import Landing from "./pages/Landing";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/DashboardPage";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import ResumeBuilder from "./pages/ResumeBuilder";
import SettingsPage from "./pages/SettingsPage";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />


      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
      
        <Route path="resume-engine" element={<ResumeAnalysis/>} />
    
        <Route path="build" element={<ResumeBuilder />} />

        <Route path="settings" element={<SettingsPage />} />
      

        {/* Catches broken links INSIDE dashboard (e.g. /dashboard/test) */}
        <Route path="*" element={<NotFound />} />
      </Route>

    </Routes>
  );
};

export default App;
