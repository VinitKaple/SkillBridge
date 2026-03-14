import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import ResumeDashboard from "./pages/ResumeDashboard";  // ← ADD

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/resume" element={<ResumeDashboard />} />  {/* ← ADD */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;